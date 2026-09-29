/* ==========================================================================
   GameZone Portal (جيم زون) - Client Logic
   - Mobile Menu Drawer
   - Scroll Reveal Observer
   - Hero Carousel Slider (Elden Ring, Wukong, Tomb Raider)
   - Wishlist Hearts Toggle
   - Interactive Gaming Toast Alerts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Drawer ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');

            // Hamburger animation
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


    // --- 2. Scroll Reveal Observer ---
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


    // --- 3. Hero Carousel Slider ---
    const carouselSlideBg = document.getElementById('hero-slide-bg');
    const slideImg = carouselSlideBg.querySelector('.slide-bg-img');
    const heroGameTag = document.getElementById('hero-game-tag');
    const heroGameTitle = document.getElementById('hero-game-title');
    const heroGameDesc = document.getElementById('hero-game-desc');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.indicator-dot');

    const slidesData = [
        {
            tag: 'إيلدن رينغ',
            title: 'ظل شجرة إرد',
            desc: 'تستمر الملحمة الأسطورية في الأراضي البينية. استكشف آفاقاً مجهولة، واجه خصوماً فتاكين، واكشف الغطاء عن أسرار شجرة إرد المفقودة.',
            img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80'
        },
        {
            tag: 'بلاك ميث',
            title: 'وكونغ: الأسطورة الصينية',
            desc: 'رحلة ملحمية عبر الأساطير الصينية القديمة. تقمص دور مقاتل القرد الأسطوري وكونغ وواجه جحافل الأعداء والوحوش باستخدام قواك السحرية الخارقة وعصاك الفولاذية.',
            img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80'
        },
        {
            tag: 'تومب رايدر',
            title: 'ثلاثية لارا كروفت المحسّنة',
            desc: 'استرجع مغامرات لارا كروفت الكلاسيكية مع رسومات ومؤثرات بصرية محسّنة بالكامل. استكشف المقابر الأثرية وحل الألغاز الغامضة عبر العالم.',
            img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1600&q=80'
        }
    ];

    let currentSlide = 0;
    let autoPlayInterval;

    const updateSlide = (index) => {
        currentSlide = index;
        const data = slidesData[currentSlide];

        // Animate slide fade in/out smoothly
        carouselSlideBg.style.opacity = '0.3';
        
        setTimeout(() => {
            slideImg.src = data.img;
            heroGameTag.innerText = data.tag;
            heroGameTitle.innerText = data.title;
            heroGameDesc.innerText = data.desc;
            
            carouselSlideBg.style.opacity = '1';
        }, 150);

        // Update active indicator dot
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        let nextIndex = (currentSlide + 1) % slidesData.length;
        updateSlide(nextIndex);
    };

    const prevSlide = () => {
        let prevIndex = (currentSlide - 1 + slidesData.length) % slidesData.length;
        updateSlide(prevIndex);
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    indicators.forEach(ind => {
        ind.addEventListener('click', () => {
            const index = parseInt(ind.getAttribute('data-slide'));
            updateSlide(index);
            resetAutoPlay();
        });
    });

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 8000); // Change slide every 8s
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Initialize Autoplay
    startAutoPlay();


    // --- 4. Interactive Gaming Toast Alerts ---
    const primaryBtns = document.querySelectorAll('.btn-read-more, .btn-video-watch, .btn-login, .view-all-link, .action-btn');

    const showGameToast = (message, title = 'جيم زون 🎮') => {
        const existingToast = document.querySelector('.game-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-card">
                <div class="toast-accent-line"></div>
                <h4 class="toast-title">${title}</h4>
                <p class="toast-msg">${message}</p>
            </div>
        `;

        // Inject dynamic toast styling
        const style = document.createElement('style');
        style.innerHTML = `
            .game-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: var(--color-surface-card, #0f1115);
                border: 1px solid var(--color-neon-green, #39e144);
                border-radius: var(--radius-sm, 4px);
                box-shadow: var(--card-shadow, 0 15px 35px rgba(0,0,0,0.7));
                z-index: 1200;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: 380px;
                direction: rtl;
                font-family: 'Readex Pro', sans-serif;
                overflow: hidden;
            }
            .game-toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            .toast-card {
                padding: 16px 20px;
            }
            .toast-accent-line {
                height: 3px;
                background-color: var(--color-neon-green, #39e144);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            }
            .toast-title {
                font-family: 'Cairo', sans-serif;
                font-weight: 800;
                font-size: 1rem;
                color: var(--color-neon-green, #39e144);
                margin-bottom: 6px;
            }
            .toast-msg {
                font-size: 0.88rem;
                color: var(--color-text-primary, #f8fafc);
                line-height: 1.5;
            }
            @media (max-width: 576px) {
                .game-toast {
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
            }, 350);
        }, 4000);
    };

    primaryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = btn.innerText.trim();
            if (btn.classList.contains('btn-read-more')) {
                e.preventDefault();
                showGameToast(`جاري فتح المراجعة والتقرير الشامل للعبة "${slidesData[currentSlide].title}" ...`, 'تقارير جيم زون 📝');
            } else if (btn.classList.contains('btn-video-watch')) {
                e.preventDefault();
                showGameToast(`جاري تشغيل العرض الدعائي الرسمي للعبة "${slidesData[currentSlide].title}" ...`, 'شاهد المقطع الدعائي 🍿');
            } else if (btn.classList.contains('btn-login')) {
                e.preventDefault();
                showGameToast('جاري فتح بوابة تسجيل الدخول الموحد لمجتمع جيم زون للرواد.', 'تسجيل الدخول 👤');
            } else if (btn.classList.contains('view-all-link')) {
                e.preventDefault();
                showGameToast('جاري تحويلك إلى الفهرس الكامل والتقويم السنوي الشامل للألعاب.', 'فهرس جيم زون 🗂️');
            } else if (btn.getAttribute('aria-label') === 'الإشعارات') {
                showGameToast('قائمة التنبيهات: تم تحديد 3 أخبار جديدة متوافقة مع تفضيلاتك للألعاب.', 'الإشعارات النشطة 🔔');
            } else if (btn.getAttribute('aria-label') === 'البحث عن أخبار أو ألعاب') {
                showGameToast('جاري تهيئة محرك البحث الفوري عن الأخبار والمراجعات والإصدارات.', 'البحث الذكي 🔍');
            }
        });
    });


    // --- 5. Wishlist Hearts Toggle ---
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            const rowTitle = btn.closest('.release-row').querySelector('.release-info h3').innerText;

            if (btn.classList.contains('active')) {
                showGameToast(`لقد تم إضافة لعبة "${rowTitle}" بنجاح إلى قائمة الأمنيات والمتابعة. سنقوم بتنبيهك فور إطلاقها!`, 'تم الإضافة للمفضلة ❤️');
            } else {
                showGameToast(`تم إزالة لعبة "${rowTitle}" من قائمة الأمنيات والمتابعة الخاصة بك.`, 'تم الإزالة من المفضلة 💔');
            }
        });
    });

});
