const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { App } = require('app-store-connect-api');

// 環境変数の読み込み
require('dotenv').config();

// CORS設定
app.use(cors());
app.use(bodyParser.json());

// App Store Connect API設定
const api = new App({
    issuerId: process.env.ASC_ISSUER_ID,
    keyId: process.env.ASC_KEY_ID,
    privateKey: process.env.ASC_PRIVATE_KEY,
});

// TestFlight招待送信エンドポイント
app.post('/api/invite', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'メールアドレスが必要です'
            });
        }

        // TestFlight招待を送信
        const invitation = await api.betaTesters.create({
            data: {
                type: 'betaTesters',
                attributes: {
                    email: email,
                },
                relationships: {
                    betaGroups: {
                        data: [{
                            id: process.env.BETA_GROUP_ID,
                            type: 'betaGroups'
                        }]
                    }
                }
            }
        });

        // 招待の記録を保存
        await saveInvitation({
            email,
            timestamp: new Date(),
            status: 'sent'
        });

        res.json({
            success: true,
            message: '招待を送信しました'
        });

    } catch (error) {
        console.error('招待送信エラー:', error);
        res.status(500).json({
            error: '招待の送信に失敗しました'
        });
    }
});

// 招待状況確認エンドポイント
app.get('/api/invite/status/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const status = await checkInvitationStatus(email);
        
        res.json({
            email,
            status
        });

    } catch (error) {
        console.error('ステータス確認エラー:', error);
        res.status(500).json({
            error: 'ステータスの確認に失敗しました'
        });
    }
});

// データベース操作のためのヘルパー関数
async function saveInvitation(data) {
    // TODO: データベースに招待記録を保存
    // 例: MongoDB, SQLなど
    console.log('招待を保存:', data);
}

async function checkInvitationStatus(email) {
    // TODO: データベースから招待状況を確認
    return 'pending';
}

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'サーバーエラーが発生しました'
    });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});