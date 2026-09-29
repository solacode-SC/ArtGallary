/* ==========================================================================
   Null Games Arabic - Premium UI Interactions
   - Light/Dark Theme Switching
   - Mobile Navigation Drawer
   - IntersectionObserver Scroll Reveals
   - Custom Neobrutalist Button Feedbacks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Light/Dark Theme Switcher ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');

    const savedTheme = localStorage.getItem('null-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.className = 'light-mode';
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        document.body.className = 'dark-mode';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.className = 'dark-mode';
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('null-theme', 'dark');
        } else {
            document.body.className = 'light-mode';
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('null-theme', 'light');
        }
    });


    // --- 2. Mobile Menu Drawer ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');

            // Toggle hamburger icon animation
            mobileMenuToggle.classList.toggle('open');
            if (mobileMenuToggle.classList.contains('open')) {
                mobileMenuToggle.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(6px, 6px)';
                mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '0';
                mobileMenuToggle.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                mobileMenuToggle.querySelectorAll('span').forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    }


    // --- 3. Scroll Reveal Effects ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }


    // --- 4. Interactive Feedback Toasts ---
    const moreInfoBtns = document.querySelectorAll('.btn-featured');
    const seeMoreBtn = document.querySelector('.btn-outline-pill');
    const pitchBtns = document.querySelectorAll('.btn-pitch-oval, .pitch-link');

    const showNotification = (message, icon = '🎮') => {
        const existingToast = document.querySelector('.gaming-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'gaming-toast';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <p class="toast-msg">${message}</p>
            </div>
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            .gaming-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: var(--bg-secondary);
                border: 2px solid var(--text-primary);
                color: var(--text-primary);
                padding: 16px 24px;
                border-radius: var(--radius-md);
                box-shadow: 4px 4px 0px var(--text-primary);
                z-index: 1200;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: 400px;
                direction: rtl;
                font-family: var(--font-body);
            }
            .gaming-toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 14px;
            }
            .toast-icon {
                font-size: 1.3rem;
            }
            .toast-msg {
                font-size: 0.92rem;
                font-weight: 700;
            }
            @media (max-width: 576px) {
                .gaming-toast {
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    };

    moreInfoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const gameTitle = btn.parentElement.querySelector('.featured-game-title').innerText;
            showNotification(`سيتم توجيهك إلى صفحة تفاصيل لعبة: ${gameTitle}`, '👾');
        });
    });

    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('جري فتح معرض الألعاب الكامل لمشاهدة جميع الإصدارات المستقلة...', '🕹️');
        });
    }

    pitchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('سيتم توجيهك الآن إلى استمارة تقديم الألعاب للتواصل مع فريق النشر لدينا.', '✉️');
        });
    });
});
