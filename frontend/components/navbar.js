function renderNavbar() {
  const user = getUser();

  let links = `
    <a href="/index.html">Home</a>
    <a href="/pages/events.html">Events</a>`;
  if (user && user.role === 'admin') {
    links += `<a href="/pages/admin.html">Admin</a>`;
  }

  let auth;
  if (user) {
    auth = `<span class="nav-user">Hi, ${escapeHtml(user.name)}</span>
            <button id="logout-btn" class="btn btn-outline">Logout</button>`;
  } else {
    auth = `<a href="/pages/login.html" class="btn btn-outline">Login</a>
            <a href="/pages/login.html?mode=signup" class="btn">Register</a>`;
  }

  document.getElementById('navbar').innerHTML = `
    <div class="container nav-inner">
      <a href="/index.html" class="logo">Campus Events</a>
      <nav class="nav-links">${links}</nav>
      <div class="nav-auth">${auth}</div>
    </div>`;

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

renderNavbar();