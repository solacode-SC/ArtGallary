/* ==========================================================================
   JavaScript Functionality - بِنك (Binke) Premium Arabic Agency
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Navbar Scroll class toggling
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ==========================================================================
    // Responsive Mobile Menu
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            navMenu.classList.add('open');
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
    });

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Close mobile menu on clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });


    // ==========================================================================
    // Interactive Mockup Dashboard Tab Switcher
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.db-tab-btn');
    const contentArea = document.getElementById('db-content-area');
    
    // Scrubber elements inside footer
    const progressBar = document.querySelector('.db-scrubber-progress');
    const progressPin = document.querySelector('.db-scrubber-pin');
    const durationLabel = document.querySelector('.db-duration');

    const tabData = {
        branding: {
            html: `
                <div class="tab-view branding-view active">
                    <div class="tab-text-card">
                        <span class="tab-view-tag">تطوير الهويات</span>
                        <h3 class="tab-view-title">تصميم تجربة مستخدم مبهر متناغم مع موقع تفاعلي</h3>
                        <p class="tab-view-desc">نقوم بدمج فلسفة علامتك التجارية ضمن واجهات ويب حية ومستقرة، تجمع بين جمالية التصميم وسرعة الاستجابة لخلق تجربة رقمية لا تُنسى لعملائك.</p>
                        <span class="tab-view-subtext">✦ الحركات التفاعلية للويب</span>
                    </div>
                    <div class="tab-visual-card">
                        <img src="assets/avatar_dashboard.png" alt="أبرز هويتك كالمحترفين" class="tab-avatar-img">
                        <div class="avatar-glow"></div>
                    </div>
                </div>
            `,
            progress: '78%',
            duration: '١٥:٠٥'
        },
        typography: {
            html: `
                <div class="tab-view typography-view active">
                    <div class="tab-text-card">
                        <span class="tab-view-tag">تنسيق الخطوط</span>
                        <h3 class="tab-view-title">بنية طباعية متناغمة تعبر عن شخصية علامتك</h3>
                        <p class="tab-view-desc">الخطوط ليست مجرد نصوص، بل هي نبرة صوتك الرقمية. نختار وننسق الخطوط العربية والانجليزية بدقة بالغة تضمن التوازن الجمالي وسهولة القراءة على كل الشاشات.</p>
                        <span class="tab-view-subtext">✦ خطوط هندسية معاصرة</span>
                    </div>
                    <div class="tab-visual-card" style="background-color: var(--color-lime); display: flex; flex-direction: column; justify-content: center; padding: 24px; color: var(--color-dark);">
                        <div style="border: 2px solid var(--color-dark); border-radius: 8px; padding: 14px; background: #FFF; box-shadow: -4px 4px 0px var(--color-violet);">
                            <div style="font-family: var(--font-headings); font-size: 2.2rem; font-weight: 900; line-height: 1.1; margin-bottom: 8px;">بِنك.</div>
                            <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-violet); text-transform: uppercase; margin-bottom: 12px; font-family: var(--font-headings);">Alexandria & IBM Plex</div>
                            <div style="width: 100%; height: 3px; background-color: var(--color-dark); margin-bottom: 12px;"></div>
                            <p style="font-size: 0.8rem; line-height: 1.5; color: var(--color-dark);">أب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن هـ و ي</p>
                        </div>
                    </div>
                </div>
            `,
            progress: '45%',
            duration: '٠٣:٤٠'
        },
        motion: {
            html: `
                <div class="tab-view motion-view active">
                    <div class="tab-text-card">
                        <span class="tab-view-tag">الحركات التفاعلية</span>
                        <h3 class="tab-view-title">تفاعلات حية تدب الحياة في موقعك الرقمي</h3>
                        <p class="tab-view-desc">نحول الصفحات الساكنة إلى تجارب بصرية ممتعة عبر حركات ويب ذكية ومدروسة تعزز التفاعل وتوجه انتباه عملائك بسلاسة دون تشتيت.</p>
                        <span class="tab-view-subtext">✦ حركات ويب 60 إطار بالثانية</span>
                    </div>
                    <div class="tab-visual-card" style="background-color: var(--color-dark); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                        <!-- Rotating graphic shapes mimicking canvas interactive motion -->
                        <div style="width: 140px; height: 140px; border-radius: 50%; border: 4px dashed var(--color-lime); display: flex; align-items: center; justify-content: center; animation: rotateStar 15s linear infinite;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-violet); border: 3px solid #FFF; display: flex; align-items: center; justify-content: center; animation: rotateStar 5s linear infinite reverse;">
                                <div style="width: 20px; height: 20px; background-color: var(--color-lime); border-radius: 50%;"></div>
                            </div>
                        </div>
                        <div style="position: absolute; top: 20px; right: 20px; font-size: 2rem; color: var(--color-lime); animation: floatBadge 2s ease-in-out infinite;">✦</div>
                        <div style="position: absolute; bottom: 20px; left: 20px; font-size: 1.5rem; color: var(--color-violet); animation: floatBadge 2s ease-in-out infinite 1s;">●</div>
                    </div>
                </div>
            `,
            progress: '92%',
            duration: '١٠:١٢'
        }
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            const data = tabData[tabName];
            
            if (!data) return;

            // Update Tab states
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // Render view
            contentArea.innerHTML = data.html;

            // Update Scrubber and pin position (RTL: right side offset)
            progressBar.style.width = data.progress;
            progressPin.style.right = data.progress;
            durationLabel.innerText = data.duration;
        });
    });


    // ==========================================================================
    // Intersection Observer for Premium Scroll Reveals
    // ==========================================================================
    const revealElements = document.querySelectorAll(
        '.hero-title, .hero-subtitle, .hero-actions, .canvas-container, .brands-card, ' +
        '.features-header-block, .dashboard-mockup, .vision-card, .contact-info, .contact-form-wrapper'
    );

    // Initial style setups for CSS reveals
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                observer.unobserve(el); // Only reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
