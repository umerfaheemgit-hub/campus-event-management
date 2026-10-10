const express = require('express');
const cors = require('cors');
const path = require('path');
require('./database/db'); // makes sure the tables exist

const eventsRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const registrationRoutes = require('./routes/registrations');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/events', eventsRoutes);
app.use('/api', authRoutes);
app.use('/api', registrationRoutes);

// Serve the front-end files (we'll use this on Day 2)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Unknown API URL
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Catch-all for unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});