/* ==========================================================================
   JavaScript Functionality - مَارْلُونْد (Marlund) Booking Portal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const bookingForm = document.getElementById('marlund-booking-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const modalOkBtn = document.getElementById('btn-modal-ok');
    const successMessageText = document.getElementById('success-message-text');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const name = document.getElementById('book-name-input').value.trim();
            const phone = document.getElementById('book-phone-input').value.trim();
            const guests = document.getElementById('book-guests-picker').value;
            const date = document.getElementById('book-date-picker').value;
            const time = document.getElementById('book-time-picker').value;
            const consent = document.getElementById('consent-check').checked;

            if (!consent) {
                alert('يرجى الموافقة على سياسة الخصوصية للمتابعة.');
                return;
            }

            // Convert numeric guest value to text for premium presentation
            let guestsText = `${guests} ضيوف`;
            if (guests === '1') guestsText = 'ضيف واحد';
            if (guests === '2') guestsText = 'ضيفين (٢)';

            // Format Arabic success message
            const formattedMessage = `أهلاً يا ${name}، تم استلام طلب حجز طاولة لعدد (${guestsText}) في مطعم مارلوند الفاخر بتاريخ ${date} عند الساعة ${time}.\nسنرسل لك رسالة تأكيد الحجز إلى جوالك: ${phone} قريباً.`;

            // Display success modal
            if (successModal && successMessageText) {
                successMessageText.innerText = formattedMessage;
                successModal.classList.add('open');
                successModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }

            // Reset form
            bookingForm.reset();
        });
    }

    // Close modal function
    function closeModal() {
        if (successModal) {
            successModal.classList.remove('open');
            successModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
    
    // Close modal on overlay click
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeModal();
        });
    }

});
