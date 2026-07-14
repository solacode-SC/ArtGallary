/* ==========================================================================
   JavaScript Functionality - صَحِيفَةُ النُّور (Sahifat Al-Noor)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Intersection Observer for Scroll Reveal Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.concept-card-block, .double-border-box, .poetic-intro-desc');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after revealing once for smooth static feeling
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Reveals slightly before entering view
    });

    revealElements.forEach(el => {
        // Initial setup for CSS transition classes
        el.classList.add('reveal-item');
        revealObserver.observe(el);
    });

});
