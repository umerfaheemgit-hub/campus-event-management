# Backend

Node.js + Express REST API with an SQLite database.

## Run

    npm install
    npm run seed
    npm start

Server runs at http://localhost:5000

## API Endpoints

| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/events | Public | List events (?search= and ?category=) |
| GET | /api/events/:id | Public | Get one event |
| POST | /api/events | Admin | Create event |
| PUT | /api/events/:id | Admin | Update event |
| DELETE | /api/events/:id | Admin | Delete event |
| POST | /api/signup | Public | Create student account |
| POST | /api/login | Public | Log in and get JWT token |
| POST | /api/register | Logged in | Register for an event |
| GET | /api/registrations | Logged in | List registrations |

Protected routes need the header: Authorization: Bearer <token>