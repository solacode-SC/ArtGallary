/* ==========================================================================
   JavaScript Functionality - مدونة رُؤْيَة (Ro'yah Blog)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Articles Database (10 Articles mapped to pre-generated assets)
    // ==========================================================================
    const articlesDatabase = [
        {
            id: 'post-1',
            category: 'tech',
            title: "كيف تشكل التقنية الذكية مستقبل العمل والإنتاجية في عام ٢٠٢٦",
            author: "إياد الخالدي",
            date: "١٦ أكتوبر ٢٠٢٤",
            snippet: "في عالمنا الرقمي اليوم، لم يعد العمل عن بُعد مجرد خيار، بل أصبح استراتيجية كبرى لربط العقول والابتكارات...",
            desc: "في عالمنا الرقمي اليوم، لم يعد العمل عن بُعد مجرد خيار عشوائي، بل أصبح استراتيجية كبرى لربط العقول والابتكارات. ممارسات تنظيم المهام رقمياً واستعمال أدوات البرمجة السحابية تزيد الإنتاجية بنسبة ٤٠٪ وتمنح الموظفين مرونة إبداعية كافية للابتكار.",
            image: "assets/lifestyle_productivity_cover_1783375646250.png"
        },
        {
            id: 'post-2',
            category: 'travel',
            title: "مستقبل السفر والترحال: جولات السياحة الافتراضية الذكية",
            author: "إياد الخالدي",
            date: "٢٨ سبتمبر ٢٠٢٤",
            snippet: "تصفح أحدث الوجهات السياحية والتقط الصور الخلابة من شاشتك عبر حلول التفاعل البصري ثلاثية الأبعاد...",
            desc: "تصفح أحدث الوجهات السياحية والتقط الصور الخلابة من شاشتك عبر حلول التفاعل البصري ثلاثية الأبعاد. السياحة الافتراضية تعيد تعريف تجارب السفر، وتمنح المستخدم فرصة مثالية لاستكشاف معالم العالم العريقة من منزله بكل تفاصيلها الدقيقة.",
            image: "assets/winter_travel_cover_1783375659199.png"
        },
        {
            id: 'post-3',
            category: 'business',
            title: "أدوات ريادة الأعمال الحديثة لإدارة التمويل والشركات",
            author: "إياد الخالدي",
            date: "٢٥ سبتمبر ٢٠٢٤",
            snippet: "نستعرض كيف تسهم الأنظمة السحابية والتحليلات البيانية في رفع الكفاءة الاقتصادية للشركات الناشئة...",
            desc: "نستعرض كيف تسهم الأنظمة السحابية والتحليلات البيانية في رفع الكفاءة الاقتصادية للشركات الناشئة. توفير لوحات متابعة للمصروفات في الوقت الفعلي يسهل اتخاذ قرارات حكيمة واستباقية لتجنب الخسائر وبناء نمو مالي مستدام.",
            image: "assets/dashboard_finance_1783352192218.png"
        },
        {
            id: 'post-4',
            category: 'sport',
            title: "تمارين التنفس العميق والرياضة الذاتية للتخلص من توتر العمل",
            author: "إياد الخالدي",
            date: "١٥ سبتمبر ٢٠٢٤",
            snippet: "تمارين تصفية الذهن والتحكم بالشهيق والزفير صباحاً تقي عقولنا من الاحتراق المهني وتمنحنا حيوية بدنية...",
            desc: "تمارين تصفية الذهن والتحكم بالشهيق والزفير صباحاً تقي عقولنا من الاحتراق المهني وتمنحنا حيوية بدنية. ينصح بممارسة تمارين التنفس الواعي لمدة عشر دقائق يومياً لتنظيم نبضات القلب وتهدئة الأعصاب المتوترة.",
            image: "assets/breathing_exercises_cover_1783375634232.png"
        },
        {
            id: 'post-5',
            category: 'management',
            title: "دور الذكاء الاصطناعي في تطوير الإدارة القيادية واتخاذ القرار",
            author: "إياد الخالدي",
            date: "١٠ سبتمبر ٢٠٢٤",
            snippet: "الاعتماد على تحليلات الآلة ونماذج التنبؤ يمنح القادة رؤية أعمق لإدارة الموارد البشرية وتوريد المستلزمات...",
            desc: "الاعتماد على تحليلات الآلة ونماذج التنبؤ يمنح القادة رؤية أعمق لإدارة الموارد البشرية وتوريد المستلزمات. دمج الذكاء الاصطناعي في صناعة القرار يقلل الأخطاء التشغيلية بنسبة ٢٥٪.",
            image: "assets/dashboard_accounting_1783352205163.png"
        },
        {
            id: 'post-6',
            category: 'trends',
            title: "لماذا تعد سلامة البيانات الشخصية أولوية قصوى للمؤسسات",
            author: "إياد الخالدي",
            date: "٨ سبتمبر ٢٠٢٤",
            snippet: "مع زيادة الهجمات السيبرانية، بناء حصون حماية وتشفير للبيانات المشتركة يحمي أسرار العملاء والشركات...",
            desc: "مع زيادة الهجمات السيبرانية، بناء حصون حماية وتشفير للبيانات المشتركة يحمي أسرار العملاء والشركات. التزام الموظفين بسياسات الأمن الرقمي يقلل ثغرات الاختراق بشكل كبير ويدعم استقرار المنصة.",
            image: "assets/dashboard_philosophy_1783352215755.png"
        },
        {
            id: 'post-7',
            category: 'tech',
            title: "الشركات التقنية الناشئة التي تقود حلول الابتكار الأخضر",
            author: "إياد الخالدي",
            date: "٣ سبتمبر ٢٠٢٤",
            snippet: "الاستثمار في الطاقة البديلة والحوسبة الصديقة للبيئة يضمن بناء بنية تحتية رقمية مستدامة للأجيال القادمة...",
            desc: "الاستثمار في الطاقة البديلة والحوسبة الصديقة للبيئة يضمن بناء بنية تحتية رقمية مستدامة للأجيال القادمة. حلول الحوسبة الخضراء تسعى لتقليل انبعاثات الكربون الناتجة عن مراكز البيانات الضخمة.",
            image: "assets/dashboard_ocean_1783352231560.png"
        },
        {
            id: 'post-8',
            category: 'travel',
            title: "رحلة تأملية هادئة وسط الجبال والوديان الطبيعية الخلابة",
            author: "إياد الخالدي",
            date: "٣٠ أغسطس ٢٠٢٤",
            snippet: "الابتعاد عن شاشات الأجهزة والاندماج في الطبيعة يعيد تشغيل حواسنا الإنسانية ويمنحنا إلهاماً للكتابة والتأمل...",
            desc: "الابتعاد عن شاشات الأجهزة والاندماج في الطبيعة يعيد تشغيل حواسنا الإنسانية ويمنحنا إلهاماً للكتابة والتأمل. قضاء عطلة نهاية الأسبوع في نزل جبلي ريفي يسهم في تنقية الذهن وإعادة شحن الطاقة الإبداعية.",
            image: "assets/diary_mountain_1783350971924.png"
        },
        {
            id: 'post-9',
            category: 'trends',
            title: "الفنون التجريدية المعاصرة وتعبيراتها الرقمية المبتكرة",
            author: "إياد الخالدي",
            date: "١٢ أغسطس ٢٠٢٤",
            snippet: "أدوات الرسم الرقمي ثلاثية الأبعاد تفتح آفاقاً جديدة أمام المصممين للتعبير عن أفكارهم الفلسفية بطرق حديثة...",
            desc: "أدوات الرسم الرقمي ثلاثية الأبعاد تفتح آفاقاً جديدة أمام المصممين للتعبير عن أفكارهم الفلسفية بطرق حديثة. دمج الفن بالتقنية يصنع لوحات تفاعلية تحظى بتقدير كبير في المعارض الرقمية المعاصرة.",
            image: "assets/abstract_art_cover_1783348914599.png"
        },
        {
            id: 'post-10',
            category: 'business',
            title: "دروس وحكايات ملهمة لرواد الأعمال والشركات الناشئة",
            author: "إياد الخالدي",
            date: "٥ أغسطس ٢٠٢٤",
            snippet: "قصص النجاح والفشل لرواد الأعمال الأوائل تعد كنزاً تعليمياً يختصر مسافات طويلة من التعلم التجريبي...",
            desc: "قصص النجاح والفشل لرواد الأعمال الأوائل تعد كنزاً تعليمياً يختصر مسافات طويلة من التعلم التجريبي. التخطيط الجيد والقدرة على التكيف مع متطلبات السوق يضمنان استمرار المشاريع ونموها.",
            image: "assets/fairy_tales_cover_1783348930389.png"
        }
    ];

    // ==========================================================================
    // Featured Slides Database (rotating inside sidebar carousel)
    // ==========================================================================
    const featuredSlides = [
        {
            category: "إدارة قيادية",
            title: "الذكاء الاصطناعي في إدارة الأعمال: تحسين الكفاءة التشغيلية",
            image: "assets/dashboard_finance_1783352192218.png"
        },
        {
            category: "تأملات",
            title: "أهمية الاسترخاء الذهني وتأملات الغروب الهادئة",
            image: "assets/diary_sunset_1783350960261.png"
        },
        {
            category: "ثقافة وأدب",
            title: "روائع الروايات الكلاسيكية العالمية: قراءة في كتاب غاتسبي العظيم",
            image: "assets/great_gatsby_cover_1783348982967.png"
        }
    ];

    // ==========================================================================
    // UI Elements Bindings
    // ==========================================================================
    const blogFeedGrid = document.getElementById('blog-feed-grid');
    const topicPills = document.querySelectorAll('.topic-pill');
    const paginationContainer = document.getElementById('pagination-container');
    
    // Search bindings
    const btnSearchToggle = document.getElementById('btn-search-toggle');
    const searchBarWrap = document.getElementById('search-bar-wrap');
    const searchInputField = document.getElementById('search-input-field');

    // Theme toggle
    const btnThemeToggle = document.getElementById('btn-theme-toggle');

    // Slider container
    const featuredSliderContainer = document.getElementById('featured-slider-container');

    // Experience items clicks
    const expItems = document.querySelectorAll('.exp-item-row');

    // Newsletter Subscribe modal
    const subscribeModal = document.getElementById('subscribe-modal');
    const btnSubscribeHeader = document.getElementById('btn-subscribe-header');
    const btnCloseSubscribe = document.getElementById('btn-close-subscribe');
    const subscribeForm = document.getElementById('subscribe-newsletter-form');

    // Feedback dialogs
    const successDialog = document.getElementById('success-feedback-dialog');
    const btnFeedbackOk = document.getElementById('btn-feedback-ok');
    const successTitle = document.getElementById('success-feedback-title');
    const successMsg = document.getElementById('success-feedback-msg');

    // State Variables
    let currentCategory = 'all';
    let currentSearchQuery = '';
    let currentPage = 1;
    const postsPerPage = 4; // Paginate nicely (10 posts -> 3 pages)

    let currentFeaturedIndex = 0;


    // ==========================================================================
    // 2. Render Blog Cards Feed with Pagination
    // ==========================================================================
    function renderBlogGrid() {
        if (!blogFeedGrid) return;
        blogFeedGrid.innerHTML = '';

        let list = articlesDatabase;

        // Apply category filter
        if (currentCategory !== 'all') {
            list = list.filter(post => post.category === currentCategory);
        }

        // Apply search query
        if (currentSearchQuery.trim() !== '') {
            const query = currentSearchQuery.toLowerCase().trim();
            list = list.filter(post => post.title.toLowerCase().includes(query) || post.snippet.toLowerCase().includes(query));
        }

        // Compute pagination ranges
        const totalPosts = list.length;
        const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedList = list.slice(startIndex, endIndex);

        if (paginatedList.length === 0) {
            blogFeedGrid.innerHTML = `
                <div class="sidebar-card" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px;">
                    <h4>لا توجد مقالات مطابقة لبحثك!</h4>
                    <p style="font-size: 0.68rem; color: var(--text-muted); margin-top: 8px;">حاول استخدام كلمات رئيسية مغايرة أو تصفح الأقسام الكلية.</p>
                </div>
            `;
            renderPagination(1);
            return;
        }

        paginatedList.forEach((post, index) => {
            const card = document.createElement('article');
            card.className = 'vision-post-card';
            card.style.animationDelay = `${index * 0.08}s`;

            let categoryLabel = '';
            if (post.category === 'tech') categoryLabel = 'تقنية';
            else if (post.category === 'travel') categoryLabel = 'سفر';
            else if (post.category === 'sport') categoryLabel = 'رياضة';
            else if (post.category === 'business') categoryLabel = 'أعمال';
            else if (post.category === 'management') categoryLabel = 'إدارة';
            else if (post.category === 'trends') categoryLabel = 'اتجاهات';

            card.innerHTML = `
                <div class="post-cover-wrap">
                    <img src="${post.image}" alt="${post.title}">
                    <div class="post-tags-row">
                        <span class="category-tag ${post.category}">${categoryLabel}</span>
                    </div>
                </div>
                <div class="post-body-wrap">
                    <div class="post-meta-row">
                        <span class="post-author-name">${post.author}</span>
                        <span>•</span>
                        <span>🗓️ ${post.date}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-desc">${post.snippet}</p>
                </div>
            `;

            // Simple click to expand read details alert
            card.addEventListener('click', () => {
                showFeedbackDialog(post.title, post.desc);
            });

            blogFeedGrid.appendChild(card);
        });

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-num-btn ${i === currentPage ? 'active' : ''}`;
            btn.innerText = i.toLocaleString('ar-EG');
            
            btn.addEventListener('click', () => {
                currentPage = i;
                renderBlogGrid();
                window.scrollTo({ top: 380, behavior: 'smooth' });
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Bind Topic Filters
    topicPills.forEach(pill => {
        pill.addEventListener('click', () => {
            topicPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            currentCategory = pill.getAttribute('data-category');
            currentPage = 1;
            renderBlogGrid();
        });
    });

    // ==========================================================================
    // 3. Render Featured Slider Widget
    // ==========================================================================
    function renderFeaturedSlider() {
        if (!featuredSliderContainer) return;
        featuredSliderContainer.innerHTML = '';

        featuredSlides.forEach((slide, index) => {
            const slideEl = document.createElement('div');
            slideEl.className = `featured-slide ${index === currentFeaturedIndex ? 'active' : ''}`;
            
            slideEl.innerHTML = `
                <div class="featured-img-wrap">
                    <img src="${slide.image}" alt="${slide.title}">
                </div>
                <span class="featured-tag">${slide.category}</span>
                <h5 class="featured-title">${slide.title}</h5>
            `;

            featuredSliderContainer.appendChild(slideEl);
        });

        // Add controls row
        const navRow = document.createElement('div');
        navRow.className = 'featured-nav-row';

        navRow.innerHTML = `
            <span class="slider-indicators">${(currentFeaturedIndex + 1).toLocaleString('ar-EG')} / ${featuredSlides.length.toLocaleString('ar-EG')}</span>
            <div class="slider-arrows">
                <button class="btn-slider-arrow btn-prev" aria-label="السابق">➜</button>
                <button class="btn-slider-arrow btn-next" aria-label="التالي">←</button>
            </div>
        `;

        navRow.querySelector('.btn-prev').addEventListener('click', prevSlide);
        navRow.querySelector('.btn-next').addEventListener('click', nextSlide);

        featuredSliderContainer.appendChild(navRow);
    }

    function nextSlide() {
        currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredSlides.length;
        renderFeaturedSlider();
    }

    function prevSlide() {
        currentFeaturedIndex = (currentFeaturedIndex - 1 + featuredSlides.length) % featuredSlides.length;
        renderFeaturedSlider();
    }

    // Auto rotate featured slides every 8 seconds
    setInterval(nextSlide, 8000);


    // ==========================================================================
    // 4. Light/Dark Mode Switcher
    // ==========================================================================
    // Check saved local theme or default to light
    const savedTheme = localStorage.getItem('vision-theme') || 'theme-light';
    document.documentElement.className = savedTheme;
    if (btnThemeToggle) {
        btnThemeToggle.innerText = savedTheme === 'theme-light' ? '🌙' : '☀️';
    }

    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.contains('theme-light');
            if (isLight) {
                document.documentElement.className = 'theme-dark';
                btnThemeToggle.innerText = '☀️';
                localStorage.setItem('vision-theme', 'theme-dark');
            } else {
                document.documentElement.className = 'theme-light';
                btnThemeToggle.innerText = '🌙';
                localStorage.setItem('vision-theme', 'theme-light');
            }
        });
    }

    // ==========================================================================
    // 5. Expandable Job Experiences Accordions
    // ==========================================================================
    expItems.forEach(item => {
        item.addEventListener('click', () => {
            const panel = item.querySelector('.exp-details-panel');
            
            // Toggle active status
            const isOpen = panel.classList.contains('open');
            
            // Close all others
            document.querySelectorAll('.exp-details-panel').forEach(p => p.classList.remove('open'));

            if (!isOpen) {
                panel.classList.add('open');
            }
        });
    });


    // ==========================================================================
    // 6. Search Actions
    // ==========================================================================
    if (btnSearchToggle) {
        btnSearchToggle.addEventListener('click', () => {
            searchBarWrap.classList.toggle('open');
            if (searchBarWrap.classList.contains('open')) {
                searchInputField.focus();
            } else {
                searchInputField.value = '';
                currentSearchQuery = '';
                renderBlogGrid();
            }
        });
    }

    if (searchInputField) {
        searchInputField.addEventListener('input', () => {
            currentSearchQuery = searchInputField.value;
            currentPage = 1;
            renderBlogGrid();
        });
    }


    // ==========================================================================
    // 7. Subscribe newsletter modals
    // ==========================================================================
    if (btnSubscribeHeader) {
        btnSubscribeHeader.addEventListener('click', () => {
            subscribeModal.classList.add('open');
            subscribeModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    if (btnCloseSubscribe) {
        btnCloseSubscribe.addEventListener('click', () => {
            subscribeModal.classList.remove('open');
            subscribeModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('subscribe-email-input').value.trim();
            if (email) {
                subscribeModal.classList.remove('open');
                subscribeModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                showFeedbackDialog("تم الاشتراك بنجاح!", `شكراً لثقتك بنا. تم تسجيل بريدك الإلكتروني (${email}) في نشرة رُؤْيَة الأسبوعية.`);
                subscribeForm.reset();
            }
        });
    }

    // ==========================================================================
    // 8. Feedback Dialog Box
    // ==========================================================================
    function showFeedbackDialog(title, msg) {
        successTitle.innerText = title;
        successMsg.innerText = msg;
        successDialog.classList.add('open');
        successDialog.setAttribute('aria-hidden', 'false');
    }

    if (btnFeedbackOk) {
        btnFeedbackOk.addEventListener('click', () => {
            successDialog.classList.remove('open');
            successDialog.setAttribute('aria-hidden', 'true');
        });
    }


    // Header Scroll glassmorphic transition
    const visionHeader = document.querySelector('.vision-header');
    if (visionHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                visionHeader.classList.add('scrolled');
            } else {
                visionHeader.classList.remove('scrolled');
            }
        });
    }

    // Initialize renders
    renderBlogGrid();
    renderFeaturedSlider();

});
