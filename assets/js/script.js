// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Scroll Reveal Animation
const scrollElements = document.querySelectorAll(".scroll-reveal");
const elementInView = (el, dividend = 1.25) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
};
const displayScrollElement = (element) => {
  element.classList.add("visible");
};
const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el)) {
      displayScrollElement(el);
    }
  });
};
window.addEventListener("scroll", handleScrollAnimation);

// Testimonials Carousel
const carouselInner = document.getElementById("carouselInner");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let carouselIndex = 0;
const updateCarousel = () => {
  const totalItems = document.querySelectorAll(".carousel-inner#carouselInner .carousel-item").length;
  carouselInner.style.transform = "translateX(-" + carouselIndex * 100 + "%)";
  prevBtn.disabled = carouselIndex <= 0;
  nextBtn.disabled = carouselIndex >= totalItems - 1;
};
if(prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    carouselIndex = Math.max(0, carouselIndex - 1);
    updateCarousel();
  });
  nextBtn.addEventListener("click", () => {
    const totalItems = document.querySelectorAll(".carousel-inner#carouselInner .carousel-item").length;
    carouselIndex = Math.min(totalItems - 1, carouselIndex + 1);
    updateCarousel();
  });
  updateCarousel();
}

// Meet the Team Carousel
const teamCarouselInner = document.getElementById("teamCarouselInner");
const teamPrevBtn = document.getElementById("teamPrevBtn");
const teamNextBtn = document.getElementById("teamNextBtn");
let teamCarouselIndex = 0;
const updateTeamCarousel = () => {
  const totalTeamItems = document.querySelectorAll("#teamCarouselInner .carousel-item").length;
  teamCarouselInner.style.transform = "translateX(-" + teamCarouselIndex * 100 + "%)";
  teamPrevBtn.disabled = teamCarouselIndex <= 0;
  teamNextBtn.disabled = teamCarouselIndex >= totalTeamItems - 1;
};
if(teamPrevBtn && teamNextBtn) {
  teamPrevBtn.addEventListener("click", () => {
    teamCarouselIndex = Math.max(0, teamCarouselIndex - 1);
    updateTeamCarousel();
  });
  teamNextBtn.addEventListener("click", () => {
    const totalTeamItems = document.querySelectorAll("#teamCarouselInner .carousel-item").length;
    teamCarouselIndex = Math.min(totalTeamItems - 1, teamCarouselIndex + 1);
    updateTeamCarousel();
  });
  updateTeamCarousel();
}
