#!/bin/bash

# エラー発生時にスクリプトを停止
set -e

# 環境変数の確認
if [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "Error: ANDROID_SDK_ROOT is not set"
    exit 1
fi

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}アトムの泉 - ビルドスクリプト${NC}"
echo -e "${GREEN}========================================${NC}"

# 依存関係のインストール
echo -e "\n${YELLOW}1. 依存関係のインストール...${NC}"
npm install

# TypeScriptのビルド
echo -e "\n${YELLOW}2. TypeScriptのコンパイル...${NC}"
npx tsc

# Android ビルド
echo -e "\n${YELLOW}3. Androidビルドの準備...${NC}"
cd android
./gradlew clean

echo -e "\n${YELLOW}4. リリースビルドの作成...${NC}"
./gradlew assembleRelease

cd ..

# 成果物の確認
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo -e "\n${GREEN}ビルド成功!${NC}"
    echo -e "APKの場所: android/app/build/outputs/apk/release/app-release.apk"
else
    echo -e "\n${RED}ビルド失敗: APKが見つかりません${NC}"
    exit 1
fi

# iOS ビルド (Macの場合)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "\n${YELLOW}5. iOSビルドの準備...${NC}"
    cd ios
    pod install
    
    echo -e "\n${YELLOW}6. iOS用アーカイブの作成...${NC}"
    xcodebuild -workspace AtomSpring.xcworkspace -scheme AtomSpring -configuration Release -arch arm64 clean build
    
    cd ..
    echo -e "\n${GREEN}iOSビルド完了${NC}"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}ビルドプロセス完了${NC}"
echo -e "${GREEN}========================================${NC}"

# 次のステップの表示
echo -e "\n${YELLOW}次のステップ:${NC}"
echo "1. Android: APKファイルを Google Play Console にアップロード"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "2. iOS: Xcodeから App Store Connect にアップロード"
fi