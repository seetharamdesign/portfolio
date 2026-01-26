/* ===============================
   PORTFOLIO CONTINUOUS SCROLL
================================ */

document.querySelectorAll(".portfolio-wrapper").forEach((wrapper) => {
  const track = wrapper.querySelector(".portfolio-container");
  const scroller = wrapper.querySelector(".portfolio-scroller");
  const left = wrapper.querySelector(".arrow.left");
  const right = wrapper.querySelector(".arrow.right");

  // Duplicate images (infinite scroll)
  track.innerHTML += track.innerHTML;

  let scrollX = 0;
  let paused = false;
  let dragging = false;
  let startX = 0;

  function loop() {
    if (!paused && !dragging) {
      scrollX += 0.8;
      if (scrollX >= track.scrollWidth / 2) scrollX = 0;
      track.style.transform = `translateX(${-scrollX}px)`;
    }
    requestAnimationFrame(loop);
  }
  loop();

  // Hover pause
  scroller.addEventListener("mouseenter", () => (paused = true));
  scroller.addEventListener("mouseleave", () => (paused = false));

  // Drag scroll
  scroller.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.pageX + scrollX;
    scroller.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    scroller.style.cursor = "grab";
  });

  scroller.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    scrollX = startX - e.pageX;
    track.style.transform = `translateX(${-scrollX}px)`;
  });

  // Arrow buttons
  left.addEventListener("click", () => (scrollX -= 300));
  right.addEventListener("click", () => (scrollX += 300));

  /* ✅ EVENT DELEGATION FOR IMAGE CLICK */
  scroller.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;

    paused = true; // stop animation
    openLightbox(img.src);
  });
});

/* ===============================
   LIGHTBOX
================================ */

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.innerHTML = `
  <span class="close">&times;</span>
  <img />
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");
const closeBtn = lightbox.querySelector(".close");

let scale = 1,
  x = 0,
  y = 0;
let dragging = false,
  startX = 0,
  startY = 0;

function openLightbox(src) {
  lightbox.classList.add("show");
  lightboxImg.src = src;
  scale = 1;
  x = y = 0;
  updateTransform();
}

closeBtn.onclick = () => lightbox.classList.remove("show");
lightbox.onclick = (e) => {
  if (e.target === lightbox) lightbox.classList.remove("show");
};

// Zoom
lightboxImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.min(Math.max(1, scale), 4);
  updateTransform();
});

// Pan
lightboxImg.addEventListener("mousedown", (e) => {
  dragging = true;
  startX = e.clientX - x;
  startY = e.clientY - y;
  lightboxImg.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  dragging = false;
  lightboxImg.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  x = e.clientX - startX;
  y = e.clientY - startY;
  updateTransform();
});

function updateTransform() {
  lightboxImg.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}
