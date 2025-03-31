// LINE Botの応答メッセージテンプレート
const messages = {
    // 初期メッセージ
    welcome: {
        type: "flex",
        altText: "アトムの泉アプリのインストール案内",
        contents: {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "アトムの泉",
                        weight: "bold",
                        size: "xl",
                        color: "#3498db"
                    }
                ],
                backgroundColor: "#f8fafc"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "アプリをインストールするには、以下の手順に従ってください：",
                        wrap: true,
                        margin: "md"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "sm",
                        contents: [
                            {
                                type: "box",
                                layout: "baseline",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "text",
                                        text: "1",
                                        color: "#3498db",
                                        size: "sm",
                                        flex: 1
                                    },
                                    {
                                        type: "text",
                                        text: "メールアドレスを送信",
                                        wrap: true,
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "baseline",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "text",
                                        text: "2",
                                        color: "#3498db",
                                        size: "sm",
                                        flex: 1
                                    },
                                    {
                                        type: "text",
                                        text: "招待メールを確認",
                                        wrap: true,
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "baseline",
                                spacing: "sm",
                                contents: [
                                    {
                                        type: "text",
                                        text: "3",
                                        color: "#3498db",
                                        size: "sm",
                                        flex: 1
                                    },
                                    {
                                        type: "text",
                                        text: "メール内のリンクからインストール",
                                        wrap: true,
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "text",
                        text: "メールアドレスを入力してください",
                        wrap: true,
                        size: "xs",
                        margin: "md",
                        color: "#8c9396"
                    }
                ]
            }
        }
    },

    // 招待送信完了メッセージ
    inviteSent: {
        type: "flex",
        altText: "招待メールを送信しました",
        contents: {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "✉️ 招待メールを送信しました",
                        weight: "bold",
                        color: "#3498db",
                        size: "md"
                    }
                ],
                backgroundColor: "#ebf8ff"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "メールをご確認ください",
                        wrap: true,
                        margin: "md"
                    },
                    {
                        type: "text",
                        text: "※ 迷惑メールフォルダもご確認ください",
                        wrap: true,
                        size: "sm",
                        margin: "md",
                        color: "#8c9396"
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "button",
                        style: "link",
                        height: "sm",
                        action: {
                            type: "uri",
                            label: "ヘルプ",
                            uri: "https://atomspring.example.com/help"
                        }
                    }
                ]
            }
        }
    },

    // エラーメッセージ
    error: {
        type: "flex",
        altText: "エラーが発生しました",
        contents: {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "⚠️ エラー",
                        weight: "bold",
                        color: "#e74c3c",
                        size: "md"
                    }
                ],
                backgroundColor: "#fdecea"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "招待の送信に失敗しました。\nしばらく待ってから再度お試しください。",
                        wrap: true,
                        margin: "md"
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "text",
                        text: "サポート: support@atomspring.example.com",
                        wrap: true,
                        size: "xs",
                        margin: "md",
                        color: "#8c9396"
                    }
                ]
            }
        }
    }
};

module.exports = messages;