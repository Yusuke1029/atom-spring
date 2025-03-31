const winston = require('winston');
const path = require('path');

// ログレベルの定義
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// ログレベルの色設定
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

// Winstonに色を追加
winston.addColors(colors);

// ログのフォーマット設定
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(info => {
        const { timestamp, level, message, stack } = info;
        const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
        
        if (stack) {
            return `${prefix} ${message}\n${stack}`;
        }
        return `${prefix} ${message}`;
    })
);

// 環境に応じたログレベルの設定
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'production' ? 'info' : 'debug';
};

// ロガーの作成
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports: [
        // エラーログ
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        }),
        
        // 通常ログ
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        }),

        // アクセスログ
        new winston.transports.File({
            filename: path.join('logs', 'access.log'),
            level: 'http',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        })
    ]
});

// 開発環境ではコンソールにも出力
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            format
        )
    }));
}

// リクエストロギングミドルウェア
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.url} ${res.statusCode} ${duration}ms`;
        logger.http(message);
    });
    next();
};

// エラーロギングミドルウェア
const errorLogger = (err, req, res, next) => {
    logger.error(err.message, {
        url: req.url,
        method: req.method,
        body: req.body,
        stack: err.stack
    });
    next(err);
};

// 定期的なログローテーション
const setupLogRotation = () => {
    const fs = require('fs');
    const logDir = 'logs';
    
    // ログディレクトリの作成
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    
    // 古いログファイルの削除（30日以上前）
    setInterval(() => {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - 30);
        
        fs.readdir(logDir, (err, files) => {
            if (err) return;
            
            files.forEach(file => {
                const filePath = path.join(logDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;
                    if (stats.mtime < threshold) {
                        fs.unlink(filePath, err => {
                            if (!err) {
                                logger.info(`Deleted old log file: ${file}`);
                            }
                        });
                    }
                });
            });
        });
    }, 24 * 60 * 60 * 1000); // 24時間ごと
};

module.exports = {
    logger,
    requestLogger,
    errorLogger,
    setupLogRotation
};