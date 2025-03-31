const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 学習コンテンツのデータ
const topics = [
    {
        id: 1,
        title: '原子力の基礎',
        description: '原子と原子核の基本構造について学びます',
        content: 'chapter1.json'
    },
    {
        id: 2,
        title: '核分裂と核融合',
        description: '原子核反応の仕組みについて学びます',
        content: 'chapter2.json'
    },
    // 他のトピック
];

// トピック一覧の取得
app.get('/api/topics', (req, res) => {
    res.json(topics);
});

// トピックの詳細取得
app.get('/api/topics/:id', async (req, res) => {
    try {
        const topicId = parseInt(req.params.id);
        const topic = topics.find(t => t.id === topicId);
        
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        const content = await fs.readFile(
            path.join(__dirname, 'content', topic.content),
            'utf-8'
        );

        res.json({
            ...topic,
            content: JSON.parse(content)
        });
    } catch (error) {
        console.error('Error loading topic:', error);
        res.status(500).json({ error: 'Failed to load topic' });
    }
});

// クイズの取得
app.get('/api/quiz', async (req, res) => {
    try {
        const quizData = await fs.readFile(
            path.join(__dirname, 'content', 'quiz.json'),
            'utf-8'
        );
        
        res.json(JSON.parse(quizData));
    } catch (error) {
        console.error('Error loading quiz:', error);
        res.status(500).json({ error: 'Failed to load quiz' });
    }
});

// 進捗の保存
app.post('/api/progress', (req, res) => {
    const { userId, topicId, progress } = req.body;
    
    // TODO: データベースに進捗を保存
    console.log('Progress saved:', { userId, topicId, progress });
    
    res.json({ success: true });
});

// クイズ結果の保存
app.post('/api/quiz-results', (req, res) => {
    const { userId, quizId, score, answers } = req.body;
    
    // TODO: データベースに結果を保存
    console.log('Quiz results saved:', { userId, quizId, score, answers });
    
    res.json({ success: true });
});

// プッシュ通知の購読
app.post('/api/subscribe', (req, res) => {
    const { subscription } = req.body;
    
    // TODO: プッシュ通知の購読情報を保存
    console.log('Push subscription:', subscription);
    
    res.json({ success: true });
});

// 同期処理
app.post('/api/sync-progress', (req, res) => {
    const { userId, timestamp, data } = req.body;
    
    // TODO: オフライン時のデータを同期
    console.log('Syncing progress:', { userId, timestamp, data });
    
    res.json({ success: true });
});

// SPAのルーティング対応
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});