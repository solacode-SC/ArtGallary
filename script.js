/* ============================================
   VibeGallery — Design Museum
   JavaScript Application
   ============================================ */

// galleryData loaded from data.js


// ───── DOM Elements ─────
const galleryGrid = document.getElementById('gallery-grid');
const searchInput = document.getElementById('search-input');
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

// ───── Navbar Scroll Effect ─────
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.classList.toggle('scrolled', scrollTop > 400);
    lastScroll = scrollTop;
}, { passive: true });

// ───── Create Card HTML ─────
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
    if (!galleryGrid) return;
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

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
        if (emptyState) emptyState.classList.remove('hidden');
        if (resultCount) resultCount.textContent = 'No designs found';
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (resultCount) resultCount.textContent = `Showing ${filtered.length} design${filtered.length !== 1 ? 's' : ''}`;
        filtered.forEach(item => galleryGrid.appendChild(createCard(item)));
    }
}

// ───── Filter Tabs ─────
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        window.location.href = `gallery.html?filter=${filter}`;
    });
});

// ───── Search ─────
let searchDebounce;
if (searchInput) {
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(renderGallery, 200);
    });
}

// ───── View Toggle ─────
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        if (galleryGrid) galleryGrid.classList.toggle('list-view', currentView === 'list');
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
renderEditorialGallery();
animateCounters();

// ═══════════════════════════════════════════════
//  Japanese Art Inspired Hero Motion Background
// ═══════════════════════════════════════════════

(function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, dpr;
    let animationId;
    let time = 0;

    // ── Color palettes inspired by Japanese art (redesigned with cozy dashboard tones) ──
    const palettes = {
        // Sage, terracotta, indigo-blue, mustard yellow, and warm clay
        waves: [
            'rgba(140, 174, 104, 0.32)',  // Sage Green
            'rgba(196, 124, 105, 0.28)',  // Warm Terracotta
            'rgba(92, 124, 158, 0.28)',   // Muted Indigo Blue
            'rgba(211, 178, 111, 0.28)',  // Mustard Gold
            'rgba(67, 52, 34, 0.18)',     // Cozy Coffee Brown
            'rgba(244, 239, 225, 0.35)',  // Warm Cream
        ],
        // Ink-wash stroke colors
        strokes: [
            'rgba(140, 174, 104, 0.12)',
            'rgba(196, 124, 105, 0.12)',
            'rgba(92, 124, 158, 0.12)',
            'rgba(211, 178, 111, 0.12)',
            'rgba(67, 52, 34, 0.08)',
        ],
        // Cherry blossom petal colors (warm peach & sakura)
        petals: [
            'rgba(255, 183, 197, 0.65)',
            'rgba(255, 204, 213, 0.55)',
            'rgba(196, 124, 105, 0.45)',  // Warm Terracotta-tinged petal
            'rgba(255, 218, 224, 0.5)',
            'rgba(240, 142, 168, 0.45)',
        ]
    };

    // ── Resize handler ──
    function resize() {
        const hero = document.getElementById('hero');
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = hero.offsetWidth;
        height = hero.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', () => {
        resize();
    });
    resize();

    // ── Flowing Wave Lines (Hokusai Great Wave inspired) ──
    class WaveLine {
        constructor(index, total) {
            this.index = index;
            this.total = total;
            this.baseY = (height * 0.15) + (height * 0.7) * (index / total);
            this.amplitude = 20 + Math.random() * 40;
            this.frequency = 0.002 + Math.random() * 0.003;
            this.speed = 0.3 + Math.random() * 0.5;
            this.phase = Math.random() * Math.PI * 2;
            this.lineWidth = 1 + Math.random() * 2;
            this.color = palettes.waves[index % palettes.waves.length];
            // Secondary wave for organic feel
            this.amp2 = 8 + Math.random() * 15;
            this.freq2 = 0.005 + Math.random() * 0.004;
            this.speed2 = 0.6 + Math.random() * 0.8;
        }

        draw(t) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';

            const segments = Math.ceil(width / 3);
            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * (width + 40) - 20;
                const normalX = x / width;

                // Primary wave
                const y1 = Math.sin((x * this.frequency) + (t * this.speed * 0.01) + this.phase) * this.amplitude;
                // Secondary organic wave
                const y2 = Math.sin((x * this.freq2) + (t * this.speed2 * 0.01) + this.phase * 1.5) * this.amp2;
                // Gentle envelope to taper at edges
                const envelope = Math.sin(normalX * Math.PI) * 0.8 + 0.2;

                const y = this.baseY + (y1 + y2) * envelope;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }

    // ── Cherry Blossom Petals ──
    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -20;
            this.size = 3 + Math.random() * 6;
            this.speedY = 0.3 + Math.random() * 0.8;
            this.speedX = -0.3 + Math.random() * 0.6;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.wobbleAmp = 15 + Math.random() * 25;
            this.wobbleFreq = 0.01 + Math.random() * 0.02;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.color = palettes.petals[Math.floor(Math.random() * palettes.petals.length)];
            this.opacity = 0.3 + Math.random() * 0.5;
        }

        update(t) {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(t * this.wobbleFreq + this.wobblePhase) * 0.4;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Petal shape — two bezier curves forming a teardrop
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(
                this.size * 0.8, -this.size * 0.5,
                this.size * 0.8, this.size * 0.5,
                0, this.size * 0.6
            );
            ctx.bezierCurveTo(
                -this.size * 0.8, this.size * 0.5,
                -this.size * 0.8, -this.size * 0.5,
                0, -this.size
            );
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    // ── Ink-Brush Flowing Curves (sumi-e inspired) ──
    class InkCurve {
        constructor(index) {
            this.index = index;
            this.reset();
        }

        reset() {
            // Start from a random edge
            const side = Math.floor(Math.random() * 2);
            if (side === 0) {
                this.startX = -50;
                this.endX = width + 50;
            } else {
                this.startX = width + 50;
                this.endX = -50;
            }
            this.startY = height * 0.2 + Math.random() * height * 0.6;
            this.endY = height * 0.2 + Math.random() * height * 0.6;
            this.cp1x = width * 0.2 + Math.random() * width * 0.3;
            this.cp1y = Math.random() * height;
            this.cp2x = width * 0.5 + Math.random() * width * 0.3;
            this.cp2y = Math.random() * height;
            this.progress = 0;
            this.speed = 0.001 + Math.random() * 0.002;
            this.lineWidth = 1 + Math.random() * 3;
            this.color = palettes.strokes[this.index % palettes.strokes.length];
            this.life = 0;
            this.maxLife = 300 + Math.random() * 400;
        }

        update() {
            this.life++;
            if (this.progress < 1) {
                this.progress += this.speed;
            }
            if (this.life > this.maxLife) {
                this.reset();
            }
        }

        draw() {
            // Fade in and out
            let fade = 1;
            if (this.life < 60) {
                fade = this.life / 60;
            } else if (this.life > this.maxLife - 60) {
                fade = (this.maxLife - this.life) / 60;
            }

            ctx.save();
            ctx.globalAlpha = fade;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';

            // Draw the bezier up to current progress
            const steps = Math.floor(this.progress * 80);
            for (let i = 0; i <= steps; i++) {
                const t = i / 80;
                const u = 1 - t;
                const x = u*u*u*this.startX + 3*u*u*t*this.cp1x + 3*u*t*t*this.cp2x + t*t*t*this.endX;
                const y = u*u*u*this.startY + 3*u*u*t*this.cp1y + 3*u*t*t*this.cp2y + t*t*t*this.endY;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    // ── Ensō Circles (Zen circles) ──
    class Enso {
        constructor(index) {
            this.index = index;
            this.reset();
        }

        reset() {
            this.cx = width * 0.15 + Math.random() * width * 0.7;
            this.cy = height * 0.2 + Math.random() * height * 0.6;
            this.radius = 30 + Math.random() * 80;
            this.startAngle = Math.random() * Math.PI * 2;
            this.gapSize = 0.3 + Math.random() * 0.8; // gap in the circle (Ensō style)
            this.progress = 0;
            this.speed = 0.004 + Math.random() * 0.004;
            this.lineWidth = 1.5 + Math.random() * 2;
            this.color = palettes.strokes[this.index % palettes.strokes.length];
            this.life = 0;
            this.maxLife = 400 + Math.random() * 300;
            this.rotationOffset = Math.random() * 0.001;
        }

        update(t) {
            this.life++;
            if (this.progress < 1) {
                this.progress = Math.min(1, this.progress + this.speed);
            }
            if (this.life > this.maxLife) {
                this.reset();
            }
        }

        draw(t) {
            let fade = 1;
            if (this.life < 80) {
                fade = this.life / 80;
            } else if (this.life > this.maxLife - 80) {
                fade = (this.maxLife - this.life) / 80;
            }

            ctx.save();
            ctx.globalAlpha = fade * 0.6;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';

            const totalArc = (Math.PI * 2) - this.gapSize;
            const drawArc = totalArc * this.progress;
            const dynamicStart = this.startAngle + t * this.rotationOffset;

            ctx.arc(this.cx, this.cy, this.radius, dynamicStart, dynamicStart + drawArc);
            ctx.stroke();

            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    // ── Create all elements ──
    const waveCount = 8;
    const petalCount = 25;
    const inkCurveCount = 4;
    const ensoCount = 3;

    let waves = [];
    let petals = [];
    let inkCurves = [];
    let ensos = [];

    function createElements() {
        waves = [];
        petals = [];
        inkCurves = [];
        ensos = [];

        for (let i = 0; i < waveCount; i++) {
            waves.push(new WaveLine(i, waveCount));
        }
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }
        for (let i = 0; i < inkCurveCount; i++) {
            inkCurves.push(new InkCurve(i));
        }
        for (let i = 0; i < ensoCount; i++) {
            ensos.push(new Enso(i));
        }
    }

    createElements();

    // Re-create on significant resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            createElements();
        }, 250);
    });

    // ── Animation Loop ──
    function animate() {
        time++;
        ctx.clearRect(0, 0, width, height);

        // Draw wave lines
        waves.forEach(w => w.draw(time));

        // Draw ink curves
        inkCurves.forEach(c => {
            c.update();
            c.draw();
        });

        // Draw ensō circles
        ensos.forEach(e => {
            e.update(time);
            e.draw(time);
        });

        // Draw petals on top
        petals.forEach(p => {
            p.update(time);
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // ── Visibility-based start/stop for performance ──
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.05 });

    heroObserver.observe(document.getElementById('hero'));

    // Start immediately
    animate();
})();

// ───── 3D Ambient Background Parallax Decoration ─────
(function initAmbientParallax() {
    const gallerySection = document.getElementById('gallery-section');
    if (!gallerySection) return;

    const shapes = gallerySection.querySelectorAll('.decor-shape');

    gallerySection.addEventListener('mousemove', (e) => {
        const rect = gallerySection.getBoundingClientRect();
        // Mouse coordinate mapping relative to center of the gallery container
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        shapes.forEach((shape, index) => {
            // Apply different shift factors and 3D rotations based on shape depth
            const factor = (index + 1) * 0.035;
            const tiltX = (y / rect.height) * 20 * (index + 1);
            const tiltY = -(x / rect.width) * 20 * (index + 1);
            
            shape.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
    });

    // Reset shapes gently on mouse leave
    gallerySection.addEventListener('mouseleave', () => {
        shapes.forEach((shape) => {
            shape.style.transform = '';
        });
    });
})();

function renderEditorialGallery() {
    const grid = document.getElementById('editorial-grid');
    if (!grid) return;

    // Slice the first 8 items from database
    const items = galleryData.slice(0, 8);
    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'editorial-card';
        
        const labelTopLeft = item.category.toUpperCase();
        const labelTopRight = `👁️ ${item.stats.views.toUpperCase()}`;
        const labelBottomLeft = item.tags[0] ? item.tags[0].toUpperCase() : 'MINIMAL';
        const labelBottomRight = item.tags[1] ? item.tags[1].toUpperCase() : 'ELEGANCE';

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
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="editorial-link-mini" onclick="event.stopPropagation();">
                    ${labelBottomRight} ›
                </a>
            </div>
        `;

        card.addEventListener('click', () => openLightbox(item));
        grid.appendChild(card);
    });
}


