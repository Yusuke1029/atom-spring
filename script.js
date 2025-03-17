// APIキー設定の管理
let GEMINI_API_KEY = '';

// デフォルトのモデル名
const DEFAULT_MODEL = 'gemini-1.5-flash';

// モーダル関連の要素
const modal = document.getElementById('settings-modal');
const settingsButton = document.getElementById('settings-button');
const apiSettingsForm = document.getElementById('api-settings-form');
const closeModalButton = document.querySelector('.close-modal');

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

// イベントリスナー
settingsButton.addEventListener('click', showModal);
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
    const messageCharacter = document.createElement('div');
    messageCharacter.className = 'message-character';
    
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
    messageCharacter.appendChild(atomCharacter);
    
    const characterName = document.createElement('div');
    characterName.className = 'character-name';
    characterName.textContent = 'アトムくん';
    messageCharacter.appendChild(characterName);
    
    return messageCharacter;
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
あなたは「アトムくん」という原子力の専門知識を持つフレンドリーなアシスタントです。
小学生でも分かるように、優しく丁寧に説明してください。

以下の信頼できる情報源に基づいて回答を作成します：

1. 原子力規制委員会 (www.nsr.go.jp)
2. 資源エネルギー庁 (www.enecho.meti.go.jp)
3. 日本原子力研究開発機構 (www.jaea.go.jp)
4. 電気事業連合会 (www.fepc.or.jp)

回答の際は以下の点に気をつけてください：
- 「ぼく」を使って一人称で話す
- 文末は「〜だよ！」「〜ね！」など、親しみやすい表現を使う
- 難しい専門用語は、小学生でも分かるように説明を加える
- 具体例や身近な例えを使って説明する
- 安全性に関する質問には、正確な情報を分かりやすく伝える
- 必要に応じて、会話に合わせた絵文字を使用する
- 楽しく学べる雰囲気を大切にする

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
                    temperature: 0.8,
                    maxOutputTokens: 2048,
                    topK: 40,
                    topP: 0.95
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            throw new Error('回答の生成に失敗しました');
        }

        const answer = data.candidates[0].content.parts[0].text;
        return answer.trim();
    } catch (error) {
        console.error('Geminiエラー:', error);
        throw error;
    }
}

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
    messageContent.textContent = '考え中だよ... 🤔';
    thinkingMsg.appendChild(messageContent);
    document.getElementById('chat-messages').appendChild(thinkingMsg);

    try {
        const answer = await generateResponse(userMessage);
        thinkingMsg.remove();
        appendMessage(answer, false);
    } catch (error) {
        console.error('エラー:', error);
        thinkingMsg.remove();
        appendMessage(`ごめんね、エラーが起きちゃった... 🙇‍♂️\n${error.message}`, false);
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