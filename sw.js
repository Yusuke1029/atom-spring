const CACHE_NAME = 'atom-spring-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/study.svg',
    '/icons/quiz.svg',
    '/icons/progress.svg'
];

// Service Workerのインストール
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS);
            })
    );
});

// キャッシュの使用とネットワークフォールバック
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュが見つかればそれを返す
                if (response) {
                    return response;
                }

                // キャッシュが見つからなければネットワークにフェッチ
                return fetch(event.request).then(
                    response => {
                        // 無効なレスポンスの場合は何もしない
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // レスポンスをクローンしてキャッシュに保存
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// プッシュ通知の処理
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/icons/icon-192.png',
        badge: '/icons/badge.png',
        vibrate: [100, 50, 100]
    };

    event.waitUntil(
        self.registration.showNotification('アトムの泉', options)
    );
});

// 通知クリック時の処理
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

// バックグラウンド同期
self.addEventListener('sync', event => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

// 進捗の同期処理
async function syncProgress() {
    try {
        const response = await fetch('/api/sync-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Progress sync failed');
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}