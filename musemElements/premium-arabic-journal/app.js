/* ==========================================================================
   JavaScript Functionality - سُكُون (Sukoon) Premium Wellness Journal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Dynamic Multi-Day Diary Database
    // ==========================================================================
    const defaultDiaryEntries = {
        'today': {
            text: "اليوم شعرت بسكينة عميقة عند شروق الشمس. جلست في الفناء الخارجي أراقب الضوء وهو يتسلل بين أوراق الشجر، وكأن الطبيعة تهمس لنا بأن كل يوم هو فرصة جديدة للتجدد والنمو الروحي الهادئ.",
            location: "محمية الغابة الوطنية",
            date: "الثلاثاء، ٢٩ يوليو ٢٠٢٥",
            caption: "أين يكمن جمال هذا العالم المليء بالسلام؟",
            streakCompleted: false,
            mood: "calm"
        },
        'yesterday': {
            text: "قضيت المساء في مراجعة كتيبات المحاسبة، ثم خرجت للمشي تحت ضوء القمر. كان النسيم بارداً ومنعشاً، وساعدني على ترتيب أفكاري والتخلص من أثر يوم دراسي حافل بالمسؤوليات.",
            location: "ممشى الواحة الخضراء",
            date: "الأحد، ٢٧ يوليو ٢٠٢٥",
            caption: "هدوء المساء يعيد ترتيب الفوضى بداخلنا.",
            streakCompleted: true,
            mood: "happy"
        },
        'may25': {
            text: "رحلة جبلية رائعة مع الأصدقاء. الصعود كان شاقاً لكن منظر القمم الممتدة وسط الضباب الكثيف جعل كل تعب يتلاشى. الطبيعة تملك دائماً طريقة خاصة لتذكيرنا بصغر حجم مخاوفنا.",
            location: "قمة الجبل الشرقي",
            date: "السبت، ٢٥ مايو ٢٠٢٥",
            caption: "القمم الصامتة تحكي قصصاً لا تسمعها إلا القلوب.",
            streakCompleted: true,
            mood: "anxious"
        },
        'apr29': {
            text: "جلست اليوم بالقرب من شاطئ المحيط أراقب حركة الأمواج المتتابعة. كل موجة تأتي وتذهب تذكرني بأفكارنا ومشاعرنا؛ تأتي ثم تتلاشى، والمهم هو أن نحافظ على هدوء الأعماق الساكنة.",
            location: "شاطئ الشروق الذهبي",
            date: "الجمعة، ٢٩ أبريل ٢٠٢٥",
            caption: "البحر يعلمنا فلسفة التخلي والتدفق المستمر.",
            streakCompleted: true,
            mood: "calm"
        },
        'mar23': {
            text: "أنهيت اليوم تسليم التكليف الدراسي لمساق إدارة الأعمال. شعرت براحة كبيرة وتوجهت للمكتبة العامة لقراءة بعض الروايات التاريخية المترجمة في أجواء دافئة هادئة.",
            location: "مقهى الروضة الثقافي",
            date: "الخميس، ٢٣ مارس ٢٠٢٥",
            caption: "الإنجاز الصغير يفتح أبواباً واسعة للسلام.",
            streakCompleted: true,
            mood: "happy"
        },
        'nov19': {
            text: "يوم ماطر وجميل. رائحة المطر تملأ المكان. فضلت البقاء في المنزل بجانب النافذة أكتب خواطري وأستمع إلى عزف المطر الهادئ على الزجاج.",
            location: "رواق المنزل الدافئ",
            date: "الأربعاء، ١٩ نوفمبر ٢٠٢٤",
            caption: "حين تمطر السماء، تتنفس الأرواح هدوءها.",
            streakCompleted: true,
            mood: "tired"
        },
        'june12': {
            text: "قضيت فترة الصباح في تأمل بحيرة الأحساء الصامتة. المياه تعكس لون السماء الصافي وكأنها مرآة عملاقة تحكي قصص النخيل والهدوء البشري الاستثنائي.",
            location: "واحة الأحساء التاريخية",
            date: "الخميس، ١٢ يونيو ٢٠٢٥",
            caption: "النخيل الشامخ يعلمنا الثبات والصمت المثمر.",
            streakCompleted: true,
            mood: "calm"
        },
        'oct04': {
            text: "شاهدت الغروب اليوم في صحراء النفود الكبير. الرمال الذهبية تتحول تدريجياً إلى درجات الأحمر الداكن والبنفسجي، مشهد مهيب يبعث على التفكر والسكينة المطلقة بقلب الرمال.",
            location: "عروق النفود الكبير",
            date: "السبت، ٤ أكتوبر ٢٠٢٤",
            caption: "رمال الصحراء تحوي حكمة الصمت والامتداد.",
            streakCompleted: true,
            mood: "happy"
        }
    };

    let diaryDB = {};
    const savedDB = localStorage.getItem('sukoon-diary-database-v1');
    if (savedDB) {
        diaryDB = JSON.parse(savedDB);
    } else {
        diaryDB = { ...defaultDiaryEntries };
        localStorage.setItem('sukoon-diary-database-v1', JSON.stringify(diaryDB));
    }

    let activeDateKey = 'today';


    // ==========================================================================
    // UI Elements Bindings
    // ==========================================================================
    const ruledTextarea = document.getElementById('journal-ruled-textarea');
    const locationInput = document.getElementById('journal-location-input');
    const pageDateTxt = document.getElementById('journal-page-date');
    const polaroidCaption = document.getElementById('polaroid-caption-text');
    
    const dateCardBtns = document.querySelectorAll('.date-card-btn');
    const sidebarSearchInput = document.getElementById('sidebar-search-input');
    
    // Mood Elements
    const moodBtns = document.querySelectorAll('.mood-btn');
    
    // Streak Elements
    const streakCheckbox = document.getElementById('streak-check-input');
    const streakDaysCount = document.getElementById('streak-days-count');
    const streakFireEmoji = document.getElementById('streak-fire-emoji');
    const streakMotivateTxt = document.getElementById('streak-motivate-txt');

    // Prompt Elements
    const promptQuoteTxt = document.getElementById('prompt-quote-txt');
    const btnRefreshPrompt = document.getElementById('btn-refresh-prompt');
    const btnLikePrompt = document.getElementById('btn-like-prompt');
    const btnCopyPrompt = document.getElementById('btn-copy-prompt');


    // ==========================================================================
    // 2. Load and Populate Active Diary Page Entry
    // ==========================================================================
    function loadActiveDiaryEntry() {
        const entry = diaryDB[activeDateKey];
        if (!entry) return;

        // Populate fields
        ruledTextarea.value = entry.text;
        locationInput.value = entry.location;
        pageDateTxt.innerText = entry.date;
        polaroidCaption.innerText = entry.caption;

        // Highlight active mood
        moodBtns.forEach(btn => btn.classList.remove('active'));
        if (entry.mood) {
            const activeMoodBtn = document.querySelector(`.mood-btn[data-mood="${entry.mood}"]`);
            if (activeMoodBtn) activeMoodBtn.classList.add('active');
        }

        // Set streak completion state
        streakCheckbox.checked = entry.streakCompleted;
        updateStreakUI(entry.streakCompleted);
    }

    // Auto-save changes on keyup/input
    function saveActiveDiaryEntry() {
        if (!diaryDB[activeDateKey]) {
            diaryDB[activeDateKey] = {};
        }

        diaryDB[activeDateKey].text = ruledTextarea.value;
        diaryDB[activeDateKey].location = locationInput.value;
        diaryDB[activeDateKey].caption = polaroidCaption.innerText;
        diaryDB[activeDateKey].streakCompleted = streakCheckbox.checked;

        // Find active mood
        const activeMoodBtn = document.querySelector('.mood-btn.active');
        diaryDB[activeDateKey].mood = activeMoodBtn ? activeMoodBtn.getAttribute('data-mood') : 'calm';

        localStorage.setItem('sukoon-diary-database-v1', JSON.stringify(diaryDB));
    }

    // Bind Auto-save listeners
    ruledTextarea.addEventListener('input', saveActiveDiaryEntry);
    locationInput.addEventListener('input', saveActiveDiaryEntry);
    polaroidCaption.addEventListener('input', saveActiveDiaryEntry);

    // Sidebar navigation date clicks
    dateCardBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            dateCardBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            activeDateKey = btn.getAttribute('data-target') || btn.getAttribute('data-date-key');
            loadActiveDiaryEntry();
        });
    });


    // ==========================================================================
    // 3. Streak Ticker & Checkbox Toggle Actions
    // ==========================================================================
    function updateStreakUI(completed) {
        if (completed) {
            streakDaysCount.innerText = '٢ يوم'; // Ticks up streak
            streakFireEmoji.classList.add('active');
            streakMotivateTxt.innerText = 'رائع! لقد أكملت تأمل اليوم. استمر غداً للحفاظ على السلسلة!';
        } else {
            streakDaysCount.innerText = '١ يوم'; // Resets streak
            streakFireEmoji.classList.remove('active');
            streakMotivateTxt.innerText = 'حافظ على شعلة التأمل متقدة كل يوم!';
        }
    }

    if (streakCheckbox) {
        streakCheckbox.addEventListener('change', () => {
            const completed = streakCheckbox.checked;
            updateStreakUI(completed);
            saveActiveDiaryEntry();
        });
    }


    // ==========================================================================
    // 4. Inspirational Wellness Reflection Prompt Quotes Database
    // ==========================================================================
    const wellnessPrompts = [
        "أبطئ من خطاي لأستمع إلى تفتح الزهور وأشعر باللمسة اللطيفة للنسيم المداعب لروحي.",
        "أركز على ما يمنحني السلام الداخلي، وأتخلى عن كل ما يثقل كاهلي بالتوتر والقلق.",
        "أشعر بالامتنان للنعم الصغيرة البسيطة التي تحيط بي في هذا اليوم الجميل الاستثنائي.",
        "كل خطوة أخطوها اليوم تقربني أكثر من تحقيق التوازن الجسدي والنفسي المتناغم.",
        "أسمح لروحي بالاسترخاء والتدفق مثل نهر هادئ ينساب بين التلال الخضراء الصامتة.",
        "اليوم سأمارس الصمت لدقائق، مستمعاً لأفكاري دون إطلاق أحكام عليها."
    ];

    if (btnRefreshPrompt && promptQuoteTxt) {
        btnRefreshPrompt.addEventListener('click', () => {
            // Simple fade-out, change, fade-in transition
            promptQuoteTxt.style.opacity = '0';
            promptQuoteTxt.style.transform = 'translateY(4px)';

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * wellnessPrompts.length);
                promptQuoteTxt.innerText = wellnessPrompts[randomIndex];
                
                promptQuoteTxt.style.opacity = '1';
                promptQuoteTxt.style.transform = 'translateY(0)';
            }, 250);
        });
    }

    if (btnCopyPrompt && promptQuoteTxt) {
        btnCopyPrompt.addEventListener('click', () => {
            navigator.clipboard.writeText(promptQuoteTxt.innerText)
                .then(() => {
                    alert('تم نسخ خاطرة اليوم التأملية بنجاح!');
                });
        });
    }

    if (btnLikePrompt) {
        btnLikePrompt.addEventListener('click', () => {
            btnLikePrompt.classList.toggle('liked');
            if (btnLikePrompt.classList.contains('liked')) {
                btnLikePrompt.querySelector('span').innerText = '❤️';
                btnLikePrompt.style.color = '#E74C3C';
            } else {
                btnLikePrompt.querySelector('span').innerText = '❤️';
                btnLikePrompt.style.color = '';
            }
        });
    }


    // ==========================================================================
    // 5. Mood Selector Click Toggles
    // ==========================================================================
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            saveActiveDiaryEntry();
        });
    });


    // ==========================================================================
    // 6. Sidebar Journal Search Box Filter
    // ==========================================================================
    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            dateCardBtns.forEach(btn => {
                const dateKey = btn.getAttribute('data-date-key');
                const entry = diaryDB[dateKey];

                if (!entry) return;

                const textMatch = entry.text.toLowerCase().includes(query);
                const locationMatch = entry.location.toLowerCase().includes(query);
                const captionMatch = entry.caption.toLowerCase().includes(query);

                if (query === '' || textMatch || locationMatch || captionMatch) {
                    btn.style.display = 'flex';
                } else {
                    btn.style.display = 'none';
                }
            });
        });
    }


    // ==========================================================================
    // Initial Load Actions
    // ==========================================================================
    loadActiveDiaryEntry();

});
