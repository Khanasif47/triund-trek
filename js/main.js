/* ============ PAGE TRANSITION ============ */
const transition = document.querySelector(".page-transition");

window.addEventListener("load", () => {
  if (transition) transition.classList.remove("active");
  loadAllMedia();
});

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    e.preventDefault();
    transition.classList.add("active");
    setTimeout(() => window.location.href = href, 500);
  });
});

/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".media-item").forEach(item => {
  revealObserver.observe(item);
});

/* ============ LAZY LOAD MEDIA ============ */
const mediaObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    loadMedia(entry.target);
    mediaObserver.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document.querySelectorAll("img[data-src], video").forEach(el => {
  mediaObserver.observe(el);
});

function loadMedia(el) {
  if (el.tagName === "IMG") {
    el.src = el.dataset.src;
  }
  if (el.tagName === "VIDEO") {
    const src = el.querySelector("source");
    if (src?.dataset.src) {
      src.src = src.dataset.src;
      el.load();
      el.play().catch(()=>{});
    }
  }
}

function loadAllMedia() {
  document.querySelectorAll("video source[data-src]").forEach(src => {
    src.src = src.dataset.src;
    src.parentElement.load();
    src.parentElement.play().catch(()=>{});
  });
}

/* ============ AUTO PAUSE VIDEOS ============ */
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(()=>{});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll("video").forEach(v => videoObserver.observe(v));

/* ============ LIGHTBOX ============ */
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.innerHTML = `
  <span id="lightbox-close">×</span>
  <div id="lightbox-content"></div>
`;
document.body.appendChild(lightbox);

const lbContent = document.getElementById("lightbox-content");
document.getElementById("lightbox-close").onclick = () => {
  lightbox.classList.remove("show");
  lbContent.innerHTML = "";
};

document.querySelectorAll(".media-item").forEach(item => {
  item.addEventListener("click", () => {
    const media = item.querySelector("img, video");
    if (!media) return;
    lbContent.innerHTML = "";
    const clone = media.cloneNode(true);
    clone.controls = true;
    lbContent.appendChild(clone);
    lightbox.classList.add("show");
  });
});
