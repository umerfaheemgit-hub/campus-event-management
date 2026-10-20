# API Documentation

Base URL: `http://localhost:5000/api`

All request and response bodies are JSON. Errors always have this shape:

```json
{ "error": "Message describing the problem" }
```

## Authentication

Protected endpoints need a token in the request header:

```
Authorization: Bearer <token>
```

Get a token from `POST /api/login`. Tokens expire after 2 hours.

| Status | Meaning |
|--------|---------|
| 401 | No token, or the token is invalid or expired |
| 403 | The user is logged in but is not an admin |

## Summary

| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /api/signup | Public | Create a student account |
| POST | /api/login | Public | Log in and receive a token |
| GET | /api/events | Public | List events, with optional search and filter |
| GET | /api/events/:id | Public | Get one event |
| POST | /api/events | Admin | Create an event |
| PUT | /api/events/:id | Admin | Update an event |
| DELETE | /api/events/:id | Admin | Delete an event |
| POST | /api/register | Logged in | Register for an event |
| GET | /api/registrations | Logged in | List registrations |

---

## Users

### POST /api/signup

Creates a new account with the role `student`.

Request body:

```json
{ "name": "Ali Khan", "email": "ali@student.edu", "password": "secret123" }
```

| Status | Response |
|--------|----------|
| 201 | `{ "message": "Account created successfully" }` |
| 400 | `Name, email and password are required`, `Please enter a valid email`, or `Password must be at least 6 characters` |
| 409 | `This email is already registered` |

### POST /api/login

Request body:

```json
{ "email": "admin@campus.edu", "password": "admin123" }
```

Success (200):

```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Admin User", "email": "admin@campus.edu", "role": "admin" }
}
```

| Status | Response |
|--------|----------|
| 200 | Token and user, as above |
| 400 | `Email and password are required` |
| 401 | `Wrong email or password` |

---

## Events

An event object looks like this:

```json
{
  "id": 2,
  "title": "Cloud Computing Seminar",
  "description": "Talk on cloud platforms and careers in the cloud industry.",
  "date": "2026-11-08",
  "time": "11:00",
  "location": "Main Auditorium",
  "category": "Seminar",
  "capacity": 150,
  "registered": 0,
  "available_seats": 150
}
```

`registered` and `available_seats` are calculated by the server.

### GET /api/events

Public. Returns an array of events sorted by date and time.

| Query parameter | Description | Example |
|-----------------|-------------|---------|
| `search` | Matches the title or description | `/api/events?search=AI` |
| `category` | Exact category match | `/api/events?category=Workshop` |

Both can be combined: `/api/events?search=AI&category=Workshop`.

| Status | Response |
|--------|----------|
| 200 | Array of events (empty array if nothing matches) |

### GET /api/events/:id

Public. Returns one event object.

| Status | Response |
|--------|----------|
| 200 | The event |
| 404 | `Event not found` |

### POST /api/events (admin)

Request body (all fields required except `description`):

```json
{
  "title": "Career Fair",
  "description": "Meet local employers",
  "date": "2026-12-10",
  "time": "10:00",
  "location": "Convention Hall",
  "category": "Conference",
  "capacity": 200
}
```

Valid categories: `Seminar`, `Workshop`, `Sports`, `Competition`, `Conference`, `Society`.

| Status | Response |
|--------|----------|
| 201 | The created event |
| 400 | Missing fields, `Category must be one of: ...`, or `Capacity must be a positive whole number` |
| 401 / 403 | Not logged in / not an admin |

### PUT /api/events/:id (admin)

Takes the same body as `POST /api/events` and replaces the event's details.

| Status | Response |
|--------|----------|
| 200 | The updated event |
| 400 | Same validation errors as create, or `Capacity cannot be less than students already registered` |
| 404 | `Event not found` |
| 401 / 403 | Not logged in / not an admin |

### DELETE /api/events/:id (admin)

Deletes the event and all of its registrations.

| Status | Response |
|--------|----------|
| 200 | `{ "message": "Event deleted successfully" }` |
| 404 | `Event not found` |
| 401 / 403 | Not logged in / not an admin |

---

## Registrations

### POST /api/register

Registers the logged-in user for an event.

Request body:

```json
{ "event_id": 2 }
```

| Status | Response |
|--------|----------|
| 201 | `{ "message": "Registered successfully for Cloud Computing Seminar" }` |
| 400 | `event_id is required`, or `Sorry, this event is full` |
| 404 | `Event not found` |
| 409 | `You are already registered for this event` |
| 401 | Not logged in |

### GET /api/registrations

Needs a login. An **admin** receives every registration. A **student** receives only their own.

Response (200):

```json
[
  {
    "id": 1,
    "registration_date": "2026-10-20 09:15:00",
    "student_name": "Test Student",
    "email": "student@campus.edu",
    "event_id": 2,
    "title": "Cloud Computing Seminar",
    "date": "2026-11-08",
    "time": "11:00",
    "location": "Main Auditorium"
  }
]
```

---

## Other responses

| Status | When |
|--------|------|
| 404 `API route not found` | The URL starts with `/api` but matches no endpoint |
| 500 `Something went wrong on the server` | An unexpected error occurred |

## Testing

The endpoints were tested with Postman. The results are in [api-testing.md](api-testing.md).
