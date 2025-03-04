import random
import tkinter as tk
from tkinter import messagebox, ttk

class NumberGameGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("数字当てゲーム")
        self.root.geometry("400x500")
        
        # フォント設定
        self.fonts = {
            'title': ('Yu Gothic', 16, 'bold'),
            'subtitle': ('Yu Gothic', 12, 'bold'),
            'normal': ('Yu Gothic', 11),
            'input': ('Yu Gothic', 14),
            'button': ('Yu Gothic', 12),
            'history': ('Yu Gothic', 10)
        }
        
        # テーマカラーの設定
        self.colors = {
            'bg': '#E8F5E9',
            'title': '#1B5E20',
            'button': '#4CAF50',
            'button_text': 'white',
            'entry_bg': 'white',
            'bigger': '#FF5722',
            'smaller': '#2196F3',
            'correct': '#4CAF50',
            'header_bg': '#81C784'
        }
        
        self.root.configure(bg=self.colors['bg'])
        
        self.answer = random.randint(1, 100)
        self.tries = 0
        self.max_tries = 6
        
        self.setup_ui()
        
    def setup_ui(self):
        # タイトル
        title_label = tk.Label(
            self.root,
            text="数字当てゲーム",
            font=self.fonts['title'],
            bg=self.colors['bg'],
            fg=self.colors['title']
        )
        title_label.pack(pady=10)
        
        # サブタイトル
        subtitle_label = tk.Label(
            self.root,
            text="1から100までの数字を当ててください！",
            font=self.fonts['subtitle'],
            bg=self.colors['bg'],
            fg=self.colors['title']
        )
        subtitle_label.pack(pady=5)
        
        # 残り回数表示
        self.tries_label = tk.Label(
            self.root,
            text=f"残り回数: {self.max_tries - self.tries}",
            font=self.fonts['normal'],
            bg=self.colors['bg'],
            fg=self.colors['title']
        )
        self.tries_label.pack(pady=5)
        
        # 入力フレーム
        input_frame = tk.Frame(self.root, bg=self.colors['bg'])
        input_frame.pack(pady=5)
        
        # 数字入力
        self.number_entry = tk.Entry(
            input_frame,
            width=8,
            font=self.fonts['input'],
            bg=self.colors['entry_bg'],
            justify='center'
        )
        self.number_entry.pack(side=tk.LEFT, padx=5)
        self.number_entry.bind('<Return>', lambda e: self.check_guess())
        
        # 送信ボタン
        submit_button = tk.Button(
            input_frame,
            text="予想する",
            command=self.check_guess,
            font=self.fonts['button'],
            bg=self.colors['button'],
            fg=self.colors['button_text'],
            relief=tk.RAISED,
            cursor="hand2",
            padx=15
        )
        submit_button.pack(side=tk.LEFT, padx=5)
        
        # ヒント表示
        self.hint_label = tk.Label(
            self.root,
            text="数字を入力してください",
            font=self.fonts['normal'],
            wraplength=350,
            bg=self.colors['bg'],
            fg=self.colors['title']
        )
        self.hint_label.pack(pady=10)
        
        # 履歴表示用フレーム
        history_frame = tk.LabelFrame(
            self.root,
            text="入力履歴",
            font=self.fonts['subtitle'],
            bg=self.colors['bg'],
            fg=self.colors['title']
        )
        history_frame.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)
        
        # スクロールバー
        scrollbar = ttk.Scrollbar(history_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 履歴表示用リストボックス
        self.history_listbox = tk.Listbox(
            history_frame,
            height=10,
            font=self.fonts['history'],
            yscrollcommand=scrollbar.set,
            bg=self.colors['entry_bg'],
            selectmode=tk.NONE
        )
        self.history_listbox.pack(fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.history_listbox.yview)
        
    def check_guess(self):
        try:
            guess = int(self.number_entry.get())
            self.number_entry.delete(0, tk.END)
            
            if guess < 1 or guess > 100:
                messagebox.showwarning("警告", "1から100までの数字を入力してください。")
                return
                
            self.tries += 1
            self.tries_label.config(text=f"残り回数: {self.max_tries - self.tries}")
            
            # 履歴に追加
            if guess == self.answer:
                history_text = f"#{self.tries}: {guess} → 正解！"
                self.history_listbox.insert(0, history_text)
                self.history_listbox.itemconfig(0, {'fg': self.colors['correct']})
                messagebox.showinfo("おめでとう！", 
                    f"{self.tries}回目で正解です！\nあなたの勝ちです！")
                if messagebox.askyesno("確認", "もう一度プレイしますか？"):
                    self.reset_game()
                else:
                    self.root.quit()
            elif self.tries >= self.max_tries:
                history_text = f"#{self.tries}: {guess} → 不正解"
                self.history_listbox.insert(0, history_text)
                self.history_listbox.itemconfig(0, {'fg': 'red'})
                messagebox.showinfo("ゲームオーバー", 
                    f"残念！正解は{self.answer}でした。\nコンピュータの勝ちです！")
                if messagebox.askyesno("確認", "もう一度プレイしますか？"):
                    self.reset_game()
                else:
                    self.root.quit()
            else:
                if guess < self.answer:
                    hint = "もっと大きい数字です。"
                    history_text = f"#{self.tries}: {guess} → 大きい"
                    color = self.colors['bigger']
                else:
                    hint = "もっと小さい数字です。"
                    history_text = f"#{self.tries}: {guess} → 小さい"
                    color = self.colors['smaller']
                self.hint_label.config(text=hint)
                self.history_listbox.insert(0, history_text)
                self.history_listbox.itemconfig(0, {'fg': color})
                    
        except ValueError:
            messagebox.showerror("エラー", "正しい数字を入力してください。")
            
    def reset_game(self):
        self.answer = random.randint(1, 100)
        self.tries = 0
        self.tries_label.config(text=f"残り回数: {self.max_tries - self.tries}")
        self.hint_label.config(text="数字を入力してください")
        self.number_entry.delete(0, tk.END)
        self.history_listbox.delete(0, tk.END)

def main():
    root = tk.Tk()
    game = NumberGameGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()