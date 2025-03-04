// タイピングエフェクト
function typeEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// スキルバーのアニメーション
function animateSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const progress = card.querySelector('.skill-progress');
        const skillLevel = card.dataset.skill;
        progress.style.width = `${skillLevel}%`;
    });
}

// Intersection Observer for スキルセクション
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// もっと読むボタンの機能
document.getElementById('readMoreBtn').addEventListener('click', function() {
    const moreContent = document.getElementById('moreContent');
    moreContent.classList.toggle('show');
    this.textContent = moreContent.classList.contains('show') ? '閉じる' : 'もっと読む';
});

// フォームの送信処理
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // フォームデータの表示（実際のプロジェクトではサーバーに送信）
    alert(`送信内容の確認:
名前: ${name}
メール: ${email}
メッセージ: ${message}`);
    
    // フォームのリセット
    this.reset();
});

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // タイピングエフェクトの開始
    const heroTitle = document.querySelector('.hero-content h1');
    const originalText = heroTitle.textContent;
    typeEffect(heroTitle, originalText);
    
    // スキルセクションの監視開始
    const skillsSection = document.querySelector('.skills');
    observer.observe(skillsSection);
    
    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});

// スクロールアニメーション
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.header');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.8)';
        nav.style.boxShadow = 'none';
    }
});