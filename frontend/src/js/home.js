async function loadFeatured() {
  const box = document.getElementById('featured');
  try {
    const events = await apiRequest('/events');
    box.innerHTML = events.slice(0, 3).map(renderEventCard).join('');
  } catch (err) {
    box.innerHTML = '<p class="error">' + escapeHtml(err.message) + '</p>';
  }
}

loadFeatured();