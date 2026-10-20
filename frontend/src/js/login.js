const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const messageBox = document.getElementById('message');
const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');

function showMessage(text, isError) {
  messageBox.textContent = text;
  messageBox.className = 'message ' + (isError ? 'error' : 'success');
}

function showMode(mode) {
  const signup = mode === 'signup';
  loginForm.classList.toggle('hidden', signup);
  signupForm.classList.toggle('hidden', !signup);
  formTitle.textContent = signup ? 'Create Account' : 'Login';
  toggleLink.textContent = signup ? 'Already have an account? Login' : 'New here? Create an account';
}

toggleLink.addEventListener('click', (event) => {
  event.preventDefault();
  messageBox.textContent = '';
  showMode(signupForm.classList.contains('hidden') ? 'signup' : 'login');
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const data = await apiRequest('/login', 'POST', {
      email: document.getElementById('login-email').value.trim(),
      password: document.getElementById('login-password').value
    });
    saveLogin(data.token, data.user);
    window.location.href = data.user.role === 'admin' ? '/pages/admin.html' : '/pages/events.html';
  } catch (err) {
    showMessage(err.message, true);
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
    const nameValue = document.getElementById('signup-name').value.trim();
  const emailValue = document.getElementById('signup-email').value.trim();
  const passwordValue = document.getElementById('signup-password').value;

  if (nameValue.length < 3) {
    showMessage('Name must be at least 3 characters', true);
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
    showMessage('Please enter a valid email address', true);
    return;
  }
  if (passwordValue.length < 6) {
    showMessage('Password must be at least 6 characters', true);
    return;
  }
  try {
    await apiRequest('/signup', 'POST', {
      name: document.getElementById('signup-name').value.trim(),
      email: document.getElementById('signup-email').value.trim(),
      password: document.getElementById('signup-password').value
    });
    showMode('login');
    showMessage('Account created! Please log in.', false);
  } catch (err) {
    showMessage(err.message, true);
  }
});

// Open signup directly when the URL has ?mode=signup
if (new URLSearchParams(window.location.search).get('mode') === 'signup') {
  showMode('signup');
}