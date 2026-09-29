// ─────────────────────────────────────────────────────────────
// WIZARD SHOCK — Arabic RTL Interactive JS
// ─────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════
// HERO PARTICLE CANVAS ENGINE
// ══════════════════════════════════════════════════════════════
(function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', () => { resize(); buildParticles(); });
    resize();

    // Particle types: stars, fireflies (warm gold), magic sparks (purple)
    function buildParticles() {
        particles = [];
        const count = Math.floor((W * H) / 5000);
        for (let i = 0; i < count; i++) {
            const type = Math.random() < 0.6 ? 'star' : Math.random() < 0.5 ? 'firefly' : 'spark';
            particles.push(createParticle(type));
        }
    }

    function createParticle(type) {
        const base = {
            x: Math.random() * W,
            y: Math.random() * H,
            life: Math.random(),
            maxLife: 0.5 + Math.random() * 1.5,
            speed: 0.1 + Math.random() * 0.3,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(0.05 + Math.random() * 0.3),
            type,
        };
        if (type === 'star') {
            return { ...base, r: 0.5 + Math.random() * 1.5, color: '#ffffff', twinkle: Math.random() * Math.PI * 2 };
        } else if (type === 'firefly') {
            return { ...base, r: 1 + Math.random() * 2, color: '#ffd600', glow: 8 + Math.random() * 12 };
        } else {
            return { ...base, r: 0.8 + Math.random() * 1.5, color: '#cc5de8', glow: 6 + Math.random() * 10 };
        }
    }

    buildParticles();

    let animFrameId;
    let lastTime = 0;

    function draw(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 16, 3); // cap delta
        lastTime = timestamp;

        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            p.life += p.speed * dt * 0.02;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Loop back
            if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; p.life = 0; }
            if (p.x < -10) p.x = W + 5;
            if (p.x > W + 10) p.x = -5;

            const progress = (p.life % p.maxLife) / p.maxLife;
            const alpha = Math.sin(progress * Math.PI); // fade in/out

            if (p.type === 'star') {
                const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(p.twinkle + timestamp * 0.001));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * twinkle, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha * twinkle * 0.8})`;
                ctx.fill();
            } else {
                // Firefly / spark with glow
                ctx.save();
                ctx.globalAlpha = alpha * 0.9;
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.glow, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();
            }
        });

        animFrameId = requestAnimationFrame(draw);
    }

    // Respect reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animFrameId = requestAnimationFrame(draw);
    }
})();

// ══════════════════════════════════════════════════════════════
// HERO TITLE WORD REVEAL (staggered, elastic entry)
// ══════════════════════════════════════════════════════════════
(function heroTitleReveal() {
    const words = document.querySelectorAll('.hero-title-word');
    words.forEach((word, i) => {
        setTimeout(() => {
            word.classList.add('hero-word-visible');
        }, 400 + i * 280);
    });
})();

// ── Toast System ──────────────────────────────────────────────
const toastContainer = document.getElementById('toast-container');

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Trigger show animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ── Collect Buttons ────────────────────────────────────────────
const collectBtns = document.querySelectorAll('.btn-collect');

collectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const charName = btn.dataset.char || 'الشخصية';
        const card = btn.closest('.char-card');

        // Pixel flash effect on the image
        const imgBox = card?.querySelector('.char-img-box');
        if (imgBox) {
            imgBox.classList.add('flash-effect');
            imgBox.addEventListener('animationend', () => {
                imgBox.classList.remove('flash-effect');
            }, { once: true });
        }

        // Toggle collected state
        if (btn.classList.contains('collected')) {
            btn.classList.remove('collected');
            btn.querySelector('.btn-collect-text').textContent = 'اقتنِ';
            showToast(`❌ تمت إزالة ${charName} من مجموعتك`);
        } else {
            btn.classList.add('collected');
            btn.querySelector('.btn-collect-text').textContent = 'في مجموعتك ✓';
            showToast(`✨ تمت إضافة ${charName} إلى مجموعتك!`);
        }
    });
});

// ── Scroll Reveal ─────────────────────────────────────────────
const revealTargets = document.querySelectorAll(
    '.char-card, .intro-block, .site-footer'
);

revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay within each grid
    const delay = (i % 3) * 120;
    el.style.transitionDelay = `${delay}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

revealTargets.forEach(el => revealObserver.observe(el));

// ── Character hover bounce ─────────────────────────────────────
document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const img = card.querySelector('.char-img-box img');
        if (img) {
            img.style.transform = 'scale(1.05) translateY(-4px)';
        }
    });
    card.addEventListener('mouseleave', () => {
        const img = card.querySelector('.char-img-box img');
        if (img) {
            img.style.transform = '';
        }
    });
});
