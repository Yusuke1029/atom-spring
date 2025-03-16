import json
import re
from typing import List, Dict, Optional, Tuple
import random
import argparse
from PyPDF2 import PdfReader
import tempfile
import os
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import shutil

class ExamPredictor:
    """試験問題の抽出と予測を行うクラス
    
    主な機能:
    1. テキスト処理と問題抽出
       - PDFからのOCRテキスト抽出
       - セクション分割と問題の構造化
       - 数式・記号の正規化
    
    2. 問題の分析と分類
       - カテゴリー判定（数学/物理）
       - 難易度評価
       - キーワード抽出
    
    3. 予測と生成
       - 出題傾向の統計分析
       - カテゴリーバランスの維持
       - 問題文の自動生成と調整
    
    使用例:
        predictor = ExamPredictor()
        predictor.load_past_questions("past_exam.pdf")
        predicted = predictor.generate_predicted_questions(5)
    
    注意:
        - OCR処理には pytesseract が必要
        - 数式を含む問題は変換時に注意が必要
        - 物理問題は説明文の前処理が重要
    """

    # クラスの定数定義
    KEYWORDS_BY_CATEGORY = {
        '数学': ['関数', '方程式', '積分', '微分', 'ベクトル', '行列', '確率', '三角関数'],
        '物理': ['力学', '電磁気', '光', '波動', '熱力学', '相対性', '運動量', 'エネルギー'],
        '化学': ['反応', '分子', '原子', '酸', '塩基', '化合', '結合', '平衡']
    }

    # 初期化とデータ読み込み関連のメソッド
    def __init__(self):
        """初期化"""
        self.past_questions: List[Dict] = []

    # PDFとテキスト処理関連のメソッド
    def extract_text_from_pdf_with_ocr(self, pdf_path: str) -> str:
        """PDFからOCRを使用してテキストを抽出する"""
        try:
            # 一時ディレクトリを作成
            with tempfile.TemporaryDirectory() as temp_dir:
                print(f"\nデバッグ: PDFを画像に変換中...")
                
                # PDFを画像に変換
                images = convert_from_path(pdf_path)
                print(f"変換された画像数: {len(images)}")
                
                # OCRの設定
                custom_config = '--psm 6 --oem 3 -l jpn+jpn_vert'  # 日本語OCR設定（縦書きにも対応）
                
                # 各画像からテキストを抽出
                full_text = ""
                for i, image in enumerate(images, 1):
                    print(f"\nページ {i} の処理中...")
                    
                    # 画像を一時ファイルとして保存
                    temp_image_path = os.path.join(temp_dir, f'page_{i}.png')
                    image.save(temp_image_path, 'PNG')
                    
                    # OCRでテキストを抽出
                    text = pytesseract.image_to_string(
                        Image.open(temp_image_path),
                        config=custom_config,
                        lang='jpn'
                    )
                    
                    print(f"ページ {i} から抽出されたテキストのプレビュー:")
                    print(text[:200].replace('\n', '\\n'))
                    
                    full_text += text + "\n\n"
                
                return full_text
                
        except Exception as e:
            print(f"エラー: OCR処理中にエラーが発生しました: {str(e)}")
            return ""

    def extract_questions_from_pdf(self, pdf_path: str) -> List[Dict]:
        """PDFファイルから問題を抽出し、構造化されたデータとして返す

        Args:
            pdf_path (str): 処理対象のPDFファイルパス

        Returns:
            List[Dict]: 抽出された問題のリスト。各問題は以下の形式:
                {
                    'category': str,      # 科目カテゴリー
                    'section': str,       # セクション名
                    'sub_number': str,    # 問題番号
                    'difficulty': str,    # 難易度（易/中/難）
                    'keywords': List[str],# キーワード
                    'question': str,      # 問題文
                    'answer': str         # 解答（存在する場合）
                }

        Raises:
            Exception: PDFの読み込みや問題抽出に失敗した場合
        """
        return self._extract_questions_from_pdf(pdf_path)

    def _extract_questions_from_pdf(self, pdf_path: str) -> List[Dict]:
        """PDFファイルから問題を抽出する（内部メソッド）"""
        questions = []
        try:
            # テキストの抽出と前処理
            print(f"\nPDFファイル '{pdf_path}' の処理を開始")
            text = self.extract_text_from_pdf_with_ocr(pdf_path)
            if not text.strip():
                raise Exception("テキストの抽出に失敗しました")

            processed_text = self._preprocess_text(text)
            print(f"テキスト抽出完了（{len(text)}文字）")

            # セクションと問題の抽出
            sections = self._extract_sections(processed_text)
            if not sections:
                raise Exception("セクションの抽出に失敗しました")

            # 各セクションから問題を抽出
            for name, data in sections.items():
                section_questions = self._extract_section_questions(name, data)
                questions.extend(section_questions)
                print(f"{name}から{len(section_questions)}問を抽出しました")

            if not questions:
                raise Exception("問題を抽出できませんでした")
            print(f"\n処理完了: 合計{len(questions)}問を抽出")

        except Exception as e:
            print(f"\nエラー: {str(e)}")
            questions = []

        return questions


    def _normalize_question_number(self, num: str) -> str:
        """様々な形式の問題番号を統一された形式に変換する

        以下の形式を標準的な半角数字に変換:
        - 丸数字 (①-⑨)
        - 漢数字 (一-九)
        - 全角数字 (１-９)

        Args:
            num (str): 変換する問題番号

        Returns:
            str: 標準化された問題番号（1-9の半角数字）
        """
        if '①' <= num <= '⑨':
            return str(ord(num) - ord('①') + 1)
        elif '一' <= num <= '九':
            return str('一二三四五六七八九'.index(num) + 1)
        elif '１' <= num <= '９':
            return str(ord(num) - ord('１') + 1)
        return num

    def _create_question(self, section_name: str, category: str,
                        num: str, content: str, intro_text: str = "") -> Dict:
        """問題テキストから構造化された問題データを生成する

        テキストの前処理、難易度評価、キーワード抽出を行い、
        標準化された形式の問題データを生成します。
        物理問題の場合は、共通の説明文を問題文に統合します。

        Args:
            section_name (str): セクション名（例: '基礎I'）
            category (str): 科目カテゴリー（数学/物理）
            num (str): 問題番号
            content (str): 問題本文
            intro_text (str, optional): 物理問題の共通説明文

        Returns:
            Dict: 以下の形式の問題データ:
                {
                    'category': str,          # 科目カテゴリー
                    'section': str,           # セクション名
                    'sub_number': str,        # 問題番号
                    'difficulty': str,        # 難易度
                    'keywords': List[str],    # 抽出されたキーワード
                    'question': str,          # 整形された問題文
                    'answer': str,            # 解答（空文字列）
                    'math_complexity': int    # 数式の複雑さスコア
                }
        """
        # 物理の場合は説明文を追加
        if category == '物理' and intro_text:
            if not any(keyword in content.lower() for keyword in ['図', '注意', '条件']):
                content = f"{intro_text}\n\n{content}"

        # テキストのクリーンアップ
        content = re.sub(r'[\n\s]+', ' ', content)
        content = re.sub(r'(?<=\d)\s+(?=[\+\-\*\/\=])', '', content)

        # 難易度の評価
        math_complexity = len(re.findall(r'[+\-*/^√∫∂∑∏=><≤≥]', content))
        base_difficulty = self._estimate_difficulty(content)
        difficulty = ('難' if math_complexity > 10 else
                    '中' if math_complexity > 5 or base_difficulty == '中' else
                    '易')

        return {
            'category': category,
            'section': section_name,
            'sub_number': num,
            'difficulty': difficulty,
            'keywords': self._extract_keywords(content),
            'question': content,
            'answer': '',
            'math_complexity': math_complexity
        }

    def _preprocess_text(self, text: str) -> str:
        """OCRで抽出したテキストの前処理と正規化を行う

        以下の処理を実施:
        1. OCR特有の誤認識を修正 (例: '基磯' → '基礎')
        2. 数字表記を統一 (例: '一(' → '(1)')
        3. 特殊文字を標準化 (例: 'Ll' → 'II')
        4. 空白文字と改行を正規化

        Args:
            text (str): OCRで抽出された生テキスト

        Returns:
            str: 前処理・正規化済みのテキスト
        """
        # OCR修正用の置換マップ
        replacements = {
            '基 磯': '基礎',
            '基磯': '基礎',
            'Ll': 'II',
            '一(': '(1)',
            '二(': '(2)',
            '三(': '(3)',
            '四(': '(4)',
            '⑫': '(2)',
            '⑬': '(3)',
        }
        
        # テキストの修正
        processed_text = text
        for old, new in replacements.items():
            processed_text = processed_text.replace(old, new)
        
        # 空白と改行の正規化
        processed_text = re.sub(r'[\r\n]+', '\n', processed_text)
        processed_text = re.sub(r'\s+', ' ', processed_text)
        
        return processed_text

    def _extract_sections(self, text: str) -> Dict[str, Dict]:
        """テキストから試験問題のセクションを抽出し構造化する

        以下のパターンのセクションを認識します：
        - 基礎I、II（数学）
        - 基礎III、IV（物理）

        Args:
            text (str): 解析対象の全テキスト

        Returns:
            Dict[str, Dict]: セクション名をキーとし、以下の形式の辞書を値とする辞書:
                {
                    'text': str,       # セクションの本文
                    'category': str,   # カテゴリー（数学/物理）
                    'type': str        # セクションタイプ（math/physics）
                }

        Raises:
            Exception: セクションが見つからない、または抽出に失敗した場合
        """
        # セクションパターンの定義
        section_patterns = {
            '基礎I': {'pattern': r'基礎\s*[IＩ](?![IＩVＶ])', 'category': '数学'},
            '基礎II': {'pattern': r'基礎\s*[IＩ]{2}(?![IＩ])', 'category': '数学'},
            '基礎III': {'pattern': r'基礎\s*[IＩ]{3}', 'category': '物理'},
            '基礎IV': {'pattern': r'基礎\s*[IＩ]?[VＶ]', 'category': '物理'}
        }

        # セクションの位置を検出
        print("\nセクションの検出を開始")
        positions = []
        for name, info in section_patterns.items():
            for match in re.finditer(info['pattern'], text):
                start = match.start()
                print(f"・{name} を位置 {start} で検出")
                positions.append((start, name, info['category']))

        if not positions:
            raise Exception("セクションが見つかりませんでした")

        # 検出された位置でソート
        positions.sort()
        print(f"\n{len(positions)}個のセクションを検出")

        # セクションの内容を抽出
        sections = {}
        for i, (start, name, category) in enumerate(positions):
            end = positions[i+1][0] if i < len(positions)-1 else len(text)
            content = text[start:end].strip()
            
            if content:
                sections[name] = {
                    'text': content,
                    'category': category,
                    'type': 'physics' if category == '物理' else 'math'
                }
                print(f"・{name}: {len(content)}文字を抽出")

        if not sections:
            raise Exception("有効なセクションの内容が見つかりませんでした")

        return sections

    def _extract_intro_text(self, text: str) -> str:
        """物理の説明文を抽出する"""
        intro_match = re.search(r'^(.*?)(?=(?:\(|（)1(?:\)|）))', text, re.DOTALL)
        if intro_match:
            intro_text = intro_match.group(1).strip()
            if intro_text:
                print(f"説明文を検出: {intro_text[:100]}...")
                return intro_text
        return ""

    # テキスト解析と問題検出関連のメソッド
    def _find_questions_in_text(self, text: str) -> List[Tuple[str, str]]:
        """テキストから問題を検出する"""
        # 問題検出用の正規表現パターン
        patterns = {
            'bracket': r'(?:\(|（)([1-9１-９一二三四五六七八九])(?:\)|）)\s*(.*?)(?=(?:\(|（)[1-9１-９一二三四五六七八九](?:\)|）)|$)',
            'dot': r'(?:^|\n)\s*([1-9１-９一二三四五六七八九])[\s\.。]\s*(.*?)(?=(?:^|\n)\s*[1-9１-９一二三四五六七八九][\s\.。]|$)',
            'circle': r'([①-⑨])\s*(.*?)(?=[①-⑨]|$)'
        }

        for pattern_type, pattern in patterns.items():
            try:
                matches = re.finditer(pattern, text, re.DOTALL | re.MULTILINE)
                for match in matches:
                    num = self._normalize_question_number(match.group(1))
                    content = match.group(2).strip()
                    if content:
                        found_questions.append((num, content))
                        print(f"{pattern_type}形式で問題{num}を検出")
            except Exception as e:
                print(f"警告: {pattern_type}パターンでエラー: {str(e)}")

        return found_questions

    # キーワードデータの定義
    KEYWORDS_BY_CATEGORY = {
        '数学': ['関数', '方程式', '積分', '微分', 'ベクトル', '行列', '確率', '三角関数'],
        '物理': ['力学', '電磁気', '光', '波動', '熱力学', '相対性', '運動量', 'エネルギー'],
        '化学': ['反応', '分子', '原子', '酸', '塩基', '化合', '結合', '平衡']
    }

    # 問題の分析と評価関連のメソッド
    def _estimate_difficulty(self, text: str) -> str:
        """問題文の難易度を推定する
        
        文章の長さ、数式の複雑さ、および専門用語の出現頻度から難易度を算出
        """
        # 難易度評価のための要素を計算
        complexity = (
            len(text) / 100  # 文章の長さ
            + len(re.findall(r'[=+\-×÷√∫∂∑∏]', text)) * 0.5  # 数式の複雑さ
            + sum(text.count(term) for term in ['証明', '一般化', '最適化', '導出']) * 2  # 難しい概念
        )

        # 複雑さスコアに基づいて難易度を判定
        if complexity > 5:
            return '難'
        elif complexity > 3:
            return '中'
        return '易'

    def _estimate_category(self, text: str) -> str:
        """テキストからカテゴリーを推定する"""
        # カテゴリーごとのキーワード出現回数を集計
        counts = {category: sum(text.count(word) for word in words)
                 for category, words in self.KEYWORDS_BY_CATEGORY.items()}
        
        return '未分類' if not any(counts.values()) else max(counts.items(), key=lambda x: x[1])[0]
def _extract_keywords(self, text: str) -> List[str]:
    """テキストから重要なキーワードを抽出する"""
    # すべてのキーワードから出現頻度を計算
    all_keywords = [(word, text.count(word))
                   for words in self.KEYWORDS_BY_CATEGORY.values()
                   for word in words
                   if word in text]
    
    # 出現頻度順にソートして上位3つを返す
    return [word for word, _ in sorted(all_keywords, key=lambda x: x[1], reverse=True)[:3]]

# 問題データの処理と生成に関するメソッド

    def load_past_questions(self, file_path: str) -> None:
        """過去問データをファイルから読み込んでインスタンスに追加する

        PDFファイルまたはJSONファイルから過去問データを読み込みます。
        - PDFファイルの場合: OCRで問題を抽出して追加
        - JSONファイルの場合: 既存の構造化データを直接読み込み

        Args:
            file_path (str): 読み込むファイルのパス（.pdf または .json）

        Raises:
            FileNotFoundError: 指定されたファイルが存在しない場合
            Exception: ファイルの読み込みや処理に失敗した場合
        """
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
    
    # 問題予測と生成関連のメソッド
    def generate_predicted_questions(self, num_questions: int = 5) -> List[Dict]:
        """過去問の傾向を分析して予想問題を生成する

        以下のステップで予想問題を生成します：
        1. 過去問の出題傾向を分析（カテゴリー、難易度、キーワード）
        2. カテゴリーごとの出題比率を維持
        3. 各カテゴリー内で適切な難易度の問題を選択
        4. 問題文中の数値をランダムに変更（数学の計算問題の場合）
        5. キーワードと傾向に基づいて問題を再構成

        Args:
            num_questions (int, optional): 生成する問題数. デフォルト: 5.

        Returns:
            List[Dict]: 以下の形式の予想問題リスト
                {
                    'category': str,      # 科目カテゴリー
                    'difficulty': str,    # 予測される難易度
                    'keywords': List[str],# 関連キーワード
                    'question': str,      # カスタマイズされた問題文
                    'answer': str         # 予想解答
                }
        """
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