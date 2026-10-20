// Only logged-in users can see this page
if (!getToken()) {
  window.location.href = '/pages/login.html';
}

async function loadMyRegistrations() {
  const body = document.getElementById('my-registrations');
  try {
    const registrations = await apiRequest('/registrations');
    body.innerHTML = registrations.length
      ? registrations.map(r => `
        <tr>
          <td><a href="/pages/event-details.html?id=${Number(r.event_id)}">${escapeHtml(r.title)}</a></td>
          <td>${escapeHtml(r.date)}</td>
          <td>${escapeHtml(r.time)}</td>
          <td>${escapeHtml(r.location)}</td>
          <td>${escapeHtml(r.registration_date)}</td>
        </tr>`).join('')
      : '<tr><td colspan="5">You have not registered for any events yet.</td></tr>';
  } catch (err) {
    body.innerHTML = '<tr><td colspan="5" class="error">' + escapeHtml(err.message) + '</td></tr>';
  }
}

loadMyRegistrations();