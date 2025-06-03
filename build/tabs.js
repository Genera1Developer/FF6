const tabsContainer = document.getElementById("tabsContainer");
let tabs = JSON.parse(localStorage.getItem("searchTabs")) || [];
let currentTab = localStorage.getItem("currentTab") || null;

function saveTabs() {
  localStorage.setItem("searchTabs", JSON.stringify(tabs));
  localStorage.setItem("currentTab", currentTab);
}

function setActiveTab(tabName) {
  currentTab = tabName;
  renderTabs();
  saveTabs();
}

function addTab(tabName) {
  if (!tabs.includes(tabName)) {
    tabs.push(tabName);
    saveTabs();
  }
  setActiveTab(tabName);
}

function deleteTab(tabName) {
  tabs = tabs.filter(t => t !== tabName);
  if (currentTab === tabName) {
    currentTab = tabs[0] || null;
  }
  saveTabs();
  renderTabs();
}

function renderTabs() {
  tabsContainer.innerHTML = '';
  tabs.forEach(tab => {
    const div = document.createElement("div");
    div.className = "tab" + (tab === currentTab ? " active" : "");
    div.textContent = tab;
    div.onclick = () => setActiveTab(tab);
    div.oncontextmenu = (e) => {
      e.preventDefault();
      if (confirm(`Delete tab "${tab}"?`)) {
        deleteTab(tab);
      }
    };
    tabsContainer.appendChild(div);
  });

  const queryInput = document.getElementById("query");
  if (queryInput && currentTab) {
    queryInput.value = currentTab;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  const form = document.getElementById("searchForm");
  form.addEventListener("submit", () => {
    const input = document.getElementById("query").value.trim();
    if (input) {
      addTab(input);
    }
  });
});
