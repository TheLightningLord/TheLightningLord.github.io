// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Multi-step form logic
let currentStep = 0;

function showStep(step) {
  const steps = document.querySelectorAll(".form-step");
  steps.forEach((stepDiv, index) => {
    stepDiv.classList.remove("active");
    if (index === step) {
      stepDiv.classList.add("active");
    }
  });
}

function nextStep() {
  const steps = document.querySelectorAll(".form-step");
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// Show the first step on page load
showStep(currentStep);

// Form submission (purely for demonstration)
// Replace with your desired approach (e.g., Formspree, Netlify) for actual data collection.
const multiStepForm = document.getElementById("multiStepForm");
multiStepForm.addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you! Your information has been submitted. We will contact you soon.");
  // You can also redirect, e.g.: window.location.href = "thank-you.html";
});
