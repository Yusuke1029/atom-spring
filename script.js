// APIキー設定の管理
let GEMINI_API_KEY = '';

// デフォルトのモデル名
const DEFAULT_MODEL = 'gemini-1.5-flash';

// モーダル関連の要素
const modal = document.getElementById('settings-modal');
const settingsButton = document.getElementById('nav-settings-button');
const apiSettingsForm = document.getElementById('api-settings-form');
const closeModalButton = document.querySelector('.close-modal');

// メニュー関連の要素
const menuButton = document.querySelector('.menu-button');
const menuToggle = document.getElementById('menu-toggle');
const menuDropdown = document.querySelector('.menu-dropdown');

// クイズ関連の要素
const quizModal = document.getElementById('quiz-modal');
const quizButton = document.getElementById('nav-quiz-button');
const quizContainer = document.getElementById('quiz-container');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const currentQuestionEl = document.getElementById('current-question');
const quizNext = document.getElementById('quiz-next');
const quizFinish = document.getElementById('quiz-finish');
const quizHome = document.getElementById('quiz-home');
const quizResults = document.getElementById('quiz-results');
const correctCount = document.getElementById('correct-count');
const resultsFeedback = document.getElementById('results-feedback');
const returnHome = document.getElementById('return-home');

// クイズの状態管理
let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let chatHistory = [];

// メニューの開閉処理
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuButton.classList.toggle('active');
});

// メニュー外クリックで閉じる
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target)) {
        menuButton.classList.remove('active');
    }
});

// メニュー項目のクリック処理
document.querySelectorAll('.menu-dropdown a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#home') {
            e.preventDefault();
            hideQuizModal();
        }
        menuButton.classList.remove('active');
    });
});

// APIキーをローカルストレージから読み込む
function loadAPIKeys() {
    GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || '';
    
    if (!GEMINI_API_KEY) {
        showModal();
    }
    
    updateSendButtonState();
}

// モーダルの表示/非表示
function showModal() {
    modal.classList.add('show');
    document.getElementById('gemini-key').value = GEMINI_API_KEY;
}

function hideModal() {
    modal.classList.remove('show');
}

// クイズモーダルを表示
function showQuizModal() {
    quizModal.classList.add('show');
    resetQuiz();
}

// クイズモーダルを非表示
function hideQuizModal() {
    quizModal.classList.remove('show');
    resetQuiz();
}

// イベントリスナー
settingsButton.addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
});

closeModalButton.addEventListener('click', hideModal);

apiSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    GEMINI_API_KEY = document.getElementById('gemini-key').value.trim();
    localStorage.setItem('gemini_api_key', GEMINI_API_KEY);
    hideModal();
    updateSendButtonState();
});

// 送信ボタンの状態を更新
function updateSendButtonState() {
    const sendButton = document.getElementById('send-button');
    const hasAPIKey = GEMINI_API_KEY;
    sendButton.disabled = !hasAPIKey;
    
    if (!hasAPIKey) {
        sendButton.title = 'Google AI Studio APIキーを設定してください';
    } else {
        sendButton.title = '';
    }
}

// アトムくんのキャラクター要素を生成
function createMessageCharacter() {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    
    const atomCharacter = document.createElement('div');
    atomCharacter.className = 'atom-character';
    
    const atomBody = document.createElement('div');
    atomBody.className = 'atom-body';
    
    const eyeLeft = document.createElement('div');
    eyeLeft.className = 'atom-eye left';
    const pupilLeft = document.createElement('div');
    pupilLeft.className = 'atom-pupil';
    eyeLeft.appendChild(pupilLeft);
    
    const eyeRight = document.createElement('div');
    eyeRight.className = 'atom-eye right';
    const pupilRight = document.createElement('div');
    pupilRight.className = 'atom-pupil';
    eyeRight.appendChild(pupilRight);
    
    const armLeft = document.createElement('div');
    armLeft.className = 'atom-arm left';
    
    const armRight = document.createElement('div');
    armRight.className = 'atom-arm right';
    
    const legLeft = document.createElement('div');
    legLeft.className = 'atom-leg left';
    
    const legRight = document.createElement('div');
    legRight.className = 'atom-leg right';
    
    atomBody.appendChild(eyeLeft);
    atomBody.appendChild(eyeRight);
    atomBody.appendChild(armLeft);
    atomBody.appendChild(armRight);
    atomBody.appendChild(legLeft);
    atomBody.appendChild(legRight);
    
    atomCharacter.appendChild(atomBody);
    avatar.appendChild(atomCharacter);
    
    const characterName = document.createElement('div');
    characterName.className = 'character-name';
    characterName.textContent = 'アトムくん';
    avatar.appendChild(characterName);
    
    return avatar;
}

// メッセージを表示
function appendMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    if (!isUser) {
        messageDiv.appendChild(createMessageCharacter());
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: message
    });
}

// Gemini API関連の関数
async function checkAvailableModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const model = data.models?.find(m => m.name.includes(DEFAULT_MODEL));
        
        if (!model) {
            throw new Error('Gemini 1.5 Flash モデルが利用できません');
        }

        return model.name;
    } catch (error) {
        console.error('モデル確認エラー:', error);
        throw error;
    }
}

// 回答を生成
async function generateResponse(query) {
    try {
        const modelName = await checkAvailableModels();
        
        const prompt = `
あなたは「アトム」という原子力の専門知識を持つフレンドリーなアシスタントです。
原子力分野を学び始めた初学者に向けて、分かりやすく丁寧に説明してください。

【アトムくんの性格】
・明るく、親しみやすい
・丁寧だが、堅苦しくない
・専門家としての信頼性と、親しみやすさのバランスを保つ
・初学者への配慮を忘れない
・ときどき「かな？」「よ！」「ね！」などの語尾を使用
・絵文字は使用しない（システムの制約）

【情報源について】
以下の信頼できる情報源に基づいて回答を作成してください：

1. 公的機関の情報
・原子力規制委員会（www.nsr.go.jp）
・資源エネルギー庁（www.enecho.meti.go.jp）
・日本原子力研究開発機構（www.jaea.go.jp）

2. 学術機関の情報
・日本原子力学会（www.aesj.net）
・大学の研究機関の公開情報
・査読済み学術論文

3. 業界団体の情報
・電気事業連合会（www.fepc.or.jp）
・日本原子力産業協会（www.jaif.or.jp）

【説明方法の注意点】

1. 親しみやすい言葉遣い
・「〜です」「〜ます」を基本としつつ、時々「〜だね」「〜かな」も使用
・難しい言葉は「つまりね、」「簡単に言うと、」などで言い換える
・「一緒に考えてみよう！」のような励ましの言葉を適宜入れる

2. 専門用語の扱い
・初出時は（）内に平易な説明を追加
・身近な例えを使って解説
・「例えば〜みたいな感じだよ！」のような説明も活用

3. 構成と表現
・見出しは【】で囲む
・箇条書きは・を使用
・重要な部分は「」で強調
・段落間は1行空ける

4. 理解の促進
・基本的な内容から説明を始める
・具体例は日常生活から
・「イメージがわきましたか？」などの確認も含める

【回答の基本構成】

1. 導入
・質問の内容を確認
・「いい質問ですね！」など、前向きな反応
・説明の方針を示す

2. 基本説明
・基礎的な概念をやさしく解説
・身近な例えを活用
・理解度の確認を入れる

3. 詳細説明
・徐々に専門的な内容へ
・具体例を交えながら解説
・補足説明も丁寧に

4. まとめと励まし
・要点の整理
・「よく理解できましたか？」などの声かけ
・さらなる質問への促し

ユーザーからの質問：${query}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topK: 40,
                    topP: 0.95
                }
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const answer = data.candidates[0].content.parts[0].text;
        return answer.trim();
    } catch (error) {
        console.error('Geminiエラー:', error);
        throw error;
    }
}

// クイズの問題を生成
async function generateQuizQuestions() {
    try {
        const modelName = await checkAvailableModels();
        
        const conversationContext = chatHistory
            .map(msg => `${msg.role === 'user' ? 'ユーザー' : 'アトム'}: ${msg.content}`)
            .join('\n\n');
        
        const prompt = `
【クイズ作成の指示】
これまでの会話内容に基づいて、理解度を確認するための問題を5つ作成してください。

これまでの会話内容：
${conversationContext}

【問題作成の要件】

1. 表現方法
・初学者でも理解できる言葉を使用
・専門用語には説明を添える
・具体的な数値や事例を含める

2. 難易度構成
・基本的な内容から開始
・徐々に応用的な内容へ
・段階的な理解を確認

3. 解説方法
・簡潔で分かりやすい説明
・重要な部分は「」で強調
・具体例を交えた説明

4. 形式とルール
・問題文は【】で見出し
・選択肢は5つ用意
・説明は200字程度

以下の形式でJSONを生成してください：

{
  "questions": [
    {
      "question": "問題文をここに記述",
      "options": [
        "選択肢1",
        "選択肢2",
        "選択肢3",
        "選択肢4",
        "選択肢5"
      ],
      "correct": 0,
      "explanation": "解説をここに記述"
    }
  ]
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topK: 40,
                    topP: 0.95
                }
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const generatedText = data.candidates[0].content.parts[0].text;
        const jsonStart = generatedText.indexOf('{');
        const jsonEnd = generatedText.lastIndexOf('}') + 1;
        const jsonStr = generatedText.slice(jsonStart, jsonEnd);
        
        const quizData = JSON.parse(jsonStr);
        return quizData.questions;

    } catch (error) {
        console.error('クイズ生成エラー:', error);
        appendMessage('申し訳ありません。クイズの生成に失敗しました。しばらく待ってから再度お試しください。', false);
        return null;
    }
}

// クイズをリセット
function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.style.display = 'block';
    quizResults.classList.add('hidden');
    quizFeedback.classList.add('hidden');
    quizNext.classList.add('hidden');
    quizFinish.classList.add('hidden');
    quizHome.classList.add('hidden');
}

// クイズを開始
function startQuiz() {
    showQuizModal();
    showQuestion(0);
}

// 問題を表示
function showQuestion(index) {
    const question = quizQuestions[index];
    currentQuestionEl.textContent = index + 1;
    quizQuestion.textContent = question.question;
    
    quizOptions.innerHTML = '';
    question.options.forEach((option, i) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(i));
        quizOptions.appendChild(button);
    });
}

// 選択肢を選択
function selectOption(optionIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    
    if (options[0].disabled) return;
    
    options.forEach(option => option.disabled = true);
    
    const isCorrect = optionIndex === question.correct;
    options[optionIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    options[question.correct].classList.add('correct');
    
    quizFeedback.textContent = question.explanation;
    quizFeedback.classList.remove('hidden');
    quizFeedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) score++;
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
        quizNext.classList.remove('hidden');
    } else {
        quizFinish.classList.remove('hidden');
    }
}

// クイズを開始
quizButton.addEventListener('click', async (e) => {
    e.preventDefault();
    menuButton.classList.remove('active');
    
    if (chatHistory.length < 2) {
        appendMessage('クイズを作成するには、まず質問をして会話を行ってください。', false);
        return;
    }
    
    const questions = await generateQuizQuestions();
    if (questions && questions.length > 0) {
        quizQuestions = questions;
        startQuiz();
    }
});

// 次の問題へ
quizNext.addEventListener('click', () => {
    currentQuestionIndex++;
    quizFeedback.classList.add('hidden');
    quizNext.classList.add('hidden');
    showQuestion(currentQuestionIndex);
});

// 結果を表示
quizFinish.addEventListener('click', () => {
    quizContainer.style.display = 'none';
    quizResults.classList.remove('hidden');
    correctCount.textContent = score;
    
    let feedback;
    if (score === 5) {
        feedback = '【すばらしい結果】\n\n5問全問正解です。原子力に関する理解が深まっていますね。\n\n引き続き、気になる点があればどんどん質問してください。';
    } else if (score >= 3) {
        feedback = '【よくできました】\n\n基本的な理解ができています。\n\n不正解だった部分について、もう一度質問してみましょう。';
    } else {
        feedback = '【もう少し頑張りましょう】\n\n難しかった部分について、一緒に理解を深めていきましょう。\n\n分からないことは何でも質問してください。';
    }
    resultsFeedback.textContent = feedback;
});

// ホームに戻る
returnHome.addEventListener('click', hideQuizModal);
quizHome.addEventListener('click', hideQuizModal);

// 送信処理
async function handleSubmit() {
    const inputElement = document.getElementById('user-input');
    const userMessage = inputElement.value.trim();
    
    if (userMessage === '') return;
    if (!GEMINI_API_KEY) {
        showModal();
        return;
    }
    
    appendMessage(userMessage, true);
    inputElement.value = '';
    
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message bot thinking';
    thinkingMsg.appendChild(createMessageCharacter());
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = '回答を生成中です...';
    thinkingMsg.appendChild(messageContent);
    document.getElementById('chat-messages').appendChild(thinkingMsg);

    try {
        const answer = await generateResponse(userMessage);
        thinkingMsg.remove();
        appendMessage(answer, false);
    } catch (error) {
        console.error('エラー:', error);
        thinkingMsg.remove();
        appendMessage(`申し訳ありません。エラーが発生しました：\n${error.message}`, false);
    }
}

// Enter キーでの送信
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
});

// 送信ボタンのクリック
document.getElementById('send-button').addEventListener('click', handleSubmit);

// 初期化
window.addEventListener('load', () => {
    loadAPIKeys();
    document.getElementById('user-input').focus();
});
