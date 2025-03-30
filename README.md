# アトムの泉 - モバイルアプリ

原子力について、科学的に理解を深めるためのモバイルアプリケーション

## 特徴

- 原子力に関する質問に対する分かりやすい回答
- 信頼できる情報源に基づく説明
- 理解度を確認できるクイズ機能
- オフライン動作対応
- クロスプラットフォーム対応（iOS/Android）

## 必要な環境

- Node.js 14.0.0以上
- Java Development Kit (JDK) 11以上
- Android Studio（Androidビルド用）
- Xcode（iOSビルド用、Macのみ）
- CocoaPods（iOSビルド用、Macのみ）

## セットアップ手順

1. プロジェクトのクローン:
```bash
git clone https://github.com/yourusername/atom-spring.git
cd atom-spring
```

2. 依存関係のインストール:
```bash
node setup.js
```

3. iOS用の追加セットアップ（Macのみ）:
```bash
cd ios
pod install
cd ..
```

4. Google AI Studio APIキーの設定:
- [Google AI Studio](https://makersuite.google.com/)からAPIキーを取得
- アプリ内の設定画面でAPIキーを入力

## 開発用サーバーの起動

```bash
# Metro サーバーの起動
npm start

# 別のターミナルで以下のいずれかを実行
npm run android  # Androidアプリの起動
npm run ios     # iOSアプリの起動（Macのみ）
```

## ビルド手順

### Android

1. キーストアの生成:
```bash
cd android/app
keytool -genkey -v -keystore release.keystore -alias atom-spring -keyalg RSA -keysize 2048 -validity 10000
```

2. リリースビルドの作成:
```bash
cd android
./gradlew assembleRelease
```

3. 生成されたAPKの場所:
```
android/app/build/outputs/apk/release/app-release.apk
```

### iOS（Macのみ）

1. Xcodeでプロジェクトを開く:
```bash
cd ios
open AtomSpring.xcworkspace
```

2. Xcode経由でアーカイブとアップロード

## プロジェクト構造

```
atom-spring/
├── src/
│   ├── components/     # 再利用可能なコンポーネント
│   ├── screens/       # 画面コンポーネント
│   ├── utils/         # ユーティリティ関数
│   └── assets/        # 画像などのリソース
├── android/           # Androidプロジェクト
└── ios/              # iOSプロジェクト
```

## 情報源

アプリケーションは以下の信頼できる情報源に基づいて回答を提供します：

- 原子力規制委員会 (www.nsr.go.jp)
- 資源エネルギー庁 (www.enecho.meti.go.jp)
- 日本原子力研究開発機構 (www.jaea.go.jp)
- 日本原子力学会 (www.aesj.net)
- その他学術機関や査読済み論文

## 注意事項

- このアプリは教育目的で作成されています
- 医療や緊急時の判断には使用しないでください
- APIキーは安全に管理してください

## ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)ファイルを参照してください。