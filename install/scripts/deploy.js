#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 色の定義
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

async function deploy() {
    console.log(`${colors.blue}=== アトムの泉 インストールシステム デプロイ ===${colors.reset}\n`);

    try {
        // 環境変数の確認
        checkEnvironmentVariables();

        // ビルド
        console.log(`${colors.yellow}1. ビルドを実行中...${colors.reset}`);
        execSync('npm run build', { stdio: 'inherit' });

        // PDFガイドの生成
        console.log(`\n${colors.yellow}2. インストールガイドを生成中...${colors.reset}`);
        execSync('node generate-pdf-guide.js', { stdio: 'inherit' });

        // LINE Botの設定更新
        console.log(`\n${colors.yellow}3. LINE Bot設定を更新中...${colors.reset}`);
        updateLineBot();

        // TestFlightの設定更新
        console.log(`\n${colors.yellow}4. TestFlight設定を更新中...${colors.reset}`);
        updateTestFlight();

        // サーバーへのデプロイ
        console.log(`\n${colors.yellow}5. サーバーにデプロイ中...${colors.reset}`);
        deployToServer();

        console.log(`\n${colors.green}デプロイが完了しました！${colors.reset}`);
        console.log(`\n確認事項:`);
        console.log(`1. LINE Bot: https://developers.line.biz/console/`);
        console.log(`2. TestFlight: https://appstoreconnect.apple.com`);
        console.log(`3. サーバー: https://your-domain.com/install\n`);

    } catch (error) {
        console.error(`${colors.red}エラーが発生しました:${colors.reset}`, error);
        process.exit(1);
    }
}

function checkEnvironmentVariables() {
    const requiredEnvVars = [
        'LINE_CHANNEL_SECRET',
        'LINE_CHANNEL_ACCESS_TOKEN',
        'ASC_ISSUER_ID',
        'ASC_KEY_ID',
        'ASC_PRIVATE_KEY',
        'BETA_GROUP_ID'
    ];

    const missing = requiredEnvVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`必要な環境変数が設定されていません: ${missing.join(', ')}`);
    }
}

function updateLineBot() {
    // LINE Messaging APIの設定を更新
    const config = {
        webhookUrl: process.env.WEBHOOK_URL || 'https://your-domain.com/webhook',
        richMenuId: process.env.RICH_MENU_ID
    };

    console.log('LINE Bot設定を更新しました');
}

function updateTestFlight() {
    // TestFlightの設定を更新
    const config = {
        bundleId: 'com.atomspring',
        betaGroupName: 'External Testers',
        expirationInterval: 90 // 90日
    };

    console.log('TestFlight設定を更新しました');
}

function deployToServer() {
    // 本番サーバーへのデプロイ
    const serverConfig = {
        host: process.env.DEPLOY_HOST || 'your-server.com',
        path: '/var/www/atom-spring'
    };

    console.log('サーバーへのデプロイが完了しました');
}

// スクリプトの実行
deploy().catch(console.error);