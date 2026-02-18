/* ===============================
   PORTFOLIO CONTINUOUS SCROLL
================================ */

let globalPaused = false;
let activePlayers = new Set();

function initScrollers() {
  document.querySelectorAll(".portfolio-wrapper").forEach((wrapper) => {
    const track = wrapper.querySelector(".portfolio-container");
    const scroller = wrapper.querySelector(".portfolio-scroller");
    const left = wrapper.querySelector(".arrow.left");
    const right = wrapper.querySelector(".arrow.right");
    const viewAllBtn = wrapper.querySelector(".view-all-btn");

    if (!track || !scroller) return;

    // 1. Double the content for seamless looping - only once
    if (!wrapper.dataset.initialized) {
      const originalContent = track.innerHTML;
      const cloneContainer = document.createElement("div");
      cloneContainer.innerHTML = originalContent;

      // Mark original items
      Array.from(track.children).forEach((child) =>
        child.classList.add("original-item"),
      );

      // Add clones and mark them
      Array.from(cloneContainer.children).forEach((clone) => {
        clone.classList.add("clone");
        track.appendChild(clone);
      });

      wrapper.dataset.initialized = "true";
    }

    let scrollX = 0;
    let localPaused = false;
    let gridMode = false;
    let dragging = false;
    let startX = 0;

    function loop() {
      if (!globalPaused && !localPaused && !dragging && !gridMode) {
        scrollX += 0.8;
        if (scrollX >= track.scrollWidth / 2) {
          scrollX = 0;
        }
        track.style.transform = `translateX(${-scrollX}px)`;
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    // View All Toggle
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        gridMode = !gridMode;
        wrapper.classList.toggle("grid-mode");
        viewAllBtn.textContent = gridMode ? "Close Grid" : "View All";

        if (!gridMode) {
          // Reset transform when exiting grid mode
          track.style.transform = `translateX(${-scrollX}px)`;
        }
      });
    }

    // Hover pause
    scroller.addEventListener("mouseenter", () => (localPaused = true));
    scroller.addEventListener("mouseleave", () => (localPaused = false));

    // Drag scroll
    scroller.addEventListener("mousedown", (e) => {
      if (gridMode) return;
      dragging = true;
      startX = e.pageX + scrollX;
      scroller.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
      scroller.style.cursor = "grab";
    });

    scroller.addEventListener("mousemove", (e) => {
      if (!dragging || gridMode) return;
      scrollX = startX - e.pageX;

      const limit = track.scrollWidth / 2;
      if (scrollX >= limit) scrollX -= limit;
      if (scrollX < 0) scrollX += limit;

      track.style.transform = `translateX(${-scrollX}px)`;
    });

    // Arrow controls
    if (left) {
      left.addEventListener("click", () => {
        if (gridMode) return;
        scrollX -= 300;
        const limit = track.scrollWidth / 2;
        if (scrollX < 0) scrollX += limit;
        track.style.transform = `translateX(${-scrollX}px)`;
      });
    }
    if (right) {
      right.addEventListener("click", () => {
        if (gridMode) return;
        scrollX += 300;
        const limit = track.scrollWidth / 2;
        if (scrollX >= limit) scrollX -= limit;
        track.style.transform = `translateX(${-scrollX}px)`;
      });
    }

    scroller.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      openLightbox(img, track);
    });
  });
}

// Simple initialization
window.addEventListener("load", () => {
  initScrollers();
  initYouTubeAPI();
});

/* ===============================
   YOUTUBE API INTEGRATION
================================ */

function initYouTubeAPI() {
  if (!window.YT) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

window.onYouTubeIframeAPIReady = function () {
  const iframes = document.querySelectorAll(".portfolio-container iframe");
  iframes.forEach((iframe, index) => {
    if (!iframe.id) iframe.id = "yt-player-" + index;
    new YT.Player(iframe.id, {
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  });
};

function onPlayerStateChange(event) {
  // YT.PlayerState.PLAYING = 1, YT.PlayerState.BUFFERING = 3
  if (event.data === 1 || event.data === 3) {
    activePlayers.add(event.target);
    globalPaused = true;
  } else {
    activePlayers.delete(event.target);
    if (activePlayers.size === 0) {
      globalPaused = false;
    }
  }
}

/* ===============================
   LIGHTBOX 
================================ */

let lightbox = document.getElementById("lightbox");
if (!lightbox) {
  lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.innerHTML = `
    <span class="close">&times;</span>
    <span class="l-arrow prev">&#10094;</span>
    <span class="l-arrow next">&#10095;</span>
    <img />
  `;
  document.body.appendChild(lightbox);
}

const lightboxImg = lightbox.querySelector("img");
const closeBtn = lightbox.querySelector(".close");
const prevBtn = lightbox.querySelector(".l-arrow.prev");
const nextBtn = lightbox.querySelector(".l-arrow.next");

let scale = 1,
  lx = 0,
  ly = 0;
let lightboxDragging = false,
  lstartX = 0,
  lstartY = 0;
let currentGallery = [];
let currentIndex = 0;

function openLightbox(imgEl, container) {
  globalPaused = true;
  lightbox.classList.add("show");
  const allImgs = Array.from(container.querySelectorAll("img"));
  const count = allImgs.length / 2;
  currentGallery = allImgs.slice(0, count).map((img) => img.src);
  currentIndex = allImgs.indexOf(imgEl) % count;

  updateLightboxImage();
  scale = 1;
  lx = ly = 0;
  updateTransform();
}

function updateLightboxImage() {
  lightboxImg.src = currentGallery[currentIndex];
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateLightboxImage();
}

function prevImage() {
  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateLightboxImage();
}

function closeLightbox() {
  globalPaused = false;
  lightbox.classList.remove("show");
}

if (closeBtn) closeBtn.onclick = closeLightbox;
if (prevBtn)
  prevBtn.onclick = (e) => {
    e.stopPropagation();
    prevImage();
  };
if (nextBtn)
  nextBtn.onclick = (e) => {
    e.stopPropagation();
    nextImage();
  };

lightbox.onclick = (e) => {
  if (e.target === lightbox) closeLightbox();
};

window.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

lightboxImg.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(1, scale), 4);
    updateTransform();
  },
  { passive: false },
);

lightboxImg.addEventListener("mousedown", (e) => {
  lightboxDragging = true;
  lstartX = e.clientX - lx;
  lstartY = e.clientY - ly;
  lightboxImg.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  lightboxDragging = false;
  lightboxImg.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (!lightboxDragging) return;
  lx = e.clientX - lstartX;
  ly = e.clientY - lstartY;
  updateTransform();
});

function updateTransform() {
  lightboxImg.style.transform = `translate(${lx}px, ${ly}px) scale(${scale})`;
}
