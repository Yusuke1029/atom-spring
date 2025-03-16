// ゲームの状態管理
const gameState = {
    isRunning: false,
    days: 0,
    coreTemp: 300,
    powerOutput: 0,
    fuelStatus: '良好',
    coolingStatus: '正常',
    eventProbability: 0.1,
    lastCheck: new Date()
};

// イベントの定義
const events = [
    {
        id: 'cooling_malfunction',
        title: '冷却システム異常',
        description: '冷却システムの性能が低下しています。早急な対応が必要です。',
        severity: 'high',
        options: [
            { text: '緊急停止する', action: 'shutdown' },
            { text: 'バックアップシステムに切り替える', action: 'switch_backup' },
            { text: '技術者を呼ぶ', action: 'call_engineer' }
        ]
    },
    {
        id: 'fuel_degradation',
        title: '燃料棒の劣化',
        description: '燃料棒の劣化が検出されました。定期点検時期を前倒しする必要があります。',
        severity: 'medium',
        options: [
            { text: '即座に点検を実施', action: 'immediate_inspection' },
            { text: '出力を下げて運転継続', action: 'reduce_power' },
            { text: '状況を監視', action: 'monitor' }
        ]
    }
];

// スタッフの定義
const staff = {
    engineer: {
        name: '山田技術主任',
        responses: {
            normal: [
                'システムの状態は安定しています。通常運転を継続してください。',
                '定期点検の時期が近づいています。スケジュールの確認をお願いします。',
                '燃料棒の状態は正常範囲内です。'
            ],
            emergency: [
                '直ちに緊急手順を実行してください。安全性を最優先に考えます。',
                'バックアップシステムの起動を推奨します。',
                '技術チームを派遣します。到着まで状況を監視してください。'
            ]
        }
    },
    safety: {
        name: '佐藤安全管理官',
        responses: {
            normal: [
                '安全パラメータは全て正常値です。',
                '放射線量は基準値以内で推移しています。',
                '避難経路の確認を定期的に実施してください。'
            ],
            emergency: [
                '周辺地域への通知が必要です。手順に従って連絡を開始してください。',
                '作業員の安全確保を最優先してください。',
                '緊急時対応手順を確認してください。'
            ]
        }
    },
    operator: {
        name: '鈴木運転員',
        responses: {
            normal: [
                '制御棒の位置は適正です。',
                '出力調整の必要はありません。',
                '計器の値は全て正常範囲内です。'
            ],
            emergency: [
                '制御棒の緊急挿入準備をしてください。',
                '出力低下操作を開始します。',
                '緊急停止システムの起動準備を行います。'
            ]
        }
    }
};

// UIの更新
function updateUI() {
    document.getElementById('time').textContent = gameState.days;
    document.getElementById('core-temp').textContent = gameState.coreTemp;
    document.getElementById('power-output').textContent = gameState.powerOutput;
    document.getElementById('fuel-status').textContent = gameState.fuelStatus;
    document.getElementById('cooling-status').textContent = gameState.coolingStatus;
}

// イベントログの追加
function addEventLog(message, type = 'normal') {
    const eventLog = document.getElementById('event-log');
    const eventElement = document.createElement('div');
    eventElement.classList.add('event-message');
    if (type !== 'normal') {
        eventElement.classList.add(type);
    }
    eventElement.textContent = `Day ${gameState.days}: ${message}`;
    eventLog.insertBefore(eventElement, eventLog.firstChild);
}

// チャットメッセージの追加
function addChatMessage(sender, message) {
    const chatLog = document.getElementById('chat-log');
    const chatElement = document.createElement('div');
    chatElement.classList.add('chat-message');
    chatElement.innerHTML = `<span class="sender">${sender}:</span> ${message}`;
    chatLog.insertBefore(chatElement, chatLog.firstChild);
}

// モーダルの表示
function showModal(title, message, options) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalOptions = document.getElementById('modal-options');

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOptions.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => {
            handleEventOption(option.action);
            modal.style.display = 'none';
        };
        modalOptions.appendChild(button);
    });

    modal.style.display = 'block';
}

// イベントオプションの処理
function handleEventOption(action) {
    switch (action) {
        case 'shutdown':
            gameState.isRunning = false;
            gameState.powerOutput = 0;
            addEventLog('原子炉を緊急停止しました。', 'warning');
            break;
        case 'switch_backup':
            gameState.coolingStatus = '正常 (バックアップ)';
            addEventLog('バックアップ冷却システムに切り替えました。', 'success');
            break;
        case 'call_engineer':
            addChatMessage(staff.engineer.name, staff.engineer.responses.emergency[2]);
            break;
        // 他のアクションも同様に実装
    }
    updateUI();
}

// ランダムイベントの生成
function generateRandomEvent() {
    if (Math.random() < gameState.eventProbability) {
        const event = events[Math.floor(Math.random() * events.length)];
        showModal(event.title, event.description, event.options);
    }
}

// ゲームの更新
function updateGame() {
    if (!gameState.isRunning) return;

    gameState.days++;
    
    if (gameState.isRunning) {
        // 温度の変動
        gameState.coreTemp = Math.max(300, Math.min(1000, 
            gameState.coreTemp + (Math.random() - 0.5) * 10));
        
        // 出力の変動
        gameState.powerOutput = Math.max(0, Math.min(1000,
            gameState.powerOutput + (Math.random() - 0.5) * 20));
    }

    generateRandomEvent();
    updateUI();
}

// ボタンのイベントハンドラー
document.getElementById('start-reactor').onclick = () => {
    if (!gameState.isRunning) {
        gameState.isRunning = true;
        gameState.powerOutput = 100;
        addEventLog('原子炉を起動しました。', 'success');
        updateUI();
    }
};

document.getElementById('shutdown-reactor').onclick = () => {
    if (gameState.isRunning) {
        gameState.isRunning = false;
        gameState.powerOutput = 0;
        addEventLog('原子炉を停止しました。', 'warning');
        updateUI();
    }
};

document.getElementById('adjust-control-rods').onclick = () => {
    if (gameState.isRunning) {
        gameState.powerOutput = Math.max(0, Math.min(1000,
            gameState.powerOutput + (Math.random() - 0.5) * 100));
        addEventLog('制御棒を調整しました。');
        updateUI();
    }
};

document.getElementById('check-systems').onclick = () => {
    const status = Math.random() > 0.2 ? '正常' : '要点検';
    addEventLog(`システム点検結果: ${status}`);
    gameState.coolingStatus = status;
    updateUI();
};

document.getElementById('contact-staff').onclick = () => {
    const selectedStaff = document.getElementById('staff-select').value;
    const staff_member = staff[selectedStaff];
    const isEmergency = gameState.coreTemp > 800;
    const responses = staff_member.responses[isEmergency ? 'emergency' : 'normal'];
    const response = responses[Math.floor(Math.random() * responses.length)];
    addChatMessage(staff_member.name, response);
};

// モーダルの外側をクリックして閉じる
document.getElementById('modal').onclick = (e) => {
    if (e.target.id === 'modal') {
        e.target.style.display = 'none';
    }
};

// ゲームループの開始
setInterval(updateGame, 5000); // 5秒ごとに更新