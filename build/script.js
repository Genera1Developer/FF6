document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("query").value.trim();
  if (!query) return;

  saveTab(query); 
  performSearch(query);
});

function performSearch(query) {
  document.getElementById("resultsContainer").innerHTML = "";
  document.getElementById("summaryContainer").innerHTML = `<p>Searching for "${query}"...</p>`;

  const results = [
    {
      title: `Google: ${query}`,
      link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      description: "View search results from Google.",
      source: "Google"
    },
    {
      title: `Bing: ${query}`,
      link: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      description: "View search results from Bing.",
      source: "Bing"
    },
    {
      title: `DuckDuckGo: ${query}`,
      link: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      description: "View search results from DuckDuckGo.",
      source: "DuckDuckGo"
    },
    {
      title: `Ecosia: ${query}`,
      link: `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`,
      description: "View search results from Ecosia.",
      source: "Ecosia"
    },
    {
      title: `Brave: ${query}`,
      link: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
      description: "View search results from Brave.",
      source: "Brave"
    },
    {
      title: `Yandex: ${query}`,
      link: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
      description: "View search results from Yandex.",
      source: "Yandex"
    }
  ];

  displaySummary(query);
  displayResults(results);
}

function displaySummary(query) {
  const summaryText = `This is a multi-search engine query for: "${query}". Click any result below to open it.`;
  document.getElementById("summaryContainer").innerHTML = `<p>${summaryText}</p>`;
}

function displayResults(results) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  results.forEach((result) => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <a href="${result.link}" target="_blank">${result.title}</a>
      <p>${result.description}</p>
      <div class="result-source">${result.source}</div>
    `;

    container.appendChild(card);
  });
}
