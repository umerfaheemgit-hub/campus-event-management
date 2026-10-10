// Only admins may use this page
const currentUser = getUser();
if (!currentUser || currentUser.role !== 'admin') {
  window.location.href = '/pages/login.html';
}

const form = document.getElementById('event-form');
const tableBody = document.getElementById('events-table');
const messageBox = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

let editingId = null;
let currentEvents = [];

function showMessage(text, isError) {
  messageBox.textContent = text;
  messageBox.className = 'message ' + (isError ? 'error' : 'success');
}

function resetForm() {
  form.reset();
  editingId = null;
  formTitle.textContent = 'Create Event';
  saveBtn.textContent = 'Create Event';
  cancelBtn.classList.add('hidden');
}

async function loadAdminEvents() {
  try {
    currentEvents = await apiRequest('/events');
    tableBody.innerHTML = currentEvents.map(e => `
      <tr>
        <td>${escapeHtml(e.title)}</td>
        <td>${escapeHtml(e.date)}</td>
        <td>${escapeHtml(e.category)}</td>
        <td>${Number(e.registered)} / ${Number(e.capacity)}</td>
        <td>
          <button class="btn btn-small" data-edit="${Number(e.id)}">Edit</button>
          <button class="btn btn-small btn-danger" data-delete="${Number(e.id)}">Delete</button>
        </td>
      </tr>`).join('');
  } catch (err) {
    showMessage(err.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const eventData = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    location: document.getElementById('location').value.trim(),
    category: document.getElementById('category').value,
    capacity: Number(document.getElementById('capacity').value)
  };

  try {
    if (editingId) {
      await apiRequest('/events/' + editingId, 'PUT', eventData);
      showMessage('Event updated successfully', false);
    } else {
      await apiRequest('/events', 'POST', eventData);
      showMessage('Event created successfully', false);
    }
    resetForm();
    loadAdminEvents();
  } catch (err) {
    showMessage(err.message, true);
  }
});

tableBody.addEventListener('click', async (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (editId) {
    const e = currentEvents.find(item => item.id === Number(editId));
    editingId = e.id;
    document.getElementById('title').value = e.title;
    document.getElementById('description').value = e.description;
    document.getElementById('date').value = e.date;
    document.getElementById('time').value = e.time;
    document.getElementById('location').value = e.location;
    document.getElementById('category').value = e.category;
    document.getElementById('capacity').value = e.capacity;
    formTitle.textContent = 'Edit Event';
    saveBtn.textContent = 'Save Changes';
    cancelBtn.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  if (deleteId && confirm('Delete this event?')) {
    try {
      await apiRequest('/events/' + deleteId, 'DELETE');
      showMessage('Event deleted', false);
      loadAdminEvents();
    } catch (err) {
      showMessage(err.message, true);
    }
  }
});

cancelBtn.addEventListener('click', resetForm);

loadAdminEvents();