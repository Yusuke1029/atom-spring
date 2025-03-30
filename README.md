# アトムの泉

原子力について、科学的に理解を深めるためのチャットアプリケーション

## 概要

「アトムの泉」は、原子力に関する知識を分かりやすく学べるPWA（Progressive Web App）です。
信頼できる情報源に基づいて、初学者にも理解しやすい説明を提供します。

## 特徴

- 親しみやすいUIとキャラクター
- 信頼できる情報源に基づく回答
- 理解度を確認できるクイズ機能
- PWA対応でインストール可能
- オフライン動作対応

## セットアップ方法

1. 必要なAPIキーの取得
   - Google AI Studio (https://makersuite.google.com/) にアクセス
   - APIキーを取得

2. アプリケーションの起動
   - ローカルサーバーを起動（例：`python -m http.server 8000`）
   - ブラウザで `http://localhost:8000` にアクセス
   - 設定画面でAPIキーを入力

## 使用している技術

- HTML5 / CSS3
- JavaScript (Vanilla JS)
- Google AI Studio (Gemini API)
- PWA (Progressive Web App)
- Service Workers

## 情報源

以下の信頼できる情報源に基づいて回答を提供しています：

- 原子力規制委員会 (www.nsr.go.jp)
- 資源エネルギー庁 (www.enecho.meti.go.jp)
- 日本原子力研究開発機構 (www.jaea.go.jp)
- 日本原子力学会 (www.aesj.net)
- その他学術機関や査読済み論文

## 注意事項

- 医療や緊急時の判断には使用しないでください
- APIキーは安全に管理してください
- 常に最新の情報を参照することをお勧めします

## ライセンス

MIT License