const PDFDocument = require('pdfkit');
const fs = require('fs');

// PDFガイドを生成
function generateInstallGuide() {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50
    });

    // ストリームをファイルに書き込み
    doc.pipe(fs.createWriteStream('install-guide.pdf'));

    // フォント設定
    doc.registerFont('NotoSansJP', 'fonts/NotoSansJP-Regular.ttf');
    doc.font('NotoSansJP');

    // タイトル
    doc.fontSize(24)
        .fill('#3498db')
        .text('アトムの泉アプリ', {
            align: 'center'
        });

    doc.fontSize(18)
        .fill('#2c3e50')
        .text('インストールガイド', {
            align: 'center'
        });

    // 空白
    doc.moveDown(2);

    // Step 1
    addStep(doc, 1, 'インストール招待を受け取る', [
        'LINEで「アトムの泉」を友だち追加',
        'メールアドレスを送信',
        '招待メールを確認'
    ]);

    // Step 2
    addStep(doc, 2, 'TestFlightをインストール', [
        'メール内のリンクをタップ',
        'App StoreからTestFlightをインストール',
        '※ すでにインストール済みの場合はスキップ'
    ]);

    // Step 3
    addStep(doc, 3, 'アプリをインストール', [
        'TestFlightを開く',
        '「インストール」をタップ',
        'アプリを起動'
    ]);

    // 注意事項
    doc.moveDown(2)
        .fontSize(14)
        .fill('#e74c3c')
        .text('注意事項', {
            underline: true
        });

    doc.fontSize(12)
        .fill('#2c3e50')
        .list([
            'iOS 12.4以上が必要です',
            '約200MBの空き容量が必要です',
            'インターネット接続が必要です',
            '招待メールの有効期限は7日間です'
        ], {
            bulletRadius: 2,
            textIndent: 20
        });

    // サポート情報
    doc.moveDown(2)
        .fontSize(14)
        .fill('#2c3e50')
        .text('サポート', {
            underline: true
        });

    doc.fontSize(12)
        .text('困ったときは以下にご連絡ください：')
        .moveDown(0.5)
        .text('📱 LINE: @atomspring')
        .text('📧 メール: support@atomspring.example.com')
        .text('☎️ 電話: 0120-XXX-XXX（平日10:00-17:00）');

    // フッター
    doc.fontSize(10)
        .fill('#95a5a6')
        .text('© 2025 アトムの泉', 50, doc.page.height - 50, {
            align: 'center'
        });

    // PDFを完了
    doc.end();
}

// ステップを追加する関数
function addStep(doc, number, title, items) {
    doc.moveDown()
        .fontSize(16)
        .fill('#3498db')
        .text(`Step ${number}: ${title}`);

    doc.fontSize(12)
        .fill('#2c3e50')
        .list(items, {
            bulletRadius: 2,
            textIndent: 20
        });

    doc.moveDown();
}

// スクリプト実行
try {
    console.log('PDFガイドを生成中...');
    generateInstallGuide();
    console.log('PDFガイドの生成が完了しました。');
} catch (error) {
    console.error('PDFガイドの生成に失敗しました:', error);
    process.exit(1);
}