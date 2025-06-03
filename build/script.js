document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  if (!query || isBlocked(query)) {
    alert("Invalid or blocked query.");
    return;
  }

  async function summaryFromGoogle(query) {
    const summaryBox = document.getElementById("summaryBox");
    summaryBox.innerHTML = "<p>Trying to get summary from Google...</p>";

    try {
      const html = await fetch(`https://www.google.com/webhp?igu=1&hl=en&gl=us&q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }).then(r => r.text());

      const doc = new DOMParser().parseFromString(html, "text/html");

      // Try to find snippet box
      const snippet = doc.querySelector("div[data-attrid='wa:/description'] span") ||
                      doc.querySelector(".hgKElc") ||  // General snippet
                      doc.querySelector("div[data-content-feature='1'] span"); // Sometimes in AI boxes

      if (snippet && snippet.textContent.trim().length > 50) {
        summaryBox.innerHTML = `<strong>Summary (from Google):</strong><br>${snippet.textContent.trim()}`;
      } else {
        summaryBox.innerHTML = `<p><i>No summary found.</i></p>`;
      }
    } catch (err) {
      console.warn("Google summary failed, retrying in a few seconds...");
      summaryBox.innerHTML = `<p><i>Still working... checking again shortly.</i></p>`;

      // Wait 2 seconds and try again (slow-loading AI responses)
      setTimeout(() => summaryFromGoogle(query), 2000);
    }
  }

  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "<p>Loading...</p>";

  let allResults = [];

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
  if (allResults.length > 15) {
    allResults = allResults.slice(2, -13);
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
