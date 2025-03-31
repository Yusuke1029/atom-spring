# アトムの泉 TestFlight招待システム

TestFlight経由でアプリをインストールするための招待システムです。

## セットアップ手順

### 1. App Store Connect APIの設定

1. [App Store Connect](https://appstoreconnect.apple.com)にログイン
2. Users and Access > Keys で新しいAPIキーを作成
3. 以下の情報をメモ：
   - Issuer ID
   - Key ID
   - Private Key（ダウンロードして安全に保管）

### 2. 環境変数の設定

1. `.env.example`を`.env`にコピー
```bash
cp .env.example .env
```

2. `.env`ファイルを編集
```env
ASC_ISSUER_ID=your-issuer-id
ASC_KEY_ID=your-key-id
ASC_PRIVATE_KEY=path/to/private-key.p8
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. サーバーの起動

開発環境:
```bash
npm run dev
```

本番環境:
```bash
npm start
```

## 招待の管理方法

### 招待の送信

1. 管理画面から送信
```bash
curl -X POST http://localhost:3000/api/invite \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

2. CSVで一括送信
```bash
npm run invite-batch path/to/emails.csv
```

### 招待状況の確認

```bash
curl http://localhost:3000/api/invite/status/user@example.com
```

## トラブルシューティング

### よくある問題

1. **招待メールが届かない**
- スパムフォルダを確認
- メールアドレスの正確性を確認
- App Store Connectの招待権限を確認

2. **APIエラー**
- 環境変数の設定を確認
- APIキーの有効期限を確認
- ネットワーク接続を確認

3. **Rate Limit**
- デフォルトで15分に100リクエストまで
- 必要に応じて`RATE_LIMIT_*`の設定を調整

## セキュリティ注意事項

1. 環境変数の管理
- `.env`ファイルをGitにコミットしない
- 本番環境の認証情報は安全に管理

2. アクセス制御
- 管理画面へのアクセスは認証必須
- APIエンドポイントはレート制限あり

3. ログ管理
- 機密情報はログに記録しない
- 定期的にログをローテート

## API仕様

### POST /api/invite
招待を送信

```json
{
  "email": "user@example.com",
  "group": "beta-testers"  // オプション
}
```

### GET /api/invite/status/:email
招待状況を確認

```json
{
  "email": "user@example.com",
  "status": "sent|accepted|expired",
  "sentAt": "2025-03-31T04:54:42.000Z"
}
```

## 管理者向け機能

### 招待の一括管理

1. CSVフォーマット
```csv
email,group
user1@example.com,beta
user2@example.com,beta
```

2. 実行コマンド
```bash
npm run admin:invite-bulk path/to/list.csv
```

### 統計情報の確認

```bash
npm run admin:stats
```

## サポート

問題が発生した場合は以下にお問い合わせください：

- 技術的な問題: dev-support@atomspring.example.com
- 一般的な問題: support@atomspring.example.com