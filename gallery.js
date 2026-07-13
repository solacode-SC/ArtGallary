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

// ───── Pagination & Load More States ─────
let currentPage = 1;
const cardsPerPage = 8;
let loadedLimit = 8;
let interactionMode = 'pagination'; // 'pagination' or 'loadMore'

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
function resetPagination() {
    currentPage = 1;
    loadedLimit = 8;
    interactionMode = 'pagination';
}

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
    const loadMoreBtn = document.getElementById('load-more-btn');
    const paginationContainer = document.getElementById('pagination-container');

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        resultCount.textContent = 'No designs found';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (paginationContainer) paginationContainer.innerHTML = '';
    } else {
        emptyState.classList.add('hidden');
        const total = filtered.length;
        resultCount.textContent = `Showing ${total} design${total !== 1 ? 's' : ''}`;

        // Get subset of items to render
        let itemsToRender = [];
        if (interactionMode === 'pagination') {
            const start = (currentPage - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            itemsToRender = filtered.slice(start, end);
            
            // Show pagination, reset page numbers
            if (paginationContainer) {
                paginationContainer.style.display = 'flex';
                renderPagination(filtered.length);
            }
        } else {
            itemsToRender = filtered.slice(0, loadedLimit);
            // Hide pagination container, since we are appending
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
        }

        // Render cards
        itemsToRender.forEach(item => galleryGrid.appendChild(createCard(item)));

        // Handle "Load More" button visibility
        if (loadMoreBtn) {
            // Show load more only if there are remaining cards to load
            if (itemsToRender.length < filtered.length) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = `Load More (${filtered.length - itemsToRender.length} left)`;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
}

// Helper to render pagination controls
function renderPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / cardsPerPage);
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn pagination-arrow';
    prevBtn.innerHTML = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            interactionMode = 'pagination';
            renderGallery();
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        }
    });
    paginationContainer.appendChild(prevBtn);

    // Page Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${currentPage === i ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            if (currentPage !== i) {
                currentPage = i;
                interactionMode = 'pagination';
                renderGallery();
                document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn pagination-arrow';
    nextBtn.innerHTML = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            interactionMode = 'pagination';
            renderGallery();
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// ───── Language Filter Pills ─────
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLangFilter = btn.dataset.lang;
        resetPagination();
        renderGallery();
    });
});

// ───── Sidebar Category Tabs ─────
document.querySelectorAll('.vertical-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.vertical-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        resetPagination();
        renderGallery();
    });
});

// ───── Search ─────
let searchDebounce;
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
        resetPagination();
        renderGallery();
    }, 200);
});

// ───── View Toggle ─────
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        galleryGrid.classList.toggle('list-view', currentView === 'list');
        resetPagination();
        renderGallery();
    });
});

// ───── Load More Button Listener ─────
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        interactionMode = 'loadMore';
        loadedLimit += cardsPerPage;
        renderGallery();
    });
}

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

// ───── Notion Sidebar Interaction & Shortcuts ─────

// Collapsible Sections logic
const sections = [
    { headerId: 'header-categories', contentId: 'content-categories' },
    { headerId: 'header-languages', contentId: 'content-languages' }
];

sections.forEach(sec => {
    const header = document.getElementById(sec.headerId);
    const content = document.getElementById(sec.contentId);
    if (header && content) {
        // Initialize as active
        header.classList.add('active');
        content.classList.add('active');

        header.addEventListener('click', () => {
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
    }
});

// Sidebar Collapse / Expand logic
const appLayout = document.querySelector('.app-layout');
const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
const sidebarExpandBtn = document.getElementById('sidebar-expand-btn');
const headerSidebarToggle = document.getElementById('header-sidebar-toggle');

if (appLayout && sidebarCollapseBtn && sidebarExpandBtn) {
    // Read initial state from localStorage, default to collapsed on mobile
    const isMobile = window.innerWidth <= 1024;
    let isCollapsed = localStorage.getItem('sidebar-collapsed');
    
    if (isCollapsed === null) {
        isCollapsed = isMobile;
        localStorage.setItem('sidebar-collapsed', isCollapsed ? 'true' : 'false');
    } else {
        isCollapsed = isCollapsed === 'true';
    }

    if (isCollapsed) {
        appLayout.classList.add('sidebar-collapsed');
    }

    sidebarCollapseBtn.addEventListener('click', () => {
        appLayout.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebar-collapsed', 'true');
    });

    const expandSidebar = () => {
        appLayout.classList.remove('sidebar-collapsed');
        localStorage.setItem('sidebar-collapsed', 'false');
    };

    sidebarExpandBtn.addEventListener('click', expandSidebar);
    if (headerSidebarToggle) {
        headerSidebarToggle.addEventListener('click', expandSidebar);
    }

    // Sidebar Mobile Overlay Backdrop click listener
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            appLayout.classList.add('sidebar-collapsed');
            localStorage.setItem('sidebar-collapsed', 'true');
        });
    }
}

// Keyboard shortcut to focus search input (pressing "/")
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});

// ───── Parse Query String Filter on Load ─────
const urlParams = new URLSearchParams(window.location.search);
const filterParam = urlParams.get('filter');
const langParam = urlParams.get('lang');

if (filterParam) {
    currentFilter = filterParam;
    // Update active tab in the sidebar
    document.querySelectorAll('.vertical-tab').forEach(tab => {
        if (tab.dataset.filter === filterParam) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

if (langParam) {
    currentLangFilter = langParam;
    // Update active language button in the sidebar
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === langParam) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ───── Initialize ─────
renderGallery();
observeCards();
