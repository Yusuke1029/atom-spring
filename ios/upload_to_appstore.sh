#!/bin/bash

# エラー時に停止
set -e

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}アトムの泉 - App Store アップロードスクリプト${NC}"
echo -e "${GREEN}========================================${NC}"

# 環境変更の確認
if [ -z "$APPLE_ID" ] || [ -z "$APP_SPECIFIC_PASSWORD" ]; then
    echo "Error: 環境変数が設定されていません"
    echo "以下の環境変数を設定してください："
    echo "APPLE_ID: Apple IDのメールアドレス"
    echo "APP_SPECIFIC_PASSWORD: App用パスワード"
    exit 1
fi

# ビルド設定
SCHEME="AtomSpring"
CONFIGURATION="Release"
WORKSPACE="AtomSpring.xcworkspace"
ARCHIVE_PATH="./build/AtomSpring.xcarchive"

echo -e "\n${YELLOW}1. プロジェクトのクリーン...${NC}"
xcodebuild clean -workspace "$WORKSPACE" -scheme "$SCHEME"

echo -e "\n${YELLOW}2. アーカイブの作成...${NC}"
xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH"

echo -e "\n${YELLOW}3. App Storeへのアップロード...${NC}"
xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportOptionsPlist "exportOptions.plist" \
    -exportPath "./build"

echo -e "\n${GREEN}アップロード完了！${NC}"
echo "App Store Connectで確認してください: https://appstoreconnect.apple.com"