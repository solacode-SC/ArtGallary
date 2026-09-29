// Flutterwave Design Team Page - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initThemeSelector();
});

/**
 * Centered Slider Carousel
 */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const container = document.querySelector('.carousel-clip-container');

    if (!track || slides.length === 0 || !prevBtn || !nextBtn || !container) return;

    let currentIndex = 1; // Start on the second slide (the green Money/Emotion card) to match image
    let slideWidth = slides[0].offsetWidth;

    // Track resize events to keep offsets perfectly accurate
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth;
        updateSliderPosition(false); // update instantly on resize
    });

    /**
     * Update slide track transition offset
     * @param {boolean} animated - whether to animate transition
     */
    function updateSliderPosition(animated = true) {
        if (animated) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        } else {
            track.style.transition = 'none';
        }

        // Calculate offset to place the active card exactly in the horizontal center of the viewport
        const containerWidth = container.offsetWidth;
        const centerOffset = (containerWidth / 2) - (slideWidth / 2);
        const shiftX = centerOffset - (currentIndex * slideWidth);

        track.style.transform = `translateX(${shiftX}px)`;

        // Highlight active slide and fade others
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.style.opacity = '1';
                slide.style.transform = 'scale(1)';
            } else {
                slide.style.opacity = '0.45';
                slide.style.transform = 'scale(0.93)';
            }
            slide.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Set initial position
    updateSliderPosition(false);

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        } else {
            // Bounce or wrap around
            currentIndex = slides.length - 1;
            updateSliderPosition();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSliderPosition();
        } else {
            // Bounce or wrap around
            currentIndex = 0;
            updateSliderPosition();
        }
    });

    // Touch swipe support
    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        const diffX = endX - startX;
        const threshold = 50;

        if (startX && endX) {
            if (diffX > threshold && currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            } else if (diffX < -threshold && currentIndex < slides.length - 1) {
                currentIndex++;
                updateSliderPosition();
            }
        }
        startX = 0;
        endX = 0;
    });
}

/**
 * Functional Light/Dark Mode Switcher
 */
function initThemeSelector() {
    const dotLight = document.querySelector('.dot-light');
    const dotDark = document.querySelector('.dot-dark');
    const body = document.body;

    if (!dotLight || !dotDark) return;

    dotLight.addEventListener('click', () => {
        body.classList.remove('dark-theme');
        dotDark.classList.remove('active');
        dotLight.classList.add('active');
    });

    dotDark.addEventListener('click', () => {
        body.classList.add('dark-theme');
        dotLight.classList.remove('active');
        dotDark.classList.add('active');
    });
}
