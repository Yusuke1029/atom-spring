// UIのテストケース
describe('アトムの泉 UIテスト', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="atom-kun">
                <div class="speech-bubble">
                    <p></p>
                </div>
            </div>
            <div class="quiz-options"></div>
            <input id="apiKey" type="password">
        `;
    });

    // アトムくんの動作テスト
    test('アトムくんが正しく反応する', () => {
        const atomKunElement = document.querySelector('.atom-kun');
        const event = new MouseEvent('click');
        atomKunElement.dispatchEvent(event);
        
        const bubble = document.querySelector('.speech-bubble p');
        expect(bubble.textContent).not.toBe('');
    });

    // メッセージ表示テスト
    test('正しい回答でポジティブなメッセージを表示', () => {
        const quizOption = document.createElement('button');
        quizOption.textContent = '陽子と中性子';
        quizOption.classList.add('quiz-option');
        
        document.querySelector('.quiz-options').appendChild(quizOption);
        quizOption.click();
        
        const message = document.querySelector('.speech-bubble p').textContent;
        expect(message).toMatch(/すごい|正解|素晴らしい/);
    });

    // APIキー保存テスト
    test('APIキーが正しく保存される', () => {
        const apiKey = 'test-api-key';
        document.getElementById('apiKey').value = apiKey;
        saveApiKey();
        
        expect(localStorage.getItem('apiKey')).toBe(apiKey);
    });

    // アニメーションのテスト
    test('アトムくんのアニメーションが正しく切り替わる', () => {
        const atomKunElement = document.querySelector('.atom-kun');
        setAtomKunMood('excited');
        
        expect(atomKunElement.style.animation).toContain('jump');
        
        setAtomKunMood('thinking');
        expect(atomKunElement.style.animation).toContain('float');
    });

    // メニューの動作テスト
    test('メニューが正しく開閉する', () => {
        const menuButton = document.createElement('button');
        menuButton.classList.add('menu-button');
        document.body.appendChild(menuButton);
        
        const sideMenu = document.createElement('nav');
        sideMenu.classList.add('side-menu');
        document.body.appendChild(sideMenu);
        
        menuButton.click();
        expect(sideMenu.classList.contains('active')).toBe(true);
        
        menuButton.click();
        expect(sideMenu.classList.contains('active')).toBe(false);
    });

    // レスポンシブ動作テスト
    test('画面サイズに応じて正しく表示が切り替わる', () => {
        // ビューポートサイズの変更をシミュレート
        window.innerWidth = 375;
        window.dispatchEvent(new Event('resize'));
        
        const atomKun = document.querySelector('.atom-kun');
        const computedStyle = window.getComputedStyle(atomKun);
        expect(computedStyle.transform).toContain('scale(0.8)');
    });
});