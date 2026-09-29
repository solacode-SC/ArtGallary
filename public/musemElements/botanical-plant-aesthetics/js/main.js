document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    function handleScrollReveal() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top <= windowHeight * 0.85) {
                el.classList.add('reveal-active');
            }
        });
    }
    window.addEventListener('scroll', handleScrollReveal);
    // Initial check
    setTimeout(handleScrollReveal, 100);

    // --- Details Sidebar & Calculator Control ---
    const sidebar = document.getElementById('details-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    
    const sidebarName = document.getElementById('sidebar-plant-name');
    const sidebarSub = document.getElementById('sidebar-plant-sub');
    const sidebarImg = document.getElementById('sidebar-plant-img');

    // Calculator Selects
    const roomTempSelect = document.getElementById('room-temp');
    const roomLightSelect = document.getElementById('room-light');
    const calcResultLbl = document.getElementById('calc-result-lbl');

    const moreViewBtns = document.querySelectorAll('.btn-more-view');

    // Plant specifications mapping
    const plantDetails = {
        'Jardin Du Soleil': {
            sub: '[ 태양의 정원 - Cactus & Ivy ]',
            img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 75.00,
            baseDays: 14 // Cactus needs less water
        },
        'Dearment': {
            sub: '[ 디어먼트 - Corokia & Hydrangea ]',
            img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 85.00,
            baseDays: 7 // Foliage needs moderate water
        },
        'Greenlab': {
            sub: '[ 식물 연구소 - Palms & Pothos ]',
            img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 90.00,
            baseDays: 5 // Hydroponics/Ferns need frequent water
        }
    };

    let activePlantName = 'Jardin Du Soleil';

    function calculateWatering() {
        const details = plantDetails[activePlantName];
        if (!details) return;

        let days = details.baseDays;
        const temp = roomTempSelect.value;
        const light = roomLightSelect.value;

        // Adjust based on temp
        if (temp === 'warm') days -= 2;
        if (temp === 'cool') days += 3;

        // Adjust based on light
        if (light === 'high') days -= 1;
        if (light === 'low') days += 4;

        if (days < 2) days = 2; // Clamp minimum watering interval

        calcResultLbl.innerHTML = `Water your <strong>${activePlantName}</strong> every <strong>${days} days</strong>.`;
    }

    [roomTempSelect, roomLightSelect].forEach(select => {
        select.addEventListener('change', calculateWatering);
    });

    moreViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plant = btn.getAttribute('data-plant');
            const data = plantDetails[plant];
            if (!data) return;

            activePlantName = plant;

            sidebarName.textContent = plant;
            sidebarSub.textContent = data.sub;
            sidebarImg.src = data.img;

            calculateWatering();
            sidebar.classList.add('show');
        });
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('show');
    });

    // --- Persistent Cart System Drawer ---
    const cartDrawer = document.getElementById('cart-drawer');
    const cartTriggerBtn = document.getElementById('cart-trigger-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');

    const cartBadgeCount = document.getElementById('cart-badge-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const checkoutBtn = document.getElementById('btn-checkout-trigger');

    let cartItems = JSON.parse(localStorage.getItem('botanicalCartItems')) || [];

    function updateCartUI() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cartItems.forEach((item, index) => {
            total += item.price;
            const card = document.createElement('div');
            card.className = 'cart-item';
            card.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="btn-remove-item" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button>
            `;
            cartItemsList.appendChild(card);
        });

        cartBadgeCount.textContent = cartItems.length;
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        
        localStorage.setItem('botanicalCartItems', JSON.stringify(cartItems));
    }

    cartTriggerBtn.addEventListener('click', () => {
        cartDrawer.classList.add('show');
    });

    closeCartBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('show');
    });

    addToCartBtn.addEventListener('click', () => {
        const details = plantDetails[activePlantName];
        if (!details) return;

        cartItems.push({
            name: activePlantName,
            price: details.price
        });

        updateCartUI();
        sidebar.classList.remove('show');
        showToast(`🌿 Added ${activePlantName} Bundle to your basket!`);
        
        // Auto open cart after brief delay
        setTimeout(() => {
            cartDrawer.classList.add('show');
        }, 600);
    });

    cartItemsList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-item');
        if (removeBtn) {
            const index = parseInt(removeBtn.getAttribute('data-index'));
            cartItems.splice(index, 1);
            updateCartUI();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showToast("⚠️ Your basket is empty!");
            return;
        }
        cartItems = [];
        updateCartUI();
        cartDrawer.classList.remove('show');
        showToast("🎉 Order placed successfully! We'll contact you for delivery.");
    });

    // Toast notifications
    const toastContainer = document.getElementById('toast-container');
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            sidebar.classList.remove('show');
            cartDrawer.classList.remove('show');
        }
    });

    // Close drawers on outside click
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('show') && !sidebar.contains(e.target) && !e.target.closest('.btn-more-view')) {
            sidebar.classList.remove('show');
        }
        if (cartDrawer.classList.contains('show') && !cartDrawer.contains(e.target) && !e.target.closest('.cart-trigger') && !e.target.closest('#add-to-cart-btn')) {
            cartDrawer.classList.remove('show');
        }
    });

    // Initial render
    updateCartUI();
});
