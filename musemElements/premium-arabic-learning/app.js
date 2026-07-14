/* ==========================================================================
   JavaScript Functionality - نَمَاء (Namaa) Premium Arabic Dashboard
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Upcoming Classes Database
    // ==========================================================================
    const upcomingClasses = [
        {
            id: 0,
            subject: "physics",
            code: "PHYS101",
            title: "الفيزياء: اكتشاف قوانين الطبيعة ونظرية القوى",
            time: "يبدأ ١١:٣٠",
            banner: "assets/dashboard_physics.png",
            instructors: ["assets/dashboard_sophia.png"],
            moreInstructors: "+٤٠"
        },
        {
            id: 1,
            subject: "chemistry",
            code: "CHEM102",
            title: "الكيمياء: استكشاف أسرار المادة والمركبات",
            time: "يبدأ ١١:٣٠",
            banner: "assets/dashboard_chemistry.png",
            instructors: ["assets/dashboard_sophia.png"],
            moreInstructors: "+٤٠"
        }
    ];

    // ==========================================================================
    // In Progress Learning Rows Database
    // ==========================================================================
    const learningRows = [
        {
            id: 0,
            subject: "physics",
            code: "PHYS101",
            title: "الفيزياء: اكتشاف قوانين الطبيعة",
            materials: "٥ وحدات دراسية",
            progress: 44,
            duration: "يوم واحد",
            icon: "🌳",
            bgColor: "#10B981"
        },
        {
            id: 1,
            subject: "business",
            code: "GEOG102",
            title: "الجغرافيا: تخطيط أسرار الأرض وتضاريسها",
            materials: "٥ وحدات دراسية",
            progress: 44,
            duration: "يوم واحد",
            icon: "🌍",
            bgColor: "#8B5CF6"
        },
        {
            id: 2,
            subject: "chemistry",
            code: "CHEM102",
            title: "الكيمياء: مبادئ الكيمياء التأسيسية للمبتدئين",
            materials: "٥ وحدات دراسية",
            progress: 44,
            duration: "يوم واحد",
            icon: "🧪",
            bgColor: "#F59E0B"
        }
    ];

    // Elements
    const classCardsGrid = document.getElementById('class-cards-grid');
    const progressRowsList = document.getElementById('progress-rows-list');
    const categoryFilters = document.getElementById('category-filters');

    // ==========================================================================
    // 1. Render Classes & Learning Progress lists (With Category Filters)
    // ==========================================================================
    function renderUpcomingClasses(filterSubject = 'all') {
        classCardsGrid.innerHTML = '';
        
        const filtered = upcomingClasses.filter(c => filterSubject === 'all' || c.subject === filterSubject);

        if (filtered.length === 0) {
            classCardsGrid.innerHTML = `
                <div class="empty-filter-msg">
                    لا توجد محاضرات قادمة مجدولة لهذا التخصص اليوم.
                </div>
            `;
            return;
        }

        filtered.forEach((cls, index) => {
            const card = document.createElement('div');
            card.className = 'class-card';
            card.style.animationDelay = `${index * 0.12}s`;
            card.innerHTML = `
                <div class="class-card-banner" style="background-image: url('${cls.banner}');">
                    <span class="class-time-tag">${cls.time}</span>
                </div>
                <div class="class-card-body">
                    <div>
                        <span class="class-subject-tag">${cls.code}</span>
                        <h4 class="class-card-title">${cls.title}</h4>
                    </div>
                    <div class="class-card-footer">
                        <div class="instructor-avatars">
                            <img src="${cls.instructors[0]}" alt="مدرس المادة" class="instructor-img">
                            <span class="instructor-more-bubble">${cls.moreInstructors}</span>
                        </div>
                        <button class="btn-card-action btn-start-class">البدء</button>
                    </div>
                </div>
            `;

            // Start class action
            card.querySelector('.btn-start-class').addEventListener('click', () => {
                alert(`جاري تهيئة الفصل الافتراضي لمساق ${cls.code}. يرجى الانتظار...`);
            });

            classCardsGrid.appendChild(card);
        });
    }

    function renderLearningRows(filterSubject = 'all') {
        progressRowsList.innerHTML = '';

        const filtered = learningRows.filter(r => filterSubject === 'all' || r.subject === filterSubject);

        if (filtered.length === 0) {
            progressRowsList.innerHTML = `
                <div class="empty-filter-msg">
                    لا توجد مساقات قيد المتابعة مسجلة لهذا التخصص حالياً.
                </div>
            `;
            return;
        }

        filtered.forEach((row, index) => {
            const item = document.createElement('div');
            item.className = 'progress-row-item';
            item.style.animationDelay = `${index * 0.08}s`;

            // Localize numbers
            const arPercent = row.progress.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

            // Calculate SVG mini circle dashboard progress
            // Mini Circle Circumference C = 2 * Math.PI * r = 2 * Math.PI * 14 = 87.96
            const circumference = 87.96;
            const offset = circumference - (row.progress / 100) * circumference;

            item.innerHTML = `
                <div class="row-subject-info">
                    <div class="row-icon-box" style="background-color: ${row.bgColor}15; color: ${row.bgColor};">${row.icon}</div>
                    <div class="row-subject-details">
                        <span class="row-subject-lbl">${row.code}</span>
                        <h4 class="row-subject-title">${row.title}</h4>
                    </div>
                </div>
                <div class="row-meta-col">
                    <span class="row-meta-col-lbl">المحتوى</span>
                    <span class="row-meta-col-val">${row.materials}</span>
                </div>
                <div class="row-meta-col">
                    <span class="row-meta-col-lbl">التقدم</span>
                    <div class="row-progress-circle-wrap">
                        <svg class="mini-circle-svg" width="36" height="36">
                            <circle class="mini-circle-track" cx="18" cy="18" r="14" stroke-width="3.5" fill="transparent"/>
                            <circle class="mini-circle-bar" cx="18" cy="18" r="14" stroke-width="3.5" fill="transparent" stroke-dasharray="87.96" stroke-dashoffset="${offset}"/>
                        </svg>
                        <span class="row-meta-col-val progress-percent-value">${arPercent}٪</span>
                    </div>
                </div>
                <div class="row-meta-col">
                    <span class="row-meta-col-lbl">المستحق</span>
                    <span class="row-meta-col-val">${row.duration}</span>
                </div>
                <div class="row-action-col">
                    <button class="btn-row-action">${row.progress === 100 ? 'اكتمل' : 'متابعة'}</button>
                </div>
            `;

            // Progress increment action (adds 10% progress on click)
            const actionBtn = item.querySelector('.btn-row-action');
            actionBtn.addEventListener('click', () => {
                if (row.progress < 100) {
                    row.progress = Math.min(100, row.progress + 14); // increment
                    
                    // Recalculate
                    const newOffset = circumference - (row.progress / 100) * circumference;
                    item.querySelector('.mini-circle-bar').style.strokeDashoffset = newOffset;
                    item.querySelector('.progress-percent-value').innerText = `${row.progress.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}٪`;
                    
                    if (row.progress === 100) {
                        actionBtn.innerText = 'اكتمل';
                        alert(`مبروك! لقد أكملت مساق ${row.code} بنجاح.`);
                    }
                }
            });

            progressRowsList.appendChild(item);
        });
    }

    // Category Pill Event Bindings
    if (categoryFilters) {
        const pills = categoryFilters.querySelectorAll('.filter-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const subject = pill.getAttribute('data-subject');
                renderUpcomingClasses(subject);
                renderLearningRows(subject);
            });
        });
    }


    // ==========================================================================
    // 2. Active Study Timer Switch Toggle (ticks hours every second when active)
    // ==========================================================================
    const timerToggle = document.getElementById('study-timer-toggle');
    const timerHoursTxt = document.getElementById('timer-hours');
    
    let timerInterval = null;
    let studyHours = 3.50; // Base starting activity hours

    if (timerToggle && timerHoursTxt) {
        timerToggle.addEventListener('click', () => {
            const isPressed = timerToggle.getAttribute('aria-pressed') === 'true';
            
            // Toggle active status
            timerToggle.setAttribute('aria-pressed', !isPressed);
            timerToggle.classList.toggle('active');

            if (!isPressed) {
                // Start ticking timer (ticks up 0.01 hours = ~36 seconds of study time every real second)
                timerInterval = setInterval(() => {
                    studyHours += 0.01;
                    // Format to 2 decimal places and localize digits
                    const formatted = studyHours.toFixed(2);
                    const arHours = formatted.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
                    timerHoursTxt.innerText = arHours;
                    
                    // Increment points slightly to reward studying
                    const pointsTxt = document.getElementById('profile-points');
                    if (pointsTxt) {
                        const currentPoints = parseInt(pointsTxt.innerText.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
                        pointsTxt.innerText = (currentPoints + 1).toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
                    }
                }, 1000);
            } else {
                // Clear timer
                clearInterval(timerInterval);
                timerInterval = null;
            }
        });
    }


    // ==========================================================================
    // 3. Ask AI Chatbot slide-out overlay & dynamic responses
    // ==========================================================================
    const btnAskAi = document.getElementById('btn-ask-ai');
    const aiChatPanel = document.getElementById('ai-chat-panel');
    const btnCloseChat = document.getElementById('btn-close-chat');
    
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-user-input');
    const chatThread = document.getElementById('chat-messages-thread');

    if (btnAskAi && aiChatPanel && btnCloseChat && chatForm) {
        
        // Open/Close
        btnAskAi.addEventListener('click', () => {
            aiChatPanel.classList.add('open');
            aiChatPanel.setAttribute('aria-hidden', 'false');
        });

        btnCloseChat.addEventListener('click', () => {
            aiChatPanel.classList.remove('open');
            aiChatPanel.setAttribute('aria-hidden', 'true');
        });

        // Chat replies logic
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const query = chatInput.value.trim();
            if (!query) return;

            // 1. Append User Bubble
            appendChatBubble(query, 'user-msg');
            chatInput.value = '';

            // Scroll lock thread
            chatThread.scrollTop = chatThread.scrollHeight;

            // 2. Simulated Bot Thinking & response
            setTimeout(() => {
                let reply = "سؤال دراسي رائع! يمكنني مساعدتك في شرح الفصول الدراسية، أو مراجعة جداول واجباتك الأسبوعية المتعلقة بهذا الموضوع.";

                // Keywords mapping
                const lowerQuery = query.toLowerCase();
                if (lowerQuery.includes('واجب') || lowerQuery.includes('مستحق') || lowerQuery.includes('تعديل')) {
                    reply = "لديك واجب دراسي مستحق في مساق الكيمياء وآخر في مساق الفيزياء يستحق تسليمهما خلال ٤ أيام.";
                } else if (lowerQuery.includes('محاضرة') || lowerQuery.includes('موعد') || lowerQuery.includes('وقت')) {
                    reply = "محاضراتك القادمة المجدولة اليوم هي مساق الفيزياء وعلم المحيطات، وتبدأ الجلسات عند الساعة ١١:٣٠ صباحاً.";
                } else if (lowerQuery.includes('مرحباً') || lowerQuery.includes('أهلاً') || lowerQuery.includes('السلام')) {
                    reply = "أهلاً بك صوفيا! أنا مساعد منصة نَمَاء الذكي، كيف يمكنني مساعدتك في مساقاتك الدراسية اليوم؟";
                }

                appendChatBubble(reply, 'bot-msg');
                chatThread.scrollTop = chatThread.scrollHeight;
            }, 800);
        });
    }

    function appendChatBubble(text, className) {
        const bubble = document.createElement('div');
        bubble.className = `message ${className}`;
        bubble.innerHTML = `<p class="msg-text">${text}</p>`;
        chatThread.appendChild(bubble);
    }


    // ==========================================================================
    // 4. SPA Subpage Navigation Switcher
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-item-link[data-target]');
    const subpageViews = document.querySelectorAll('.subpage-view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Toggle active classes on links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const target = link.getAttribute('data-target');

            // Hide all subpage views
            subpageViews.forEach(view => {
                view.style.display = 'none';
                view.classList.remove('active');
            });

            // Show current active subpage view
            const activeView = document.getElementById(`view-${target}`);
            if (activeView) {
                activeView.style.display = 'block';
                setTimeout(() => {
                    activeView.classList.add('active');
                }, 20);
            }
        });
    });

    // ==========================================================================
    // 5. Interactive Notebook Manager
    // ==========================================================================
    const notebookForm = document.getElementById('notebook-form');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const notesThread = document.getElementById('notes-list-thread');

    let notes = [];
    const savedNotes = localStorage.getItem('namaa-notes-v1');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    } else {
        notes = [
            {
                id: 0,
                title: "ملاحظات محاضرة الفيزياء العامة",
                date: "٢٢ يناير ٢٠٢٦",
                content: "قوانين نيوتن للحركة:\n١. الجسم الساكن يبقى ساكناً ما لم تؤثر عليه قوة خارجية.\n٢. القوة تساوي الكتلة في التسارع (F = m.a).\n٣. لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه."
            }
        ];
        localStorage.setItem('namaa-notes-v1', JSON.stringify(notes));
    }

    function renderNotes() {
        if (!notesThread) return;
        notesThread.innerHTML = '';

        if (notes.length === 0) {
            notesThread.innerHTML = `<div class="empty-notes-msg">لا توجد ملاحظات محفوظة حالياً. يمكنك تدوين ملاحظة جديدة.</div>`;
            return;
        }

        notes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'note-item-card';
            card.innerHTML = `
                <div class="note-item-header">
                    <h5 class="note-item-title">${note.title}</h5>
                    <button class="btn-delete-note" aria-label="حذف الملاحظة" data-index="${index}">×</button>
                </div>
                <span class="note-item-date">${note.date}</span>
                <p class="note-item-content">${note.content}</p>
            `;

            // Delete action
            card.querySelector('.btn-delete-note').addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                notes.splice(idx, 1);
                localStorage.setItem('namaa-notes-v1', JSON.stringify(notes));
                renderNotes();
            });

            notesThread.appendChild(card);
        });
    }

    if (notebookForm) {
        notebookForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = noteTitleInput.value.trim();
            const content = noteContentInput.value.trim();
            if (!title || !content) return;

            // Formulate date in Arabic style
            const today = new Date();
            const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
            const day = today.getDate().toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            const month = months[today.getMonth()];
            const year = today.getFullYear().toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            const dateStr = `${day} ${month} ${year}`;

            const newNote = {
                id: Date.now(),
                title: title,
                date: dateStr,
                content: content
            };

            notes.unshift(newNote); // Add to beginning of array
            localStorage.setItem('namaa-notes-v1', JSON.stringify(notes));
            
            // Clear inputs & re-render list
            notebookForm.reset();
            renderNotes();
        });
    }


    // ==========================================================================
    // Initial Render Actions
    // ==========================================================================
    renderUpcomingClasses();
    renderLearningRows();
    renderNotes();

});
