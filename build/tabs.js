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
