/* ==========================================================================
   JavaScript Functionality - عالم المحيط (Ocean. Donation Portal)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Dynamic Donation Selector Capsule
    // ==========================================================================
    const amountPills = document.querySelectorAll('#amount-picker .amount-pill');
    let selectedAmount = "3"; // Default $3 selection

    amountPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active state from all pills
            amountPills.forEach(p => p.classList.remove('active'));
            
            // Add active to current
            pill.classList.add('active');
            selectedAmount = pill.getAttribute('data-value');
            
            // Pre-fill / update floating live donor card value dynamically
            const donorAmt = document.getElementById('donor-amount-label');
            if (donorAmt) {
                donorAmt.innerText = `تم التبرع بـ $${selectedAmount}`;
            }
        });
    });

    // ==========================================================================
    // 2. Interactive 3D Parallax Hover Shifts on Waves Design Card
    // ==========================================================================
    const wavesPanel = document.getElementById('waves-interactive-panel');
    const waveImg = document.querySelector('.waves-design-img');

    if (wavesPanel && waveImg) {
        wavesPanel.addEventListener('mousemove', (e) => {
            const rect = wavesPanel.getBoundingClientRect();
            // Coordinates relative to panel center
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Subtle parallax shift on the image
            const shiftX = mouseX * 0.04;
            const shiftY = mouseY * 0.04;
            
            waveImg.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.02)`;
        });

        // Reset values on mouse exit
        wavesPanel.addEventListener('mouseleave', () => {
            waveImg.style.transform = '';
        });
    }

    // ==========================================================================
    // 3. Side Donors History Drawer (RTL: Slides from Right)
    // ==========================================================================
    const donorsDrawer = document.getElementById('donors-drawer');
    const btnDonorTrigger = document.getElementById('btn-donor-drawer-trigger');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');

    function openDonorsDrawer() {
        if (donorsDrawer) {
            donorsDrawer.classList.add('open');
            donorsDrawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDonorsDrawer() {
        if (donorsDrawer) {
            donorsDrawer.classList.remove('open');
            donorsDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (btnDonorTrigger) btnDonorTrigger.addEventListener('click', openDonorsDrawer);
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDonorsDrawer);

    // ==========================================================================
    // 4. Donation Submissions & Success Receipt Modal
    // ==========================================================================
    const btnDonateSubmit = document.getElementById('btn-donate-submit');
    const quickDonateForm = document.getElementById('quick-donate-form');
    
    // Receipt Modal Elements
    const successDialog = document.getElementById('receipt-success-dialog');
    const btnReceiptOk = document.getElementById('btn-receipt-ok');
    const receiptMsg = document.getElementById('receipt-msg');

    function showReceipt(donorName, donorCountry, amountVal) {
        // Close donor drawer if open
        closeDonorsDrawer();

        // Generate unique donation confirmation number
        const refCode = `DON-${Math.floor(100000 + Math.random() * 900000)}`;

        if (receiptMsg && successDialog) {
            receiptMsg.innerText = `المساهم الكريم: ${donorName}\nالبلد: ${donorCountry}\nقيمة التبرع: $${amountVal} دولار\nرقم تأكيد المعاملة: ${refCode}\n\nشكراً لك! تساهم تبرعاتك في تمويل الفعاليات وتأهيل الشعب المرجانية في محميات المحيطات لحماية الكائنات البحرية المهددة بالانقراض.`;
            
            successDialog.classList.add('open');
            successDialog.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    // Submit via main hero capsule
    if (btnDonateSubmit) {
        btnDonateSubmit.addEventListener('click', () => {
            showReceipt("فاعل خير", "الوطن العربي", selectedAmount);
        });
    }

    // Submit via drawer quick form
    if (quickDonateForm) {
        quickDonateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const donorName = document.getElementById('form-donor-name').value;
            const donorCountry = document.getElementById('form-donor-country').value;
            showReceipt(donorName, donorCountry, selectedAmount);
            quickDonateForm.reset();
        });
    }

    if (btnReceiptOk && successDialog) {
        btnReceiptOk.addEventListener('click', () => {
            successDialog.classList.remove('open');
            successDialog.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    // ==========================================================================
    // 5. Scroll Down Exploration triggers
    // ==========================================================================
    const btnScrollExplore = document.getElementById('btn-scroll-explore');
    if (btnScrollExplore) {
        btnScrollExplore.addEventListener('click', () => {
            openDonorsDrawer(); // Slide donor list open as secondary view
        });
    }

    // Upgrade account hook
    const btnUpgrade = document.getElementById('btn-upgrade');
    if (btnUpgrade) {
        btnUpgrade.addEventListener('click', () => {
            if (receiptMsg && successDialog) {
                receiptMsg.innerText = "تم إرسال طلب الترقية للمراجعة!\n\nسيقوم مدير المنصة بمراجعة حسابك والاتصال بك لتأكيد تفاصيل حساب الجهات أو المنظمات المانحة الكبرى.";
                successDialog.classList.add('open');
                successDialog.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    }

});
