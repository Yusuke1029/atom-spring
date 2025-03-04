import random

def play_game():
    # 1から100までのランダムな整数を生成
    answer = random.randint(1, 100)
    tries = 0
    max_tries = 8  # 最大試行回数を設定
    
    # ゲームの説明を表示
    print("\n1から100までの数字を当ててください！")
    print(f"あなたは{max_tries}回まで挑戦できます。")
    print("途中で終了する場合は0を入力してください。")
    
    # 最大試行回数までループ
    while tries < max_tries:
        try:
            # ユーザーに数字を入力させる
            guess = int(input(f"\n数字を入力してください（残り{max_tries - tries}回）: "))
            
            # 0が入力された場合、ゲームを終了
            if guess == 0:
                print("\nゲームを終了します。")
                return False
                
            # 1から100の範囲外の数字が入力された場合、再入力を促す
            if guess < 1 or guess > 100:
                print("1から100までの数字を入力してください。")
                continue
                
            tries += 1  # 試行回数をカウント
            
            # 正解の場合
            if guess == answer:
                print(f"\nおめでとうございます！{tries}回目で正解です！")
                print("あなたの勝ちです！")
                return True
            # 入力された数字が正解より小さい場合
            elif guess < answer:
                print("もっと大きい数字です。")
            # 入力された数字が正解より大きい場合
            else:
                print("もっと小さい数字です。")
                
        except ValueError:
            # 数字以外が入力された場合のエラーメッセージ
            print("正しい数字を入力してください。")
    
    # 最大試行回数に達した場合のメッセージ
    print(f"\n残念！正解は{answer}でした。")
    print("コンピュータの勝ちです！")
    return False

def main():
    while True:
        play_game()  # ゲームをプレイ
        while True:
            # もう一度プレイするかどうかをユーザーに尋ねる
            cont = input("\nもう一度プレイしますか？(y/n): ").lower()
            if cont in ['y', 'n']:
                break
            print("yまたはnを入力してください。")
            
        # 'n' が入力された場合、ゲームを終了
        if cont == 'n':
            print("\nプレイしていただき、ありがとうございました！")
            break

if __name__ == "__main__":
    main()  # メイン関数を実行