# System Test Plan

Project: Campus Event Management System
Issue: #18 (test the full system and write a test report)
Environment: Windows, Chrome, Postman, Node.js v24, http://localhost:5000

## Scope

The plan covers the finished system from two sides:

- **Browser tests (B1 to B8)** check what a user sees and does: home page, events search and filter, signup validation, student registration and dashboard, role-based navbar, and admin create, edit and delete.
- **API tests (P1 to P8)** send requests directly to the server with Postman. They also check rules the interface hides, such as admin-only access, duplicate registration and wrong-password login.

## Before testing

1. Start the server from the `backend` folder: `npm run seed` then `npm start`. It must print `Server running at http://localhost:5000`.
2. Press Ctrl + F5 before each browser test to avoid cached pages.
3. Demo accounts: `admin@campus.edu / admin123` and `student@campus.edu / student123`.
4. For protected API requests, first send `POST /api/login`, copy the token and use it under Authorization > Bearer Token.

## Browser tests

| ID | What to test | Steps | Expected result |
|----|--------------|-------|-----------------|
| B1 | Home page | Open the home page and scroll down | Hero, stat counters, featured events, category buttons and footer all show |
| B2 | Search | Events page, type `AI`, click Search | Only events about AI show |
| B3 | Filter | Clear the search, choose Workshop | Only workshops show |
| B4 | Signup validation | Login page, Create an account, name `Al`, any email, password `123456` | Red message: Name must be at least 3 characters |
| B5 | Student registration | Log in as student, register for 2 different events | Success message each time |
| B6 | Dashboard | Click My Registrations | Both events are listed |
| B7 | Student cannot see Admin | While logged in as student, look at the navbar | No Admin link |
| B8 | Admin create, edit, delete | Log in as admin, Admin page: create an event, edit its title, delete it | Each action works and the table updates |

## API tests (Postman)

| ID | Request | Token | Expected |
|----|---------|-------|----------|
| P1 | `GET /api/events` | none | 200 and a list of events |
| P2 | `PUT /api/events/1` with a full event body | admin | 200 and the updated event |
| P3 | `POST /api/events` (create a test event), then `DELETE /api/events/{id}` of that event | admin | 201, then 200 `Event deleted successfully` |
| P4 | `PUT /api/events/1` | student | 403 `Admin access required` |
| P5 | `PUT /api/events/999` | admin | 404 `Event not found` |
| P6 | `DELETE /api/events/1` | none | 401 `Please log in first` |
| P7 | `POST /api/register` with `{"event_id": 2}` twice | student | First 201, second 409 `You are already registered` |
| P8 | `POST /api/login` with a wrong password | none | 401 `Wrong email or password` |

Request body used for P2 and P4:

```json
{
  "title": "QA Test Event",
  "description": "Testing",
  "date": "2026-12-01",
  "time": "10:00",
  "location": "Main Hall",
  "category": "Seminar",
  "capacity": 100
}
```

## Pass and fail rule

A test is **Passed** when the actual result matches the expected result exactly (visible message or status code). Anything else is **Failed** and is reported as it was seen, with a screenshot.

## Evidence

One screenshot per test, saved in `screenshots/` with the prefix `qa-` (for example `qa-b2-search.png`, `qa-p4-student-403.png`).
