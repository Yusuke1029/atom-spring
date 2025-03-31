#!/bin/bash

# 色の設定
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}アトムの泉 デプロイスクリプト${NC}\n"

# 環境チェック
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .envファイルが見つかりません${NC}"
    exit 1
fi

# Node.jsバージョンチェック
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [ $(echo "$NODE_VERSION 14.0.0" | tr " " "\n" | sort -V | head -n1) != "14.0.0" ]; then
    echo -e "${RED}Error: Node.js 14.0.0以上が必要です${NC}"
    exit 1
fi

# 依存関係のインストール
echo -e "${YELLOW}1. 依存関係をインストール中...${NC}"
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: 依存関係のインストールに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 依存関係をインストールしました${NC}\n"

# ビルド
echo -e "${YELLOW}2. アプリケーションをビルド中...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: ビルドに失敗しました${NC}"
    exit 1
fi
echo -e "${GREEN}✓ ビルドが完了しました${NC}\n"

# バックアップ
echo -e "${YELLOW}3. データベースをバックアップ中...${NC}"
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="backups/${timestamp}"
mkdir -p "$backup_dir"

# データベースのバックアップ
if [ -f "data/database.sqlite" ]; then
    cp data/database.sqlite "${backup_dir}/database.sqlite"
    echo -e "${GREEN}✓ データベースをバックアップしました${NC}"
else
    echo -e "${YELLOW}Warning: データベースファイルが存在しません${NC}"
fi

# コンテンツのバックアップ
if [ -d "content" ]; then
    cp -r content "${backup_dir}/content"
    echo -e "${GREEN}✓ コンテンツをバックアップしました${NC}"
fi
echo -e "\n"

# 古いバックアップの削除
echo -e "${YELLOW}4. 古いバックアップを削除中...${NC}"
find backups/* -type d -mtime +30 -exec rm -rf {} \;
echo -e "${GREEN}✓ 30日以上前のバックアップを削除しました${NC}\n"

# アプリケーションの停止
echo -e "${YELLOW}5. 現在のアプリケーションを停止中...${NC}"
if [ -f "process.pid" ]; then
    pid=$(cat process.pid)
    kill $pid 2>/dev/null || true
    rm process.pid
    echo -e "${GREEN}✓ アプリケーションを停止しました${NC}"
else
    echo -e "${YELLOW}Warning: プロセスIDファイルが見つかりません${NC}"
fi
echo -e "\n"

# デプロイ
echo -e "${YELLOW}6. 新しいバージョンをデプロイ中...${NC}"
npm start &
echo $! > process.pid
echo -e "${GREEN}✓ 新しいバージョンを起動しました${NC}\n"

# ヘルスチェック
echo -e "${YELLOW}7. ヘルスチェックを実行中...${NC}"
for i in {1..6}; do
    if curl -s http://localhost:3000/health > /dev/null; then
        echo -e "${GREEN}✓ アプリケーションが正常に起動しました${NC}"
        exit 0
    fi
    echo "待機中... ($i/6)"
    sleep 10
done

echo -e "${RED}Error: アプリケーションの起動に失敗しました${NC}"
exit 1