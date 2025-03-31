#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setup() {
    console.log('\n=== アトムの泉 インストールシステム セットアップ ===\n');

    try {
        // 必要なディレクトリの作成
        const dirs = [
            'logs',
            'public',
            'tmp'
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✓ ${dir}ディレクトリを作成しました`);
            }
        });

        // 環境変数の設定
        if (!fs.existsSync('.env')) {
            await setupEnvFile();
        }

        // 依存関係のインストール
        console.log('\nパッケージをインストールしています...');
        execSync('npm install', { stdio: 'inherit' });

        // LINE Bot の設定
        await setupLineBot();

        // TestFlight の設定
        await setupTestFlight();

        console.log('\n✨ セットアップが完了しました！');
        console.log('\n次のステップ:');
        console.log('1. LINE Botを友達追加: @atomspring');
        console.log('2. サーバーを起動: npm start');
        console.log('3. 動作確認: http://localhost:3000\n');

    } catch (error) {
        console.error('エラーが発生しました:', error);
        process.exit(1);
    } finally {
        rl.close();
    }
}

async function setupEnvFile() {
    console.log('\n環境変数の設定:');
    
    const config = {
        'LINE_CHANNEL_SECRET': 'LINE Botのチャンネルシークレット',
        'LINE_CHANNEL_ACCESS_TOKEN': 'LINE Botのチャンネルアクセストークン',
        'ASC_ISSUER_ID': 'App Store Connect APIのIssuer ID',
        'ASC_KEY_ID': 'App Store Connect APIのKey ID',
        'ASC_PRIVATE_KEY': 'App Store Connect APIの秘密鍵のパス',
        'BETA_GROUP_ID': 'TestFlightのベータグループID',
        'SMTP_HOST': 'SMTPサーバーのホスト名',
        'SMTP_PORT': 'SMTPサーバーのポート番号',
        'SMTP_USER': 'SMTPユーザー名',
        'SMTP_PASS': 'SMTPパスワード'
    };

    let envContent = '';
    
    for (const [key, description] of Object.entries(config)) {
        const value = await question(`${description}を入力してください: `);
        envContent += `${key}=${value}\n`;
    }

    fs.writeFileSync('.env', envContent);
    console.log('\n✓ .envファイルを作成しました');
}

async function setupLineBot() {
    console.log('\nLINE Botの設定:');
    console.log('1. LINE Developersコンソールにアクセス');
    console.log('2. Webhookの設定');
    console.log('3. リッチメニューの作成');

    await question('完了したらEnterを押してください...');
}

async function setupTestFlight() {
    console.log('\nTestFlightの設定:');
    console.log('1. App Store Connectにアクセス');
    console.log('2. ベータテストグループの作成');
    console.log('3. APIキーの設定');

    await question('完了したらEnterを押してください...');
}

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// スクリプトの実行
setup().catch(console.error);