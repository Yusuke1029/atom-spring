# アトムの泉 クイックスタートガイド

## 必要条件

- Node.js 14.0.0以上
- npm 6.0.0以上
- モダンブラウザ（Chrome, Firefox, Safari, Edge）

## インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/atom-spring.git
cd atom-spring

# 依存パッケージのインストール
npm install
```

## 開発環境の起動

```bash
# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

## 本番環境へのデプロイ

```bash
# 本番用ビルド
npm run build

# デプロイスクリプトの実行
./scripts/deploy.sh
```

## アプリケーションの構造

```
.
├── public/          # 静的ファイル
├── content/         # 学習コンテンツ
├── config/          # 設定ファイル
├── scripts/         # デプロイスクリプト
└── src/            # ソースコード
```

## 主な機能

1. 学習コンテンツ
- 原子力の基礎知識
- 段階的な学習システム
- マルチメディアコンテンツ

2. クイズ機能
- 理解度チェック
- 即時フィードバック
- 進捗管理

3. PWA機能
- オフライン対応
- ホーム画面への追加
- プッシュ通知

## 開発の進め方

1. ブランチ戦略
```bash
# 新機能の開発
git checkout -b feature/new-feature

# バグ修正
git checkout -b hotfix/bug-fix
```

2. コードの品質管理
```bash
# リントの実行
npm run lint

# テストの実行
npm test
```

3. ビルドとデプロイ
```bash
# 本番用ビルド
npm run build

# デプロイ
npm run deploy
```

## トラブルシューティング

1. 開発サーバーが起動しない
```bash
# 依存関係の再インストール
rm -rf node_modules
npm install
```

2. ビルドエラー
```bash
# キャッシュのクリア
npm run clean
npm run build
```

3. データベースエラー
```bash
# データベースの初期化
npm run db:init
```

## サポートとヘルプ

- ドキュメント: /docs
- 開発者フォーラム: https://forum.atomspring.example.com
- メール: dev-support@atomspring.example.com