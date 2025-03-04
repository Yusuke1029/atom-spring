import random

def play_game():
    answer = random.randint(1, 100)
    tries = 0
    max_tries = 6
    
    print("\n1から100までの数字を当ててください！")
    print(f"あなたは{max_tries}回まで挑戦できます。")
    print("途中で終了する場合は0を入力してください。")
    
    while tries < max_tries:
        try:
            guess = int(input(f"\n数字を入力してください（残り{max_tries - tries}回）: "))
            
            if guess == 0:
                print("\nゲームを終了します。")
                return False
                
            if guess < 1 or guess > 100:
                print("1から100までの数字を入力してください。")
                continue
                
            tries += 1
            
            if guess == answer:
                print(f"\nおめでとうございます！{tries}回目で正解です！")
                print("あなたの勝ちです！")
                return True
            elif guess < answer:
                print("もっと大きい数字です。")
            else:
                print("もっと小さい数字です。")
                
        except ValueError:
            print("正しい数字を入力してください。")
    
    print(f"\n残念！正解は{answer}でした。")
    print("コンピュータの勝ちです！")
    return False

def main():
    while True:
        play_game()
        while True:
            cont = input("\nもう一度プレイしますか？(y/n): ").lower()
            if cont in ['y', 'n']:
                break
            print("yまたはnを入力してください。")
            
        if cont == 'n':
            print("\nプレイしていただき、ありがとうございました！")
            break

if __name__ == "__main__":
    main()