async function loadEvents(query = '') {
  const box = document.getElementById('event-list');
  box.innerHTML = '<p>Loading events...</p>';
  try {
    const events = await apiRequest('/events' + query);
    box.innerHTML = events.length
      ? events.map(renderEventCard).join('')
      : '<p>No events found.</p>';
  } catch (err) {
    box.innerHTML = '<p class="error">' + escapeHtml(err.message) + '</p>';
  }
}

loadEvents();