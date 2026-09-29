/* ==========================================================================
   JavaScript Functionality - أَسْفَار المَشْرِق (Asfaar Al-Mashriq)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Testimonial Reviews Slider Database
    // ==========================================================================
    const testimonials = [
        {
            text: `"كانت رحلتي مع أسفار المشرق إلى العلا تجربة لا تُنسى. التنظيم كان دقيقًا للغاية، والمرشد التراثي أضاف عمقًا معرفيًا رائعًا لكل موقع زرناه."`,
            author: "سليمان عبد الله",
            location: "الرياض، المملكة العربية السعودية"
        },
        {
            text: `"وادي الديسة كان حلمًا بالنسبة لي! المزيج بين الجبال الشاهقة والرمال الجافة والمياه والورود الجارية لا يوصف. شكرًا على هذه المغامرة الجميلة."`,
            author: "مريم الأحمد",
            location: "دبي، الإمارات العربية المتحدة"
        },
        {
            text: `"جبال عسير وضبابها الكثيف يعزلانك عن صخب العالم تمامًا. الباقة السياحية شملت سكنًا تقليديًا غاية في الرقي والأصالة والجمال."`,
            author: "عمر الفاروق",
            location: "عمان، الأردن"
        }
    ];

    let currentReviewIndex = 0;

    const quoteTextLbl = document.getElementById('quote-text');
    const quoteAuthorLbl = document.getElementById('quote-author');
    const quoteLocationLbl = document.getElementById('quote-location');
    const sliderDots = document.querySelectorAll('.slider-dot');

    function updateTestimonial(index) {
        if (!quoteTextLbl) return;
        
        // Add fade out animation class
        quoteTextLbl.style.opacity = 0;
        
        setTimeout(() => {
            const t = testimonials[index];
            quoteTextLbl.innerText = t.text;
            quoteAuthorLbl.innerText = t.author;
            quoteLocationLbl.innerText = t.location;
            
            sliderDots.forEach(dot => dot.classList.remove('active'));
            sliderDots[index].classList.add('active');
            
            // Fade in
            quoteTextLbl.style.opacity = 1;
        }, 300);
    }

    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            currentReviewIndex = index;
            updateTestimonial(index);
        });
    });

    // Auto rotate testimonials
    setInterval(() => {
        currentReviewIndex = (currentReviewIndex + 1) % testimonials.length;
        updateTestimonial(currentReviewIndex);
    }, 8000);


    // ==========================================================================
    // 2. Collage Category Filtering Grid
    // ==========================================================================
    const filterCapsules = document.querySelectorAll('.filter-capsule');
    const collageCards = document.querySelectorAll('.collage-card');

    filterCapsules.forEach(capsule => {
        capsule.addEventListener('click', () => {
            filterCapsules.forEach(c => c.classList.remove('active'));
            capsule.classList.add('active');

            const filterValue = capsule.getAttribute('data-filter');

            collageCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = 0;
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // ==========================================================================
    // 3. Trip Booking Modal Dialog
    // ==========================================================================
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingBtn = document.getElementById('btn-close-booking');
    const bookingTargetTitle = document.getElementById('booking-target-title');
    const tripBookingForm = document.getElementById('trip-booking-form');

    // Global booking modal opener
    window.openBooking = function(tripName) {
        if (!bookingModal) return;
        
        if (bookingTargetTitle) {
            bookingTargetTitle.innerText = `حجز: ${tripName}`;
        }
        
        bookingModal.classList.add('open');
        bookingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    function closeBooking() {
        if (!bookingModal) return;
        bookingModal.classList.remove('open');
        bookingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBooking);
    
    // Close on overlay click
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBooking();
        });
    }

    // Form submit
    if (tripBookingForm) {
        tripBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('book-user-name').value.trim();
            const phone = document.getElementById('book-user-phone').value.trim();
            const date = document.getElementById('book-trip-date').value;

            closeBooking();
            tripBookingForm.reset();

            alert(`شكرًا لك يا ${name}!\nتم استلام طلب حجزك لرحلتك المفضلة بتاريخ ${date}.\nسيقوم مستشار السفر بالاتصال بك على الجوال: ${phone} لتأكيد تفاصيل باقتك.`);
        });
    }

    // Nav Contact trigger
    const pitchTrigger = document.getElementById('btn-pitch-modal-trigger');
    if (pitchTrigger) {
        pitchTrigger.addEventListener('click', () => {
            window.openBooking('استفسار تواصل عام');
        });
    }

});
