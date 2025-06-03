
const resultsWeb = document.getElementById("results-web");
const resultsImages = document.getElementById("results-images");

function switchTab(tab) {
  resultsWeb.style.display = tab === "Web" ? "block" : "none";
  resultsImages.style.display = tab === "Images" ? "block" : "none";
  document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(btn => {
    if (btn.textContent === tab) btn.classList.add("active");
  });
}

async function search(event) {
  event.preventDefault();
  const query = document.getElementById("query").value;
  const webRes = await fetch(`http://localhost:4567/search?q=${encodeURIComponent(query)}&type=web`).then(r => r.json());
  const imgRes = await fetch(`http://localhost:4567/search?q=${encodeURIComponent(query)}&type=images`).then(r => r.json());

  resultsWeb.innerHTML = webRes.map(r => `
    <div class="signup">
      <a href="${r.url}" target="_blank"><h2>${r.title}</h2></a>
      <p>${r.description}</p>
      <p class="source">Source: ${r.source}</p>
    </div>`).join("");

  resultsImages.innerHTML = imgRes.map(r => `
    <div class="signup">
      <img src="${r.url}" alt="${r.title}" style="max-width:100%;border-radius:10px;">
      <p>${r.title}</p>
      <p class="source">Source: ${r.source}</p>
    </div>`).join("");
}
