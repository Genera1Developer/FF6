document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("gradientSlider");
  const background = document.getElementById("gradient-background");

  slider.addEventListener("input", () => {
    const value = slider.value;
    background.style.backgroundPosition = `center ${value}%`;
  });
});
