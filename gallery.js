/* ============================================
   VibeGallery — Gallery Page Script
   ============================================ */

// ───── DOM Elements ─────
const galleryGrid = document.getElementById('gallery-grid');
const searchInput = document.getElementById('search-input');
const resultCount = document.getElementById('result-count');
const emptyState = document.getElementById('empty-state');
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxTags = document.getElementById('lightbox-tags');
const lightboxOpenBtn = document.getElementById('lightbox-open-btn');
const lightboxClose = document.getElementById('lightbox-close');

let currentFilter = 'all';
let currentLangFilter = 'all';
let currentView = 'grid';

// ───── Language display names & flag emojis ─────
const langMeta = {
    all: { label: 'All Languages', flag: '🌐' },
    en:  { label: 'English',       flag: '🇬🇧' },
    ar:  { label: 'Arabic',        flag: '🇸🇦' },
    zh:  { label: 'Chinese',       flag: '🇨🇳' },
    ja:  { label: 'Japanese',      flag: '🇯🇵' }
};

// ───── Create Card ─────
function createCard(item) {
    const card = document.createElement('article');
    card.className = 'editorial-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-lang', item.language);

    const labelTopLeft = item.category.toUpperCase();
    const labelTopRight = `👁️ ${item.stats.views.toUpperCase()}`;
    const labelBottomLeft = item.tags[0] ? item.tags[0].toUpperCase() : 'MINIMAL';
    const labelBottomRight = item.tags[1] ? item.tags[1].toUpperCase() : 'DESIGN';

    // Language badge for the card
    const meta = langMeta[item.language] || langMeta.en;
    const langBadge = `<span class="card-lang-badge" title="${meta.label}">${meta.flag}</span>`;

    card.innerHTML = `
        <div class="editorial-card-header">
            <span class="editorial-label-mini">${labelTopLeft}</span>
            <span class="editorial-label-mini">${labelTopRight}</span>
        </div>
        
        <h3 class="editorial-card-title">${item.title}</h3>
        
        <div class="editorial-image-container">
            <img src="${item.image}" alt="${item.title}" class="editorial-card-image" loading="lazy">
            <div class="editorial-emblem">${item.emoji}</div>
        </div>
        
        <div class="editorial-brand-mark">VIBEGALLERY</div>
        
        <div class="editorial-card-footer">
            <span class="editorial-label-mini">${labelBottomLeft}</span>
            <div class="editorial-footer-right">
                ${langBadge}
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="editorial-link-mini" onclick="event.stopPropagation();">
                    ${labelBottomRight} ›
                </a>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openLightbox(item));
    return card;
}

// ───── Render Gallery ─────
function renderGallery() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filtered = galleryData.filter(item => {
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        const matchesLang = currentLangFilter === 'all' || item.language === currentLangFilter;
        const matchesSearch = !searchTerm ||
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.language.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesLang && matchesSearch;
    });

    galleryGrid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        resultCount.textContent = 'No designs found';
    } else {
        emptyState.classList.add('hidden');
        const total = filtered.length;
        resultCount.textContent = `Showing ${total} design${total !== 1 ? 's' : ''}`;
        filtered.forEach(item => galleryGrid.appendChild(createCard(item)));
    }
}

// ───── Language Filter Pills ─────
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLangFilter = btn.dataset.lang;
        renderGallery();
    });
});

// ───── Sidebar Category Tabs ─────
document.querySelectorAll('.vertical-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.vertical-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderGallery();
    });
});

// ───── Search ─────
let searchDebounce;
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(renderGallery, 200);
});

// ───── View Toggle ─────
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        galleryGrid.classList.toggle('list-view', currentView === 'list');
    });
});

// ───── Lightbox ─────
function openLightbox(item) {
    const meta = langMeta[item.language] || langMeta.en;
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.description;
    lightboxCategory.textContent = item.category.toUpperCase();
    lightboxTags.textContent = item.tags.join(' · ');
    if (lightboxOpenBtn) lightboxOpenBtn.href = item.link;

    // Update language indicator in lightbox if present
    const langIndicator = document.getElementById('lightbox-lang');
    if (langIndicator) {
        langIndicator.textContent = `${meta.flag} ${meta.label}`;
    }

    lightboxOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightboxOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ───── Intersection Observer for Animations ─────
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Re-observe after render
function observeCards() {
    document.querySelectorAll('.editorial-card').forEach(el => {
        observer.observe(el);
    });
}

// ───── Initialize ─────
renderGallery();
observeCards();
