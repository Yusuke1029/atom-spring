const line = require('@line/bot-sdk');
const express = require('express');
const router = express.Router();

// LINE Bot設定
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

// メッセージハンドラー
router.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// イベント処理
async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const text = event.message.text;

    // メールアドレスのバリデーション
    if (isValidEmail(text)) {
        try {
            // 招待処理
            await sendInvitation(text);
            
            return client.replyMessage(event.replyToken, [
                {
                    type: 'text',
                    text: 'メールアドレスを受け付けました！\n招待メールをお送りしましたので、ご確認ください。'
                },
                {
                    type: 'text',
                    text: '※ 招待メールが届かない場合は、迷惑メールフォルダもご確認ください。'
                }
            ]);
        } catch (error) {
            console.error('招待エラー:', error);
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: '申し訳ありません。招待の送信に失敗しました。\nしばらく待ってから再度お試しください。'
            });
        }
    }

    // ヘルプメッセージ
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'アプリをインストールするには、メールアドレスを送信してください。\n\n' +
              '例: example@gmail.com\n\n' +
              '招待メールをお送りします。'
    });
}

// メールアドレスのバリデーション
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 招待メール送信処理
async function sendInvitation(email) {
    // APIを呼び出して招待を送信
    const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('招待の送信に失敗しました');
    }

    return response.json();
}

// リッチメニュー作成
async function createRichMenu() {
    const richMenu = {
        size: {
            width: 2500,
            height: 1686
        },
        selected: true,
        name: "アプリインストールメニュー",
        chatBarText: "メニュー",
        areas: [
            {
                bounds: {
                    x: 0,
                    y: 0,
                    width: 1250,
                    height: 1686
                },
                action: {
                    type: "message",
                    text: "インストール方法を教えて"
                }
            },
            {
                bounds: {
                    x: 1251,
                    y: 0,
                    width: 1250,
                    height: 1686
                },
                action: {
                    type: "uri",
                    uri: "https://atomspring.example.com/help"
                }
            }
        ]
    };

    try {
        const richMenuId = await client.createRichMenu(richMenu);
        console.log('リッチメニューを作成しました:', richMenuId);
    } catch (error) {
        console.error('リッチメニューの作成に失敗:', error);
    }
}

// 初期設定
if (process.env.NODE_ENV === 'production') {
    createRichMenu().catch(console.error);
}

module.exports = router;