// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Preloader functionality
window.addEventListener('load', function() {
  const preloader = document.getElementById('preloader');
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll Reveal Animation
const scrollElements = document.querySelectorAll('.scroll-reveal');
const elementInView = (el, dividend = 1.25) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const displayScrollElement = (element) => {
  element.classList.add('visible');
};

const hideScrollElement = (element) => {
  element.classList.remove('visible');
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el)) {
      displayScrollElement(el);
    }
  });
};

window.addEventListener('scroll', () => {
  handleScrollAnimation();
});

// Modal Functionality for Interactive Areas & Diseases
const infoModal = document.getElementById("infoModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

const areaButtons = document.querySelectorAll(".area-button");
const diseaseButtons = document.querySelectorAll(".disease-button");

function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.textContent = content;
  infoModal.classList.add("open");
}

areaButtons.forEach(button => {
  button.addEventListener("click", () => {
    openModal(button.dataset.title, button.dataset.content);
  });
});

diseaseButtons.forEach(button => {
  button.addEventListener("click", () => {
    openModal(button.dataset.title, button.dataset.content);
  });
});

closeModalBtn.addEventListener("click", () => {
  infoModal.classList.remove("open");
});

infoModal.addEventListener("click", (e) => {
  if (e.target === infoModal) {
    infoModal.classList.remove("open");
  }
});
