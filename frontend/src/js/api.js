// Every page uses this file to talk to the back-end API
const API_URL = window.location.protocol === 'file:'
  ? 'http://localhost:5000/api'
  : '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
}

function saveLogin(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

// Stops people from injecting HTML into our pages
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text ?? '');
  return div.innerHTML;
}

// One function for all API calls. Adds the login token automatically.
async function apiRequest(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const response = await fetch(API_URL + path, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}