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
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      // Optional: Stop observing once revealed
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
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
