// アトムくんの設定
const atomKun = {
    expressions: {
        happy: {
            eyes: 'normal',
            mouth: 'smile',
            animation: 'bounce'
        },
        thinking: {
            eyes: 'looking-up',
            mouth: 'thinking',
            animation: 'float'
        },
        excited: {
            eyes: 'sparkle',
            mouth: 'big-smile',
            animation: 'jump'
        },
        explaining: {
            eyes: 'normal',
            mouth: 'talking',
            animation: 'wave'
        }
    },
    messages: {
        greeting: [
            'やあ！ぼくはアトムくん！一緒に原子力について学ぼうね！',
            'こんにちは！今日も楽しく勉強しましょう！',
            'みんなで楽しく科学を学びましょう！'
        ],
        encouragement: [
            'その調子だよ！とってもよく理解できてるね！',
            'すごい！その考え方は正解だよ！',
            'よく頑張ったね！次も一緒に頑張ろう！'
        ],
        helping: [
            'むずかしいところは一緒に考えていこうね',
            'ヒントが必要なときは言ってね',
            '少しずつ理解していけば大丈夫だよ！'
        ],
        explaining: [
            'これは面白いところなんだ！',
            'ここが重要なポイントだよ！',
            'こうやって考えると分かりやすいよ！'
        ]
    }
};

// アプリケーションの状態管理
const state = {
    currentPage: 'home',
    menuOpen: false,
    apiKey: localStorage.getItem('apiKey') || '',
    currentExpression: 'happy'
};

// DOMの読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    startAtomKunBehavior();
});

// アプリケーションの初期化
function initializeApp() {
    showRandomGreeting();
    setupAtomKunInteractions();
    restoreSettings();
}

// イベントリスナーの設定
function setupEventListeners() {
    // メニュー関連
    const menuButton = document.querySelector('.menu-button');
    menuButton.addEventListener('click', toggleMenu);
    
    // ナビゲーション
    document.querySelectorAll('.side-menu a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // クイズ関連
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleQuizAnswer);
    });
    
    // 設定関連
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSave);
    }
}

// アトムくんの動作制御
function setAtomExpression(expression) {
    const config = atomKun.expressions[expression];
    const atomKunElement = document.querySelector('.atom-kun');
    
    // アニメーションのリセットと適用
    atomKunElement.style.animation = 'none';
    atomKunElement.offsetHeight; // リフロー
    atomKunElement.style.animation = `${config.animation} 2s infinite`;
    
    // 表情の更新
    document.querySelector('.atom-eye.left').className = `atom-eye left ${config.eyes}`;
    document.querySelector('.atom-eye.right').className = `atom-eye right ${config.eyes}`;
    document.querySelector('.atom-mouth').className = `atom-mouth ${config.mouth}`;
    
    state.currentExpression = expression;
}

// メッセージの表示
function showAtomMessage(message, type = 'greeting') {
    const bubble = document.querySelector('.speech-bubble p');
    const atomKunElement = document.querySelector('.atom-kun');
    
    // メッセージのアニメーション
    bubble.style.animation = 'none';
    bubble.offsetHeight; // リフロー
    bubble.style.animation = 'pop 0.5s ease-out';
    
    bubble.textContent = message;
    
    // 表情とアニメーションの設定
    setAtomExpression(type);
    
    // クリック時のインタラクション
    atomKunElement.addEventListener('click', () => {
        showRandomMessage(type);
    }, { once: true });
}

// ランダムなメッセージの表示
function showRandomMessage(type) {
    const messages = atomKun.messages[type];
    const randomIndex = Math.floor(Math.random() * messages.length);
    showAtomMessage(messages[randomIndex], type);
}

// クイズの回答処理
function handleQuizAnswer(e) {
    const selected = e.target;
    const isCorrect = selected.textContent === '陽子と中性子';
    
    if (isCorrect) {
        showAtomMessage(atomKun.messages.encouragement[0], 'excited');
        selected.classList.add('correct');
    } else {
        showAtomMessage(atomKun.messages.helping[0], 'thinking');
        selected.classList.add('incorrect');
    }
    
    // 少し待ってからリセット
    setTimeout(() => {
        selected.classList.remove('correct', 'incorrect');
        showRandomMessage('greeting');
    }, 3000);
}

// メニューの開閉
function toggleMenu() {
    const menuButton = document.querySelector('.menu-button');
    const sideMenu = document.querySelector('.side-menu');
    
    state.menuOpen = !state.menuOpen;
    menuButton.classList.toggle('active');
    sideMenu.classList.toggle('active');
    
    // メニュー開閉時のアトムくんの反応
    if (state.menuOpen) {
        showAtomMessage('メニューから選んでね！', 'explaining');
    } else {
        showRandomMessage('greeting');
    }
}

// アトムくんの自動的な振る舞い
function startAtomKunBehavior() {
    setInterval(() => {
        if (Math.random() < 0.3) { // 30%の確率で
            showRandomMessage('greeting');
        }
    }, 15000); // 15秒ごと
}

// 設定の保存
function handleSettingsSave(e) {
    e.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    
    localStorage.setItem('apiKey', apiKey);
    state.apiKey = apiKey;
    
    showAtomMessage('設定を保存したよ！これでもっと賢くなれるね！', 'excited');
}
