document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const dots = document.querySelectorAll('.dot');
    
    // Left Toolbar Buttons
    const brushBtn = document.querySelector('.tool-btn:nth-child(1)');
    const heartBtn = document.querySelector('.tool-btn:nth-child(2)');
    
    // Lightbox Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Layout order classes
    const layoutClasses = ['active', 'right-1', 'right-2', 'left-2', 'left-1'];
    let order = [0, 1, 2, 3, 4]; 
    
    function updateCarousel() {
        cards.forEach((card) => {
            const cardIndex = parseInt(card.getAttribute('data-index'));
            const positionInOrder = order.indexOf(cardIndex);
            
            layoutClasses.forEach(cls => card.classList.remove(cls));
            
            const positionClass = layoutClasses[positionInOrder];
            card.classList.add(positionClass);
            
            if (positionClass === 'active') {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[cardIndex].classList.add('active');
            }
        });
    }
    
    function rotateNext() {
        const first = order.shift();
        order.push(first);
        updateCarousel();
    }
    
    function rotatePrev() {
        const last = order.pop();
        order.unshift(last);
        updateCarousel();
    }
    
    // Bottom navigation
    nextBtn.addEventListener('click', rotateNext);
    prevBtn.addEventListener('click', rotatePrev);
    
    // Card clicking focus
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore if clicked on control buttons
            if (e.target.closest('.card-top-controls') || e.target.closest('.card-details-panel')) {
                return;
            }
            
            if (card.classList.contains('right-1')) {
                rotateNext();
            } else if (card.classList.contains('left-1')) {
                rotatePrev();
            } else if (card.classList.contains('right-2')) {
                rotateNext();
                setTimeout(rotateNext, 150);
            } else if (card.classList.contains('left-2')) {
                rotatePrev();
                setTimeout(rotatePrev, 150);
            }
        });
    });

    // Hook up arrows on the card controls
    cards.forEach(card => {
        const leftArrow = card.querySelector('.control-circle-btn:first-child');
        const rightArrow = card.querySelector('.control-circle-btn:last-child');
        const expandBtn = card.querySelector('.control-pill-btn');

        if (leftArrow) {
            leftArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                rotatePrev();
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                rotateNext();
            });
        }

        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Get info from card to inject into Lightbox
                const img = card.querySelector('.card-image-box img');
                const title = card.querySelector('.painting-title').textContent;
                const date = card.querySelector('.painting-date').textContent;
                const quote = card.querySelector('.painting-quote').textContent;

                lightboxImg.src = img.src;
                lightboxTitle.textContent = title;
                lightboxDate.textContent = date;
                lightboxDesc.textContent = quote;

                lightbox.classList.add('show');
            });
        }
    });

    // Close Lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });

    // Left Toolbar functionalities
    // Toggle Paintbrush filter on/off (Sepia/Saturation filter)
    brushBtn.addEventListener('click', () => {
        brushBtn.classList.toggle('active');
        document.body.classList.toggle('painting-filter');
    });

    // Toggle heart active/liked state
    heartBtn.addEventListener('click', () => {
        heartBtn.classList.toggle('liked');
        
        // Quick visual popup trigger
        const isLiked = heartBtn.classList.contains('liked');
        const activeCard = document.querySelector('.carousel-card.active');
        const title = activeCard.querySelector('.painting-title').textContent;
        
        showNotification(isLiked ? `Liked "${title}"` : `Removed "${title}" from favorites`);
    });

    // Simple temporary toast notification creator
    function showNotification(text) {
        const toast = document.createElement('div');
        toast.className = 'glass-panel';
        toast.style.position = 'fixed';
        toast.style.bottom = '110px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '20px';
        toast.style.zIndex = '2000';
        toast.style.fontSize = '0.85rem';
        toast.style.fontWeight = '600';
        toast.style.border = '1px solid rgba(255,255,255,0.15)';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        toast.style.transition = 'opacity 0.3s ease';
        toast.textContent = text;

        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }
    
    // Keyboard arrow keys navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            rotateNext();
        } else if (e.key === 'ArrowLeft') {
            rotatePrev();
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('show');
        }
    });

    // Address bar mock search function
    const addressInput = document.querySelector('.address-input-wrapper');
    addressInput.addEventListener('click', () => {
        showNotification("Searching catalog...");
    });

    // Initialize layout positions
    updateCarousel();
});
