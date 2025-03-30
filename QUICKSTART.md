# アトムの泉 クイックスタートガイド

## 必要な環境

### 共通要件
- Node.js 14.0.0以上
- npm 6.0.0以上
- Git

### iOS開発用（Macのみ）
- macOS Catalina (10.15)以上
- Xcode 14.0以上
- CocoaPods
- iOS Developer Account

### Android開発用
- Android Studio
- Java Development Kit (JDK) 11以上
- Android SDK
- Android Virtual Device または実機

## セットアップ手順

1. プロジェクトのクローン
```bash
git clone https://github.com/yourusername/atom-spring.git
cd atom-spring
```

2. 依存関係のインストール
```bash
# npm パッケージのインストール
npm install

# iOSの依存関係インストール（Macのみ）
cd ios && pod install && cd ..
```

3. 環境変数の設定
```bash
# .env ファイルを作成
cp .env.example .env

# API キーを設定
# エディタで .env を開き、必要な値を設定
```

## 開発用アプリの実行

### iOSシミュレータで実行（Macのみ）
```bash
npm run ios
```

### Androidエミュレータで実行
```bash
npm run android
```

### 実機でのテスト

#### iOS実機（Macのみ）
1. Xcodeでデバイスを接続
2. 証明書の設定
3. `npm run ios -- --device`

#### Android実機
1. USBデバッグを有効化
2. デバイスを接続
3. `npm run android`

## トラブルシューティング

### ビルドエラー
```bash
# キャッシュのクリア
npm start -- --reset-cache

# iOS（Macのみ）
cd ios
pod deintegrate
pod install
cd ..

# Android
cd android
./gradlew clean
cd ..
```

### 実行時エラー
1. Metro serverの再起動
```bash
npm start -- --reset-cache
```

2. アプリの再インストール
```bash
# iOS（Macのみ）
cd ios
xcodebuild -workspace AtomSpring.xcworkspace -scheme AtomSpring clean
cd ..

# Android
cd android
./gradlew clean
cd ..
```

## アプリのビルド

### iOSのリリースビルド（Macのみ）
```bash
cd ios
./upload_to_appstore.sh
```

### Androidのリリースビルド
```bash
cd android
./gradlew assembleRelease
```

リリースAPKは以下の場所に生成されます：
`android/app/build/outputs/apk/release/app-release.apk`

## 参考リンク

- [React Native 公式ドキュメント](https://reactnative.dev/docs/getting-started)
- [iOS開発者ポータル](https://developer.apple.com/ios)
- [Android開発者ポータル](https://developer.android.com)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)