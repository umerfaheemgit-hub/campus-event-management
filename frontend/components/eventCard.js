function renderEventCard(e) {
  const full = e.available_seats <= 0;
  return `
    <div class="event-card">
      <span class="badge">${escapeHtml(e.category)}</span>
      <h3>${escapeHtml(e.title)}</h3>
      <p class="event-meta">📅 ${escapeHtml(e.date)} &nbsp; 🕒 ${escapeHtml(e.time)}</p>
      <p class="event-meta">📍 ${escapeHtml(e.location)}</p>
      <p class="seats ${full ? 'seats-full' : ''}">
        ${full ? 'Event full' : e.available_seats + ' seats left'}
      </p>
      <a class="btn" href="/pages/event-details.html?id=${Number(e.id)}">View Details</a>
    </div>`;
}