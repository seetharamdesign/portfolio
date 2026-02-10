// Dynamic Navbar Scroll Effect
const navElement = document.querySelector(".navbar");

const handleNavScroll = () => {
  if (window.scrollY > 50) {
    navElement.classList.add("scrolled");
  } else {
    navElement.classList.remove("scrolled");
  }
};

// Initial Check
handleNavScroll();

window.addEventListener("scroll", handleNavScroll);

// Scroll Animation Observer
const observerOptions = {
  root: null,
  rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the bottom
  threshold: 0.05,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Reveal once, then stop watching
    }
  });
}, observerOptions);

const revealableElements = document.querySelectorAll(
  "section, .reveal-trigger",
);

revealableElements.forEach((el) => {
  // Reveal introduction, experience, and project instantly
  if (el.id === "introduction" || el.id === "experience-container") {
    el.classList.add("visible");
  } else {
    observer.observe(el);
  }
});

// click-image to scroll to id

document.addEventListener("click", (e) => {
  const img = e.target.closest(".logo");
  if (!img) return;

  const targetId = img.dataset.target;
  const target = document.getElementById(targetId);

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
});
