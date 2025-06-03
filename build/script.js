document.addEventListener("DOMContentLoaded", () => {
  loadTabs();
  loadLastQuery();
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

  resultsContainer.innerHTML = "<p>Loading results...</p>";
  summaryContainer.innerHTML = "<p>Loading summary...</p>";

  const allResults = [];

  for (const engine of ENGINES) {
    try {
      const response = await fetch(`https://corsproxy.io/?${engine.url(query)}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const results = engine.parser(doc);
      const trimmed = results.slice(2, results.length - 13);
      allResults.push(...trimmed);
    } catch (err) {
      console.error("Error fetching from", engine.name, err);
    }
  }

  if (allResults.length === 0) {
    resultsContainer.innerHTML = "<p>No results found or blocked by CORS.</p>";
  } else {
    resultsContainer.innerHTML = allResults.map(res => `
      <div class="result-card">
        <a href="${res.href}" target="_blank">${res.title}</a>
        <p>${res.desc}</p>
        <div class="result-source">${res.source}</div>
      </div>
    `).join("");
  }

  try {
    const duckduckgoRes = await fetch(`https://corsproxy.io/?https://html.duckduckgo.com/html?q=${encodeURIComponent(query)}`);
    const html = await duckduckgoRes.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const snippet = doc.querySelector(".module--about .module__text, .result__snippet");

    if (snippet) {
      summaryContainer.innerHTML = `<p>${snippet.textContent.trim()}</p>`;
    } else {
      summaryContainer.innerHTML = "<p>No summary found.</p>";
    }
  } catch (err) {
    summaryContainer.innerHTML = "<p>Could not load summary.</p>";
  }
});

function saveTab(query) {
  let tabs = JSON.parse(localStorage.getItem("tabs") || "[]");
  if (!tabs.includes(query)) {
    tabs.push(query);
    localStorage.setItem("tabs", JSON.stringify(tabs));
    renderTabs();
  }
}

function loadTabs() {
  const tabList = document.getElementById("tabList");
  const tabs = JSON.parse(localStorage.getItem("tabs") || "[]");
  tabList.innerHTML = "";
  tabs.forEach(query => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = query;
    tab.onclick = () => {
      document.getElementById("query").value = query;
      document.getElementById("searchForm").dispatchEvent(new Event("submit"));
    };

    const close = document.createElement("button");
    close.className = "close-tab";
    close.innerHTML = "&times;";
    close.onclick = (e) => {
      e.stopPropagation();
      deleteTab(query);
    };

    tab.appendChild(close);
    tabList.appendChild(tab);
  });
}

function deleteTab(query) {
  let tabs = JSON.parse(localStorage.getItem("tabs") || "[]");
  tabs = tabs.filter(t => t !== query);
  localStorage.setItem("tabs", JSON.stringify(tabs));
  renderTabs();
}

function clearTabs() {
  localStorage.removeItem("tabs");
  renderTabs();
}

function renderTabs() {
  loadTabs();
}

function saveLastQuery(query) {
  localStorage.setItem("lastQuery", query);
}

function loadLastQuery() {
  const last = localStorage.getItem("lastQuery");
  if (last) {
    document.getElementById("query").value = last;
  }
}
