#!/bin/bash

# 色の設定
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== アトムの泉 インストールシステム セットアップ ===${NC}\n"

# Node.jsのバージョン確認
if ! command -v node > /dev/null; then
    echo -e "${RED}Error: Node.jsがインストールされていません${NC}"
    echo "https://nodejs.org からNode.js 14.0.0以上をインストールしてください"
    exit 1
fi

# 必要なディレクトリの作成
echo -e "${YELLOW}1. 必要なディレクトリを作成中...${NC}"
mkdir -p logs public tmp
echo -e "${GREEN}✓ ディレクトリを作成しました${NC}\n"

# 依存関係のインストール
echo -e "${YELLOW}2. 依存関係をインストール中...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: npm installに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 依存関係をインストールしました${NC}\n"

# 環境変数の設定
echo -e "${YELLOW}3. 環境変数の設定...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  .envファイルを編集してください${NC}"
else
    echo -e "${GREEN}✓ .envファイルは既に存在します${NC}"
fi

# セットアップスクリプトの実行
echo -e "\n${YELLOW}4. セットアップスクリプトを実行中...${NC}"
node scripts/setup.js
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: セットアップに失敗しました${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== セットアップが完了しました！ ===${NC}"
echo -e "\n次のステップ:"
echo "1. .envファイルを編集"
echo "2. npm startでサーバーを起動"
echo "3. http://localhost:3000 にアクセス"

# LINE Bot QRコードの表示
echo -e "\n${BLUE}LINE Botの友だち追加:${NC}"
echo "以下のQRコードを読み取って友だち追加してください"
echo "================================="
echo "          QR Code here           "
echo "================================="

# ヘルプ情報
echo -e "\n${YELLOW}困ったときは:${NC}"
echo "- ドキュメント: /install/README.md"
echo "- サポート: support@atomspring.example.com"
echo "- LINE: @atomspring"