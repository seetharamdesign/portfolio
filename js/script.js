/* ===============================
   PORTFOLIO CONTINUOUS SCROLL
================================ */

function initAll() {
  console.log("Initializing all components...");
  try {
    initNavbar();
    initHeroParallax();
    initHeroAnimations();
    initRevealOnScroll();
    initGenAIWorks();
    initJourney();
    initSkills();
    initDesignArchive();
    initEducation();
    initContact();
    initRecentWorks();
    initScrollToTop();
    initYouTubeAPI();
    initReadMore();
    console.log("All components initialized successfully.");
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

// ... rest of initAll logic ...

/* ===== HERO PARALLAX ===== */
function initHeroParallax() {
  // Skip parallax on mobile — CSS already disables it via transform:none !important
  // Running it on mobile would still cause rAF calls and layout work
  if (window.innerWidth <= 768) return;

  const heroBg = document.querySelector(".hero-bg-image");
  const introSection = document.getElementById("introduction");
  if (!heroBg || !introSection) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const sectionH = introSection.offsetHeight;

        if (scrollY <= sectionH + 100) {
          heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

function initHeroAnimations() {
  console.log("Initializing hero animations...");
  const items = document.querySelectorAll(".reveal-text-item");
  console.log(`Found ${items.length} reveal items.`);
  items.forEach((item, index) => {
    setTimeout(
      () => {
        console.log(`Revealing item ${index}: ${item.textContent}`);
        item.classList.add("is-visible");

        // Sync underline bar (H2 ::after) with text reveal
        const parentH2 = item.closest("h2");
        if (parentH2) {
          parentH2.classList.add("reveal-visible");
        }
      },
      200 + index * 150,
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}

function initScrollToTop() {
  const btn = document.getElementById("scrollToTopBtn");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 300) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

let globalPaused = false;
let activePlayers = new Set();

/* ===== 1. NAVBAR & NAVIGATION ===== */
function initNavbar() {
  const navElement = document.querySelector(".navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinksList = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links a");

  // Navbar Scroll Effect
  const handleNavScroll = () => {
    if (navElement) {
      if (window.scrollY > 50) {
        navElement.classList.add("scrolled");
      } else {
        navElement.classList.remove("scrolled");
      }
    }
  };
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  // Main Nav Scroll Spy — cache elements outside handler to avoid repeated DOM queries
  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

  const handleMainNavScrollSpy = () => {
    let current = "";
    const triggerPoint = window.innerHeight * 0.35;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (current && href === `#${current}`) {
        link.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", handleMainNavScrollSpy, { passive: true });
  handleMainNavScrollSpy();

  // Smooth Scroll & Hamburger Logic
  if (navToggle && navLinksList) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinksList.classList.toggle("active");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        if (navToggle) navToggle.classList.remove("active");
        if (navLinksList) navLinksList.classList.remove("active");

        const offset = window.innerWidth > 768 ? 70 : 0;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ===== 3. GLOBAL REVEAL ON SCROLL ===== */
function initRevealOnScroll() {
  // Use IntersectionObserver when available — far more efficient than scroll events
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            // Once revealed, stop observing to free up resources
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    document
      .querySelectorAll("section, .myExpertise-item, .reveal-trigger")
      .forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    const revealOnScroll = () => {
      const elements = document.querySelectorAll(
        "section, .myExpertise-item, .reveal-trigger",
      );
      const windowHeight = window.innerHeight;
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - 100) {
          el.classList.add("reveal-visible");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll, { passive: true });
    revealOnScroll();
  }
}

/* ===== 6. MY EXPERTISE ===== */
function initExpertise() {
  // Reveal logic now handled by initRevealOnScroll
}

/* ===== 7. GENERATIVE AI WORKS ===== */
/* ===== 7. TABBED GALLERY SYSTEM (REUSABLE) ===== */
function setupTabbedGallery(sectionId, containerId) {
  const section = document.getElementById(sectionId);
  const container = document.getElementById(containerId);
  if (!section || !container) return;

  const stickyTabs = section.querySelector(".gen-ai-sticky-tabs");
  const tabBtns = stickyTabs ? stickyTabs.querySelectorAll(".tab-btn") : [];
  const parallaxSections = container.querySelectorAll(".parallax-section");
  const entries = container.querySelectorAll(".gen-ai-entry");

  // 1. Tab Logic (Click to Scroll)
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;
      const targetEl = document.getElementById(targetId);

      // Update active tab button
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (targetEl) {
        const offset = window.innerWidth > 768 ? 200 : 115;
        const targetPosition =
          targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 2. Tab Logic (Scroll-Spy)
  const handleScrollSpy = () => {
    let currentId = "";
    const triggerPoint = window.innerHeight * 0.3;

    parallaxSections.forEach((s) => {
      const rect = s.getBoundingClientRect();
      if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
        currentId = s.id;
      }
    });

    if (currentId) {
      tabBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === currentId);
      });
    }
  };
  window.addEventListener("scroll", handleScrollSpy, { passive: true });
  handleScrollSpy();

  // 3. Entry Reveal Observer
  const entryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
        } else {
          entry.target.classList.remove("is-active");
        }
      });
    },
    { root: container, threshold: 0.5 },
  );
  entries.forEach((entry) => entryObserver.observe(entry));

  // 5. Lightbox delegate for this container
  container.addEventListener("click", (e) => {
    const media = e.target.closest("img, video");
    if (media && !e.target.closest(".view-all-card")) {
      // Limit collection to the current tab/category for better UX
      const tabCategory = media.closest(".parallax-section") || container;
      openLightbox(media, tabCategory);
    }
  });
}

function initGenAIWorks() {
  setupTabbedGallery("generative-ai-works", "gen-ai-parallax-scroll");

  // Setup drag-to-scroll for all horizontal galleries
  setupHorizontalGallery(
    "#works-2d-content .works-gallery",
    "btn-prev-2d",
    "btn-next-2d",
  );
  setupHorizontalGallery(
    "#works-video-content .works-gallery",
    "btn-prev-video",
    "btn-next-video",
  );
  setupHorizontalGallery(
    "#works-3d-content .works-gallery",
    "btn-prev-3d",
    "btn-next-3d",
  );
  setupHorizontalGallery(
    "#works-audio-content .works-gallery",
    "btn-prev-audio",
    "btn-next-audio",
  );
}

function setupHorizontalGallery(gallerySelector, btnPrevId, btnNextId) {
  const gallery = document.querySelector(gallerySelector);
  const btnPrev = document.getElementById(btnPrevId);
  const btnNext = document.getElementById(btnNextId);

  if (!gallery) return;

  // --- Show controls only if more than 4 cards ---
  const cardCount = gallery.querySelectorAll(".gen-ai-entry").length;
  const section = gallery.closest(".parallax-section");
  const controls = section ? section.querySelector(".gallery-controls") : null;
  if (controls && cardCount > 4) {
    controls.classList.add("is-visible");
  }

  // --- Button scroll ---
  if (btnPrev && btnNext) {
    btnPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      const firstCard = gallery.querySelector(".gen-ai-entry");
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = parseInt(getComputedStyle(gallery).gap) || 0;
        const scrollDistance = (cardWidth + gap) * 2; // Slide by 2 cards
        gallery.scrollBy({ left: -scrollDistance, behavior: "smooth" });
      } else {
        gallery.scrollBy({ left: -800, behavior: "smooth" });
      }
    });

    btnNext.addEventListener("click", (e) => {
      e.stopPropagation();
      const firstCard = gallery.querySelector(".gen-ai-entry");
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = parseInt(getComputedStyle(gallery).gap) || 0;
        const scrollDistance = (cardWidth + gap) * 2; // Slide by 2 cards
        gallery.scrollBy({ left: scrollDistance, behavior: "smooth" });
      } else {
        gallery.scrollBy({ left: 800, behavior: "smooth" });
      }
    });
  }

  // --- Mouse Drag scroll ---
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  gallery.addEventListener("mousedown", (e) => {
    // Ignore clicks on buttons/links so they function normally
    if (e.target.closest("button, a, .view-all-card")) return;

    isDragging = true;
    hasDragged = false;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;

    gallery.style.cursor = "grabbing";

    // Only preventDefault if it's NOT a media element.
    // This allows the 'click' event to reach our lightbox delegate.
    if (!e.target.closest("img, video, audio")) {
      e.preventDefault();
    }
  });

  // Prevent browser's native ghost image drag
  gallery.addEventListener("dragstart", (e) => {
    if (e.target.closest("img, video")) {
      e.preventDefault();
    }
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    gallery.classList.remove("is-dragging");
    gallery.style.cursor = "grab";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    if (Math.abs(walk) > 5) {
      hasDragged = true;
      gallery.classList.add("is-dragging");
    }
    gallery.scrollLeft = scrollLeft - walk;
  });

  // Prevent clicks from firing on child elements after a drag
  gallery.addEventListener(
    "click",
    (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    },
    true,
  );
}

/* ===== 8. MY JOURNEY ===== */
function initJourney() {
  const journeyEntries = document.querySelectorAll(".journey-entry");
  if (journeyEntries.length === 0) return;

  journeyEntries.forEach((entry) => {
    entry.addEventListener("click", () => {
      // Toggle only this entry — others stay open/closed as they are
      entry.classList.toggle("is-active");
    });
  });
}

/* ===== 9. EXPERTISE & SKILLS ===== */
function initSkills() {
  const skillsContainer = document.querySelector(".skills-container");
  if (!skillsContainer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(skillsContainer);
}

/* ===== 10. DESIGN ARCHIVE / PORTFOLIO ===== */
function initDesignArchive() {
  setupTabbedGallery("portfolio", "portfolio-parallax-scroll");

  // Adobe Design Works (Photoshop + Illustrator + Indesign + Web Design combined)
  setupHorizontalGallery(
    "#works-adobe-design .works-gallery",
    "btn-prev-adobe-design",
    "btn-next-adobe-design",
  );

  setupHorizontalGallery(
    "#works-archive-video .works-gallery",
    "btn-prev-archive-video",
    "btn-next-archive-video",
  );
  setupHorizontalGallery(
    "#works-projects .works-gallery",
    "btn-prev-projects",
    "btn-next-projects",
  );

  if (typeof initCarouselGallery === "function") initCarouselGallery();
}

/* ===== 11. EDUCATION ===== */
function initEducation() {
  // Currently no specific JS for education unless adding click effects
}

/* ===== 12. CONTACT ===== */
function initContact() {
  // Currently no specific JS for contact form validation listed
}

/* ===== 13. RECENT WORKS LIGHTBOX ===== */
function initRecentWorks() {
  const container = document.querySelector(".Recent-works-container");
  if (!container) return;

  container.addEventListener("click", (e) => {
    // Check if clicked element is an image or video
    const media = e.target.closest("img, video");
    
    // Ensure it's not a link or other interactive element that's being clicked
    if (media && !e.target.closest("a")) {
      openLightbox(media, container);
    }
  });
}

function initCarouselGallery() {
  const galleryGrid = document.querySelector(".modern-gallery-grid");
  // Remove old controls if they exist (we only need the grid now)
  // SCOPED FIX: Only select controls strictly associated with this gallery or removed if incorrect.
  // The global querySelector(".gallery-controls") was hiding the GenAI controls.
  // Assuming the legacy controls were adjacent or within the grid container scope if they existed.
  if (galleryGrid) {
    const oldControls = galleryGrid.parentElement.querySelector(
      ".gallery-controls.legacy-nav",
    );
    if (oldControls) oldControls.style.display = "none";
  }

  if (galleryGrid) {
    const items = Array.from(galleryGrid.querySelectorAll(".gallery-item"));
    if (items.length === 0) return;

    // 1. Create Track
    let track = galleryGrid.querySelector(".gallery-track");
    if (!track) {
      track = document.createElement("div");
      track.classList.add("gallery-track");
      // Move items into track
      items.forEach((item) => track.appendChild(item));
      galleryGrid.appendChild(track);
    }

    // 2. Clone for Seamless Loop
    // We need 1 full set of clones to seamlessly loop the 50% translate
    const clones = items.map((item) => {
      const clone = item.cloneNode(true);
      clone.classList.add("clone");
      return clone;
    });

    clones.forEach((clone) => track.appendChild(clone));

    // 3. Click to Lightbox
    track.addEventListener("click", (e) => {
      const media = e.target.closest("img, video");
      if (media && typeof openLightbox === "function") {
        openLightbox(media, galleryGrid);
      }
    });

    // No more JS scroll logic needed! CSS handles it.
  }
}
// Simple initialization

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
  const iframes = document.querySelectorAll("iframe[src*='youtube']");
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
    <span class="close" aria-label="Close">&times;</span>
    <div class="lightbox-container">
      <div class="media-wrapper">
        <img src="" />
        <video controls playsinline loop></video>
      </div>
      <div class="lightbox-nav">
        <span class="l-arrow prev" aria-label="Previous">&#8592;</span>
        <span class="l-arrow next" aria-label="Next">&#8594;</span>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);
}

const lightboxImg = lightbox.querySelector("img");
const lightboxVideo = lightbox.querySelector("video");
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

function openLightbox(mediaEl, container) {
  globalPaused = true;
  lightbox.classList.add("show");

  // Find all images and videos in this gallery container
  const allMediaElements = Array.from(
    container.querySelectorAll("img:not(.clone), video:not(.clone)"),
  );

  currentGallery = allMediaElements.map((el) => {
    const isVideo = el.tagName.toLowerCase() === "video";
    return {
      type: isVideo ? "video" : "img",
      src: isVideo ? el.querySelector("source")?.src || el.src : el.src,
    };
  });

  // Find index of clicked element
  // For cloned galleries (marquee), we handle differently if needed,
  // but selecting non-clones above simplifies it.
  // If the clicked element itself is a clone, find its counterpart.
  let targetSrc =
    mediaEl.tagName.toLowerCase() === "video"
      ? mediaEl.querySelector("source")?.src || mediaEl.src
      : mediaEl.src;

  currentIndex = currentGallery.findIndex((item) => item.src === targetSrc);
  if (currentIndex === -1) currentIndex = 0;

  updateLightboxMedia();

  scale = 1;
  lx = ly = 0;
  updateTransform();
}

function updateLightboxMedia() {
  const item = currentGallery[currentIndex];
  if (!item) return;

  if (item.type === "video") {
    lightboxImg.style.display = "none";
    lightboxVideo.style.display = "block";
    lightboxVideo.src = item.src;
    lightboxVideo.play().catch(() => {}); // Autoplay inside lightbox
  } else {
    lightboxVideo.style.display = "none";
    lightboxVideo.pause();
    lightboxImg.style.display = "block";
    lightboxImg.src = item.src;
  }
}

function nextMedia() {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateLightboxMedia();
}

function prevMedia() {
  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateLightboxMedia();
}

function closeLightbox() {
  globalPaused = false;
  lightbox.classList.remove("show");
  lightboxVideo.pause();
  lightboxVideo.src = "";
}

if (closeBtn) closeBtn.onclick = closeLightbox;
if (prevBtn)
  prevBtn.onclick = (e) => {
    e.stopPropagation();
    prevMedia();
  };
if (nextBtn)
  nextBtn.onclick = (e) => {
    e.stopPropagation();
    nextMedia();
  };

lightbox.onclick = (e) => {
  if (e.target === lightbox) closeLightbox();
};

window.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextMedia();
  if (e.key === "ArrowLeft") prevMedia();
});

lightboxImg.addEventListener(
  "wheel",
  (e) => {
    if (currentGallery[currentIndex]?.type === "video") return;
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(1, scale), 4);
    updateTransform();
  },
  { passive: false },
);

lightboxImg.addEventListener("mousedown", (e) => {
  if (currentGallery[currentIndex]?.type === "video") return;
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

/* ===== YOUTUBE API (single declaration) ===== */
// Note: initYouTubeAPI is defined only once earlier in the file — this section is intentionally empty.

/* ===== READ MORE TOGGLE ===== */
function initReadMore() {
  const entries = document.querySelectorAll(".entry-info");

  entries.forEach((info) => {
    const p = info.querySelector("p");
    if (!p) return;

    // Apply the clamp class if not already present
    if (!p.classList.contains("description-clamp")) {
      p.classList.add("description-clamp");
    }

    // Function to check if text is truncated
    const isTruncated = (el) => {
      return el.scrollHeight > el.clientHeight;
    };

    // Use a small timeout to ensure styles are applied and layout is rendered
    setTimeout(() => {
      if (isTruncated(p)) {
        // Find or create the button
        let btn = info.querySelector(".see-more-btn");
        if (!btn) {
          btn = document.createElement("button");
          btn.className = "see-more-btn";
          btn.textContent = "See more";
          info.appendChild(btn);
        }
        btn.style.display = "inline-block";

        btn.onclick = () => {
          if (p.classList.contains("description-clamp")) {
            p.classList.remove("description-clamp");
            btn.textContent = "See less";
          } else {
            p.classList.add("description-clamp");
            btn.textContent = "See more";
          }
        };
      } else {
        // If not truncated, hide the button if it exists
        const btn = info.querySelector(".see-more-btn");
        if (btn) btn.style.display = "none";
      }
    }, 100);
  });
}

// Re-check on resize
window.addEventListener("resize", () => {
  // Use a debounce or simple timeout to avoid excessive calls
  clearTimeout(window.readMoreTimeout);
  window.readMoreTimeout = setTimeout(initReadMore, 200);
});

/* ===============================
   VIEW ALL MODAL LOGIC
================================ */
function openViewAllModal(title, sectionId) {
  const modal = document.getElementById("view-all-modal");
  const modalTitle = document.getElementById("view-all-title");
  const modalGrid = document.getElementById("view-all-grid");
  const section = document.getElementById(sectionId);

  if (!modal || !section) return;

  // Set title
  modalTitle.textContent = title;

  // Clear existing items in the modal grid
  modalGrid.innerHTML = "";

  // Get original cards (not clones from the infinite scroll)
  // The items might be wrapped in .gallery-track, so we select securely
  const items = section.querySelectorAll(".gen-ai-entry:not(.clone)");

  items.forEach((item) => {
    // Clone the item
    const clonedItem = item.cloneNode(true);
    // Remove inline styles safely (assigning string to .style can throw TypeErrors)
    clonedItem.removeAttribute("style");

    // If the card has a "See more" button inside, we might want to re-initReadMore
    // or just let it be fully expanded in the grid
    const desc = clonedItem.querySelector("p.description-clamp");
    if (desc) {
      desc.classList.remove("description-clamp");
    }
    const seeMoreBtn = clonedItem.querySelector(".see-more-btn");
    if (seeMoreBtn) {
      seeMoreBtn.style.display = "none";
    }

    modalGrid.appendChild(clonedItem);
  });

  // Re-initialize lightbox listeners for the cloned grid items if they have images/videos
  // This lets users click on a media item in the pop-up and still view it in the lightbox
  modalGrid.addEventListener("click", (e) => {
    const media = e.target.closest("img, video");
    if (media) {
      if (typeof openLightbox === "function") {
        openLightbox(media, modalGrid);
      }
    }
  });

  // Pause background videos if any
  globalPaused = true;
  document.body.style.overflow = "hidden"; // Prevent background scrolling
  modal.classList.add("show");
}

function closeViewAllModal() {
  const modal = document.getElementById("view-all-modal");
  if (!modal) return;

  // Pause any playing videos inside the modal before closing
  const videos = modal.querySelectorAll("video");
  videos.forEach((v) => v.pause());

  globalPaused = false;
  document.body.style.overflow = ""; // Restore scrolling
  modal.classList.remove("show");
}

// Close modal if clicking outside the content area
document.addEventListener("click", (e) => {
  const modal = document.getElementById("view-all-modal");
  if (modal && modal.classList.contains("show") && e.target === modal) {
    closeViewAllModal();
  }
});
