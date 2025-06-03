function loadTabs() {
  const tabs = JSON.parse(localStorage.getItem("searchTabs") || "[]");
  const tabList = document.getElementById("tabList");
  tabList.innerHTML = "";
  tabs.forEach((tab, i) => {
    const tabEl = document.createElement("div");
    tabEl.className = "tab";
    tabEl.innerHTML = `<span>${tab}</span><button class="close-tab" data-index="${i}">&times;</button>`;
    tabEl.querySelector("span").addEventListener("click", () => {
      document.getElementById("query").value = tab;
      document.getElementById("searchForm").dispatchEvent(new Event("submit"));
    });
    tabEl.querySelector(".close-tab").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTab(i);
    });
    tabList.appendChild(tabEl);
  });
}

function deleteTab(index) {
  const tabs = JSON.parse(localStorage.getItem("searchTabs") || "[]");
  tabs.splice(index, 1);
  localStorage.setItem("searchTabs", JSON.stringify(tabs));
  loadTabs();
}

function clearTabs() {
  localStorage.removeItem("searchTabs");
  loadTabs();
}

function saveTab(query) {
  const tabs = JSON.parse(localStorage.getItem("searchTabs") || "[]");
  if (!tabs.includes(query)) {
    tabs.push(query);
    localStorage.setItem("searchTabs", JSON.stringify(tabs));
    loadTabs();
  }
}

document.getElementById("toggleTabs").addEventListener("click", () => {
  const panel = document.getElementById("tabsPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

document.getElementById("clearTabs").addEventListener("click", clearTabs);

document.getElementById("addTab").addEventListener("click", () => {
  const query = prompt("Name your new tab:");
  if (query) {
    saveTab(query.trim());
  }
});

loadTabs();
