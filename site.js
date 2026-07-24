for (const carousel of document.querySelectorAll("[data-carousel]")) {
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dots = carousel.querySelector("[data-carousel-dots]");
  const live = carousel.querySelector("[data-carousel-live]");
  const name = carousel.dataset.carouselName || "Slide";
  let index = 0;
  let touchStartX = null;

  const buttons = slides.map((_, slideIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel-dot";
    button.setAttribute("aria-label", `Show ${name.toLowerCase()} ${slideIndex + 1}`);
    button.addEventListener("click", () => show(slideIndex));
    dots.appendChild(button);
    return button;
  });

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== index;
    });
    buttons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
    live.textContent = `${name} ${index + 1} of ${slides.length}`;
  }

  previous.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      show(0);
    } else if (event.key === "End") {
      event.preventDefault();
      show(slides.length - 1);
    }
  });

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    if (touchStartX === null) {
      return;
    }
    const delta = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) >= 45) {
      show(index + (delta < 0 ? 1 : -1));
    }
  }, { passive: true });

  show(0);
}
