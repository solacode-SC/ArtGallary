/* ==========================================================================
   JavaScript Functionality - مدونة صِوان (Siwan Blog)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    const articlesDatabase = [
        {
            id: 'post-1',
            category: 'lifestyle',
            title: "ابدأ يومك بتمارين التنفس للتخلص من التوتر وقلق العمل",
            author: "ديفيد باين",
            views: 87,
            readTime: "٣ دقائق",
            date: "٥ ديسمبر ٢٠٢٢",
            snippet: "تمارين التنفس العميق والواعي تساعد بشكل مباشر في تهدئة الجهاز العصبي وتقليل مستويات الكورتيزول الضارة وإفراز هرمونات الاسترخاء...",
            body: `تعتبر تمارين التنفس العميق واحدة من أبسط الطرق وأكثرها فعالية لإدارة التوتر والضغط اليومي. عندما نأخذ نفساً عميقاً، يرسل جسمنا إشارة مباشرة إلى الدماغ للاسترخاء والتهدئة. ينصح الخبراء بممارسة تمرين '٤-٧-٨' صباحاً: تنفس عبر الأنف لأربع ثوانٍ، احبس النفس لسبع ثوانٍ، ثم ازفر ببطء لثماني ثوانٍ. تكرار هذا التمرين يومياً يضمن لك صفاءً ذهنياً وطاقة متجددة طوال اليوم للتعامل مع ضغوطات العمل الشاقة.`,
            tags: ["نمط الحياة", "جودة الحياة"],
            tagClass: "lifestyle",
            image: "assets/breathing_exercises_cover_1783375634232.png",
            comments: [
                { author: "خالد العتيبي", date: "منذ ساعة", text: "مقال رائع ومفيد جداً، جربت تمرين التنفس وكان له أثر طيب في تخفيف ضغط الاجتماعات الصباحية." },
                { author: "سارة أحمد", date: "منذ ٣ ساعات", text: "نصائح ممتازة! نحتاج لمثل هذه المقالات التوعوية البسيطة والعملية في حياتنا اليومية المليئة بالسرعة والتوتر." }
            ]
        },
        {
            id: 'post-2',
            category: 'ideas',
            title: "كيف يشكل نمط الحياة الصحي مسارنا وإنتاجيتنا اليومية",
            author: "ديفيد باين",
            views: 22,
            readTime: "٣ دقائق",
            date: "٤ ديسمبر ٢٠٢٢",
            snippet: "خياراتنا البسيطة في المأكل والملبس والروتين الصباحي تؤثر مباشرة في جودة يومنا وقدرتنا على اتخاذ قرارات حاسمة وهادئة...",
            body: `نمط الحياة ليس مجرد خيارات عشوائية، بل هو سلسلة مترابطة من العادات الصباحية والمسائية. ممارسة رياضة المشي الخفيف، تناول وجبات صحية غنية بالخضروات، وتقليل وقت الشاشات الإلكترونية قبل النوم هي الركائز الأساسية لبناء نمط حياة مستدام وصحي. ابدأ بتغيير عادة واحدة صغيرة كل أسبوع، وراقب كيف يتحول مزاجك وإنتاجيتك اليومية بشكل إيجابي وملحوظ. التوازن هو مفتاح الاستمرارية.`,
            tags: ["أفكار إبداعية", "سفر وترحال"],
            tagClass: "ideas",
            image: "assets/lifestyle_productivity_cover_1783375646250.png",
            comments: [
                { author: "محمد السديري", date: "أمس", text: "تغيير العادات الصغيرة فعلاً يفرق بشكل كبير، جربت قطع الشاشات قبل النوم بساعة وتحسن نومي كثيراً." }
            ]
        },
        {
            id: 'post-3',
            category: 'travel',
            title: "أفضل وجهات السفر الهادئة في الشتاء لإعادة شحن طاقتك",
            author: "ديفيد باين",
            views: 104,
            readTime: "٥ دقائق",
            date: "٣ ديسمبر ٢٠٢٢",
            snippet: "البحث عن السكينة وسط الثلوج أو شواطئ البحر الدافئة في الشتاء يمنح العقل فرصة مثالية للتأمل وإعادة النشاط العملي والذهني...",
            body: `السفر في الشتاء يتميز بالهدوء وقلة الزحام، وهو فرصة ممتازة للتأمل والسكينة والابتعاد عن صخب الحياة الحضرية والعملية. من مرتفعات اليونان الشتوية الباردة إلى شواطئ البحر الأحمر الدافئة، هناك وجهات سياحية ساحرة تقدم لك تجربة استجمام فريدة من نوعها. احرص على اختيار نزل صغيرة هادئة وتجربة الأطعمة الشعبية الدافئة لتستشعر دفء الشتاء وتراث الوجهة.`,
            tags: ["سفر وترحال", "ترفيه"],
            tagClass: "travel",
            image: "assets/winter_travel_cover_1783375659199.png",
            comments: []
        }
    ];

    // ==========================================================================
    // UI Elements Bindings
    // ==========================================================================
    const blogFeed = document.getElementById('blog-feed-container');
    const trendingFeed = document.getElementById('trending-list-container');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Search toggle bindings
    const btnSearchToggle = document.getElementById('btn-search-toggle');
    const searchBarWrap = document.getElementById('search-bar-wrap');
    const searchInputField = document.getElementById('search-input-field');

    // Subscribe modal
    const subscribeModal = document.getElementById('subscribe-modal');
    const btnSubscribeHeader = document.getElementById('btn-subscribe-header');
    const btnCloseSubscribe = document.getElementById('btn-close-subscribe-modal');
    const subscribeForm = document.getElementById('subscribe-newsletter-form');

    // Reading Drawer
    const readingDrawer = document.getElementById('reading-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerArticleContent = document.getElementById('drawer-article-content');

    // Success dialog
    const successDialog = document.getElementById('success-feedback-dialog');
    const btnFeedbackOk = document.getElementById('btn-feedback-ok');
    const successTitle = document.getElementById('success-feedback-title');
    const successMsg = document.getElementById('success-feedback-msg');

    // About author button click
    const btnAuthorAbout = document.getElementById('btn-author-about');


    // ==========================================================================
    // 2. Render Articles dynamically (with search query & category filter)
    // ==========================================================================
    function renderArticles(categoryFilter = 'all', searchQuery = '') {
        if (!blogFeed) return;
        blogFeed.innerHTML = '';

        let list = articlesDatabase;

        // Filter category
        if (categoryFilter !== 'all') {
            list = list.filter(a => a.category === categoryFilter);
        }

        // Filter search term
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(a => a.title.toLowerCase().includes(query) || a.snippet.toLowerCase().includes(query));
        }

        // Check if empty state
        if (list.length === 0) {
            blogFeed.innerHTML = `
                <div class="sidebar-card" style="text-align: center; padding: 48px 24px;">
                    <h4>لا توجد نتائج بحث مطابقة!</h4>
                    <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 8px;">حاول استخدام كلمات مفتاحية مغايرة أو تصفح الأقسام الرئيسية.</p>
                </div>
            `;
            return;
        }

        list.forEach(article => {
            const postCard = document.createElement('article');
            postCard.className = 'blog-post-card';

            const tagBadgesHtml = article.tags.map(tag => `<span class="tag-badge ${article.tagClass}">${tag}</span>`).join('');

            const coverHtml = article.image 
                ? `<img src="${article.image}" alt="${article.title}">` 
                : article.svg;

            postCard.innerHTML = `
                <div class="post-cover-wrap">
                    ${coverHtml}
                    <div class="post-tags-container">
                        ${tagBadgesHtml}
                    </div>
                </div>
                <div class="post-details-body">
                    <h3 class="post-title" data-id="${article.id}">${article.title}</h3>
                    
                    <div class="post-meta-row">
                        <div class="meta-author-wrap">
                            <span class="meta-author-name">الكاتب: ${article.author}</span>
                        </div>
                        <span>⏱️ ${article.readTime}</span>
                        <span>👁️ ${article.views} مشاهدة</span>
                    </div>

                    <p class="post-snippet">${article.snippet}</p>
                    
                    <button class="btn-read-more" data-id="${article.id}">اقرأ المقال كاملاً ➜</button>
                </div>
            `;

            // Bind click to open drawer
            const clickElements = [postCard.querySelector('.post-title'), postCard.querySelector('.btn-read-more')];
            clickElements.forEach(el => {
                el.addEventListener('click', () => {
                    openReadingDrawer(article.id);
                });
            });

            blogFeed.appendChild(postCard);
        });
    }

    // ==========================================================================
    // 3. Render Trending Sidebar widgets
    // ==========================================================================
    function renderTrending() {
        if (!trendingFeed) return;
        trendingFeed.innerHTML = '';

        // Sort by views descending
        const sorted = [...articlesDatabase].sort((a,b) => b.views - a.views);

        sorted.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'trending-item-row';
            row.setAttribute('data-id', item.id);

            row.innerHTML = `
                <span class="trending-badge">${index + 1}</span>
                <div class="trending-item-details">
                    <h5 class="trending-item-title">${item.title}</h5>
                    <span class="trending-item-date">${item.date}</span>
                </div>
            `;

            row.addEventListener('click', () => {
                openReadingDrawer(item.id);
            });

            trendingFeed.appendChild(row);
        });
    }

    // Bind Category Nav Link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const category = link.getAttribute('data-category');
            renderArticles(category, searchInputField.value);
        });
    });

    // ==========================================================================
    // 4. Live search toggle
    // ==========================================================================
    if (btnSearchToggle) {
        btnSearchToggle.addEventListener('click', () => {
            searchBarWrap.classList.toggle('open');
            if (searchBarWrap.classList.contains('open')) {
                searchInputField.focus();
            } else {
                searchInputField.value = '';
                const activeLink = document.querySelector('.nav-link.active');
                const cat = activeLink ? activeLink.getAttribute('data-category') : 'all';
                renderArticles(cat);
            }
        });
    }

    if (searchInputField) {
        searchInputField.addEventListener('input', () => {
            const activeLink = document.querySelector('.nav-link.active');
            const cat = activeLink ? activeLink.getAttribute('data-category') : 'all';
            renderArticles(cat, searchInputField.value);
        });
    }


    // ==========================================================================
    // 5. Article Details Slide-out Drawer & Comments Threads
    // ==========================================================================
    function openReadingDrawer(articleId) {
        const article = articlesDatabase.find(a => a.id === articleId);
        if (!article || !readingDrawer) return;

        // Increment Views locally
        article.views += 1;
        renderTrending();

        const tagBadgesHtml = article.tags.map(tag => `<span class="tag-badge ${article.tagClass}">${tag}</span>`).join('');
        
        const coverHtml = article.image 
            ? `<img src="${article.image}" alt="${article.title}">` 
            : article.svg;

        // Populate full article body
        drawerArticleContent.innerHTML = `
            <div class="drawer-image-wrap">
                ${coverHtml}
            </div>
            
            <div class="drawer-header-wrap">
                <div class="post-tags-container" style="position: static; margin-bottom: 8px;">
                    ${tagBadgesHtml}
                </div>
                <h3 class="drawer-article-title">${article.title}</h3>
                
                <div class="post-meta-row" style="margin-top: 8px;">
                    <span>الكاتب: ${article.author}</span>
                    <span>⏱️ ${article.readTime}</span>
                    <span>👁️ ${article.views} مشاهدة</span>
                    <span>🗓️ ${article.date}</span>
                </div>
            </div>

            <p class="drawer-article-text">${article.body}</p>

            <!-- Comments section -->
            <div class="drawer-comments-section">
                <h4 class="comments-heading">التعليقات (${article.comments.length})</h4>
                
                <div class="comments-stack" id="comments-stack-list">
                    ${renderCommentsList(article.comments)}
                </div>

                <!-- Submit comment form -->
                <form id="comment-add-form" class="comment-submit-form">
                    <textarea id="comment-textarea" required placeholder="اكتب تعليقك هنا بكل أدب واحترام..."></textarea>
                    <button type="submit" class="btn-comment-submit">إرسال التعليق</button>
                </form>
            </div>
        `;

        // Bind comment form submission
        const commentForm = drawerArticleContent.querySelector('#comment-add-form');
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const txt = drawerArticleContent.querySelector('#comment-textarea').value.trim();
            if (txt) {
                // Append locally
                article.comments.push({
                    author: "قارئ زائر",
                    date: "منذ ثوانٍ",
                    text: txt
                });

                // Update UI comments stack
                drawerArticleContent.querySelector('#comments-stack-list').innerHTML = renderCommentsList(article.comments);
                drawerArticleContent.querySelector('.comments-heading').innerText = `التعليقات (${article.comments.length})`;
                commentForm.reset();
            }
        });

        // Open
        readingDrawer.classList.add('open');
        readingDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function renderCommentsList(comments) {
        if (comments.length === 0) {
            return `<p style="font-size: 0.65rem; color: var(--text-muted); text-align: center; padding: 14px 0;">لا توجد تعليقات بعد. كن أول من يعلق!</p>`;
        }
        return comments.map(c => `
            <div class="comment-card">
                <div class="comment-author-row">
                    <span>${c.author}</span>
                    <span style="color: var(--text-muted);">${c.date}</span>
                </div>
                <p class="comment-body-text">${c.text}</p>
            </div>
        `).join('');
    }

    function closeReadingDrawer() {
        if (readingDrawer) {
            readingDrawer.classList.remove('open');
            readingDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeReadingDrawer);


    // ==========================================================================
    // 6. Follow Counter Multiplier simulator
    // ==========================================================================
    const socialItems = document.querySelectorAll('.social-stack-item');
    socialItems.forEach(item => {
        item.addEventListener('click', () => {
            const platform = item.getAttribute('data-platform');
            const counterEl = item.querySelector('.social-counter');
            
            // Increment
            let currentVal = parseInt(counterEl.innerText.replace(/,/g, '').replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 1632));
            if (isNaN(currentVal)) currentVal = 25000;
            
            const newVal = currentVal + 1;
            
            // Format number locally
            counterEl.innerText = newVal.toLocaleString('ar-EG');
            
            showFeedbackDialog("شكراً لمتابعتك!", "تم تسجيل متابعتك لمدونة صِوان عبر شبكات التواصل بنجاح.");
        });
    });


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
                showFeedbackDialog("تم الاشتراك بنجاح!", `شكراً لثقتك بنا. تم تسجيل بريدك الإلكتروني (${email}) في نشرتنا الأسبوعية.`);
                subscribeForm.reset();
            }
        });
    }

    function showFeedbackDialog(title, msg) {
        successTitle.innerText = title;
        successMsg.innerText = msg;
        successDialog.classList.add('open');
        successDialog.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    if (btnFeedbackOk) {
        btnFeedbackOk.addEventListener('click', () => {
            successDialog.classList.remove('open');
            successDialog.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    if (btnAuthorAbout) {
        btnAuthorAbout.addEventListener('click', () => {
            showFeedbackDialog("حول الكاتب - ديفيد باين", "ديفيد باين هو كاتب وباحث في جودة الحياة والنمو الشخصي. يكتب أسبوعياً لمساعدتك في بناء روتين متوازن.");
        });
    }


    // ==========================================================================
    // Initial Load Actions
    // ==========================================================================
    renderArticles();
    renderTrending();

});
