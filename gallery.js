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
let currentView = 'grid';

function createCard(item) {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-id', item.id);

    card.innerHTML = `
        <div class="card-image-wrap">
            <img src="${item.image}" alt="${item.title}" class="card-image-main" loading="lazy">
            <span class="card-badge-floating">
                <span class="badge-star">★</span> ${item.category}
            </span>
            <button class="card-favorite-btn" aria-label="Favorite design" onclick="event.stopPropagation(); this.classList.toggle('active');">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        </div>
        <div class="card-content-modern">
            <div class="card-header-row">
                <h3 class="card-title-modern">${item.title}</h3>
                <span class="card-price-modern">👁️ ${item.stats.views}</span>
            </div>
            <span class="card-subtitle-modern">${item.subtitle}</span>
            <p class="card-description-modern">${item.description}</p>
            
            <div class="card-specs-row">
                <span class="spec-item">
                    <span class="spec-icon">❤️</span>
                    <span class="spec-label">${item.stats.likes} Likes</span>
                </span>
                <span class="spec-item">
                    <span class="spec-icon">🔗</span>
                    <span class="spec-label">${item.stats.shares} Shares</span>
                </span>
                <span class="spec-item">
                    <span class="spec-icon">${item.emoji}</span>
                    <span class="spec-label">Vibe Avatar</span>
                </span>
            </div>

            <div class="card-tags-modern">
                ${item.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
            </div>

            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-action-btn" onclick="event.stopPropagation();">
                View Details
            </a>
        </div>
    `;

    // Card click opens lightbox
    card.addEventListener('click', () => openLightbox(item));

    return card;
}

// ───── Render Gallery ─────
function renderGallery() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Render ALL designs on catalog page matching query
    const filtered = galleryData.filter(item => {
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        const matchesSearch = !searchTerm ||
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            item.category.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    galleryGrid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        resultCount.textContent = 'No designs found';
    } else {
        emptyState.classList.add('hidden');
        resultCount.textContent = `Showing ${filtered.length} design${filtered.length !== 1 ? 's' : ''}`;
        filtered.forEach(item => galleryGrid.appendChild(createCard(item)));
    }
}

// ───── Sidebar Filter Vertical Tabs ─────
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
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.description;
    lightboxCategory.textContent = item.category;
    lightboxTags.textContent = item.tags.join(' · ');
    lightboxOpenBtn.href = item.link;
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
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe grid cards
document.querySelectorAll('.gallery-card').forEach(el => {
    observer.observe(el);
});

// ───── Initialize ─────
renderGallery();
