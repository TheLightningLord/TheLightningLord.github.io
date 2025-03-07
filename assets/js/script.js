// Automatically update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// FAQ Accordion
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
