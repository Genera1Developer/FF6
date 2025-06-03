const token = window.location.hash.split('=')[1];

async function loadContent() {
  const userRes = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: { Authorization: `bearer ${token}` }
  });
  const user = await userRes.json();

  const postsRes = await fetch(`https://oauth.reddit.com/user/${user.name}/submitted`, {
    headers: { Authorization: `bearer ${token}` }
  });
  const posts = await postsRes.json();

  const container = document.getElementById('resultsContainer');

  posts.data.children.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'result-card';
    div.innerHTML = `
      <input type="checkbox" class="delete-check" data-id="${item.data.name}" />
      <p>${item.data.title || item.data.body}</p>
      <a href="https://reddit.com${item.data.permalink}" target="_blank">View</a>
    `;
    container.appendChild(div);
  });
}

async function deleteSelected() {
  const checks = document.querySelectorAll('.delete-check:checked');
  for (const check of checks) {
    const id = check.dataset.id;
    await fetch(`https://oauth.reddit.com/api/del`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `id=${id}`
    });
  }
  alert("Selected posts deleted.");
  location.reload();
}

async function deleteAll() {
  const checks = document.querySelectorAll('.delete-check');
  for (const check of checks) {
    const id = check.dataset.id;
    await fetch(`https://oauth.reddit.com/api/del`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `id=${id}`
    });
  }
  alert("All posts deleted.");
  location.reload();
}

if (token) loadContent();
