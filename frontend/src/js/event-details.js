const eventId = new URLSearchParams(window.location.search).get('id');
const box = document.getElementById('event-detail');
const messageBox = document.getElementById('message');

function showMessage(text, isError) {
  messageBox.textContent = text;
  messageBox.className = 'message ' + (isError ? 'error' : 'success');
}

async function loadEvent() {
  try {
    const e = await apiRequest('/events/' + encodeURIComponent(eventId));
    const full = e.available_seats <= 0;
    box.innerHTML = `
      <span class="badge">${escapeHtml(e.category)}</span>
      <h1>${escapeHtml(e.title)}</h1>
      <p>${escapeHtml(e.description)}</p>
      <ul class="detail-list">
        <li><strong>Date:</strong> ${escapeHtml(e.date)}</li>
        <li><strong>Time:</strong> ${escapeHtml(e.time)}</li>
        <li><strong>Location:</strong> ${escapeHtml(e.location)}</li>
        <li><strong>Category:</strong> ${escapeHtml(e.category)}</li>
        <li><strong>Available seats:</strong> ${Number(e.available_seats)} of ${Number(e.capacity)}</li>
      </ul>
      <button id="register-btn" class="btn" ${full ? 'disabled' : ''}>
        ${full ? 'Event Full' : 'Register for this Event'}
      </button>`;
    document.getElementById('register-btn').addEventListener('click', registerNow);
  } catch (err) {
    box.innerHTML = '<p class="error">' + escapeHtml(err.message) + '</p>';
  }
}

async function registerNow() {
  if (!getToken()) {
    window.location.href = '/pages/login.html';
    return;
  }
  try {
    const data = await apiRequest('/register', 'POST', { event_id: Number(eventId) });
    showMessage(data.message, false);
    loadEvent(); // refresh the seat count
  } catch (err) {
    showMessage(err.message, true);
  }
}

loadEvent();