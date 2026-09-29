document.addEventListener('DOMContentLoaded', () => {
    
    // --- Hero Parallax Scroll Effect ---
    const parallaxImg = document.getElementById('hero-parallax-img');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        // Limit parallax to banner view to avoid rendering overhead
        if (scrolled < window.innerHeight) {
            parallaxImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
        }
    });

    // --- About Section Gallery Thumbnail Swapping ---
    const mainGalleryImg = document.getElementById('about-gallery-main');
    const thumbnails = document.querySelectorAll('.thumb-frame');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            const newSrc = thumb.getAttribute('data-src');
            
            // Apply fade transition effect
            mainGalleryImg.style.opacity = 0;
            setTimeout(() => {
                mainGalleryImg.src = newSrc;
                mainGalleryImg.style.opacity = 1;
            }, 200);
        });
    });

    // --- Registration Modal Dialog ---
    const regModal = document.getElementById('register-modal');
    const openRegBtn = document.getElementById('btn-register-trigger');
    const closeRegBtn = document.getElementById('close-register-btn');
    const registerForm = document.getElementById('register-form');

    openRegBtn.addEventListener('click', () => {
        regModal.classList.add('show');
    });

    closeRegBtn.addEventListener('click', () => {
        regModal.classList.remove('show');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('visitor-name').value;
        const date = document.getElementById('visit-date').value;
        const phone = document.getElementById('visitor-phone').value;
        const count = document.getElementById('visitor-count').value;

        // Save registration locally
        const regData = { name, date, phone, count };
        let regList = JSON.parse(localStorage.getItem('reserveRegistrations')) || [];
        regList.push(regData);
        localStorage.setItem('reserveRegistrations', JSON.stringify(regList));

        // Reset
        registerForm.reset();
        regModal.classList.remove('show');

        showToast(`🌲 Заявка отправлена! Будем ждать вас ${date}. Количество: ${count}.`);
    });

    // --- Walk Cards Sidebar & Care Calculator ---
    const walkSidebar = document.getElementById('walk-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    
    const sidebarTitle = document.getElementById('sidebar-walk-title');
    const sidebarDifficulty = document.getElementById('sidebar-difficulty');
    const sidebarImg = document.getElementById('sidebar-walk-img');
    const sidebarDist = document.getElementById('sidebar-dist');
    const sidebarDuration = document.getElementById('sidebar-duration');
    const btnBookTrail = document.getElementById('btn-book-trail');

    const walkCards = document.querySelectorAll('.walk-card');

    walkCards.forEach(card => {
        card.addEventListener('click', () => {
            const walkName = card.getAttribute('data-walk');
            const difficulty = card.getAttribute('data-difficulty');
            const dist = card.getAttribute('data-dist');
            const duration = card.getAttribute('data-duration');
            const img = card.getAttribute('data-img');

            sidebarTitle.textContent = walkName;
            sidebarDifficulty.textContent = `Сложность: ${difficulty}`;
            sidebarImg.src = img;
            sidebarDist.textContent = dist;
            sidebarDuration.textContent = duration;

            walkSidebar.classList.add('show');
        });
    });

    closeSidebarBtn.addEventListener('click', () => {
        walkSidebar.classList.remove('show');
    });

    btnBookTrail.addEventListener('click', () => {
        walkSidebar.classList.remove('show');
        showToast(`🧗 Маршрут "${sidebarTitle.textContent}" успешно забронирован!`);
    });

    // See all walks card trigger
    const seeAllBtn = document.getElementById('btn-all-walks');
    seeAllBtn.addEventListener('click', () => {
        showToast("🔍 Открывается полный список экотроп...");
    });

    // About read more button
    const aboutReadMoreBtn = document.getElementById('about-readmore-btn');
    aboutReadMoreBtn.addEventListener('click', () => {
        showToast("📄 Открывается полная история заповедника...");
    });

    // Close on background click
    [regModal, walkSidebar].forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el) {
                el.classList.remove('show');
            }
        });
    });

    // --- Toast Notification System ---
    const toastContainer = document.getElementById('toast-container');
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove after 3.5s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }, 3500);
    }

    // --- Scroll Reveal Observers ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    // Add scroll-reveal class to main section wrappers dynamically if not present
    const sections = document.querySelectorAll('.section-wrapper');
    sections.forEach((sec, index) => {
        sec.classList.add('scroll-reveal');
        if (index === 0) sec.classList.add('delay-100');
        if (index === 1) sec.classList.add('delay-200');
    });

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const allRevealElements = document.querySelectorAll('.scroll-reveal');
    allRevealElements.forEach(el => observer.observe(el));

    // Keyboard support: Escape closes modal/sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            regModal.classList.remove('show');
            walkSidebar.classList.remove('show');
        }
    });

});
