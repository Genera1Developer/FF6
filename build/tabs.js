const tabsPanel = document.getElementById("tabsPanel");
const tabList = document.getElementById("tabList");
const clearTabsBtn = document.getElementById("clearTabs");

function loadTabs() {
  const savedTabs = JSON.parse(localStorage.getItem("searchTabs") || "[]");
  tabList.innerHTML = "";
  savedTabs.forEach((tab, index) => {
    const tabEl = document.createElement("div");
    tabEl.className = "tab";
    tabEl.innerHTML = `<span>${tab}</span><button class="close-tab">&times;</button>`;
    
    tabEl.querySelector("span").onclick = () => {
      document.getElementById("query").value = tab;
      document.getElementById("searchForm").dispatchEvent(new Event("submit"));
    };

    tabEl.querySelector("button").onclick = () => {
      savedTabs.splice(index, 1);
      localStorage.setItem("searchTabs", JSON.stringify(savedTabs));
      loadTabs();
    };

    tabList.appendChild(tabEl);
  });
}

clearTabsBtn.onclick = () => {
  localStorage.removeItem("searchTabs");
  loadTabs();
};

function saveTab(query) {
  const tabs = JSON.parse(localStorage.getItem("searchTabs") || "[]");
  if (!tabs.includes(query)) {
    tabs.push(query);
    localStorage.setItem("searchTabs", JSON.stringify(tabs));
  }
  loadTabs();
}

document.addEventListener("DOMContentLoaded", loadTabs);

document.getElementById("toggleTabs").onclick = () => {
  const panel = document.getElementById("tabsPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
};
