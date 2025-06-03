document.addEventListener("DOMContentLoaded", () => {
  loadTabs();
  loadLastQuery();
});

let currentMode = "all";

document.getElementById("modeSwitch").addEventListener("click", () => {
  currentMode = currentMode === "all" ? "images" : "all";
  document.getElementById("modeSwitch").textContent = currentMode === "all" ? "Switch to Images" : "Switch to All";
});

document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  if (!query || isBlocked(query)) {
    alert("Invalid or blocked query.");
    return;
  }

  saveTab(query);
  saveLastQuery(query);

  const resultsContainer = document.getElementById("resultsContainer");
  const summaryContainer = document.getElementById("summaryContainer");

  resultsContainer.innerHTML = "<p>Loading...</p>";
  summaryContainer.innerHTML = "";

  const allResults = [];

  for (const engine of ENGINES) {
    try {
      const response = await fetch(`https://corsproxy.io/?${engine.url(query)}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const results = currentMode === "all" ? engine.parser(doc) : engine.imageParser ? engine.imageParser(doc) : [];
      allResults.push(...results);
    } catch (err) {
      console.error("Error fetching from", engine.name, err);
    }
  }

  if (allResults.length === 0) {
    resultsContainer.innerHTML = "<p>No results found or blocked by CORS.</p>";
    return;
  }

  if (currentMode === "images") {
    resultsContainer.innerHTML = `<div class="image-grid">${allResults.map(img => `
      <a href="${img.href}" target="_blank">
        <img src="${img.href}" alt="result image">
      </a>
    `).join("")}</div>`;
  } else {
    resultsContainer.innerHTML = allResults.map(res => `
      <div class="result-card">
        <a href="${res.href}" target="_blank">${res.title}</a>
        <p>${res.desc}</p>
        <div class="result-source">${res.source}</div>
      </div>
    `).join("");

    try {
      const duck = await fetch(`https://corsproxy.io/?https://html.duckduckgo.com/html?q=${encodeURIComponent(query)}`);
      const html = await duck.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const snippet = doc.querySelector(".module--about .module__text, .result__snippet");
      summaryContainer.innerHTML = snippet ? `<p>${snippet.textContent.trim()}</p>` : "<p>No summary found.</p>";
    } catch {
      summaryContainer.innerHTML = "<p>Could not load summary.</p>";
    }
  }
});
