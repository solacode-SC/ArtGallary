// 椿神社 Tsubaki Shrine — Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    initTapSounds();
    initScrollReveal();
});

/* ── Tap Sounds ─────────────────────────────────────────── */
function initTapSounds() {
    let audioCtx = null;
    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }
    function play() {
        try {
            const ctx = getCtx();
            if (!ctx) return;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            const t = ctx.currentTime;
            // Soft wooden chime sound
            o.type = 'triangle';
            o.frequency.setValueAtTime(800, t);
            o.frequency.exponentialRampToValueAtTime(200, t + 0.08);
            g.gain.setValueAtTime(0.03, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            o.start(t); o.stop(t + 0.12);
        } catch (e) {}
    }
    document.querySelectorAll('.site-logo, .h-link, .btn-vermillion, .label-pill, .photo-cell, .c-photo, .s-photo').forEach(el => {
        el.addEventListener('click', play);
    });
}

/* ── Scroll Reveal ──────────────────────────────────────── */
function initScrollReveal() {
    const reveals = document.querySelectorAll(
        '.photo-cell, .ceremony-text, .ceremony-photos, .staff-text-col, .staff-photo-col, .access-grid, .hero-text-overlay, .intro-text-block'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
