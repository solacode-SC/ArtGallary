// ─────────────────────────────────────────────────────────────
// GAME WARDROBE AR — main.js (no ES modules, plain script)
// Arabic RTL Character Customization UI — Full Fix
// ─────────────────────────────────────────────────────────────

// ── DATA ────────────────────────────────────────────────────
var CATEGORIES = [
    { id: 'all',         label: 'الكل',            icon: '🎪' },
    { id: 'hats',        label: 'القبعات',          icon: '🎩' },
    { id: 'outfits',     label: 'الأزياء',          icon: '👗' },
    { id: 'shoes',       label: 'الأحذية',          icon: '👟' },
    { id: 'bags',        label: 'الحقائب',          icon: '🎒' },
    { id: 'accessories', label: 'الإكسسوارات',      icon: '💍' },
];

var ITEMS = [
    // ── HATS ──
    { id: 'hat-1', name: 'قبعة الساحرة',       cat: 'hats',        emoji: '🎩', equipped: false, locked: false, rarity: 'rare' },
    { id: 'hat-2', name: 'برنيطة البحر',        cat: 'hats',        emoji: '⛑️', equipped: false, locked: false, rarity: '' },
    { id: 'hat-3', name: 'قبعة المستكشفة',      cat: 'hats',        emoji: '🪖', equipped: true,  locked: false, rarity: '' },
    { id: 'hat-4', name: 'ريبون الوردي',         cat: 'hats',        emoji: '🎀', equipped: false, locked: false, rarity: 'new' },
    { id: 'hat-5', name: 'آذان القطة',           cat: 'hats',        emoji: '🐱', equipped: false, locked: false, rarity: 'hot' },
    { id: 'hat-6', name: 'قبعة البحار',          cat: 'hats',        emoji: '🛟', equipped: false, locked: true,  rarity: '' },

    // ── OUTFITS ──
    { id: 'out-1', name: 'فستان غوطي',           cat: 'outfits',     emoji: '🖤', equipped: false, locked: false, rarity: 'rare' },
    { id: 'out-2', name: 'بدلة المدرسة',          cat: 'outfits',     emoji: '📚', equipped: false, locked: false, rarity: '' },
    { id: 'out-3', name: 'معطف الشتاء',           cat: 'outfits',     emoji: '🌸', equipped: false, locked: false, rarity: '' },
    { id: 'out-4', name: 'زي المغامرة',           cat: 'outfits',     emoji: '🗺️', equipped: true,  locked: false, rarity: '' },
    { id: 'out-5', name: 'معطف المطر',             cat: 'outfits',     emoji: '☔', equipped: false, locked: false, rarity: 'new' },
    { id: 'out-6', name: 'فستان الصيف',            cat: 'outfits',     emoji: '☀️', equipped: false, locked: true,  rarity: '' },

    // ── SHOES ──
    { id: 'sho-1', name: 'أحذية المستكشفة',       cat: 'shoes',       emoji: '👢', equipped: true,  locked: false, rarity: '' },
    { id: 'sho-2', name: 'حذاء ماري جاين',         cat: 'shoes',       emoji: '🩰', equipped: false, locked: false, rarity: '' },
    { id: 'sho-3', name: 'كوتشي أبيض وردي',         cat: 'shoes',       emoji: '👟', equipped: false, locked: false, rarity: 'hot' },
    { id: 'sho-4', name: 'بوت برتقالي',             cat: 'shoes',       emoji: '🥾', equipped: false, locked: true,  rarity: '' },

    // ── BAGS ──
    { id: 'bag-1', name: 'حقيبة ظهر المغامرة',    cat: 'bags',        emoji: '🎒', equipped: false, locked: false, rarity: '' },
    { id: 'bag-2', name: 'حقيبة الكتف الوردية',    cat: 'bags',        emoji: '👜', equipped: false, locked: false, rarity: 'new' },
    { id: 'bag-3', name: 'صندوق الكنز',             cat: 'bags',        emoji: '💼', equipped: false, locked: true,  rarity: 'rare' },

    // ── ACCESSORIES ──
    { id: 'acc-1', name: 'نظارات ذهبية',            cat: 'accessories', emoji: '🥽', equipped: true,  locked: false, rarity: '' },
    { id: 'acc-2', name: 'قلادة النجوم',             cat: 'accessories', emoji: '⭐', equipped: false, locked: false, rarity: '' },
    { id: 'acc-3', name: 'سوار الزهور',              cat: 'accessories', emoji: '💐', equipped: false, locked: false, rarity: 'hot' },
    { id: 'acc-4', name: 'طوق القطة',                cat: 'accessories', emoji: '🐈', equipped: false, locked: true,  rarity: '' },
];

// ── State ────────────────────────────────────────────────────
var state = {
    activeCat:    'all',
    selectedId:   null,
    favorites:    [],   // array of item IDs
    searchQuery:  '',
};

// ── DOM refs ─────────────────────────────────────────────────
var catStrip    = document.getElementById('cat-strip');
var itemsGrid   = document.getElementById('items-grid');
var emptyState  = document.getElementById('empty-state');
var searchInput = document.getElementById('search-input');
var selLabel    = document.getElementById('sel-label');
var selDot      = document.getElementById('sel-dot');
var equippedName= document.getElementById('equipped-name');
var btnFav      = document.getElementById('btn-fav');
var favIcon     = document.getElementById('fav-icon');
var btnSave     = document.getElementById('btn-save');
var toast       = document.getElementById('toast');
var toastMsg    = document.getElementById('toast-msg');
var charImg     = document.getElementById('char-img');
var charFb      = document.getElementById('char-fallback');
var helpBtn     = document.getElementById('help-btn');
var modalWrap   = document.getElementById('modal-wrap');
var modalClose  = document.getElementById('modal-close');
var modalOk     = document.getElementById('modal-ok');
var btnRotR     = document.getElementById('btn-rot-r');
var btnRotL     = document.getElementById('btn-rot-l');
var btnZoom     = document.getElementById('btn-zoom');

// ── Helper: get item by id ────────────────────────────────────
function getItem(id) {
    for (var i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].id === id) return ITEMS[i];
    }
    return null;
}

// ── Build category tabs ───────────────────────────────────────
function buildCats() {
    catStrip.innerHTML = '';
    CATEGORIES.forEach(function(cat) {
        var btn = document.createElement('button');
        btn.className = 'cat-tab' + (cat.id === state.activeCat ? ' active' : '');
        btn.dataset.id = cat.id;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', cat.id === state.activeCat ? 'true' : 'false');
        btn.setAttribute('aria-label', 'فئة ' + cat.label);
        btn.innerHTML = '<span class="tab-icon">' + cat.icon + '</span><span>' + cat.label + '</span>';
        btn.addEventListener('click', function() { selectCat(cat.id); });
        catStrip.appendChild(btn);
    });
}

// ── Select category ───────────────────────────────────────────
function selectCat(id) {
    state.activeCat = id;
    // Update tab UI
    var tabs = catStrip.querySelectorAll('.cat-tab');
    tabs.forEach(function(t) {
        var isActive = t.dataset.id === id;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderGrid();
}

// ── Render items grid ─────────────────────────────────────────
function renderGrid() {
    itemsGrid.innerHTML = '';

    // Filter items
    var filtered = ITEMS.filter(function(item) {
        var catOk    = state.activeCat === 'all' || item.cat === state.activeCat;
        var searchOk = !state.searchQuery || item.name.indexOf(state.searchQuery) !== -1;
        return catOk && searchOk;
    });

    // Toggle empty state
    if (filtered.length === 0) {
        emptyState.style.display = 'flex';
        itemsGrid.style.display  = 'none';
        return;
    }
    emptyState.style.display = 'none';
    itemsGrid.style.display  = '';

    // Build cards
    filtered.forEach(function(item, i) {
        var card = document.createElement('div');

        // CSS classes
        var classes = ['item-card'];
        if (item.equipped)           classes.push('is-equipped');
        if (item.locked)             classes.push('is-locked');
        if (state.selectedId === item.id) classes.push('is-selected');
        card.className = classes.join(' ');

        card.setAttribute('role', 'listitem');
        card.setAttribute('tabindex', item.locked ? '-1' : '0');
        card.setAttribute('aria-label', item.name + (item.equipped ? ' — مُرتدى حالياً' : '') + (item.locked ? ' — مقفل' : ''));

        // Rarity badge
        var rarityHtml = '';
        if (item.rarity === 'rare') rarityHtml = '<span class="card-rarity rarity-rare">نادر</span>';
        else if (item.rarity === 'new') rarityHtml = '<span class="card-rarity rarity-new">جديد</span>';
        else if (item.rarity === 'hot') rarityHtml = '<span class="card-rarity rarity-hot">🔥</span>';

        card.innerHTML =
            rarityHtml +
            '<div class="card-emoji">' + item.emoji + '</div>' +
            '<div class="card-name">'  + item.name  + '</div>';

        // Entrance animation
        card.style.opacity   = '0';
        card.style.animation = 'card-in 0.3s var(--ease-b) ' + (i * 40) + 'ms both';

        // Events
        if (!item.locked) {
            card.addEventListener('click', function() { selectItem(item.id); });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectItem(item.id);
                }
            });
        } else {
            card.addEventListener('click', function() {
                showToast('🔒 هذا الزي غير متاح بعد', 'rgba(180,80,80,0.95)');
            });
        }

        itemsGrid.appendChild(card);
    });
}

// ── Select item ───────────────────────────────────────────────
function selectItem(id) {
    state.selectedId = id;
    var item = getItem(id);

    // Update bottom bar
    if (selLabel) selLabel.textContent = item ? ('تم اختيار: ' + item.name) : 'لم يُختَر أي زي';
    if (selDot)   selDot.classList.toggle('active', !!item);

    // Update fav button
    updateFavBtn();

    // Trigger character bounce
    triggerCharAnim('anim-bounce');

    // Re-render grid (to update selection outline)
    renderGrid();
}

// ── Favorite toggle ───────────────────────────────────────────
function isFav(id) {
    return state.favorites.indexOf(id) !== -1;
}
function updateFavBtn() {
    if (!btnFav || !favIcon) return;
    var id  = state.selectedId;
    var fav = id && isFav(id);
    btnFav.setAttribute('aria-pressed', fav ? 'true' : 'false');
    favIcon.textContent = fav ? '❤️' : '🤍';
}

if (btnFav) {
    btnFav.addEventListener('click', function() {
        if (!state.selectedId) {
            showToast('💛 اختر زياً أولاً لإضافته للمفضلة', 'rgba(200,140,40,0.95)');
            return;
        }
        var id  = state.selectedId;
        var idx = state.favorites.indexOf(id);
        if (idx === -1) {
            state.favorites.push(id);
            showToast('💛 تمت الإضافة إلى الأزياء المفضلة!', 'rgba(200,160,30,0.95)');
        } else {
            state.favorites.splice(idx, 1);
            showToast('💔 تمت الإزالة من المفضلة', 'rgba(200,80,100,0.95)');
        }
        updateFavBtn();
    });
}

// ── Save ──────────────────────────────────────────────────────
if (btnSave) {
    btnSave.addEventListener('click', function() {
        if (!state.selectedId) {
            showToast('⚠️ اختر زياً أولاً من القائمة', 'rgba(200,140,40,0.95)');
            return;
        }
        var item = getItem(state.selectedId);
        if (!item) return;

        // Mark as equipped in same category, unequip others
        ITEMS.forEach(function(it) {
            if (it.cat === item.cat) it.equipped = (it.id === item.id);
        });

        // Update equipped badge
        if (equippedName) equippedName.textContent = item.name;

        // Character bounce
        triggerCharAnim('anim-bounce');

        showToast('✨ تم حفظ "' + item.name + '" بنجاح!', 'rgba(60,160,60,0.95)');
        renderGrid();
    });
}

// ── Rotate buttons ────────────────────────────────────────────
if (btnRotR) {
    btnRotR.addEventListener('click', function() { triggerCharAnim('anim-spin'); });
}
if (btnRotL) {
    btnRotL.addEventListener('click', function() {
        var el = charImg && charImg.style.display !== 'none' ? charImg : charFb;
        if (!el) return;
        el.style.transform = 'scaleX(-1)';
        setTimeout(function() { el.style.transform = ''; }, 600);
    });
}
if (btnZoom) {
    btnZoom.addEventListener('click', function() {
        var el = charImg && charImg.style.display !== 'none' ? charImg : charFb;
        if (!el) return;
        el.style.transform = 'scale(1.18)';
        setTimeout(function() { el.style.transform = ''; }, 600);
    });
}

// ── Character animation helper ────────────────────────────────
function triggerCharAnim(cls) {
    var el = (charImg && charImg.style.display !== 'none') ? charImg : charFb;
    if (!el) return;
    el.classList.remove('anim-bounce', 'anim-spin');
    // Force reflow
    void el.offsetWidth;
    el.classList.add(cls);
    el.addEventListener('animationend', function handler() {
        el.classList.remove(cls);
        el.removeEventListener('animationend', handler);
    });
}

// ── Search ────────────────────────────────────────────────────
if (searchInput) {
    searchInput.addEventListener('input', function() {
        state.searchQuery = searchInput.value.trim();
        renderGrid();
    });
}

// ── Toast ─────────────────────────────────────────────────────
var toastTimer = null;
function showToast(message, bg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.style.background = bg || 'rgba(60,160,60,0.95)';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3200);
}

// ── Modal ─────────────────────────────────────────────────────
function openModal() {
    if (!modalWrap) return;
    modalWrap.style.display = 'flex';
    modalWrap.removeAttribute('hidden');
}
function closeModal() {
    if (!modalWrap) return;
    modalWrap.style.display = 'none';
}
if (helpBtn)   helpBtn.addEventListener('click', openModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOk)   modalOk.addEventListener('click', closeModal);
if (modalWrap) {
    modalWrap.addEventListener('click', function(e) {
        if (e.target === modalWrap) closeModal();
    });
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// ── Keyboard nav inside grid ──────────────────────────────────
if (itemsGrid) {
    itemsGrid.addEventListener('keydown', function(e) {
        var cards = Array.from(itemsGrid.querySelectorAll('.item-card:not(.is-locked)'));
        var focused = document.activeElement;
        var idx = cards.indexOf(focused);
        if (idx === -1) return;

        var cols = window.innerWidth <= 680 ? 4 : 4;
        var next = -1;
        if (e.key === 'ArrowLeft')  next = idx + 1;
        if (e.key === 'ArrowRight') next = idx - 1;
        if (e.key === 'ArrowDown')  next = idx + cols;
        if (e.key === 'ArrowUp')    next = idx - cols;

        if (next >= 0 && next < cards.length) {
            e.preventDefault();
            cards[next].focus();
        }
    });
}

// ── Init ──────────────────────────────────────────────────────
buildCats();
renderGrid();
