# iOSビルドガイド

## 必要な環境
- macOS
- Xcode 14.0以上
- CocoaPods
- Node.js 14.0.0以上
- Ruby 2.7.0以上

## 開発環境のセットアップ

1. 依存関係のインストール
```bash
# プロジェクトルートで実行
npm install

# iOSディレクトリで実行
cd ios
pod install
```

2. 開発用証明書の設定
- Xcodeを開く: `open AtomSpring.xcworkspace`
- Signing & Capabilitiesで開発用証明書を設定
  - Team: 自分のApple Developer Teamを選択
  - Bundle Identifier: com.atomspring

## ビルドとテスト

1. シミュレータでのテスト
```bash
# プロジェクトルートで実行
npm run ios
```

2. 実機でのテスト
- Xcodeで実機を選択
- Build and Runを実行

## App Store用ビルド

1. アーカイブの作成
- Xcodeでデバイスを「Any iOS Device」に設定
- Product > Archive を選択

2. App Store Connectへのアップロード
- Archiveウィンドウで「Distribute App」を選択
- 「App Store Connect」を選択
- 画面の指示に従って進める

## App Store申請の準備

1. 必要な情報
- アプリアイコン（1024x1024）
- スクリーンショット（各デバイスサイズ）
- アプリの説明文
- プライバシーポリシー

2. App Store Connectでの設定
- 新規アプリの作成
- アプリ情報の入力
- スクリーンショットのアップロード
- ビルドのアップロード

## 注意点

- プッシュ通知を使用する場合は、Push Notification証明書の設定が必要
- アプリ内課金を使用する場合は、App Store Connectでの商品登録が必要
- TestFlightでベータテストを行う場合は、追加の設定が必要

## トラブルシューティング

1. ビルドエラーの場合
```bash
cd ios
pod deintegrate
pod install
```

2. 証明書エラーの場合
- Xcode > Preferences > Accounts で証明書を更新
- Keychain Access で証明書を確認

3. アーカイブ失敗の場合
- Clean Build Folder を実行
- Derived Data を削除して再試行

## 参考リンク
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [iOS Developer Portal](https://developer.apple.com/ios/)
- [App Store Connect](https://appstoreconnect.apple.com/)