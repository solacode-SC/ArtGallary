/* Wakamatsuya Bento - Application Logic */

// 1. Dials Load Animation
function animateDials() {
  const dialEmotion = document.getElementById("dial-emotion");
  const dialSeason = document.getElementById("dial-season");

  if (dialEmotion && dialSeason) {
    setTimeout(() => {
      dialEmotion.style.strokeDashoffset = "0";
      dialSeason.style.strokeDashoffset = "0";
    }, 400);
  }
}

// 2. Booking Modal Logic
function initBookingModal() {
  const modal = document.getElementById("modal-booking");
  const btnClose = document.getElementById("btn-close-modal");
  const formContainer = document.getElementById("booking-form-container");
  const successOverlay = document.getElementById("booking-success");
  const form = document.getElementById("booking-form");
  const dateInput = document.getElementById("delivery-date");

  if (!modal || !form) return;

  // Open triggers
  document.querySelectorAll(".trigger-booking").forEach(btn => {
    btn.addEventListener("click", () => {
      // Close mobile drawer if open
      document.getElementById("mobile-nav").classList.remove("open");
      
      formContainer.style.display = "block";
      successOverlay.style.display = "none";
      form.reset();
      
      // Auto-set tomorrow's date as min
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      dateInput.min = tomorrowStr;
      dateInput.value = tomorrowStr;
      
      modal.classList.add("open");
      document.body.style.overflow = "hidden"; // block scroll
    });
  });

  // Close helper
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = ""; // restore scroll
  }

  btnClose.addEventListener("click", closeModal);
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // Form Submit Action
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Smooth transition to success
    formContainer.style.display = "none";
    successOverlay.style.display = "flex";
    
    // Auto-close modal after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 3000);
  });
}

// 3. Mobile Hamburger Navigation Drawer
function initMobileNav() {
  const btnHamburger = document.getElementById("btn-hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  
  if (!btnHamburger || !mobileNav) return;

  btnHamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileNav.classList.toggle("open");
    
    // Animate hamburger to cross
    const bars = btnHamburger.querySelectorAll("span");
    if (mobileNav.classList.contains("open")) {
      bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      bars[0].style.transform = "";
      bars[1].style.opacity = "";
      bars[2].style.transform = "";
    }
  });

  mobileNav.addEventListener("click", (e) => {
    if (e.target === mobileNav) {
      mobileNav.classList.remove("open");
      const bars = btnHamburger.querySelectorAll("span");
      bars[0].style.transform = "";
      bars[1].style.opacity = "";
      bars[2].style.transform = "";
    }
  });
}

// 4. Initializer
document.addEventListener("DOMContentLoaded", () => {
  animateDials();
  initBookingModal();
  initMobileNav();
});
