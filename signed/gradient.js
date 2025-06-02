document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("customSlider");
  const thumb = document.getElementById("sliderThumb");
  const html = document.documentElement;

  const sliderHeight = slider.clientHeight;
  let isDragging = false;

  const updateBackground = (y) => {
    const rect = slider.getBoundingClientRect();
    let offsetY = y - rect.top;
    offsetY = Math.max(0, Math.min(offsetY, sliderHeight));
    const percentage = (offsetY / sliderHeight) * 100;
    thumb.style.top = `${offsetY}px`;
    html.style.backgroundPosition = `center ${percentage}%`;
  };

  thumb.addEventListener("mousedown", () => {
    isDragging = true;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      updateBackground(e.clientY);
    }
  });

  // Mobile support finally thank god
  thumb.addEventListener("touchstart", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  document.addEventListener("touchmove", (e) => {
    if (isDragging) {
      updateBackground(e.touches[0].clientY);
    }
  });
});
