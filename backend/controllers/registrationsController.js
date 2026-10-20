const db = require('../database/db');

// POST /api/register  (body: { "event_id": 1 })
function registerForEvent(req, res) {
  const eventId = Number(req.body.event_id);
  if (!eventId) {
    return res.status(400).json({ error: 'event_id is required' });
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const already = db.prepare(
    'SELECT id FROM registrations WHERE user_id = ? AND event_id = ?'
  ).get(req.user.id, eventId);
  if (already) {
    return res.status(409).json({ error: 'You are already registered for this event' });
  }

  const taken = db.prepare(
    'SELECT COUNT(*) AS total FROM registrations WHERE event_id = ?'
  ).get(eventId).total;
  if (taken >= event.capacity) {
    return res.status(400).json({ error: 'Sorry, this event is full' });
  }

  db.prepare('INSERT INTO registrations (user_id, event_id) VALUES (?, ?)')
    .run(req.user.id, eventId);

  res.status(201).json({ message: 'Registered successfully for ' + event.title });
}
// GET /api/registrations
// Admin sees all registrations. A student sees only their own.
function getRegistrations(req, res) {
  let sql = `
    SELECT r.id, r.registration_date, u.name AS student_name, u.email,
           e.id AS event_id, e.title, e.date, e.time, e.location
    FROM registrations r
    JOIN users u ON u.id = r.user_id
    JOIN events e ON e.id = r.event_id`;
  const params = [];

  if (req.user.role !== 'admin') {
    sql += ' WHERE r.user_id = ?';
    params.push(req.user.id);
  }
  sql += ' ORDER BY r.registration_date DESC';

  res.json(db.prepare(sql).all(...params));
}

module.exports = { registerForEvent, getRegistrations };