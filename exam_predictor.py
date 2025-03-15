import json
import re
from typing import List, Dict, Optional
import random
import argparse
from PyPDF2 import PdfReader
import tempfile
import os

class ExamPredictor:
    def __init__(self):
        self.past_questions: List[Dict] = []
    
    def extract_questions_from_pdf(self, pdf_path: str) -> List[Dict]:
        """PDFから問題と解答を抽出する"""
        questions = []
        try:
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"

            # 問題と解答のパターンを検出
            # 一般的なパターン：問題1、1.、【問題1】などで始まる
            patterns = [
                r'(?:問題|PROBLEM|第)\s*(\d+)[\s\.]*(.*?)(?=(?:問題|PROBLEM|第)\s*\d+|$)',
                r'(\d+)[\s\.]\s*(.*?)(?=\d+[\s\.]\s*|$)',
                r'【問題\s*(\d+)】\s*(.*?)(?=【問題\s*\d+】|$)'
            ]

            for pattern in patterns:
                matches = re.finditer(pattern, text, re.DOTALL)
                for match in matches:
                    question_num = match.group(1)
                    content = match.group(2).strip()

                    # 解答を探す
                    answer = ""
                    answer_patterns = [
                        rf'(?:解答|ANSWER|解)\s*{question_num}[\s\.]*(.*?)(?=(?:解答|ANSWER|解)\s*\d+|$)',
                        rf'【解答\s*{question_num}】\s*(.*?)(?=【解答\s*\d+】|$)'
                    ]

                    for ans_pattern in answer_patterns:
                        ans_match = re.search(ans_pattern, text, re.DOTALL)
                        if ans_match:
                            answer = ans_match.group(1).strip()
                            break

                    # カテゴリーを推定
                    category = self._estimate_category(content)
                    # 難易度を推定
                    difficulty = self._estimate_difficulty(content)
                    # キーワードを抽出
                    keywords = self._extract_keywords(content)

                    question = {
                        'category': category,
                        'difficulty': difficulty,
                        'keywords': keywords,
                        'question': content,
                        'answer': answer
                    }
                    questions.append(question)

                if questions:  # パターンがマッチした場合は他のパターンは試さない
                    break

        except Exception as e:
            print(f"PDFの読み込み中にエラーが発生しました: {str(e)}")
        
        return questions

    def _estimate_category(self, text: str) -> str:
        """テキスト内容からカテゴリーを推定する"""
        keywords = {
            '数学': ['関数', '方程式', '積分', '微分', 'ベクトル', '行列', '確率'],
            '物理': ['力学', '電磁気', '光', '波動', '熱力学', '相対性'],
            '化学': ['反応', '分子', '原子', '酸', '塩基', '化合']
        }
        
        counts = {category: 0 for category in keywords}
        for category, words in keywords.items():
            for word in words:
                counts[category] += len(re.findall(word, text))
        
        max_count = max(counts.values())
        if max_count == 0:
            return '未分類'
        return max(counts.items(), key=lambda x: x[1])[0]

    def _estimate_difficulty(self, text: str) -> str:
        """問題文から難易度を推定する"""
        # 文の長さ、数式の複雑さ、キーワードなどから推定
        complexity = 0
        # 文の長さによる判定
        complexity += len(text) / 100
        # 数式の数による判定
        complexity += len(re.findall(r'[=+\-×÷√∫∂∑∏]', text)) * 0.5
        # 難しい用語による判定
        difficult_terms = ['証明', '一般化', '最適化', '導出']
        complexity += sum(1 for term in difficult_terms if term in text)

        if complexity > 5:
            return '難'
        elif complexity > 3:
            return '中'
        else:
            return '易'

    def _extract_keywords(self, text: str) -> List[str]:
        """テキストから重要なキーワードを抽出する"""
        important_keywords = [
            '関数', '方程式', '積分', '微分', 'ベクトル', '行列', '確率',
            '力学', '電磁気', '光', '波動', '熱力学', '相対性',
            '反応', '分子', '原子', '酸', '塩基', '化合'
        ]
        
        found_keywords = []
        for keyword in important_keywords:
            if keyword in text:
                found_keywords.append(keyword)
        
        return found_keywords[:3]  # 最大3つまで

    def load_past_questions(self, file_path: str):
        """過去問をファイルから読み込む"""
        try:
            if file_path.lower().endswith('.pdf'):
                questions = self.extract_questions_from_pdf(file_path)
                self.past_questions.extend(questions)
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    self.past_questions.extend(json.load(f))
        except FileNotFoundError:
            print(f"エラー: ファイル {file_path} が見つかりません")
        except Exception as e:
            print(f"エラー: ファイル {file_path} の読み込み中にエラーが発生しました: {str(e)}")
    
    def analyze_questions(self) -> Dict:
        """過去問を分析して、出題傾向を把握"""
        if not self.past_questions:
            return {}
        
        trends = {
            'categories': {},  # カテゴリー別の出題頻度
            'difficulty': {},  # 難易度別の出題数
            'keywords': {}     # キーワード別の出現頻度
        }
        
        for question in self.past_questions:
            # カテゴリーの集計
            category = question.get('category', '未分類')
            trends['categories'][category] = trends['categories'].get(category, 0) + 1
            
            # 難易度の集計
            difficulty = question.get('difficulty', '中')
            trends['difficulty'][difficulty] = trends['difficulty'].get(difficulty, 0) + 1
            
            # キーワードの集計
            for keyword in question.get('keywords', []):
                trends['keywords'][keyword] = trends['keywords'].get(keyword, 0) + 1
        
        return trends
    
    def generate_predicted_questions(self, num_questions: int = 5) -> List[Dict]:
        """予想問題を生成"""
        if not self.past_questions:
            return []
        
        trends = self.analyze_questions()
        predicted_questions = []
        used_questions = set()  # 重複を防ぐために使用済みの問題を記録
        
        # カテゴリーごとの出題数を決定
        total_questions = sum(trends['categories'].values())
        category_quotas = {
            category: max(1, round(num_questions * count / total_questions))
            for category, count in trends['categories'].items()
        }
        
        for category, quota in category_quotas.items():
            # カテゴリーごとの問題を生成
            category_questions = [
                q for q in self.past_questions
                if q.get('category') == category
            ]
            
            for _ in range(quota):
                if not category_questions or len(predicted_questions) >= num_questions:
                    break
                
                # 難易度を過去の傾向に基づいて選択
                difficulty = random.choices(
                    list(trends['difficulty'].keys()),
                    weights=list(trends['difficulty'].values())
                )[0]
                
                # ベースとなる問題を選択（未使用のものから）
                available_questions = [
                    q for q in category_questions
                    if q['question'] not in used_questions
                ]
                
                if not available_questions:
                    continue
                
                base_question = random.choice(available_questions)
                used_questions.add(base_question['question'])
                
                # カテゴリーに関連する主要なキーワードを選択
                category_keywords = [
                    k for k, _ in sorted(
                        trends['keywords'].items(),
                        key=lambda x: x[1],
                        reverse=True
                    ) if any(
                        k in q.get('keywords', [])
                        for q in category_questions
                    )
                ]
                
                selected_keywords = category_keywords[:3] if category_keywords else []
                
                # 問題文と解答をカスタマイズ
                question_text = base_question.get('question', '問題文なし')
                answer_text = base_question.get('answer', '解答なし')
                
                # 問題のカスタマイズ（数値や条件を少し変更）
                if '求めよ' in question_text:
                    # 数値を含む問題の場合、数値を少し変更
                    import re
                    def modify_number(match):
                        num = float(match.group())
                        if num > 100:  # 大きすぎる数値は変更しない
                            return str(num)
                        # 整数の場合は整数のまま、小数の場合は小数のまま変更
                        is_integer = num.is_integer()
                        new_num = num * random.uniform(0.8, 1.2)
                        if is_integer:
                            return str(int(round(new_num)))
                        return f"{new_num:.2f}"
                    
                    # 数値のパターンを検出して置換
                    pattern = r'\d+(?:\.\d+)?'
                    # 行列の場合は変更しない
                    if '行列' not in question_text and '固有値' not in question_text:
                        question_text = re.sub(pattern, modify_number, question_text)
                
                predicted_question = {
                    'category': category,
                    'difficulty': difficulty,
                    'keywords': selected_keywords,
                    'question': f"【予想問題】{question_text}",
                    'answer': f"【予想解答】{answer_text}"
                }
                predicted_questions.append(predicted_question)
        
        # 問題数が足りない場合、ランダムに追加
        while len(predicted_questions) < num_questions:
            base_question = random.choice(self.past_questions)
            if base_question['question'] not in used_questions:
                predicted_questions.append({
                    'category': base_question['category'],
                    'difficulty': base_question['difficulty'],
                    'keywords': base_question['keywords'],
                    'question': f"【予想問題】{base_question['question']}",
                    'answer': f"【予想解答】{base_question['answer']}"
                })
                used_questions.add(base_question['question'])
        
        return predicted_questions

def main():
    # コマンドライン引数の設定
    parser = argparse.ArgumentParser(description='過去問から予想問題を生成するプログラム')
    parser.add_argument('files', nargs='+', help='過去問のPDFファイルパス（複数指定可）')
    parser.add_argument('--num-questions', type=int, default=5, help='生成する問題数（デフォルト: 5）')
    args = parser.parse_args()

    predictor = ExamPredictor()
    
    # 指定されたファイルから過去問を読み込む
    print("過去問データを読み込んでいます...")
    for file_path in args.files:
        if os.path.exists(file_path):
            print(f"読み込み中: {file_path}")
            predictor.load_past_questions(file_path)
        else:
            print(f"警告: ファイル {file_path} が見つかりません")
    
    if not predictor.past_questions:
        print("エラー: 有効な問題が見つかりませんでした。")
        return

    # 予想問題を生成
    print("\n出題傾向を分析し、予想問題を生成しています...\n")
    predicted_questions = predictor.generate_predicted_questions(args.num_questions)
    
    # 結果を表示
    print("=" * 60)
    print("                予想問題セット                ")
    print("=" * 60 + "\n")
    
    for i, question in enumerate(predicted_questions, 1):
        print(f"■ 問題 {i}")
        print(f"【カテゴリー】 {question['category']}")
        print(f"【難易度】     {question['difficulty']}")
        print(f"【キーワード】 {', '.join(question['keywords'])}")
        print("\n" + question['question'])
        print("\n" + question['answer'])
        print("\n" + "─" * 60 + "\n")

if __name__ == '__main__':
    main()