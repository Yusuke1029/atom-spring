# アトムの泉 開発環境セットアップガイド

## 必要条件

- Node.js 14.0.0以上
- npm 6.0.0以上
- モダンブラウザ（Chrome, Firefox, Safari, Edge）

## クイックスタート

```bash
# セットアップスクリプトを実行
chmod +x start.sh
./start.sh
```

これで自動的に以下が実行されます：
1. 必要なディレクトリの作成
2. 依存パッケージのインストール
3. 環境変数の設定
4. 開発サーバーの起動

## 手動セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/yourusername/atom-spring.git
cd atom-spring
```

### 2. 依存パッケージのインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

## プロジェクト構造

```
.
├── content/          # 学習コンテンツ
├── public/           # 静的ファイル
├── scripts/          # ユーティリティスクリプト
├── src/             # ソースコード
└── config/          # 設定ファイル
```

## 開発フロー

1. 機能開発
```bash
git checkout -b feature/new-feature
# 開発作業
git commit -m "Add new feature"
```

2. テスト実行
```bash
npm test
```

3. リント
```bash
npm run lint
```

## デバッグ

### 開発ツール
- Chrome DevTools
- React Developer Tools
- Redux DevTools

### ログの確認
```bash
# アプリケーションログ
tail -f logs/app.log

# エラーログ
tail -f logs/error.log
```

## トラブルシューティング

### node_modulesのリセット
```bash
rm -rf node_modules
npm install
```

### キャッシュのクリア
```bash
npm run clean
```

### データベースのリセット
```bash
npm run db:reset
```

## デプロイ

### 本番ビルド
```bash
npm run build
```

### サーバー起動
```bash
npm start
```

## 管理タスク

### バックアップ
```bash
npm run backup
```

### データのインポート
```bash
npm run import-data
```

### ログローテーション
```bash
npm run logs:rotate
```

## サポート

- 技術的な質問: dev-support@atomspring.example.com
- バグ報告: https://github.com/yourusername/atom-spring/issues
- ドキュメント: /docs

## ライセンス

Copyright © 2025 アトムの泉