(function () {
  const scroller = document.querySelector(".carousel");
  const track = scroller.querySelector(".carousel-track");
  if (!scroller || !track) return;

  track.insertAdjacentHTML("beforeend", track.innerHTML);

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let half = 0;
  let rafId = null;
  const SPEED = 0.6;

  function calcHalf() {
    half = track.scrollWidth / 2;
  }

  function wrapIfNeeded() {
    if (half <= 0) return;
    if (scroller.scrollLeft >= half) {
      scroller.scrollLeft -= half;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft += half;
    }
  }

  function tick() {
    scroller.scrollLeft += SPEED;
    wrapIfNeeded();
    rafId = requestAnimationFrame(tick);
  }
  function startAuto() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }
  function stopAuto() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function onDown(x) {
    isDragging = true;
    startX = x;
    startScrollLeft = scroller.scrollLeft;
    scroller.classList.add("dragging");
    stopAuto();
  }
  function onMove(x) {
    if (!isDragging) return;
    scroller.scrollLeft = startScrollLeft - (x - startX);
    wrapIfNeeded();
  }
  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    scroller.classList.remove("dragging");
    startAuto();
  }

  scroller.addEventListener("mousedown", (e) => onDown(e.pageX));
  window.addEventListener("mousemove", (e) => onMove(e.pageX));
  window.addEventListener("mouseup", onUp);

  scroller.addEventListener("touchstart", (e) => onDown(e.touches[0].pageX), {
    passive: true,
  });
  scroller.addEventListener("touchmove", (e) => onMove(e.touches[0].pageX), {
    passive: true,
  });
  scroller.addEventListener("touchend", onUp);

  scroller.addEventListener("scroll", wrapIfNeeded);

  window.addEventListener("load", () => {
    calcHalf();
    startAuto();
  });
  window.addEventListener("resize", calcHalf);
})();
