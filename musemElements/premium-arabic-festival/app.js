/* ==========================================================================
   JavaScript Functionality - مَهْرَجَانُ جُذُور (Juzoor Festival) Premium Layout
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Live Countdown Clock (Renders in Arabic numerals)
    // ==========================================================================
    const timeDays = document.getElementById('time-days');
    const timeHours = document.getElementById('time-hours');
    const timeMinutes = document.getElementById('time-minutes');
    const timeSeconds = document.getElementById('time-seconds');

    // Festival Date Set: 77 Days, 23 Hours, 10 Minutes, 54 Seconds from current time
    let totalSecondsLeft = (77 * 24 * 60 * 60) + (23 * 60 * 60) + (10 * 60) + 54;

    function updateCountdownClock() {
        if (totalSecondsLeft <= 0) {
            clearInterval(timerInterval);
            if (timeDays) timeDays.innerText = '٠';
            return;
        }

        totalSecondsLeft--;

        const days = Math.floor(totalSecondsLeft / (24 * 3600));
        const hours = Math.floor((totalSecondsLeft % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
        const seconds = totalSecondsLeft % 60;

        // Helper to format leading zero and translate to Arabic numbers
        const toArNum = (num) => {
            const str = num < 10 ? '0' + num : num.toString();
            return str.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
        };

        if (timeDays) timeDays.innerText = toArNum(days);
        if (timeHours) timeHours.innerText = toArNum(hours);
        if (timeMinutes) timeMinutes.innerText = toArNum(minutes);
        if (timeSeconds) timeSeconds.innerText = toArNum(seconds);
    }

    const timerInterval = setInterval(updateCountdownClock, 1000);
    updateCountdownClock(); // initial trigger


    // ==========================================================================
    // 2. Ticket Purchase checkout drawer overlay
    // ==========================================================================
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('btn-close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    
    const ticketBtns = document.querySelectorAll('.ticket-voucher-btn');
    const selectQuantity = document.getElementById('select-quantity');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');

    let activeTicketPrice = 0;
    let activeTicketTypeLabel = '';

    const ticketLabels = {
        '3day': 'تذكرة ٣ أيام كاملة',
        '1day': 'تذكرة اليوم الواحد',
        'redwood': 'تذكرة ريدوود الفاخرة'
    };

    function calculateTotal() {
        const qty = parseInt(selectQuantity.value);
        const total = qty * activeTicketPrice;
        
        // Format to Arabic Currency string
        const arTotal = total.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
        checkoutTotalPrice.innerText = `${arTotal} ر.س`;
    }

    ticketBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const price = parseInt(btn.getAttribute('data-ticket-price'));
            const type = btn.getAttribute('data-ticket-type');
            
            activeTicketPrice = price;
            activeTicketTypeLabel = ticketLabels[type];

            // Reset quantity to 1
            if (selectQuantity) selectQuantity.value = '1';
            calculateTotal();

            // Open Modal
            if (checkoutModal) {
                checkoutModal.classList.add('open');
                checkoutModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (selectQuantity) {
        selectQuantity.addEventListener('change', calculateTotal);
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            checkoutModal.classList.remove('open');
            checkoutModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const buyerName = document.getElementById('input-buyer-name').value.trim();
            const buyerEmail = document.getElementById('input-buyer-email').value.trim();

            if (!buyerName || !buyerEmail) return;

            alert(`شكراً لك يا ${buyerName}! تم تسجيل طلب الحجز المسبق بنجاح لـ (${activeTicketTypeLabel}).\n\nلقد أرسلنا إشعار تأكيد الحجز إلى البريد الإلكتروني: ${buyerEmail}.`);

            // Reset and close
            checkoutForm.reset();
            checkoutModal.classList.remove('open');
            checkoutModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }


    // ==========================================================================
    // 3. Filmstrip Video & Campaign Modals Overlay Managers
    // ==========================================================================
    const videoStripBtn = document.getElementById('video-strip-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('btn-close-video');

    if (videoStripBtn && videoModal && closeVideoBtn) {
        videoStripBtn.addEventListener('click', () => {
            videoModal.classList.add('open');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        closeVideoBtn.addEventListener('click', () => {
            videoModal.classList.remove('open');
            videoModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    const campaignBtn = document.getElementById('btn-campaign-modal');
    const campaignModal = document.getElementById('campaign-modal');
    const closeCampaignBtn = document.getElementById('btn-close-campaign');

    if (campaignBtn && campaignModal && closeCampaignBtn) {
        campaignBtn.addEventListener('click', () => {
            campaignModal.classList.add('open');
            campaignModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        closeCampaignBtn.addEventListener('click', () => {
            campaignModal.classList.remove('open');
            campaignModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    // Close overlays by clicking outside card
    const modals = [checkoutModal, videoModal, campaignModal];
    modals.forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            });
        }
    });


    // ==========================================================================
    // 4. Lineup Artist Search Filter Matcher
    // ==========================================================================
    const filterInput = document.getElementById('artist-filter-input');
    const dayBlocks = document.querySelectorAll('.poster-day-block');
    const artistSpans = document.querySelectorAll('.artist-item');

    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === '') {
                // Reset styling
                artistSpans.forEach(s => s.classList.remove('highlight-match'));
                dayBlocks.forEach(b => b.style.opacity = '1');
                return;
            }

            dayBlocks.forEach(block => {
                const spans = block.querySelectorAll('.artist-item');
                let dayHasMatch = false;

                spans.forEach(span => {
                    const artistName = span.innerText.toLowerCase();
                    if (artistName.includes(query)) {
                        span.classList.add('highlight-match');
                        dayHasMatch = true;
                    } else {
                        span.classList.remove('highlight-match');
                    }
                });

                // Fade day block if no artist matches in it
                if (dayHasMatch) {
                    block.style.opacity = '1';
                } else {
                    block.style.opacity = '0.3';
                }
            });
        });
    }

});
