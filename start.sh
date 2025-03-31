#!/bin/bash

# 色の設定
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== アトムの泉 開発環境セットアップ ===${NC}\n"

# 環境チェック
echo -e "${YELLOW}環境をチェックしています...${NC}"

# Node.jsバージョンチェック
if ! command -v node > /dev/null; then
    echo -e "${RED}Error: Node.jsがインストールされていません${NC}"
    echo "https://nodejs.org からNode.js 14.0.0以上をインストールしてください"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
echo "Node.js version: $NODE_VERSION"

# 必要なディレクトリの作成
echo -e "\n${YELLOW}必要なディレクトリを作成しています...${NC}"
mkdir -p public/images
mkdir -p content
mkdir -p logs

# 環境変数の設定
if [ ! -f .env ]; then
    echo -e "\n${YELLOW}環境変数を設定しています...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .envファイルを作成しました${NC}"
fi

# 依存パッケージのインストール
echo -e "\n${YELLOW}依存パッケージをインストールしています...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: パッケージのインストールに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✓ パッケージをインストールしました${NC}"

# 開発サーバーの起動
echo -e "\n${YELLOW}開発サーバーを起動しています...${NC}"
echo "http://localhost:3000 でアクセスできます"
echo -e "終了するには ${YELLOW}Ctrl+C${NC} を押してください\n"

npm run dev