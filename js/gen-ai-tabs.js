document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");

      // Remove active class from all buttons and panels
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      // Add active class to clicked button and target panel
      button.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // Lightbox Integration for GenAI images
  const contentContainer = document.querySelector(".tab-content-container");
  if (contentContainer) {
    contentContainer.addEventListener("click", (e) => {
      const workItem = e.target.closest(".work-item");
      if (!workItem) return;

      const img = workItem.querySelector("img");
      if (!img) return;

      // Find the container for this image group (e.g., works-2d-left-img)
      const groupContainer = workItem.parentElement;

      if (img && typeof openLightbox === "function") {
        openLightbox(img, groupContainer);
      }
    });
  }
});
