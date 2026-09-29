/* ==========================================================================
   JavaScript Functionality - جُرُوفِي بْلُوغ (Groovy Blog)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Search trigger modal overlay prompt
    // ==========================================================================
    const searchTrigger = document.querySelector('.search-trigger-btn');
    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            const query = prompt('ما الذي تبحث عنه في مدونة جروفي؟');
            if (query && query.trim() !== '') {
                alert(`جارٍ البحث عن: "${query.trim()}"...\nعذراً، وظيفة البحث الكامل تتطلب الاتصال بقاعدة البيانات.`);
            }
        });
    }

    // ==========================================================================
    // 2. Intersection Observer for Scroll Reveals
    // ==========================================================================
    const postCards = document.querySelectorAll('.post-card, .sidebar-widget');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    postCards.forEach(el => {
        el.classList.add('reveal-prep');
        revealObserver.observe(el);
    });

    // ==========================================================================
    // 3. Continue Reading clicks triggers
    // ==========================================================================
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-read-more')) {
            e.preventDefault();
            const card = e.target.closest('.post-card');
            const title = card ? card.querySelector('.post-title').innerText : 'المقالة';
            alert(`سيتم فتح قراءة مقالة "${title}" كاملة في نافذة جديدة قريباً.`);
        }
    });

});
