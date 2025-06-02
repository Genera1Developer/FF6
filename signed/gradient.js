document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("gradientSlider");
  const html = document.documentElement;

  if (slider && html) {
    slider.addEventListener("input", () => {
      const value = slider.value;
      html.style.backgroundPosition = `center ${value}%`;
    });
  }
});
