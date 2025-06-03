let tabs = JSON.parse(localStorage.getItem("tabs")) || [];
let currentTab = 0;

function saveTabs() {
  localStorage.setItem("tabs", JSON.stringify(tabs));
}

function renderTabs() {
  const container = document.getElementById("tabs");
  container.innerHTML = "";
  tabs.forEach((tab, i) => {
    const el = document.createElement("div");
    el.className = "tab" + (i === currentTab ? " active" : "");
    el.textContent = tab.query;
    el.onclick = () => {
      currentTab = i;
      renderTabs();
      renderResults(tab.results);
    };
    container.appendChild(el);
  });
}

function renderResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "";
  results.forEach(r => {
    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <a href="${r.href}" target="_blank" style="color: white; font-weight: bold;">
        ${r.title}
      </a>
      <p>${r.desc}</p>
      <small>Source: ${r.source}</small>
    `;
    container.appendChild(div);
  });
}

async function fetchAndParse(url, parser) {
  try {
    const response = await fetch(url, { mode: "cors" });
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return parser(doc);
  } catch (e) {
    console.error("Fetch failed:", url, e);
    return [];
  }
}

document.getElementById("searchForm").addEventListener("submit", async e => {
  e.preventDefault();
  const query = document.getElementById("query").value.trim();
  if (!query || isBlocked(query)) {
    alert("Blocked or empty query.");
    return;
  }

  const results = [];
  for (const engine of ENGINES) {
    const links = await fetchAndParse(engine.url(query), engine.parser);
    results.push(...links);
  }

  const newTab = { query, results };
  tabs.push(newTab);
  currentTab = tabs.length - 1;
  saveTabs();
  renderTabs();
  renderResults(results);
});

document.getElementById("addTabBtn").onclick = () => {
  document.getElementById("query").value = "";
};
renderTabs();
if (tabs[currentTab]) renderResults(tabs[currentTab].results);
