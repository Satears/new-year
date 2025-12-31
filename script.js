// 倒计时功能实现
function startCountdown() {
    // 设置目标日期为2026年1月1日00:00:00
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    // 每秒更新一次倒计时
    const countdownInterval = setInterval(() => {
        // 获取当前时间
        const now = new Date().getTime();
        // 计算剩余时间
        const timeRemaining = targetDate - now;

        // 如果倒计时结束
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            updateCountdownDisplay(0, 0, 0, 0);
            showNewYearMessage();
            return;
        }

        // 计算天、时、分、秒
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // 更新显示
        updateCountdownDisplay(days, hours, minutes, seconds);
    }, 1000);
}

// 更新倒计时显示
function updateCountdownDisplay(days, hours, minutes, seconds) {
    document.getElementById('days').textContent = formatNumber(days);
    document.getElementById('hours').textContent = formatNumber(hours);
    document.getElementById('minutes').textContent = formatNumber(minutes);
    document.getElementById('seconds').textContent = formatNumber(seconds);
}

// 数字格式化，确保两位数
function formatNumber(num) {
    return num < 10 ? `0${num}` : num;
}

// 显示新年祝福消息
function showNewYearMessage() {
    const header = document.querySelector('.header');
    const title = document.querySelector('.title');
    const countdown = document.querySelector('.countdown');

    // 更新标题
    title.textContent = '新年快乐！';
    title.style.fontSize = '3.5rem';
    title.style.color = '#f1c40f';

    // 创建新年消息
    const newYearMessage = document.createElement('div');
    newYearMessage.className = 'new-year-message';
    newYearMessage.innerHTML = `
        <h2>2026年快乐！</h2>
        <p>愿新的一年带给你无尽的快乐和幸福！</p>
    `;

    // 添加样式
    newYearMessage.style.cssText = `
        text-align: center;
        padding: 20px;
        background-color: rgba(241, 196, 15, 0.8);
        border-radius: 10px;
        margin-top: 20px;
        animation: fadeInUp 1s ease-out;
    `;

    // 替换倒计时为新年消息
    header.replaceChild(newYearMessage, countdown);

    // 触发庆祝动画
    triggerCelebration();
}

// 触发庆祝动画
function triggerCelebration() {
    // 创建烟花效果
    createFireworks();
    
    // 为九宫格图片添加庆祝动画
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'celebrate 0.6s ease-in-out';
        }, index * 100);
    });
}

// 创建烟花效果
function createFireworks() {
    const container = document.querySelector('.container');
    const fireworkCount = 20;

    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            
            // 随机位置
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            
            firework.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 10px;
                height: 10px;
                background-color: #${Math.floor(Math.random()*16777215).toString(16)};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: firework 1s ease-out forwards;
            `;

            container.appendChild(firework);

            // 动画结束后移除
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 200);
    }
}

// 添加烟花动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrate {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
    }

    @keyframes firework {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 图片懒加载和交互效果
function initImageEffects() {
    // 检查浏览器是否支持Intersection Observer
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const imgUrl = item.dataset.bg;
                    
                    // 加载图片
                    const img = new Image();
                    img.src = imgUrl;
                    img.onload = () => {
                        // 图片加载完成后设置背景
                        item.style.backgroundImage = `url('${imgUrl}')`;
                        item.classList.add('loaded');
                    };

                    // 停止观察已加载的图片
                    observer.unobserve(item);
                }
            });
        }, observerOptions);

        // 观察所有带lazy类的图片
        const lazyItems = document.querySelectorAll('.grid-item.lazy');
        lazyItems.forEach(item => {
            observer.observe(item);
        });
    } else {
        // 降级处理：直接加载所有图片
        const lazyItems = document.querySelectorAll('.grid-item.lazy');
        lazyItems.forEach(item => {
            const imgUrl = item.dataset.bg;
            item.style.backgroundImage = `url('${imgUrl}')`;
            item.classList.add('loaded');
        });
    }

    // 添加点击交互效果
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.animation = 'bounce 0.5s ease-in-out';
            setTimeout(() => {
                item.style.animation = '';
            }, 500);
        });
    });
}

// 添加弹跳动画样式
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
    }
`;
document.head.appendChild(bounceStyle);

// 平滑滚动到指定位置
function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// 添加页面加载动画
function initPageLoadAnimation() {
    // 页面加载完成后移除加载动画
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // 初始隐藏body，用于加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
}

// 响应式处理
function initResponsive() {
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        adjustLayout();
    });

    // 初始调整
    adjustLayout();
}

// 调整布局
function adjustLayout() {
    const gallery = document.querySelector('.gallery');
    const windowWidth = window.innerWidth;

    // 根据窗口大小调整九宫格间距
    if (windowWidth < 768) {
        gallery.style.gap = '10px';
    } else if (windowWidth < 1200) {
        gallery.style.gap = '15px';
    } else {
        gallery.style.gap = '20px';
    }
}

// 添加键盘导航
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            // 向下滚动
            window.scrollBy({ top: 300, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            // 向上滚动
            window.scrollBy({ top: -300, behavior: 'smooth' });
        }
    });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    initImageEffects();
    initPageLoadAnimation();
    initResponsive();
    initKeyboardNavigation();

    // 添加页面加载完成的庆祝效果
    window.addEventListener('load', () => {
        setTimeout(() => {
            // 轻微的页面震动效果
            document.body.style.animation = 'pageShake 0.5s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }, 2000);
    });
});

// 添加页面震动动画样式
const pageShakeStyle = document.createElement('style');
pageShakeStyle.textContent = `
    @keyframes pageShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(pageShakeStyle);

