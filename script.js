// アプリケーションの状態管理
const state = {
    currentPage: 'home',
    user: null,
    quiz: {
        currentQuestion: 0,
        score: 0,
        questions: []
    },
    progress: {
        completed: 0,
        total: 0
    }
};

// ページ管理
function navigateTo(pageId) {
    // 現在のページを非表示
    document.querySelector(`.page.active`).classList.remove('active');
    
    // 新しいページを表示
    document.querySelector(`#${pageId}`).classList.add('active');
    
    // ナビゲーションの状態を更新
    document.querySelectorAll('.app-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });

    // 状態を更新
    state.currentPage = pageId;
    
    // ページ固有の初期化を実行
    initializePage(pageId);
}

// ページ固有の初期化
function initializePage(pageId) {
    switch (pageId) {
        case 'learn':
            loadTopics();
            break;
        case 'quiz':
            initializeQuiz();
            break;
        case 'profile':
            updateProfile();
            break;
    }
}

// 学習コンテンツの読み込み
async function loadTopics() {
    try {
        const response = await fetch('/api/topics');
        const topics = await response.json();
        renderTopics(topics);
    } catch (error) {
        console.error('Topics loading failed:', error);
        showError('コンテンツの読み込みに失敗しました');
    }
}

// トピックの表示
function renderTopics(topics) {
    const topicsGrid = document.querySelector('.topics-grid');
    topicsGrid.innerHTML = topics.map(topic => `
        <div class="topic-card">
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
            <button class="start-topic" data-id="${topic.id}">開始</button>
        </div>
    `).join('');
}

// クイズの初期化
async function initializeQuiz() {
    try {
        const response = await fetch('/api/quiz');
        state.quiz.questions = await response.json();
        state.quiz.currentQuestion = 0;
        state.quiz.score = 0;
        showQuestion();
    } catch (error) {
        console.error('Quiz loading failed:', error);
        showError('クイズの読み込みに失敗しました');
    }
}

// 問題の表示
function showQuestion() {
    const question = state.quiz.questions[state.quiz.currentQuestion];
    const quizContainer = document.querySelector('.quiz-container');
    
    quizContainer.innerHTML = `
        <h2>問題 ${state.quiz.currentQuestion + 1}</h2>
        <div id="quiz-question">${question.text}</div>
        <div id="quiz-options">
            ${question.options.map((option, index) => `
                <button class="quiz-option" data-index="${index}">
                    ${option}
                </button>
            `).join('')}
        </div>
    `;

    // オプションクリックイベントの設定
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
}

// 回答処理
function handleAnswer(event) {
    const selectedIndex = event.target.dataset.index;
    const question = state.quiz.questions[state.quiz.currentQuestion];
    
    if (selectedIndex == question.correct) {
        state.quiz.score++;
        showFeedback(true);
    } else {
        showFeedback(false);
    }
}

// フィードバック表示
function showFeedback(isCorrect) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? '正解！' : '不正解...';
    
    document.querySelector('.quiz-container').appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        nextQuestion();
    }, 1500);
}

// 次の問題へ
function nextQuestion() {
    state.quiz.currentQuestion++;
    if (state.quiz.currentQuestion < state.quiz.questions.length) {
        showQuestion();
    } else {
        showQuizResult();
    }
}

// クイズ結果表示
function showQuizResult() {
    const quizContainer = document.querySelector('.quiz-container');
    const percentage = Math.round((state.quiz.score / state.quiz.questions.length) * 100);
    
    quizContainer.innerHTML = `
        <h2>クイズ完了！</h2>
        <p>スコア: ${state.quiz.score}/${state.quiz.questions.length} (${percentage}%)</p>
        <button onclick="initializeQuiz()">もう一度チャレンジ</button>
    `;
    
    updateProgress(percentage);
}

// 進捗更新
function updateProgress(score) {
    state.progress.completed++;
    state.progress.total = Math.max(state.progress.total, state.progress.completed);
    
    const percentage = Math.round((state.progress.completed / state.progress.total) * 100);
    document.querySelector('.progress-bar').style.width = `${percentage}%`;
}

// エラー表示
function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    // ナビゲーションイベント
    document.querySelectorAll('.app-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            navigateTo(pageId);
        });
    });

    // 開始ボタン
    document.querySelector('.start-button').addEventListener('click', () => {
        navigateTo('learn');
    });

    // 初期ページの表示
    navigateTo('home');
});
