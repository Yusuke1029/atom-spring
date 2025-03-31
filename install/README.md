# アトムの泉 インストールシステム

## 概要

TestFlightを使用したiOSアプリのインストールを簡単にするシステムです。

## クイックスタート

```bash
# セットアップ
git clone https://github.com/yourusername/atom-spring.git
cd install
chmod +x setup.sh
./setup.sh

# 設定
vim .env  # 環境変数を設定

# 起動
npm start
```

## システム構成

```
install/
├── invite-api/          # 招待システムAPI
│   ├── index.js        # メインサーバー
│   ├── line-bot.js     # LINE Bot処理
│   └── line-messages.js # LINE応答メッセージ
├── scripts/            # 管理スクリプト
│   ├── setup.js       # セットアップ
│   └── deploy.js      # デプロイ
├── INSTALL_GUIDE.md    # インストールガイド
├── SUMMARY.md         # システム概要
├── setup.sh          # セットアップスクリプト
└── package.json      # 依存関係
```

## 必要な環境

- Node.js 14.0.0以上
- npm 6.0.0以上
- LINE Developers アカウント
- Apple Developer アカウント
- SSL証明書（本番環境用）

## インストール方法

### 1. LINE経由でインストール

1. LINEで「アトムの泉」を友だち追加
2. メールアドレスを送信
3. 招待メールからインストール

### 2. Webページからインストール

1. https://atomspring.example.com/install にアクセス
2. メールアドレスを入力
3. 招待メールからインストール

### 3. 管理者から直接招待

1. 管理者に連絡
2. 招待メールを受信
3. インストール

## 管理者向け情報

### セットアップ

1. 環境変数の設定
```bash
cp .env.example .env
vim .env
```

2. LINE Botの設定
- LINE Developersでチャネルを作成
- Webhook URLを設定
- アクセストークンを取得

3. TestFlightの設定
- App Store Connectで設定
- ベータテストグループを作成
- APIキーを発行

### デプロイ

```bash
# 本番環境へデプロイ
node scripts/deploy.js
```

### 運用管理

1. 招待状況の確認
```bash
npm run stats
```

2. ログの確認
```bash
npm run logs
```

3. バックアップ
```bash
npm run backup
```

## トラブルシューティング

### よくある問題

1. 招待メールが届かない
- スパムフォルダを確認
- メールアドレスの確認
- サーバーのログを確認

2. TestFlightでインストールできない
- iOS バージョンの確認
- TestFlightの再インストール
- Apple IDの確認

3. エラーが発生する
- ログを確認
- 環境変数の確認
- サーバーの状態確認

## サポート

- LINE: @atomspring
- メール: support@atomspring.example.com
- 電話: 0120-XXX-XXX（平日10:00-17:00）

## ライセンス

Copyright © 2025 アトムの泉