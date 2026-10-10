const db = require('./db');
const bcrypt = require('bcryptjs');

// Don't add data twice
const count = db.prepare('SELECT COUNT(*) AS total FROM events').get().total;
if (count > 0) {
  console.log('Database already has data. Seed skipped.');
  process.exit(0);
}

// Two sample users: one admin, one student
const insertUser = db.prepare(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
);
insertUser.run('Admin User', 'admin@campus.edu', bcrypt.hashSync('admin123', 10), 'admin');
insertUser.run('Test Student', 'student@campus.edu', bcrypt.hashSync('student123', 10), 'student');

// Sample events
const events = [
  ['AI Workshop', 'Hands-on introduction to machine learning with Python.', '2026-11-05', '10:00', 'Computer Lab 2', 'Workshop', 40],
  ['Cloud Computing Seminar', 'Talk on cloud platforms and careers in the cloud industry.', '2026-11-08', '11:00', 'Main Auditorium', 'Seminar', 150],
  ['Inter-Department Cricket Tournament', 'Knockout cricket matches between all departments.', '2026-11-12', '09:00', 'University Ground', 'Sports', 100],
  ['Hackathon 2026', '24-hour coding competition. Teams of up to four.', '2026-11-15', '09:30', 'Innovation Hub', 'Competition', 60],
  ['Web Development Bootcamp', 'Build your first website from scratch in one afternoon.', '2026-11-20', '14:00', 'Lab 5', 'Workshop', 30],
  ['Annual Tech Conference', 'Industry speakers, panels and project showcases.', '2026-11-25', '09:00', 'Convention Hall', 'Conference', 300],
  ['Career Guidance Seminar', 'Learn how to prepare your CV and ace interviews.', '2026-12-02', '12:00', 'Seminar Hall A', 'Seminar', 120],
  ['Debate Society Showdown', 'Inter-university debate competition.', '2026-12-05', '15:00', 'Block B Auditorium', 'Competition', 80]
];

const insertEvent = db.prepare(
  'INSERT INTO events (title, description, date, time, location, category, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
for (const e of events) {
  insertEvent.run(...e);
}

console.log('Database seeded: 2 users and ' + events.length + ' events added.');