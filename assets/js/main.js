"use strict";

(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) {
    return;
  }

  const setExpanded = (expanded) => {
    menuToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    mobileMenu.classList.toggle("hidden", !expanded);
  };

  setExpanded(false);

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setExpanded(!isExpanded);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setExpanded(false);
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setExpanded(false));
  });
})();

(function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-form-status");

  if (!form || !status) {
    return;
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showStatus = (message, isError) => {
    status.textContent = message;
    status.classList.toggle("text-[#c89472]", Boolean(isError));
    status.classList.toggle("text-emerald-400", !isError);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = (form.elements.fullName.value || "").trim();
    const email = (form.elements.email.value || "").trim();
    const message = (form.elements.message.value || "").trim();

    if (!fullName || !email || !message) {
      showStatus("Uzupelnij wszystkie pola formularza.", true);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      showStatus("Podaj poprawny adres email.", true);
      return;
    }

    const subject = encodeURIComponent("Zapytanie ze strony STRIX Fight Club");
    const body = encodeURIComponent(
      "Imie i nazwisko: " +
        fullName +
        "\nEmail: " +
        email +
        "\n\nWiadomosc:\n" +
        message
    );

    showStatus("Otwieram Twoj program pocztowy...", false);
    window.location.href = "mailto:klub@strixfightclub.pl?subject=" + subject + "&body=" + body;
  });
})();

(function () {
  const track = document.getElementById("manual-feed-track");
  const prevButton = document.getElementById("feed-prev");
  const nextButton = document.getElementById("feed-next");

  if (!track || !prevButton || !nextButton) {
    return;
  }

  const scrollAmount = () => Math.max(track.clientWidth * 0.85, 280);

  prevButton.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
})();

(function () {
  const treningiTrack = document.getElementById("gallery-treningi-track");
  const walkiTrack = document.getElementById("gallery-walki-track");
  const videoTrack = document.getElementById("gallery-video-track");

  if (!treningiTrack && !walkiTrack && !videoTrack) {
    return;
  }

  const sliderConfigs = [
    {
      track: treningiTrack,
      prevButton: document.getElementById("gallery-treningi-prev"),
      nextButton: document.getElementById("gallery-treningi-next")
    },
    {
      track: walkiTrack,
      prevButton: document.getElementById("gallery-walki-prev"),
      nextButton: document.getElementById("gallery-walki-next")
    },
    {
      track: videoTrack,
      prevButton: document.getElementById("gallery-video-prev"),
      nextButton: document.getElementById("gallery-video-next")
    }
  ];

  const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
  const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);
  const ITEMS_PER_PAGE = 6;

  let lightboxOverlay = null;
  let lightboxImage = null;

  const ensureLightbox = () => {
    if (lightboxOverlay && lightboxImage) {
      return;
    }

    lightboxOverlay = document.createElement("div");
    lightboxOverlay.className = "fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 p-4";
    lightboxOverlay.setAttribute("role", "dialog");
    lightboxOverlay.setAttribute("aria-modal", "true");
    lightboxOverlay.setAttribute("aria-label", "Podglad zdjecia");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "absolute right-4 top-4 rounded-md border border-zinc-600 bg-black/60 px-3 py-1 text-sm font-bold uppercase tracking-wider text-white hover:bg-black";
    closeButton.textContent = "Zamknij";

    lightboxImage = document.createElement("img");
    lightboxImage.className = "max-h-[90vh] max-w-[95vw] rounded-lg border border-zinc-700 object-contain";

    lightboxOverlay.appendChild(closeButton);
    lightboxOverlay.appendChild(lightboxImage);
    document.body.appendChild(lightboxOverlay);

    const closeLightbox = () => {
      if (!lightboxOverlay) {
        return;
      }

      lightboxOverlay.classList.add("hidden");
      lightboxOverlay.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");
    };

    closeButton.addEventListener("click", closeLightbox);

    lightboxOverlay.addEventListener("click", (event) => {
      if (event.target === lightboxOverlay) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightboxOverlay && !lightboxOverlay.classList.contains("hidden")) {
        closeLightbox();
      }
    });
  };

  const openLightbox = (src, alt) => {
    ensureLightbox();

    if (!lightboxOverlay || !lightboxImage) {
      return;
    }

    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxOverlay.classList.remove("hidden");
    lightboxOverlay.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  };

  const getExtension = (path) => {
    const cleanPath = path.split("?")[0].split("#")[0].toLowerCase();
    const dotIndex = cleanPath.lastIndexOf(".");
    return dotIndex >= 0 ? cleanPath.slice(dotIndex) : "";
  };

  const renderEmptyState = (container, message) => {
    if (!container) {
      return;
    }

    container.innerHTML = "";
    const page = document.createElement("div");
    page.className = "gallery-page";

    const card = document.createElement("div");
    card.className = "gallery-empty rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400";
    card.textContent = message;
    page.appendChild(card);
    container.appendChild(page);
  };

  const renderPages = (container, items) => {
    if (!container) {
      return;
    }

    container.innerHTML = "";

    for (let startIndex = 0; startIndex < items.length; startIndex += ITEMS_PER_PAGE) {
      const page = document.createElement("div");
      page.className = "gallery-page";
      items.slice(startIndex, startIndex + ITEMS_PER_PAGE).forEach((item) => {
        page.appendChild(item);
      });
      container.appendChild(page);
    }
  };

  const updateSliderState = (sliderState) => {
    if (!sliderState) {
      return;
    }

    const { track, prevButton, nextButton } = sliderState;
    if (!track || !prevButton || !nextButton) {
      return;
    }

    const pagesCount = track.querySelectorAll(".gallery-page").length;
    const maxIndex = Math.max(0, pagesCount - 1);
    sliderState.pageIndex = Math.max(0, Math.min(sliderState.pageIndex, maxIndex));

    const viewport = track.parentElement;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.gap || "0") || 0;
    const viewportWidth = viewport ? viewport.clientWidth : track.clientWidth;
    const pages = Array.from(track.querySelectorAll(".gallery-page"));

    pages.forEach((page) => {
      page.style.width = String(viewportWidth) + "px";
      page.style.minWidth = String(viewportWidth) + "px";
    });

    const pageWidth = viewportWidth + gap;
    const trackWidth = pagesCount > 0 ? viewportWidth * pagesCount + gap * (pagesCount - 1) : viewportWidth;
    track.style.width = String(trackWidth) + "px";
    track.style.marginLeft = "-" + String(sliderState.pageIndex * pageWidth) + "px";

    prevButton.disabled = sliderState.pageIndex === 0;
    nextButton.disabled = sliderState.pageIndex >= maxIndex;
  };

  const initSlider = (sliderState) => {
    const { track, prevButton, nextButton } = sliderState;
    if (!track || !prevButton || !nextButton) {
      return;
    }

    prevButton.addEventListener("click", () => {
      sliderState.pageIndex -= 1;
      updateSliderState(sliderState);
    });

    nextButton.addEventListener("click", () => {
      sliderState.pageIndex += 1;
      updateSliderState(sliderState);
    });

    updateSliderState(sliderState);
  };

  const createImageCard = (src, alt) => {
    const card = document.createElement("div");
    card.className = "gallery-item overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40";

    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.loading = "lazy";
    image.className = "h-56 w-full cursor-zoom-in object-cover";

    image.addEventListener("click", () => {
      openLightbox(src, alt);
    });

    card.appendChild(image);
    return card;
  };

  const createVideoCard = (src) => {
    const card = document.createElement("div");
    card.className = "gallery-item overflow-hidden rounded-lg border border-zinc-800 bg-black";

    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.setAttribute("controls", "controls");
    video.setAttribute("playsinline", "playsinline");
    video.preload = "auto";
    video.className = "h-72 w-full object-cover bg-black";

    card.appendChild(video);
    return card;
  };

  const fetchFolderFiles = async (folderPath, allowedExtensions) => {
    const response = await fetch(folderPath, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Cannot list folder: " + folderPath);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const links = Array.from(doc.querySelectorAll("a[href]"));

    const files = links
      .map((link) => link.getAttribute("href") || "")
      .map((href) => href.trim())
      .filter((href) => href && !href.endsWith("/") && href !== "../")
      .map((href) => {
        try {
          return new URL(href, window.location.origin + folderPath).pathname;
        } catch (_error) {
          return null;
        }
      })
      .filter(Boolean)
      .filter((pathname) => allowedExtensions.has(getExtension(pathname)));

    files.sort((a, b) => a.localeCompare(b, "pl", { sensitivity: "base" }));
    return files;
  };

  const loadImages = async (container, folderPath, sectionName) => {
    if (!container) {
      return;
    }

    try {
      const files = await fetchFolderFiles(folderPath, IMAGE_EXTENSIONS);

      if (!files.length) {
        renderEmptyState(container, "Brak zdjec w tym folderze.");
        return;
      }

      const cards = files.map((filePath, index) => {
        return createImageCard(filePath, sectionName + " " + String(index + 1));
      });
      renderPages(container, cards);
    } catch (_error) {
      renderEmptyState(
        container,
        "Nie mozna automatycznie odczytac folderu. Sprawdz, czy hosting udostepnia listing katalogow."
      );
    }
  };

  const loadVideos = async (container, folderPath) => {
    if (!container) {
      return;
    }

    try {
      const files = await fetchFolderFiles(folderPath, VIDEO_EXTENSIONS);

      if (!files.length) {
        renderEmptyState(container, "Dodaj filmy do folderu assets/videos.");
        return;
      }

      const cards = files.map((filePath) => {
        return createVideoCard(filePath);
      });
      renderPages(container, cards);
    } catch (_error) {
      renderEmptyState(
        container,
        "Nie mozna automatycznie odczytac folderu z filmami. Sprawdz ustawienia hostingu."
      );
    }
  };

  const sliderStates = sliderConfigs.map((config) => ({
    track: config.track,
    prevButton: config.prevButton,
    nextButton: config.nextButton,
    pageIndex: 0
  }));

  sliderStates.forEach((sliderState) => {
    initSlider(sliderState);
  });

  const refreshArrowState = () => {
    sliderStates.forEach((sliderState) => {
      updateSliderState(sliderState);
    });
  };

  window.addEventListener("resize", refreshArrowState);

  Promise.all([
    loadImages(treningiTrack, "/assets/images/treningi/", "Trening"),
    loadImages(walkiTrack, "/assets/images/walki/", "Walka"),
    loadVideos(videoTrack, "/assets/videos/")
  ]).finally(refreshArrowState);
})();
