document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("searchForm");
  const queryInput = document.getElementById("query");
  const resultsContainer = document.getElementById("resultsContainer");
  const summaryContainer = document.getElementById("summaryContainer");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = queryInput.value.trim();
    if (!query || isBlocked(query)) {
      alert("Invalid or blocked query.");
      return;
    }

    resultsContainer.innerHTML = "<p>Loading results...</p>";
    summaryContainer.innerHTML = "<p>Loading summary...</p>";

    const allResults = [];

    // Load summary
    try {
      const ddgSummary = await getDuckDuckGoSummary(query);
      summaryContainer.innerHTML = ddgSummary || "No summary found.";
    } catch {
      try {
        const googleSummary = await getGoogleSummary(query);
        summaryContainer.innerHTML = googleSummary || "No summary found.";
      } catch {
        summaryContainer.innerHTML = "Could not load summary.";
      }
    }

    for (const engine of ENGINES) {
      try {
        const html = await fetch(`https://corsproxy.io/?${engine.url(query)}`).then(r => r.text());
        const doc = new DOMParser().parseFromString(html, "text/html");
        const results = engine.parser(doc);
        allResults.push(...results);
      } catch (err) {
        console.warn("Error fetching from", engine.name, err);
      }
    }

    // Strip bad results
    const filtered = allResults.slice(2, -13); // Remove first 2 and last 13
    if (filtered.length === 0) {
      resultsContainer.innerHTML = "<p>No results found or blocked by CORS.</p>";
      return;
    }

    resultsContainer.innerHTML = filtered.map(res => `
      <div class="result-card">
        <a href="${res.href}" target="_blank">${res.title}</a>
        <p>${res.desc}</p>
        <div class="result-source">${res.source}</div>
      </div>
    `).join("");
  });

  function isBlocked(query) {
    const blocked = ["porn", "nazi", "child", "exploit", "cp", "illegal", "hentai"];
    return blocked.some(term => query.toLowerCase().includes(term));
  }

  async function getDuckDuckGoSummary(query) {
    const html = await fetch(`https://corsproxy.io/?https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`)
      .then(r => r.text());
    const doc = new DOMParser().parseFromString(html, "text/html");
    const result = doc.querySelector(".result__snippet");
    return result ? `<div class="summary-box">${result.textContent}</div>` : null;
  }

  async function getGoogleSummary(query) {
    const html = await fetch(`https://corsproxy.io/?https://www.google.com/search?q=${encodeURIComponent(query)}`)
      .then(r => r.text());
    const doc = new DOMParser().parseFromString(html, "text/html");
    const summary = doc.querySelector("#rso .VwiC3b");
    return summary ? `<div class="summary-box">${summary.textContent}</div>` : null;
  }
});
