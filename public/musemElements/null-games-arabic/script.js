/* ==========================================================================
   Null Games Arabic - Premium UI Interactions
   - Live Search Filtering
   - Category Filter Tabs
   - Light/Dark Mode Persistence
   - Mobile Menu Drawer
   - Custom Neobrutalist Subscription Toast
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const gameCards = document.querySelectorAll('.game-card');
    const searchInput = document.getElementById('game-search');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const emptyState = document.getElementById('empty-state');
    const gamesGrid = document.getElementById('games-grid');

    let activeCategory = 'all';
    let searchQuery = '';

    // --- 1. Animation Setup on Load ---
    const triggerEntranceAnimations = () => {
        gameCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 0.08}s`;
            card.classList.add('animate-in');
        });
    };
    triggerEntranceAnimations();


    // --- 2. Live Search & Category Filtering logic ---
    const filterGames = () => {
        let visibleCount = 0;

        gameCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const categories = card.getAttribute('data-categories').split(' ');
            
            const matchesSearch = title.includes(searchQuery);
            const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle Empty State visibility
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
            gamesGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            gamesGrid.style.display = 'grid';
        }
    };

    // Live search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            filterGames();
        });
    }

    // Category click handler
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active states
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            activeCategory = tab.getAttribute('data-category');
            
            // Premium micro-interaction: smooth grid pop in
            gamesGrid.style.opacity = '0.4';
            setTimeout(() => {
                filterGames();
                gamesGrid.style.opacity = '1';
            }, 150);
        });
    });


    // --- 3. Light/Dark Mode Toggler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');

    const savedTheme = localStorage.getItem('null-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.className = 'dark-mode';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        document.body.className = 'light-mode';
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
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


    // --- 4. Mobile Menu Drawer ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');

            // Hamburger transformation
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


    // --- 5. Newsletter subscription & Custom Neobrutalist Toast ---
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();

            if (email) {
                showNeobrutalistToast(`شكراً لاشتراكك! تم تسجيل بريدك بنجاح: ${email}`);
                emailInput.value = '';
            }
        });
    }

    const showNeobrutalistToast = (message) => {
        // Remove old toast
        const oldToast = document.querySelector('.neobrutalist-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'neobrutalist-toast';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">👾</span>
                <p class="toast-msg">${message}</p>
            </div>
        `;

        // Inject Neobrutalist Toast CSS dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            .neobrutalist-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: var(--card-bg);
                border: 3px solid var(--border-color);
                color: var(--text-primary);
                padding: 16px 24px;
                border-radius: var(--radius-md);
                box-shadow: 6px 6px 0px var(--border-color);
                z-index: 1200;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: 420px;
                direction: rtl;
                font-family: 'Readex Pro', sans-serif;
            }
            .neobrutalist-toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .toast-icon {
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .toast-msg {
                font-size: 0.95rem;
                font-weight: 700;
                line-height: 1.4;
            }
            @media (max-width: 576px) {
                .neobrutalist-toast {
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
        }, 4500);
    };
});
