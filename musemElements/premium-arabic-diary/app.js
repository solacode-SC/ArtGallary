/* ==========================================================================
   JavaScript Functionality - دَفْتَر (Daftar) Premium Arabic Diary
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Journal Pages Database (Streamlined: 1 main image, content notes, vibe colors)
    // ==========================================================================
    const defaultPages = [
        {
            id: 0,
            title: "ذكريات قديمة",
            subtitle: "رحلات الماضي الجميل",
            image: "assets/diary_sunset.png",
            colors: ["#FCA5A5", "#EF4444", "#B91C1C", "#991B1B", "#7F1D1D"],
            note: "غروب ساحر يذكرني بشوارع غرناطة القديمة، حيث تلتقي الأصالة بالتاريخ.. كل تفصيل هناك يحمل عبقاً وحكاية عتيقة.",
            noteLabel: "ألوان الشفق الدافئة"
        },
        {
            id: 1,
            title: "معرض الفنون",
            subtitle: "تصاميم وأفكار ملهمة",
            image: "assets/diary_mountain.png",
            colors: ["#FCD34D", "#F59E0B", "#D97706", "#B45309", "#78350F"],
            note: "بين الضباب وجبال الصنوبر أجد هدوءاً يعيد ترتيب أفكاري المبعثرة ويمنحني طاقة إبداعية جديدة لرسم لوحاتي القادمة.",
            noteLabel: "باليت جبل الصنوبر"
        },
        {
            id: 2,
            title: "سكون النفس",
            subtitle: "لحظة تأمل وهدوء",
            image: "assets/diary_relax.png",
            colors: ["#A7F3D0", "#34D399", "#059669", "#065F46", "#064E3B"],
            note: "السكينة الحقيقية تبدأ من الداخل عندما ننفصل عن صخب المدينة ونستمع لصوت الطبيعة الهادئ ونغمات النسيم العليل.",
            noteLabel: "نسمات خضراء زاهية"
        },
        {
            id: 3,
            title: "يوميّاتي",
            subtitle: "تأملات الصباح والمساء",
            image: "assets/diary_valley.png",
            colors: ["#C7D2FE", "#818CF8", "#4F46E5", "#312E81", "#1E1B4B"],
            note: "أكتبُ أحلامي هنا، على أوراق دفتر رقمي يتنفس الضاد.. بين سكون الطبيعة وهمسات الغروب، أجد سلامي الداخلي وطمأنينتي.",
            noteLabel: "لوحة ألوان مصغرة"
        },
        {
            id: 4,
            title: "رحلات الخريف",
            subtitle: "قمم جبال الأطلس",
            image: "assets/diary_mountain.png",
            colors: ["#BAE6FD", "#38BDF8", "#0284C7", "#0369A1", "#0C4A6E"],
            note: "تسلقت الجبل مع نسيم الخريف البارد، ورأيت الأفق البعيد يلتحم بالغيوم البيضاء الشامخة في لوحة جبلية بديعة الأبعاد.",
            noteLabel: "ألوان الضباب الجبلي"
        },
        {
            id: 5,
            title: "خواطر حرة",
            subtitle: "كتابات تحت ضوء القمر",
            image: "assets/diary_sunset.png",
            colors: ["#DDD6FE", "#A78BFA", "#7C3AED", "#6D28D9", "#4C1D95"],
            note: "أفكار متناثرة أكتبها قبل النوم، علّها تصبح أحلاماً جميلة ترافقني في رحلتي الليلية الهادئة نحو النجوم المضيئة.",
            noteLabel: "باليت البنفسج الحالم"
        },
        {
            id: 6,
            title: "أفكار مسائية",
            subtitle: "تخطيط للمستقبل البعيد",
            image: "assets/diary_valley.png",
            colors: ["#E2E8F0", "#94A3B8", "#475569", "#334155", "#0F172A"],
            note: "كل خطوة نخطوها بوعي اليوم تقربنا خطوة إضافية من أهدافنا الكبيرة غداً. أرتب أفكاري بسلام وتفاؤل بمستقبل مشرق.",
            noteLabel: "درجات السحاب الممطر"
        }
    ];

    let journalPages = [];

    // Load from Session Storage or fallback to default
    const savedData = sessionStorage.getItem('daftar-pages-v3');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            // Verify both length and schema structure to prevent TypeError on stale versions
            if (parsed.length === defaultPages.length && parsed[0] && parsed[0].image && parsed[0].colors) {
                journalPages = parsed;
            } else {
                journalPages = [...defaultPages];
                sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));
            }
        } catch (e) {
            journalPages = [...defaultPages];
            sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));
        }
    } else {
        journalPages = [...defaultPages];
        sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));
    }

    // Set starting active page index to 3 (the center of the 7 cards stack)
    let activePageIndex = 3;

    // Elements
    const carouselDeck = document.getElementById('carousel-deck');
    const dotIndicators = document.getElementById('dot-indicators');
    const pageTitleDisplay = document.getElementById('page-title-display');
    const pageCountDisplay = document.getElementById('page-count-display');

    // ==========================================================================
    // 3D Deck Transformation Math (Centering and symmetric stacking of 7 cards)
    // ==========================================================================
    function updateDeckLayout(dragShift = 0) {
        const cards = carouselDeck.querySelectorAll('.journal-card');
        if (cards.length === 0) return;

        // Update active page titles
        const activePage = journalPages[activePageIndex];
        if (activePage) {
            pageTitleDisplay.innerText = activePage.title;
            const arActive = (activePageIndex + 1).toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            const arTotal = journalPages.length.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            pageCountDisplay.innerText = `الصفحة ${arActive} من أصل ${arTotal}`;
        }

        // Update dot indicators
        const dots = dotIndicators.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if (idx === activePageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Apply mathematical transforms to each page card
        cards.forEach((card, index) => {
            const offset = index - activePageIndex - dragShift;
            const absOffset = Math.abs(offset);

            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
            if (absOffset < 0.1) {
                card.classList.add('active');
            } else if (offset < 0) {
                card.classList.add(absOffset < 1.1 ? 'prev' : 'far-prev');
            } else if (offset > 0) {
                card.classList.add(absOffset < 1.1 ? 'next' : 'far-next');
            }

            // Stacking Math
            const spacingPower = Math.pow(absOffset, 0.75) * 160;
            const translateX = -Math.sign(offset) * spacingPower;
            const translateZ = -absOffset * 150;
            const rotateY = Math.sign(offset) * Math.min(50, absOffset * 15);
            const scale = Math.max(0.4, 1 - absOffset * 0.15); // center card big, flanking smaller
            const opacity = Math.max(0, 1 - absOffset * 0.25); // fades progressively
            const zIndex = Math.round(100 - absOffset * 10);
            const visibility = absOffset < 3.5 ? 'visible' : 'hidden';

            card.style.transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.visibility = visibility;
        });
    }

    // ==========================================================================
    // Render/Build Deck DOM elements (Single Image & Unified Content side)
    // ==========================================================================
    function renderDeck() {
        carouselDeck.innerHTML = '';
        dotIndicators.innerHTML = '';

        // Build DOT Indicators
        journalPages.forEach((page, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === activePageIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                activePageIndex = index;
                updateDeckLayout(0);
            });
            dotIndicators.appendChild(dot);
        });

        // Build Notebook Card Nodes
        journalPages.forEach((page, index) => {
            const card = document.createElement('div');
            card.className = 'journal-card';
            card.setAttribute('data-page-index', index);

            // Swatches Palette circles
            let swatchesHtml = '';
            page.colors.forEach(col => {
                swatchesHtml += `<span class="swatch-circle" style="background-color: ${col};"></span>`;
            });

            card.innerHTML = `
                <div class="notebook-spread">
                    <div class="binding-line"></div>
                    
                    <!-- Right Side: 1 Main Premium Image -->
                    <div class="notebook-page page-right page-image-side">
                        <div class="diary-main-image-container">
                            <img src="${page.image}" alt="${page.title}" class="diary-main-image">
                        </div>
                    </div>

                    <!-- Left Side: Written Content & Vibe Colors -->
                    <div class="notebook-page page-left page-content-side">
                        <!-- Top title/date indicator -->
                        <div class="content-header">
                            <span class="content-subtitle">${page.subtitle}</span>
                        </div>

                        <!-- Center written calligraphy note -->
                        <div class="diary-notes-area">
                            <div class="calligraphy-note text-editable" data-field="note" contenteditable="true">${page.note}</div>
                        </div>

                        <!-- Bottom Vibe Colors swatch palette -->
                        <div class="swatches-wrapper">
                            <div class="swatch-circles">${swatchesHtml}</div>
                            <span class="swatch-label text-editable" data-field="noteLabel" contenteditable="true">${page.noteLabel}</span>
                        </div>

                        <!-- Subtle vector arrow accent -->
                        <svg class="arrow-left-page" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12h18M15 6l6 6-6 6"/>
                        </svg>
                    </div>
                </div>
            `;

            // Click cards to select
            card.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.stopPropagation();
                    return;
                }
                if (index !== activePageIndex) {
                    activePageIndex = index;
                    updateDeckLayout(0);
                }
            });

            // Bind inline edit handlers
            const editableFields = card.querySelectorAll('.text-editable');
            editableFields.forEach(field => {
                field.addEventListener('blur', () => {
                    const fieldName = field.getAttribute('data-field');
                    const text = field.innerText.trim();
                    
                    journalPages[index][fieldName] = text;
                    sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));
                });
                
                field.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            carouselDeck.appendChild(card);
        });

        updateDeckLayout(0);
    }

    renderDeck();

    // ==========================================================================
    // Slide Navigation Functions
    // ==========================================================================
    function nextSlide() {
        if (activePageIndex < journalPages.length - 1) {
            activePageIndex++;
            updateDeckLayout(0);
        }
    }

    // Swaps direction for RTL controls
    function prevSlide() {
        if (activePageIndex > 0) {
            activePageIndex--;
            updateDeckLayout(0);
        }
    }

    // ==========================================================================
    // Interactive Mouse & Touch Dragging Controller
    // ==========================================================================
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let currentX = 0;
    let dragShift = 0;

    carouselDeck.addEventListener('mousedown', (e) => {
        if (e.target.closest('[contenteditable="true"]')) return;
        
        isDragging = true;
        hasDragged = false;
        startX = e.clientX;
        carouselDeck.classList.add('dragging');
        e.preventDefault(); 
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const deltaX = currentX - startX;
        
        if (Math.abs(deltaX) > 8) {
            hasDragged = true;
        }

        dragShift = deltaX / 300;
        
        if (activePageIndex === 0 && dragShift > 0.5) dragShift = 0.5 + (dragShift - 0.5) * 0.3;
        if (activePageIndex === journalPages.length - 1 && dragShift < -0.5) dragShift = -0.5 + (dragShift + 0.5) * 0.3;

        updateDeckLayout(dragShift);
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        carouselDeck.classList.remove('dragging');

        const threshold = 0.25; 
        let targetIndex = activePageIndex;
        
        if (dragShift > threshold) {
            targetIndex = Math.max(0, activePageIndex - 1);
        } else if (dragShift < -threshold) {
            targetIndex = Math.min(journalPages.length - 1, activePageIndex + 1);
        }

        activePageIndex = targetIndex;
        dragShift = 0;
        updateDeckLayout(0);

        setTimeout(() => {
            isDragging = false;
            hasDragged = false;
        }, 50);
    });

    // Touch events for mobile swiping
    carouselDeck.addEventListener('touchstart', (e) => {
        if (e.target.closest('[contenteditable="true"]')) return;
        isDragging = true;
        hasDragged = false;
        startX = e.touches[0].clientX;
        carouselDeck.classList.add('dragging');
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;

        if (Math.abs(deltaX) > 8) {
            hasDragged = true;
        }

        dragShift = deltaX / 260; 
        updateDeckLayout(dragShift);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        carouselDeck.classList.remove('dragging');

        const threshold = 0.25;
        let targetIndex = activePageIndex;
        
        if (dragShift > threshold) {
            targetIndex = Math.max(0, activePageIndex - 1);
        } else if (dragShift < -threshold) {
            targetIndex = Math.min(journalPages.length - 1, activePageIndex + 1);
        }

        activePageIndex = targetIndex;
        dragShift = 0;
        updateDeckLayout(0);

        setTimeout(() => {
            isDragging = false;
            hasDragged = false;
        }, 50);
    });

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
        if (document.activeElement && document.activeElement.getAttribute('contenteditable') === 'true') {
            return;
        }

        if (e.key === 'ArrowLeft') {
            nextSlide();
        } else if (e.key === 'ArrowRight') {
            prevSlide();
        }
    });

    // Editable Header Title
    if (pageTitleDisplay) {
        pageTitleDisplay.setAttribute('contenteditable', 'true');
        pageTitleDisplay.addEventListener('blur', () => {
            const newTitle = pageTitleDisplay.innerText.trim();
            if (newTitle) {
                journalPages[activePageIndex].title = newTitle;
                sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));
            }
        });
        pageTitleDisplay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                pageTitleDisplay.blur();
            }
        });
    }

    // Left & Right Deck Navigation Buttons
    const deckPrevBtn = document.getElementById('deck-prev');
    const deckNextBtn = document.getElementById('deck-next');

    if (deckPrevBtn) {
        deckPrevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    if (deckNextBtn) {
        deckNextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }

    // Page Management Footer Buttons (Add, Delete)
    const btnAddPage = document.getElementById('btn-add-page');
    const btnDelete = document.getElementById('btn-delete');

    if (btnAddPage) {
        btnAddPage.addEventListener('click', () => {
            const newId = journalPages.length;
            const newPage = {
                id: newId,
                title: `رحلة جديدة`,
                subtitle: `صفحة ذكريات فارغة`,
                image: "assets/diary_mountain.png",
                colors: ["#E2E8F0", "#CBD5E1", "#94A3B8", "#475569", "#1E293B"],
                note: "انقر هنا لبدء كتابة مذكراتك الشخصية الجديدة.. عبّر عن لحظاتك السعيدة واملأ صفحات دفترك بالتفاصيل الملهمة.",
                noteLabel: "لوحة ألوان جديدة"
            };

            journalPages.push(newPage);
            sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));
            
            activePageIndex = journalPages.length - 1;
            renderDeck();
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            if (journalPages.length <= 1) {
                alert('لا يمكن حذف كل صفحات مذكراتك! يجب الإبقاء على صفحة واحدة على الأقل.');
                return;
            }

            if (confirm('هل أنت متأكد من رغبتك في حذف صفحة اليوميات الحالية؟')) {
                journalPages.splice(activePageIndex, 1);
                journalPages.forEach((page, idx) => page.id = idx);
                sessionStorage.setItem('daftar-pages-v3', JSON.stringify(journalPages));

                if (activePageIndex >= journalPages.length) {
                    activePageIndex = journalPages.length - 1;
                }
                renderDeck();
            }
        });
    }

    // Export & Share Modals
    const btnShare = document.getElementById('btn-share');
    const shareModal = document.getElementById('share-modal');
    const shareCloseBtn = document.getElementById('share-close-btn');

    if (btnShare && shareModal && shareCloseBtn) {
        btnShare.addEventListener('click', () => {
            shareModal.classList.add('open');
            shareModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        shareCloseBtn.addEventListener('click', () => {
            shareModal.classList.remove('open');
            shareModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });

        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.remove('open');
                shareModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });

        const exportPdf = document.getElementById('export-pdf');
        const shareLink = document.getElementById('share-link');

        exportPdf.addEventListener('click', () => {
            alert('تمت تهيئة ملف الـ PDF بنجاح. سيبدأ تحميل مذكراتك الفاخرة خلال لحظات.');
            shareModal.classList.remove('open');
            shareModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });

        shareLink.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ رابط مشاركة مذكراتك في الحافظة بنجاح!');
            shareModal.classList.remove('open');
            shareModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
});
