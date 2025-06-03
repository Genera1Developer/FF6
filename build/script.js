document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  if (!query || isBlocked(query)) {
    alert("Invalid or blocked query.");
    return;
  }

  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "<p>Searching...</p>";

  const allResults = [];

  for (const engine of ENGINES) {
    try {
      const html = await fetch(`https://corsproxy.io/?${engine.url(query)}`).then(r => r.text());
      const doc = new DOMParser().parseFromString(html, "text/html");
      const results = engine.parser(doc);
      allResults.push(...results);
    } catch (err) {
      console.error("Error fetching from", engine.name, err);
    }
  }

  if (allResults.length === 0) {
    resultsContainer.innerHTML = "<p>No results found or blocked by CORS.</p>";
    return;
  }

  resultsContainer.innerHTML = allResults.map(res => `
    <div class="result-card">
      <a href="${res.href}" target="_blank">${res.title}</a>
      <p>${res.desc}</p>
      <div class="result-source">${res.source}</div>
    </div>
  `).join("");
});
