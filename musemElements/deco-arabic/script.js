/* ==========================================================================
   Deco. Arabic Premium JS Interactive Logic
   - Sticky Header
   - Light/Dark Theme Switching
   - Mobile Navigation Drawer & Dropdowns
   - Smooth Accordion Animation
   - FAQ Category Filter Simulation
   - IntersectionObserver Scroll Reveals
   - Interactive Form Success Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header ---
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load in case page is refreshed while scrolled


    // --- 2. Light/Dark Theme Switching ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('deco-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.className = 'dark-mode';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        document.body.className = 'light-mode';
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.className = 'dark-mode';
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('deco-theme', 'dark');
        } else {
            document.body.className = 'light-mode';
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('deco-theme', 'light');
        }
    });


    // --- 3. Mobile Navigation Drawer ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon state
            mobileMenuToggle.classList.toggle('open');
            if (mobileMenuToggle.classList.contains('open')) {
                mobileMenuToggle.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
                mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '0';
                mobileMenuToggle.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                mobileMenuToggle.querySelectorAll('span').forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    }

    // Toggle dropdowns on mobile click
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.parentElement;
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                parent.classList.toggle('active');
            }
        });
    });


    // --- 4. FAQ Accordion Action ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Initialize active accordion height
    document.querySelectorAll('.accordion-item.active').forEach(item => {
        const content = item.querySelector('.accordion-content');
        if (content) {
            content.style.maxHeight = 'none'; // Keep fully expanded initially
        }
    });

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');
            
            // Close other accordion items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                    
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
                        setTimeout(() => {
                            otherContent.style.maxHeight = '0px';
                        }, 10);
                    }
                }
            });
            
            // Toggle clicked item
            if (isActive) {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = content.scrollHeight + 'px';
                setTimeout(() => {
                    content.style.maxHeight = '0px';
                }, 10);
            } else {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = '0px';
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }, 10);
                
                // Allow CSS transition to complete, then set to none/auto for responsiveness
                setTimeout(() => {
                    if (item.classList.contains('active')) {
                        content.style.maxHeight = 'none';
                    }
                }, 300);
            }
        });
    });


    // --- 5. FAQ Tabs Simulation ---
    const faqTabs = document.querySelectorAll('.faq-tab');
    faqTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            faqTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Premium micro-interaction: subtle blink/fade in of accordion to mimic loading different content
            const accordionContainer = document.getElementById('faq-accordion');
            if (accordionContainer) {
                accordionContainer.style.opacity = '0.3';
                accordionContainer.style.transform = 'translateY(5px)';
                setTimeout(() => {
                    accordionContainer.style.opacity = '1';
                    accordionContainer.style.transform = 'translateY(0)';
                }, 200);
            }
        });
    });


    // --- 6. Scroll Reveal Effects using IntersectionObserver ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, no need to track it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }


    // --- 7. Newsletter Subscription & Premium Toast Alert ---
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const emailValue = emailInput.value.trim();
            
            if (emailValue) {
                // Show floating premium success notification
                showNotification(`شكراً لاشتراكك! تم تسجيل بريدك الإلكتروني بنجاح: ${emailValue}`);
                emailInput.value = '';
            }
        });
    }
    
    // Toast Notification generator
    const showNotification = (message) => {
        // Remove existing toast if there is one
        const existingToast = document.querySelector('.premium-toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'premium-toast';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✓</span>
                <p class="toast-msg">${message}</p>
            </div>
        `;
        
        // CSS Style Injection for the Toast dynamically to keep CSS clean
        const style = document.createElement('style');
        style.innerHTML = `
            .premium-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--bg-secondary);
                border: 2px solid var(--primary);
                color: var(--text-primary);
                padding: 16px 24px;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-deep);
                z-index: 1100;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: 400px;
                direction: rtl;
                font-family: var(--font-body);
            }
            .premium-toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .toast-icon {
                width: 24px;
                height: 24px;
                background-color: var(--primary);
                color: #ffffff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.9rem;
            }
            .toast-msg {
                font-size: 0.92rem;
                font-weight: 700;
                line-height: 1.4;
            }
            @media (max-width: 576px) {
                .premium-toast {
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 5000);
    };
});
