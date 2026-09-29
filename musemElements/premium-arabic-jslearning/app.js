/* ==========================================================================
   app.js — لوحة التعلم المتميزة | جيي إس لِيرْنِينج
   Full SPA Logic: page routing, cinematic transitions, charts, audio, forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. SPA Page Router with per-page cinematic transitions
  // ─────────────────────────────────────────────────────────────────────────
  const navBtns   = document.querySelectorAll('#main-sidebar-nav .nav-btn');
  const pages     = document.querySelectorAll('.page');
  const curtainL  = document.getElementById('curtain-l');
  const curtainR  = document.getElementById('curtain-r');
  const wipeBar   = document.getElementById('wipe-bar');
  const rippleEl  = document.getElementById('ripple-el');

  const TRANSITION_MAP = {
    zoom    : triggerWipe,
    curtain : triggerCurtain,
    slideup : triggerWipe,
    flip    : triggerWipe,
    blur    : triggerWipe,
    ripple  : triggerRipple,
    rotate  : triggerWipe,
    slidelf : triggerWipe
  };

  const CSS_CLASS_MAP = {
    zoom    : 't-zoom',
    curtain : 't-zoom',
    slideup : 't-slideup',
    flip    : 't-flip',
    blur    : 't-blur',
    ripple  : 't-ripple',
    rotate  : 't-rotate',
    slidelf : 't-slidelf'
  };

  function swapPage(targetId, cssClass) {
    pages.forEach(p => {
      p.classList.remove('active');
      p.className = 'page'; // reset transition classes
    });
    const target = document.getElementById(targetId);
    if (!target) return;
    target.classList.add('active');
    if (cssClass) target.classList.add(cssClass);

    // Post-page-switch hooks
    if (targetId === 'page-dashboard') animateRadial(68);
    if (targetId === 'page-calendar')  buildFullCalendar();
  }

  function triggerWipe(targetId, cssClass) {
    wipeBar.classList.remove('run');
    void wipeBar.offsetWidth; // reflow
    wipeBar.classList.add('run');
    setTimeout(() => swapPage(targetId, cssClass), 350);
    setTimeout(() => wipeBar.classList.remove('run'), 750);
  }

  function triggerCurtain(targetId, cssClass) {
    [curtainL, curtainR].forEach(el => { el.classList.remove('run'); void el.offsetWidth; el.classList.add('run'); });
    setTimeout(() => swapPage(targetId, cssClass), 375);
    setTimeout(() => [curtainL, curtainR].forEach(el => el.classList.remove('run')), 800);
  }

  function triggerRipple(targetId, cssClass, btn) {
    if (btn) {
      const r = btn.getBoundingClientRect();
      rippleEl.style.top  = `${r.top  + r.height / 2}px`;
      rippleEl.style.left = `${r.left + r.width  / 2}px`;
    }
    rippleEl.classList.remove('run');
    void rippleEl.offsetWidth;
    rippleEl.classList.add('run');
    setTimeout(() => swapPage(targetId, cssClass), 370);
    setTimeout(() => rippleEl.classList.remove('run'), 800);
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId   = btn.dataset.page;
      const transition = btn.dataset.transition || 'zoom';
      const cssClass   = CSS_CLASS_MAP[transition] || 't-zoom';
      const trigger    = TRANSITION_MAP[transition] || triggerWipe;

      const activePage = document.querySelector('.page.active');
      if (activePage && activePage.id === targetId) return;

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (transition === 'ripple') {
        trigger(targetId, cssClass, btn);
      } else {
        trigger(targetId, cssClass);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Radial Performance Ring Animation
  // ─────────────────────────────────────────────────────────────────────────
  function animateRadial(targetPct) {
    const path = document.getElementById('radial-prog-path');
    const txt  = document.getElementById('radial-prog-txt');
    if (!path || !txt) return;

    let cur = 0;
    const step = targetPct / 80;
    const tick = setInterval(() => {
      cur = Math.min(cur + step, targetPct);
      path.setAttribute('stroke-dasharray', `${cur.toFixed(1)}, 100`);
      txt.textContent = `${Math.round(cur)}%`;
      if (cur >= targetPct) clearInterval(tick);
    }, 12);
  }
  animateRadial(68);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Attendance Bar Chart (randomised weekly data)
  // ─────────────────────────────────────────────────────────────────────────
  const barGrid = document.getElementById('attendance-bar-grid');
  if (barGrid) {
    const days = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
    const subjectClasses = ['bar-math', 'bar-sci', 'bar-eng', 'bar-mat'];
    const heights = [
      [40, 60, 80, 55],
      [70, 45, 90, 60],
      [55, 80, 50, 75],
      [85, 55, 65, 40],
      [60, 90, 70, 55],
      [45, 55, 85, 65],
      [75, 65, 40, 80]
    ];
    days.forEach((_, i) => {
      const group = document.createElement('div');
      group.className = 'bar-group';
      subjectClasses.forEach((cls, j) => {
        const bar = document.createElement('div');
        bar.className = `bar ${cls}`;
        bar.style.height = '0px';
        group.appendChild(bar);
        setTimeout(() => { bar.style.height = `${heights[i][j]}px`; bar.style.transition = 'height 0.9s cubic-bezier(0.16,1,0.3,1)'; }, 150 + j * 60);
      });
      barGrid.appendChild(group);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Mini Calendar (right panel)
  // ─────────────────────────────────────────────────────────────────────────
  function buildMiniCal() {
    const grid = document.getElementById('mini-cal-grid');
    if (!grid) return;
    // Remove day-name spans (first 7 children)
    const names = Array.from(grid.children).slice(0, 7);

    // July 2024 starts on Monday (index=1 in 0=Sun system)
    const startDay = 1; // Monday
    const daysInMonth = 31;
    const today = 8; // 8 July 2024 (reference)
    const eventDays = [2, 5, 8, 11, 20, 24, 29];

    // Clear dynamically added cells
    while (grid.children.length > 7) grid.removeChild(grid.lastChild);

    // Empty prefix cells
    for (let i = 0; i < startDay; i++) {
      const e = document.createElement('div');
      e.className = 'cal-cell cal-empty';
      grid.appendChild(e);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.textContent = d;
      if (d === today) cell.classList.add('cal-today');
      if (eventDays.includes(d)) {
        const dot = document.createElement('span');
        dot.className = 'cal-dot';
        cell.appendChild(dot);
      }
      cell.addEventListener('click', () => {
        document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('cal-selected'));
        cell.classList.add('cal-selected');
      });
      grid.appendChild(cell);
    }
  }
  buildMiniCal();

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Full Calendar (page-calendar)
  // ─────────────────────────────────────────────────────────────────────────
  function buildFullCalendar() {
    const grid = document.getElementById('full-cal-grid');
    if (!grid) return;

    while (grid.children.length > 7) grid.removeChild(grid.lastChild);

    const startDay   = 1; // July 2024 starts Monday
    const daysInMonth = 31;
    const today      = 8;
    const eventDays  = [2, 5, 8, 11, 20, 24, 29];

    for (let i = 0; i < startDay; i++) {
      const e = document.createElement('div');
      e.className = 'full-cal-cell cal-empty';
      grid.appendChild(e);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'full-cal-cell';
      cell.textContent = d;
      if (d === today) cell.classList.add('cal-today');
      if (eventDays.includes(d)) cell.classList.add('has-event');
      cell.addEventListener('click', () => {
        document.querySelectorAll('.full-cal-cell').forEach(c => c.classList.remove('cal-selected'));
        cell.classList.add('cal-selected');
      });
      grid.appendChild(cell);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Task Checkbox Toggle Logic
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('.task-check').forEach(chk => {
    chk.addEventListener('click', () => {
      const isDone = chk.classList.toggle('done');
      chk.textContent = isDone ? '✓' : '';
      const badge = chk.closest('.task-item')?.querySelector('.task-badge');
      if (badge) {
        if (isDone) {
          badge.textContent = 'مُسلَّم';
          badge.className = 'task-badge badge-done';
        } else {
          badge.textContent = 'معلّق';
          badge.className = 'task-badge badge-pending';
        }
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Task Submit Form
  // ─────────────────────────────────────────────────────────────────────────
  const taskForm = document.getElementById('task-submit-form');
  if (taskForm) {
    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      const subject = document.getElementById('task-subject').value;
      alert(`✅ تم تسليم واجب مادة "${subject}" بنجاح!`);
      taskForm.reset();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Add Note
  // ─────────────────────────────────────────────────────────────────────────
  const addNoteBtn  = document.getElementById('btn-add-note');
  const notesGrid   = document.getElementById('notes-grid-container');
  const noteColors  = ['note-card-yellow', 'note-card-blue', 'note-card-green', 'note-card-rose'];
  let noteColorIdx  = 0;

  if (addNoteBtn && notesGrid) {
    addNoteBtn.addEventListener('click', () => {
      const title = prompt('عنوان المذكرة الجديدة:');
      if (!title) return;
      const body  = prompt('محتوى المذكرة:') || '...';
      const card  = document.createElement('div');
      const cls   = noteColors[noteColorIdx % noteColors.length];
      noteColorIdx++;
      const now = new Date();
      card.className = `note-card ${cls}`;
      card.innerHTML = `
        <h4 class="note-title">${title}</h4>
        <p class="note-body">${body}</p>
        <span class="note-time">${now.getDate()} يوليو ${now.getFullYear()}</span>`;
      notesGrid.prepend(card);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Audio Player Logic
  // ─────────────────────────────────────────────────────────────────────────
  const playBtn     = document.getElementById('btn-play-pause');
  const audioEq     = document.getElementById('audio-eq');
  const seekFill    = document.getElementById('audio-seek-fill');
  const elapsedLbl  = document.getElementById('audio-elapsed');
  const titleLbl    = document.getElementById('audio-track-title');
  const courseLbl   = document.getElementById('audio-track-course');
  const durLbl      = document.getElementById('audio-duration');
  const plItems     = document.querySelectorAll('.playlist-item');

  let isPlaying  = false;
  let seekPct    = 0;
  let playTick   = null;

  function setPlaying(val) {
    isPlaying = val;
    if (playBtn) playBtn.textContent = isPlaying ? '⏸' : '▶';
    if (audioEq) audioEq.classList.toggle('playing', isPlaying);
    if (isPlaying) {
      playTick = setInterval(() => {
        seekPct = Math.min(seekPct + 0.4, 100);
        if (seekFill) seekFill.style.width = `${seekPct}%`;
        const totalSec = 872;
        const cur = Math.floor((seekPct / 100) * totalSec);
        const m = Math.floor(cur / 60), s = cur % 60;
        if (elapsedLbl) elapsedLbl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (seekPct >= 100) setPlaying(false);
      }, 1000);
    } else {
      clearInterval(playTick);
    }
  }

  if (playBtn) playBtn.addEventListener('click', () => setPlaying(!isPlaying));

  plItems.forEach(item => {
    item.addEventListener('click', () => {
      plItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      if (titleLbl)  titleLbl.textContent  = item.dataset.title;
      if (courseLbl) courseLbl.textContent = item.dataset.course;
      if (durLbl)    durLbl.textContent    = item.dataset.duration;
      seekPct = 0;
      if (seekFill)   seekFill.style.width  = '0%';
      if (elapsedLbl) elapsedLbl.textContent = '٠:٠٠';
      if (isPlaying) { clearInterval(playTick); isPlaying = false; setPlaying(true); }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 10. Settings: Profile Save + Theme Color Picker
  // ─────────────────────────────────────────────────────────────────────────
  const settingsForm = document.getElementById('settings-profile-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', e => {
      e.preventDefault();
      const newName = document.getElementById('set-name').value;
      const nameEl  = document.getElementById('header-student-name');
      if (nameEl) nameEl.textContent = newName;
      alert(`✅ تم حفظ بيانات الملف الشخصي باسم "${newName}"`);
    });
  }

  const swatches = document.querySelectorAll('#theme-swatches .swatch');
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      const color = sw.dataset.color;
      document.documentElement.style.setProperty('--gold', color);
      // Derive lighter version for gold-bg (simplified)
      document.documentElement.style.setProperty('--gold-light', color + 'AA');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 11. Filter Pills generic toggle
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('.filter-pills').forEach(group => {
    group.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 12. Hero "Review now" button routes to tasks page
  // ─────────────────────────────────────────────────────────────────────────
  const heroBtn = document.getElementById('btn-hero-review');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const tasksNavBtn = document.querySelector('[data-page="page-tasks"]');
      if (tasksNavBtn) tasksNavBtn.click();
    });
  }

});
