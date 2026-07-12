/* ============================================
   VibeGallery — Design Museum
   JavaScript Application
   ============================================ */

// ───── Gallery Data ─────
const galleryData = [
    {
        id: 1,
        title: "Analytics Dashboard",
        subtitle: "Dashboard Design",
        description: "A modern, sleek dark-themed dashboard with analytics charts, sidebar navigation, and gradient purple-blue accents. Built for real-time data visualization.",
        image: "assets/images/dashboard_design.jpg",
        category: "dashboard",
        tags: ["Dark UI", "Charts", "Analytics"],
        link: "#",
        stats: { views: "1.2k", likes: "489", shares: "87" },
        emoji: "📊"
    },
    {
        id: 2,
        title: "ShopVibe E-Commerce",
        subtitle: "E-Commerce Platform",
        description: "Beautiful e-commerce website with product cards, hero sections, and shopping cart UI. Warm coral and peach color palette for a premium shopping experience.",
        image: "assets/images/ecommerce_design.jpg",
        category: "ecommerce",
        tags: ["Shopping", "Product Cards", "Warm Palette"],
        link: "#",
        stats: { views: "2.4k", likes: "812", shares: "156" },
        emoji: "🛍️"
    },
    {
        id: 3,
        title: "Creative Studio Portfolio",
        subtitle: "Agency Portfolio",
        description: "A creative portfolio with bold typography, project thumbnail grid, and dark background with neon green accents. Designed to showcase creative work beautifully.",
        image: "assets/images/portfolio_design.jpg",
        category: "landing",
        tags: ["Portfolio", "Dark Mode", "Neon"],
        link: "#",
        stats: { views: "987", likes: "345", shares: "64" },
        emoji: "🎨"
    },
    {
        id: 4,
        title: "CloudSync SaaS Landing",
        subtitle: "Landing Page",
        description: "Stunning SaaS landing page with a bold hero section, floating 3D elements, gradient mesh background, and call-to-action buttons. Designed for modern startups.",
        image: "assets/images/landing_design.jpg",
        category: "landing",
        tags: ["SaaS", "3D Elements", "Gradient Mesh"],
        link: "#",
        stats: { views: "3.1k", likes: "1.1k", shares: "234" },
        emoji: "☁️"
    },
    {
        id: 5,
        title: "ConnectHub Social Platform",
        subtitle: "Social Web App",
        description: "Modern social media platform with feed layout, user profile cards, stories bar, and messaging sidebar. Clean white and teal color scheme with rounded UI elements.",
        image: "assets/images/social_design.jpg",
        category: "app",
        tags: ["Social Media", "Feed", "Teal UI"],
        link: "#",
        stats: { views: "1.8k", likes: "623", shares: "112" },
        emoji: "💬"
    },
    {
        id: 6,
        title: "SoundWave Music App",
        subtitle: "Music Streaming",
        description: "Dark-themed music streaming app with album art grid, now-playing bar, sidebar playlist, and waveform visualizer. Deep purple and magenta gradient design.",
        image: "assets/images/music_design.jpg",
        category: "app",
        tags: ["Music", "Streaming", "Dark Mode"],
        link: "#",
        stats: { views: "2.1k", likes: "756", shares: "143" },
        emoji: "🎵"
    }
];

// ───── DOM Elements ─────
const galleryGrid = document.getElementById('gallery-grid');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const navbar = document.getElementById('navbar');
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

// ───── Theme Management ─────
function initTheme() {
    const saved = localStorage.getItem('vibegallery-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vibegallery-theme', next);
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// ───── Navbar Scroll Effect ─────
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.classList.toggle('scrolled', scrollTop > 20);
    lastScroll = scrollTop;
}, { passive: true });

// ───── Create Card HTML ─────
function createCard(item) {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-id', item.id);

    card.innerHTML = `
        <div class="card-images">
            <img src="${item.image}" alt="${item.title}" class="card-image-main" loading="lazy">
            <span class="card-category-badge">${item.category}</span>
            <div class="card-avatar">${item.emoji}</div>
        </div>
        <div class="card-body">
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <span class="card-subtitle">${item.subtitle}</span>
                <p class="card-description">${item.description}</p>
                <div class="card-tags">
                    ${item.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
                <div class="card-stats">
                    <div class="card-stat">
                        <span class="card-stat-value">${item.stats.views}</span>
                        <span class="card-stat-label">Views</span>
                    </div>
                    <div class="card-stat">
                        <span class="card-stat-value">${item.stats.likes}</span>
                        <span class="card-stat-label">Likes</span>
                    </div>
                    <div class="card-stat">
                        <span class="card-stat-value">${item.stats.shares}</span>
                        <span class="card-stat-label">Shares</span>
                    </div>
                </div>
            </div>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-open-btn" data-link="${item.link}" onclick="event.stopPropagation();">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Open in New Tab
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

// ───── Filter Tabs ─────
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
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

// ───── Animate Stats on Scroll ─────
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            if (target >= 1000) {
                counter.textContent = (current / 1000).toFixed(1) + 'k';
            } else {
                counter.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target >= 1000) {
                    counter.textContent = (target / 1000).toFixed(1) + 'k';
                } else {
                    counter.textContent = target;
                }
            }
        }

        requestAnimationFrame(update);
    });
}

// ───── Intersection Observer for Animations ─────
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.hero-stats, .gallery-card').forEach(el => {
    observer.observe(el);
});

// ───── Initialize ─────
renderGallery();
animateCounters();
