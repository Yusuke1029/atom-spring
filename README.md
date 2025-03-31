# アトムの泉 Webアプリケーション

原子力について科学的に理解を深めるための学習プラットフォーム

## 機能

- 📚 体系的な学習コンテンツ
- 🎯 理解度確認クイズ
- 📊 進捗管理
- 📱 PWA対応（オフライン学習可能）

## 技術スタック

- フロントエンド
  - HTML5 / CSS3
  - JavaScript (ES6+)
  - Service Worker (PWA)
  - Webpack

- バックエンド
  - Node.js
  - Express
  - SQLite3

## 開発環境のセットアップ

### 必要条件

- Node.js 14.0.0以上
- npm 6.0.0以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/atom-spring.git
cd atom-spring

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数の設定

`.env`ファイルを作成し、必要な環境変数を設定:

```env
# サーバー設定
PORT=3000
NODE_ENV=development

# データベース設定
DB_PATH=./data/database.sqlite
```

## ビルドとデプロイ

### 本番用ビルド

```bash
# 本番用ビルド
npm run build

# 本番サーバー起動
npm start
```

### デプロイ

```bash
# 本番環境へのデプロイ
npm run deploy
```

## プロジェクト構成

```
.
├── content/          # 学習コンテンツ
├── public/          # 静的ファイル
├── src/            # ソースコード
├── server.js       # サーバーエントリーポイント
└── webpack.config.js  # Webpack設定
```

## 開発ガイドライン

### コーディング規約

- ESLintとPrettierを使用
- コミット前に`npm run lint`を実行

### テスト

```bash
# テストの実行
npm test

# カバレッジレポートの生成
npm run test:coverage
```

### ブランチ戦略

- `main`: 本番環境用
- `develop`: 開発用
- `feature/*`: 新機能開発用
- `hotfix/*`: バグ修正用

## コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## トラブルシューティング

### よくある問題

1. 開発サーバーが起動しない
   ```bash
   # ポート競合の確認
   lsof -i :3000
   ```

2. ビルドエラー
   ```bash
   # 依存関係の再インストール
   rm -rf node_modules
   npm install
   ```

## ライセンス

Copyright © 2025 アトムの泉

## サポート

- 開発者向けサポート: dev-support@atomspring.example.com
- 一般的な質問: support@atomspring.example.com