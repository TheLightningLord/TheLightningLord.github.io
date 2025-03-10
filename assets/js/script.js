// =================== Turbo Mega JS Enhancements ===================

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// ------------------- Mobile Menu Toggle -------------------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  // Animate hamburger spans for a slick toggle effect
  menuToggle.children[0].classList.toggle("rotate1");
  menuToggle.children[1].classList.toggle("fade");
  menuToggle.children[2].classList.toggle("rotate2");
});

// ------------------- Header Background on Scroll -------------------
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    document.querySelector("header").classList.add("scrolled");
  } else {
    document.querySelector("header").classList.remove("scrolled");
  }
});

// ------------------- Back to Top Button -------------------
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ------------------- Scroll Reveal with IntersectionObserver -------------------
const scrollElements = document.querySelectorAll(".scroll-reveal");
const observerOptions = {
  threshold: 0.15,
};
const scrollObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
scrollElements.forEach(el => {
  scrollObserver.observe(el);
});

// ------------------- Turbo Mega Pricing Toggle -------------------
const pricingToggle = document.getElementById("pricingToggle");
const priceElements = document.querySelectorAll(".price");
function updatePricing() {
  priceElements.forEach(el => {
    const monthlyPrice = el.getAttribute("data-monthly");
    const yearlyPrice = el.getAttribute("data-yearly");
    if (pricingToggle.checked) {
      el.innerHTML = '$' + yearlyPrice + '<span>/yr</span>';
    } else {
      el.innerHTML = '$' + monthlyPrice + '<span>/mo</span>';
    }
  });
}
if (pricingToggle) {
  pricingToggle.addEventListener("change", updatePricing);
  updatePricing(); // initialize pricing display
}

// ------------------- Testimonials Carousel -------------------
const carouselInner = document.getElementById("carouselInner");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let carouselIndex = 0;
function updateCarousel() {
  const items = document.querySelectorAll(".carousel-inner#carouselInner .carousel-item");
  carouselInner.style.transform = "translateX(-" + carouselIndex * 100 + "%)";
  prevBtn.disabled = carouselIndex <= 0;
  nextBtn.disabled = carouselIndex >= items.length - 1;
}
if(prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    carouselIndex = Math.max(0, carouselIndex - 1);
    updateCarousel();
  });
  nextBtn.addEventListener("click", () => {
    const items = document.querySelectorAll(".carousel-inner#carouselInner .carousel-item");
    carouselIndex = Math.min(items.length - 1, carouselIndex + 1);
    updateCarousel();
  });
  updateCarousel();
}

// ------------------- Meet the Team Carousel -------------------
const teamCarouselInner = document.getElementById("teamCarouselInner");
const teamPrevBtn = document.getElementById("teamPrevBtn");
const teamNextBtn = document.getElementById("teamNextBtn");
let teamCarouselIndex = 0;
function updateTeamCarousel() {
  const teamItems = document.querySelectorAll("#teamCarouselInner .carousel-item");
  teamCarouselInner.style.transform = "translateX(-" + teamCarouselIndex * 100 + "%)";
  teamPrevBtn.disabled = teamCarouselIndex <= 0;
  teamNextBtn.disabled = teamCarouselIndex >= teamItems.length - 1;
}
if(teamPrevBtn && teamNextBtn) {
  teamPrevBtn.addEventListener("click", () => {
    teamCarouselIndex = Math.max(0, teamCarouselIndex - 1);
    updateTeamCarousel();
  });
  teamNextBtn.addEventListener("click", () => {
    const teamItems = document.querySelectorAll("#teamCarouselInner .carousel-item");
    teamCarouselIndex = Math.min(teamItems.length - 1, teamCarouselIndex + 1);
    updateTeamCarousel();
  });
  updateTeamCarousel();
}

// ------------------- Smooth Anchor Scrolling -------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ------------------- Modal Example for Turbo Info -------------------
// (Ensure you add appropriate HTML for modal-trigger elements, modal-overlay, and modal-close buttons)
const modalTrigger = document.querySelectorAll(".modal-trigger");
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.querySelector(".modal-close");
modalTrigger.forEach(trigger => {
  trigger.addEventListener("click", function(e) {
    e.preventDefault();
    const targetModal = document.querySelector(this.getAttribute("data-target"));
    if (targetModal) {
      targetModal.classList.add("active");
      modalOverlay.classList.add("active");
    }
  });
});
if(modalOverlay) {
  modalOverlay.addEventListener("click", () => {
    document.querySelectorAll(".modal.active").forEach(modal => {
      modal.classList.remove("active");
    });
    modalOverlay.classList.remove("active");
  });
}
if(modalClose) {
  modalClose.addEventListener("click", () => {
    document.querySelectorAll(".modal.active").forEach(modal => {
      modal.classList.remove("active");
    });
    modalOverlay.classList.remove("active");
  });
}
