/* ==========================================================================
   JavaScript Functionality - نُجُوم (Nojoom) Influencer Search Directory
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Influencer Profiles Database
    // ==========================================================================
    const initialInfluencers = [
        {
            id: 'mayar',
            name: "ميار ناصر",
            handle: "mayar_naser",
            bio: "مدربة أسلوب حياة ومصورة فوتوغرافية تقدم محتوى إبداعي ملهم حول تفاصيل الحياة اليومية والسفر في الشرق الأوسط.",
            avatar: "avatar_mayar.png",
            feeds: ["feed_sunset.png", "feed_relax.png", "feed_ocean.png"],
            posts: "٣٧",
            followers: "٢٤١ ألف",
            following: "٢٣١",
            er: "٤.٨٪",
            erFill: "75%",
            female: "٦٥٪",
            femaleFill: "65%",
            male: "٣٥٪",
            maleFill: "35%",
            tags: ["السعودية", "موضة", "أسلوب حياة"]
        },
        {
            id: 'ahmed',
            name: "أحمد العتيبي",
            handle: "ahmed_otaibi",
            bio: "مستكشف صانع محتوى في مجالات السفر والترحال وتوثيق معالم الطبيعة الخلابة والتراث العريق للمملكة.",
            avatar: "avatar_ahmed.png",
            feeds: ["feed_valley.png", "feed_art.png", "feed_graph.png"],
            posts: "١.٢ ألف",
            followers: "٤٨٩ ألف",
            following: "٩٨٧",
            er: "٥.٢٪",
            erFill: "82%",
            female: "٤٥٪",
            femaleFill: "45%",
            male: "٥٥٪",
            maleFill: "55%",
            tags: ["السعودية", "سفر", "مغامرة"]
        },
        {
            id: 'sara',
            name: "سارة خالد",
            handle: "sara_khaled",
            bio: "مصممة أزياء ومستشارة موضة تشارك أحدث صيحات التصميم والديكورات العصرية في منطقة الخليج.",
            avatar: "avatar_sara.png",
            feeds: ["feed_art.png", "feed_sunset.png", "feed_relax.png"],
            posts: "٢٤٥",
            followers: "١٥٢ ألف",
            following: "٤٣٢",
            er: "٣.٩٪",
            erFill: "60%",
            female: "٨٠٪",
            femaleFill: "80%",
            male: "٢٠٪",
            maleFill: "20%",
            tags: ["موضة", "تجميل"]
        }
    ];

    let influencers = [...initialInfluencers];
    let activeTags = ["السعودية", "موضة", "أسلوب حياة"];
    let favoriteIds = ['ahmed']; // default favorites
    let activeTab = 'find'; // 'find' or 'favorites'

    // Load from LocalStorage
    const savedFavorites = localStorage.getItem('nojoom-favorites-ids-v2');
    if (savedFavorites) {
        favoriteIds = JSON.parse(savedFavorites);
    } else {
        localStorage.setItem('nojoom-favorites-ids-v2', JSON.stringify(favoriteIds));
    }

    const savedInfluencers = localStorage.getItem('nojoom-custom-influencers-v2');
    if (savedInfluencers) {
        influencers = JSON.parse(savedInfluencers);
    }

    // Close options menus on body click
    document.addEventListener('click', () => {
        document.querySelectorAll('.card-options-menu').forEach(m => m.classList.remove('open'));
    });

    // ==========================================================================
    // UI Elements Bindings
    // ==========================================================================
    const influencersGrid = document.getElementById('influencers-cards-grid');
    const influencersCountLbl = document.getElementById('influencers-count-lbl');
    const tagsListWrapper = document.getElementById('tags-list-wrapper');
    const tagSearchInput = document.getElementById('tag-search-input');

    const tabFindBtn = document.getElementById('tab-find-influencers');
    const tabFavBtn = document.getElementById('tab-my-favorites');


    // ==========================================================================
    // 2. Render Influencer Cards
    // ==========================================================================
    function renderInfluencers() {
        if (!influencersGrid) return;
        influencersGrid.innerHTML = '';

        // Filter based on active tags & tabs
        let list = influencers;

        if (activeTab === 'favorites') {
            list = list.filter(item => favoriteIds.includes(item.id));
        } else {
            // Tag filtering (matches if influencer has at least one active tag)
            if (activeTags.length > 0) {
                list = list.filter(item => {
                    return item.tags.some(t => activeTags.includes(t));
                });
            }
        }

        // Update count label
        if (influencersCountLbl) {
            const countAr = list.length.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            influencersCountLbl.innerText = `تم العثور على ${countAr} صانع محتوى`;
        }

        list.forEach(item => {
            const isFav = favoriteIds.includes(item.id);
            
            const card = document.createElement('div');
            card.className = 'influencer-card';
            card.setAttribute('data-id', item.id);

            card.innerHTML = `
                <!-- 3 Feed preview -->
                <div class="card-feed-grid">
                    <div class="feed-item"><img src="assets/${item.feeds[0]}" alt="feed 1" onerror="this.src='assets/feed_relax.png'"></div>
                    <div class="feed-item"><img src="assets/${item.feeds[1]}" alt="feed 2" onerror="this.src='assets/feed_art.png'"></div>
                    <div class="feed-item"><img src="assets/${item.feeds[2]}" alt="feed 3" onerror="this.src='assets/feed_ocean.png'"></div>
                </div>

                <!-- Star Rating Favorite Button -->
                <button class="card-fav-btn ${isFav ? 'active' : ''}" aria-label="أضف للمفضلة">
                    ★
                </button>

                <!-- Avatar overlapping feed -->
                <div class="card-avatar-wrap">
                    <img src="assets/${item.avatar}" alt="${item.name}" class="card-avatar-img" onerror="this.src='assets/avatar_mayar.png'">
                </div>

                <!-- Details Body -->
                <div class="card-details-body">
                    <div class="creator-name-row">
                        <span class="creator-username">${item.handle}</span>
                        <span class="verify-badge">✓</span>
                        
                        <div class="options-menu-wrapper">
                            <button class="options-btn" aria-label="خيارات">•••</button>
                            <!-- Dropdown options -->
                            <div class="card-options-menu">
                                <button class="options-menu-item" id="opt-feed-${item.id}">إضافة إلى الخلاصة</button>
                                <button class="options-menu-item" id="opt-insta-${item.id}">متابعة على إنستغرام</button>
                                <button class="options-menu-item danger" id="opt-exclude-${item.id}">استبعاد من البحث</button>
                            </div>
                        </div>
                    </div>
                    <span class="creator-fullname">${item.name}</span>
                    <p class="creator-bio">${item.bio}</p>

                    <!-- Metrics -->
                    <div class="creator-stats-row">
                        <div class="stat-col">
                            <span class="stat-val-num">${item.posts}</span>
                            <span class="stat-lbl">المنشورات</span>
                        </div>
                        <div class="stat-col">
                            <span class="stat-val-num">${item.followers}</span>
                            <span class="stat-lbl">المتابعون</span>
                        </div>
                        <div class="stat-col">
                            <span class="stat-val-num">${item.following}</span>
                            <span class="stat-lbl">المتابَعون</span>
                        </div>
                    </div>
                </div>
            `;

            // Favorite button toggler
            const favBtn = card.querySelector('.card-fav-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(item.id, favBtn);
            });

            // Three-dot options toggler
            const optBtn = card.querySelector('.options-btn');
            const optMenu = card.querySelector('.card-options-menu');
            if (optBtn && optMenu) {
                optBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close other menus
                    document.querySelectorAll('.card-options-menu').forEach(m => {
                        if (m !== optMenu) m.classList.remove('open');
                    });
                    optMenu.classList.toggle('open');
                });
            }

            // Click option menu actions
            const optFeed = card.querySelector(`#opt-feed-${item.id}`);
            const optInsta = card.querySelector(`#opt-insta-${item.id}`);
            const optExclude = card.querySelector(`#opt-exclude-${item.id}`);

            if (optFeed) {
                optFeed.addEventListener('click', (e) => {
                    e.stopPropagation();
                    optMenu.classList.remove('open');
                    alert(`تمت إضافة صانع المحتوى (${item.name}) إلى خلاصة حملاتك بنجاح!`);
                });
            }
            if (optInsta) {
                optInsta.addEventListener('click', (e) => {
                    e.stopPropagation();
                    optMenu.classList.remove('open');
                    window.open(`https://instagram.com/${item.handle}`, '_blank');
                });
            }
            if (optExclude) {
                optExclude.addEventListener('click', (e) => {
                    e.stopPropagation();
                    optMenu.classList.remove('open');
                    influencers = influencers.filter(i => i.id !== item.id);
                    renderInfluencers();
                    alert(`تم استبعاد صانع المحتوى من نتائج البحث.`);
                });
            }

            // Card click opens drawer
            card.addEventListener('click', () => {
                openCreatorDrawer(item);
            });

            influencersGrid.appendChild(card);
        });
    }

    function toggleFavorite(id, btn) {
        if (favoriteIds.includes(id)) {
            favoriteIds = favoriteIds.filter(fId => fId !== id);
            btn.classList.remove('active');
        } else {
            favoriteIds.push(id);
            btn.classList.add('active');
        }

        localStorage.setItem('nojoom-favorites-ids-v2', JSON.stringify(favoriteIds));

        // Re-render if in favorites tab
        if (activeTab === 'favorites') {
            renderInfluencers();
        }
    }


    // ==========================================================================
    // 3. Tab Buttons Click Handlers
    // ==========================================================================
    if (tabFindBtn && tabFavBtn) {
        tabFindBtn.addEventListener('click', () => {
            if (activeTab === 'find') return;
            activeTab = 'find';
            tabFindBtn.classList.add('active');
            tabFavBtn.classList.remove('active');
            renderInfluencers();
        });

        tabFavBtn.addEventListener('click', () => {
            if (activeTab === 'favorites') return;
            activeTab = 'favorites';
            tabFavBtn.classList.add('active');
            tabFindBtn.classList.remove('active');
            renderInfluencers();
        });
    }


    // ==========================================================================
    // 4. Dynamic Tag Filter Bar Actions
    // ==========================================================================
    function renderTags() {
        if (!tagsListWrapper) return;
        tagsListWrapper.innerHTML = '';

        activeTags.forEach(tag => {
            const pill = document.createElement('div');
            pill.className = 'tag-pill';
            pill.innerHTML = `
                <span>${tag.startsWith('#') ? tag : '#' + tag}</span>
                <button class="tag-close-btn">&times;</button>
            `;

            // Close click removes tag
            pill.querySelector('.tag-close-btn').addEventListener('click', () => {
                activeTags = activeTags.filter(t => t !== tag);
                renderTags();
                renderInfluencers();
            });

            tagsListWrapper.appendChild(pill);
        });
    }

    if (tagSearchInput) {
        tagSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = tagSearchInput.value.trim();
                if (val && !activeTags.includes(val)) {
                    activeTags.push(val);
                    renderTags();
                    renderInfluencers();
                    tagSearchInput.value = '';
                }
            }
        });
    }


    // ==========================================================================
    // 5. Creator Profile Details Drawer
    // ==========================================================================
    const creatorDrawer = document.getElementById('creator-drawer');
    const closeDrawerBtn = document.getElementById('btn-close-drawer');
    
    const drawerAvatar = document.getElementById('drawer-creator-avatar');
    const drawerName = document.getElementById('drawer-creator-name');
    const drawerHandle = document.getElementById('drawer-creator-handle');
    const drawerBio = document.getElementById('drawer-creator-bio');
    
    const drawerPosts = document.getElementById('drawer-metric-posts');
    const drawerFollowers = document.getElementById('drawer-metric-followers');
    const drawerFollowing = document.getElementById('drawer-metric-following');
    const drawerER = document.getElementById('drawer-metric-er');
    const drawerERFill = document.getElementById('drawer-er-gauge-fill');

    const drawerFemaleBar = document.getElementById('drawer-female-bar');
    const drawerFemaleVal = document.getElementById('drawer-female-val');
    const drawerMaleBar = document.getElementById('drawer-male-bar');
    const drawerMaleVal = document.getElementById('drawer-male-val');

    function openCreatorDrawer(item) {
        if (!creatorDrawer) return;

        // Populate drawer contents
        drawerAvatar.src = `assets/${item.avatar}`;
        drawerName.innerText = item.name;
        drawerHandle.innerText = `@${item.handle}`;
        drawerBio.innerText = item.bio;

        drawerPosts.innerText = item.posts;
        drawerFollowers.innerText = item.followers;
        drawerFollowing.innerText = item.following;
        
        drawerER.innerText = item.er;
        drawerERFill.style.width = item.erFill;

        drawerFemaleBar.style.width = item.femaleFill;
        drawerFemaleVal.innerText = item.female;
        
        drawerMaleBar.style.width = item.maleFill;
        drawerMaleVal.innerText = item.male;

        // Open Drawer
        creatorDrawer.classList.add('open');
        creatorDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            creatorDrawer.classList.remove('open');
            creatorDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    // Close on overlay clicks
    if (creatorDrawer) {
        creatorDrawer.addEventListener('click', (e) => {
            if (e.target === creatorDrawer) {
                creatorDrawer.classList.remove('open');
                creatorDrawer.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }


    // ==========================================================================
    // 6. CSV Export Overlay dialog
    // ==========================================================================
    const exportTrigger = document.getElementById('btn-export-trigger');
    const exportDialog = document.getElementById('export-dialog');
    const exportCancel = document.getElementById('btn-export-cancel');
    const exportConfirm = document.getElementById('btn-export-confirm');
    const exportEmailInput = document.getElementById('export-target-email');

    if (exportTrigger && exportDialog && exportCancel && exportConfirm) {
        exportTrigger.addEventListener('click', () => {
            exportDialog.classList.add('open');
            exportDialog.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        exportCancel.addEventListener('click', () => {
            exportDialog.classList.remove('open');
            exportDialog.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });

        exportConfirm.addEventListener('click', () => {
            const email = exportEmailInput.value.trim();
            if (email) {
                alert(`اكتمل تصدير البيانات بنجاح!\nتم إرسال قائمة ملفات Excel / CSV التفصيلية ببيانات المؤثرين إلى البريد: ${email}`);
                exportDialog.classList.remove('open');
                exportDialog.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }


    // ==========================================================================
    // 7. Add Influencer Modal
    // ==========================================================================
    const addInfluencerBtn = document.getElementById('btn-add-influencer-trigger');
    const addInfluencerDialog = document.getElementById('add-influencer-dialog');
    const closeAddModalBtn = document.getElementById('btn-close-add-modal');
    const addInfluencerForm = document.getElementById('add-influencer-form');

    if (addInfluencerBtn && addInfluencerDialog && closeAddModalBtn) {
        addInfluencerBtn.addEventListener('click', () => {
            addInfluencerDialog.classList.add('open');
            addInfluencerDialog.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        closeAddModalBtn.addEventListener('click', () => {
            addInfluencerDialog.classList.remove('open');
            addInfluencerDialog.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    if (addInfluencerForm) {
        addInfluencerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('add-creator-name').value.trim();
            const handle = document.getElementById('add-creator-handle').value.trim();
            const rawTags = document.getElementById('add-creator-tags').value.trim();

            const parsedTags = rawTags ? rawTags.split(',').map(t => t.trim()) : ["منوعات"];

            const newCreator = {
                id: handle.toLowerCase(),
                name: name,
                handle: handle,
                bio: `مؤثر وصانع محتوى متميز يشارككم إبداعاته وتغطياته في مجالات: ${parsedTags.join(' و ')}.`,
                avatar: "avatar_mayar.png", // default avatar
                feeds: ["feed_sunset.png", "feed_relax.png", "feed_ocean.png"],
                posts: "١٢",
                followers: "٥٠ ألف",
                following: "١٢٠",
                er: "٤.٢٪",
                erFill: "65%",
                female: "٦٠٪",
                femaleFill: "60%",
                male: "٤٠٪",
                maleFill: "40%",
                tags: parsedTags
            };

            // Push and Save
            influencers.push(newCreator);
            localStorage.setItem('nojoom-custom-influencers-v2', JSON.stringify(influencers));

            // Re-render
            renderInfluencers();

            // Reset and close
            addInfluencerForm.reset();
            addInfluencerDialog.classList.remove('open');
            addInfluencerDialog.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            alert(`تمت إضافة صانع المحتوى (${name}) بنجاح لقائمة المؤثرين!`);
        });
    }


    // ==========================================================================
    // Initial Load Actions
    // ==========================================================================
    renderTags();
    renderInfluencers();

});
