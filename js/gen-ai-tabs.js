document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  // Function to apply dynamic layout classes based on aspect ratio
  function applyGalleryLayout() {
    const workItems = document.querySelectorAll(".works-gallery .work-item");
    workItems.forEach((item) => {
      const img = item.querySelector("img");
      const video = item.querySelector("video");
      const media = img || video;

      if (!media) return;

      const checkRatio = () => {
        let width, height;
        if (img) {
          width = img.naturalWidth;
          height = img.naturalHeight;
        } else if (video) {
          width = video.videoWidth;
          height = video.videoHeight;
        }

        if (width && height) {
          const ratio = width / height;
          item.classList.remove("vertical", "horizontal");

          if (ratio < 0.8) {
            item.classList.add("vertical");
          } else if (ratio > 1.3) {
            item.classList.add("horizontal");
          }
        }
      };

      if (img) {
        if (img.complete) checkRatio();
        else img.onload = checkRatio;
      } else if (video) {
        if (video.readyState >= 1) checkRatio();
        else video.onloadedmetadata = checkRatio;
      }
    });
  }

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
        // Re-apply layout when tab changes to ensure hidden panels get measured correctly
        setTimeout(applyGalleryLayout, 50);
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

      // Find the container for this image group
      const groupContainer = workItem.parentElement;

      if (img && typeof openLightbox === "function") {
        openLightbox(img, groupContainer);
      }
    });
  }

  // Initial call
  applyGalleryLayout();
});
