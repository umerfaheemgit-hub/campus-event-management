const db = require('../database/db');

const CATEGORIES = ['Seminar', 'Workshop', 'Sports', 'Competition', 'Conference', 'Society'];

// Reusable query: event details plus how many seats are left
const EVENT_QUERY = `
  SELECT e.*,
    (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registered,
    e.capacity - (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS available_seats
  FROM events e
`;

// GET /api/events?search=AI&category=Workshop
function getAllEvents(req, res) {
  const { search, category } = req.query;
  let sql = EVENT_QUERY + ' WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (e.title LIKE ? OR e.description LIKE ?)';
    params.push('%' + search + '%', '%' + search + '%');
  }
  if (category) {
    sql += ' AND e.category = ?';
    params.push(category);
  }
  sql += ' ORDER BY e.date ASC, e.time ASC';

  const events = db.prepare(sql).all(...params);
  res.json(events);
}

// GET /api/events/:id
function getEventById(req, res) {
  const event = db.prepare(EVENT_QUERY + ' WHERE e.id = ?').get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
}

// POST /api/events (admin only)
function createEvent(req, res) {
  const { title, description, date, time, location, category, capacity } = req.body;

  if (!title || !date || !time || !location || !category || !capacity) {
    return res.status(400).json({
      error: 'title, date, time, location, category and capacity are required'
    });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Category must be one of: ' + CATEGORIES.join(', ') });
  }
  if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
    return res.status(400).json({ error: 'Capacity must be a positive whole number' });
  }

  const result = db.prepare(
    `INSERT INTO events (title, description, date, time, location, category, capacity)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(title, description || '', date, time, location, category, Number(capacity));

  const created = db.prepare(EVENT_QUERY + ' WHERE e.id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
}
// PUT /api/events/:id (admin only)
function updateEvent(req, res) {
  const existing = db.prepare(EVENT_QUERY + ' WHERE e.id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { title, description, date, time, location, category, capacity } = req.body;

  if (!title || !date || !time || !location || !category || !capacity) {
    return res.status(400).json({
      error: 'title, date, time, location, category and capacity are required'
    });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Category must be one of: ' + CATEGORIES.join(', ') });
  }
  if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
    return res.status(400).json({ error: 'Capacity must be a positive whole number' });
  }
  if (Number(capacity) < existing.registered) {
    return res.status(400).json({ error: 'Capacity cannot be less than students already registered' });
  }

  db.prepare(
    `UPDATE events
     SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, capacity = ?
     WHERE id = ?`
  ).run(title, description || '', date, time, location, category, Number(capacity), req.params.id);

  const updated = db.prepare(EVENT_QUERY + ' WHERE e.id = ?').get(req.params.id);
  res.json(updated);
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, CATEGORIES };