# アトムの泉 インストールシステム概要

## システム構成

### 1. 招待方法
- LINE経由の自動招待
- Webページからの招待申請
- 管理者による直接招待

### 2. インストール手順
1. 招待受け取り
   - LINEから
   - Webページから
   - メールから

2. アプリのインストール
   - TestFlightのインストール（初回のみ）
   - アプリのインストール

### 3. 管理機能
- 招待状況の管理
- TestFlightグループの管理
- 利用統計の確認

## セットアップ手順

1. 環境構築
```bash
cd install
npm install
```

2. 設定
```bash
node scripts/setup.js
```

3. 起動
```bash
npm start
```

## デプロイ手順

1. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集
```

2. デプロイの実行
```bash
node scripts/deploy.js
```

## 必要な外部サービス

1. LINE
- LINE Developers Console
- Messaging API

2. Apple
- App Store Connect
- TestFlight

3. サーバー
- Node.js 14.0.0以上
- SSL証明書

## メンテナンス

### 定期的な確認事項
1. TestFlightの有効期限
2. SSL証明書の有効期限
3. APIキーの有効期限

### トラブルシューティング
1. 招待メールが届かない
   - スパムフォルダの確認
   - メールサーバーの状態確認

2. インストールできない
   - iOS バージョンの確認
   - TestFlightの動作確認

3. エラーが発生
   - ログの確認
   - サーバーの状態確認

## サポート体制

### ユーザーサポート
- LINE: @atomspring
- メール: support@atomspring.example.com
- 電話: 平日10:00-17:00

### 技術サポート
- 開発者向けドキュメント
- APIリファレンス
- トラブルシューティングガイド

## 今後の予定

1. 機能追加予定
- Android版対応
- 自動承認システム
- 招待コード管理

2. 改善予定
- インストール手順の簡略化
- エラーメッセージの改善
- 管理画面の機能拡充