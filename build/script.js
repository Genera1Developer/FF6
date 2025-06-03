document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  if (!query || isBlocked(query)) {
    alert("Invalid or blocked query.");
    return;
  }

  const resultsContainer = document.getElementById("resultsContainer");
  const summaryContainer = document.getElementById("summaryContainer");
  const imagesContainer = document.getElementById("imagesContainer");
  resultsContainer.innerHTML = "<p>Loading...</p>";
  summaryContainer.innerHTML = "";
  imagesContainer.innerHTML = "";

  const allResults = [];
  const allImages = [];

  for (const engine of ENGINES) {
    try {
      const html = await fetch(`https://corsproxy.io/?${engine.url(query)}`).then(r => r.text());
      const doc = new DOMParser().parseFromString(html, "text/html");
      const results = engine.parser(doc);
      const images = engine.imageParser ? engine.imageParser(doc) : [];
      allResults.push(...results);
      allImages.push(...images);
    } catch (err) {
      console.error("Error fetching from", engine.name, err);
    }
  }

  const filteredResults = allResults.slice(2, allResults.length - 13);
  if (filteredResults.length === 0) {
    resultsContainer.innerHTML = "<p>No results found or blocked by CORS.</p>";
  } else {
    resultsContainer.innerHTML = filteredResults.map(res => `
      <div class="result-card">
        <a href="${res.href}" target="_blank">${res.title}</a>
        <p>${res.desc}</p>
        <div class="result-source">${res.source}</div>
      </div>
    `).join("");
  }

  if (allImages.length > 0) {
    imagesContainer.innerHTML = `<h3>Images</h3><div class="image-grid">` + allImages.map(src => `
      <img src="${src}" loading="lazy">
    `).join("") + `</div>`;
  }

  try {
    const duckduckHTML = await fetch(`https://corsproxy.io/?https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`).then(r => r.text());
    const duckDoc = new DOMParser().parseFromString(duckduckHTML, "text/html");
    const snippet = duckDoc.querySelector(".result__snippet");
    if (snippet) {
      summaryContainer.innerHTML = `<p>${snippet.textContent}</p>`;
    } else {
      summaryContainer.innerHTML = `<p>No summary found.</p>`;
    }
  } catch (err) {
    summaryContainer.innerHTML = `<p>Could not load summary.</p>`;
  }
});

function isBlocked(query) {
  return BLOCKED_WORDS.some(word => query.toLowerCase().includes(word.toLowerCase()));
}
