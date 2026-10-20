const searchBox = document.getElementById('search-box');
const categoryFilter = document.getElementById('category-filter');

async function loadEvents() {
  const box = document.getElementById('event-list');
  box.innerHTML = '<p>Loading events...</p>';

  // Build the query, for example ?search=AI&category=Workshop
  const params = new URLSearchParams();
  if (searchBox.value.trim()) params.set('search', searchBox.value.trim());
  if (categoryFilter.value) params.set('category', categoryFilter.value);
  const query = params.toString() ? '?' + params.toString() : '';

  try {
    const events = await apiRequest('/events' + query);
    box.innerHTML = events.length
      ? events.map(renderEventCard).join('')
      : '<p>No events found.</p>';
  } catch (err) {
    box.innerHTML = '<p class="error">' + escapeHtml(err.message) + '</p>';
  }
}

document.getElementById('search-btn').addEventListener('click', loadEvents);
categoryFilter.addEventListener('change', loadEvents);
searchBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') loadEvents();
});
document.getElementById('clear-btn').addEventListener('click', () => {
  searchBox.value = '';
  categoryFilter.value = '';
  loadEvents();
});

// If the page was opened from a category shortcut, such as ?category=Workshop
const urlCategory = new URLSearchParams(window.location.search).get('category');
if (urlCategory) categoryFilter.value = urlCategory;

loadEvents();