// Automatically update the footer year
document.getElementById("year").textContent = new Date().getFullYear();

// FAQ Accordion
const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion-header");
  
  header.addEventListener("click", () => {
    // Close any other open accordion item
    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });
// 1. Update the footer year (existing code)
document.getElementById("year").textContent = new Date().getFullYear();

// 2. FAQ Accordion (existing code) - if you have it
const accordionItems = document.querySelectorAll(".accordion-item");
accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion-header");
  header.addEventListener("click", () => {
    // Close any other open accordion
    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });
    // Toggle current item
    item.classList.toggle("active");
  });
});

// 3. MODAL FUNCTIONALITY FOR AREAS & DISEASES
const infoModal = document.getElementById("infoModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

// Collect all buttons that should trigger the modal
const areaButtons = document.querySelectorAll(".area-button");
const diseaseButtons = document.querySelectorAll(".disease-button");

// Helper function to open modal with correct content
function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.textContent = content;
  infoModal.classList.add("open");
}

// Attach event listeners to each button
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

// Close modal on 'X' click
closeModalBtn.addEventListener("click", () => {
  infoModal.classList.remove("open");
});

// Close modal if user clicks outside the modal content
infoModal.addEventListener("click", (e) => {
  if (e.target === infoModal) {
    infoModal.classList.remove("open");
  }
});
    // Toggle the current item
    item.classList.toggle("active");
  });
});
