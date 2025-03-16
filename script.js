// APIキー設定の管理
let GEMINI_API_KEY = '';

// デフォルトのモデル名
const DEFAULT_MODEL = 'gemini-1.5-flash';

// APIキーをローカルストレージから読み込む
function loadAPIKeys() {
    GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || '';
    
    if (!GEMINI_API_KEY) {
        showModal();
    }
    
    updateSendButtonState();
}

// モーダル関連の要素
const modal = document.getElementById('settings-modal');
const settingsButton = document.getElementById('settings-button');
const apiSettingsForm = document.getElementById('api-settings-form');
const closeModalButton = document.querySelector('.close-modal');

// モーダルの表示/非表示
function showModal() {
    modal.classList.add('show');
    document.getElementById('gemini-key').value = GEMINI_API_KEY;
}

function hideModal() {
    modal.classList.remove('show');
}

// APIキー設定のイベントリスナー
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

// メッセージを表示する関数
function appendMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 利用可能なモデルを確認
async function checkAvailableModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        // gemini-1.5-flashモデルの完全な名前を取得
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

// Gemini APIを使用して回答を生成
async function generateResponse(query) {
    try {
        // 利用可能なモデルを確認
        const modelName = await checkAvailableModels();
        
        const prompt = `
あなたは原子力に関する専門知識を持つアシスタントとして、以下の信頼できる情報源に基づいて質問に回答してください：

1. 原子力規制委員会 (www.nsr.go.jp)
- 原子力施設の安全規制
- 放射線モニタリング情報
- 事故・トラブル情報

2. 資源エネルギー庁 (www.enecho.meti.go.jp)
- エネルギー政策
- 原子力発電の現状
- 核燃料サイクル

3. 日本原子力研究開発機構 (www.jaea.go.jp)
- 原子力科学技術
- 安全研究
- 放射線利用

4. 電気事業連合会 (www.fepc.or.jp)
- 原子力発電所の運転状況
- 安全対策の取り組み
- 環境への配慮

以下の点に注意して回答してください：
- 科学的根拠に基づいた正確な情報を提供
- 専門用語は分かりやすく説明
- 中立的な立場を保持
- 必要に応じて具体例を提示
- 安全性に関する質問には慎重に対応

質問: ${query}`;

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

// 送信ボタンのイベントリスナー
document.getElementById('send-button').addEventListener('click', handleSubmit);

// テキストエリアでのEnterキー処理
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
});

// 送信処理
async function handleSubmit() {
    const inputElement = document.getElementById('user-input');
    const userMessage = inputElement.value.trim();
    
    if (userMessage === '') return;
    if (!GEMINI_API_KEY) {
        showModal();
        return;
    }
    
    // ユーザーメッセージを表示
    appendMessage(userMessage, true);
    
    // 入力欄をクリア
    inputElement.value = '';
    
    // 「考え中」メッセージを表示
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message bot thinking';
    thinkingMsg.textContent = '回答を生成中です...';
    document.getElementById('chat-messages').appendChild(thinkingMsg);

    try {
        // 回答を生成
        const answer = await generateResponse(userMessage);
        
        // 「考え中」メッセージを削除
        thinkingMsg.remove();
        
        // 回答を表示
        appendMessage(answer, false);

    } catch (error) {
        console.error('エラー:', error);
        thinkingMsg.remove();
        appendMessage(`エラーが発生しました：${error.message}`, false);
    }
}

// ページ読み込み時の初期化
window.addEventListener('load', () => {
    loadAPIKeys();
    document.getElementById('user-input').focus();
});