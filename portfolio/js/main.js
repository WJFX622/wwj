// 单页路由系统（核心模块）
const router = (function() {
    // 路由状态管理
    const state = {
        currentPath: '#home',
        scrollPositions: {}, // 存储每个页面的滚动位置
        isTransitioning: false // 防止重复跳转
    };

    // 初始化路由
    function init() {
        // 监听URL变化（前进/后退）
        window.addEventListener('popstate', handlePopState);
        
        // 初始化页面
        const initialPath = window.location.hash || '#home';
        navigateTo(initialPath, false);
        
        // 绑定导航链接事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href');
                navigateTo(path);
            });
        });
    }

    // 处理前进/后退事件
    function handlePopState() {
        const path = window.location.hash || '#home';
        navigateTo(path, false);
    }

    // 导航到指定路径
    function navigateTo(path, addToHistory = true) {
        // 防止重复跳转和过渡中跳转
        if (path === state.currentPath || state.isTransitioning) return;
        
        state.isTransitioning = true;
        const currentPage = document.querySelector(`.page[data-page="${state.currentPath.slice(1)}"]`);
        const targetPage = document.querySelector(`.page[data-page="${path.slice(1)}"]`);
        
        // 存储当前页面滚动位置
        state.scrollPositions[state.currentPath] = window.scrollY;
        
        // 添加到历史记录
        if (addToHistory) {
            history.pushState({}, '', path);
        }
        
        // 显示加载动画
        showLoader();
        
        // 模拟加载延迟（实际项目中可替换为真实接口请求）
        setTimeout(() => {
            // 当前页面退出动画
            if (currentPage) {
                currentPage.classList.add('exit');
                setTimeout(() => {
                    currentPage.classList.remove('active', 'exit');
                }, 300);
            }
            
            // 目标页面进入动画
            if (targetPage) {
                targetPage.classList.add('active');
                // 恢复目标页面滚动位置
                setTimeout(() => {
                    window.scrollTo(0, state.scrollPositions[path] || 0);
                    state.isTransitioning = false;
                    hideLoader();
                    
                    // 更新当前路径
                    state.currentPath = path;
                    
                    // 更新导航高亮
                    updateNavHighlight();
                    
                    // 触发技能进度条动画
                    triggerSkillAnimation();
                }, 50);
            } else {
                state.isTransitioning = false;
                hideLoader();
            }
        }, 500);
    }

    // 更新导航高亮
    function updateNavHighlight() {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === state.currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 显示加载动画
    function showLoader() {
        document.querySelector('.loader').classList.add('active');
    }

    // 隐藏加载动画
    function hideLoader() {
        document.querySelector('.loader').classList.remove('active');
    }

    return {
        init,
        navigateTo
    };
})();

// 技能进度条动画触发
function triggerSkillAnimation() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const percent = progressBar.getAttribute('data-percent');
                progressBar.style.width = percent + '%';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });
}

// 项目筛选功能
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // 筛选项目
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, 300);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 联系表单提交处理
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取表单数据
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // 显示加载状态
        const submitBtn = form.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';
        
        // 模拟接口请求
        setTimeout(() => {
            // 重置表单
            form.reset();
            
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // 显示成功提示（实际项目中可使用弹窗组件）
            alert('留言发送成功！我会尽快回复你~');
        }, 1500);
    });
}

// 移动端菜单切换
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        
        // 切换图标
        const icon = menuToggle.querySelector('i');
        if (navList.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
    
    // 点击导航链接关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });
}

// 滚动事件处理（导航栏样式变化 + 返回顶部按钮）
function initScrollEffects() {
    const nav = document.querySelector('nav');
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        // 导航栏滚动样式变化
        if (window.scrollY > 100) {
            nav.classList.add('scroll');
        } else {
            nav.classList.remove('scroll');
        }
        
        // 返回顶部按钮显示/隐藏
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
}

// 页面加载完成后初始化所有功能
window.addEventListener('DOMContentLoaded', () => {
    // 初始化路由
    router.init();
    
    // 初始化项目筛选
    initProjectFilter();
    
    // 初始化联系表单
    initContactForm();
    
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化技能进度条动画
    triggerSkillAnimation();
});