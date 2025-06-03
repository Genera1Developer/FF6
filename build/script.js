function switchTab(tab) {
  document.getElementById("results-web").style.display = tab === "web" ? "block" : "none";
  document.getElementById("results-images").style.display = tab === "images" ? "block" : "none";
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`tab-${tab}`).classList.add("active");
  localStorage.setItem("tab", tab);
}

function searchAll(e) {
  e.preventDefault();
  const query = document.getElementById("query").value.trim();
  if (!query || isBlocked(query)) {
    alert("Blocked or empty search.");
    return;
  }

  const fakeEngines = ["Google", "Bing", "DuckDuckGo", "Yandex", "Ecosia", "Brave"];
  const resultsWeb = document.getElementById("results-web");
  const resultsImages = document.getElementById("results-images");

  resultsWeb.innerHTML = "";
  resultsImages.innerHTML = "";

  fakeEngines.forEach(engine => {
    // Web result
    resultsWeb.innerHTML += `
      <div class="result">
        <a href="https://${engine.toLowerCase()}.com/search?q=${encodeURIComponent(query)}" target="_blank">
          <h2>${query} - from ${engine}</h2>
        </a>
        <p>This is a mock description from ${engine}.</p>
        <p class="source">${engine}</p>
      </div>`;

    // Image result
    resultsImages.innerHTML += `
      <div class="result">
        <img src="https://placekitten.com/300/200" alt="${query}" style="max-width: 100%; border-radius: 10px;" />
        <p>${query} image result from ${engine}</p>
        <p class="source">${engine}</p>
      </div>`;
  });
}

window.onload = () => {
  const savedTab = localStorage.getItem("tab") || "web";
  switchTab(savedTab);
};
