# System Test Report

Tested by: Anas Subhani (SAP ID: 70176507)
Date: 2026-10-21
Environment: Windows, Chrome, Postman, Node.js v24, http://localhost:5000

## Results

| ID | What was tested | Expected | Actual | Result | Screenshot |
|----|-----------------|----------|--------|--------|------------|
| B1 | Home page loads | Hero, stats, featured events, category buttons, footer | Hero loaded with the heading "The University Of Lahore", the Campus Events Portal badge, the Browse All Events and Explore Categories buttons, and the Login/Register navbar. Scrolling down, the tester also saw the stat counters, featured events, category buttons and footer. | Passed | screenshots/qa-b1-home.png |
| B2 | Search "AI" | Only AI events show | Typed "ai" (lowercase) and clicked Search. One event was shown: AI Workshop (Workshop, 2026-11-05, 10:00, Computer Lab 2, 40 seats left). Search is not case-sensitive. | Passed | screenshots/qa-b2-search.png |
| B3 | Filter Workshop | Only workshops show | Cleared the search box and chose Workshop. Two events were shown and both are Workshops: AI Workshop and Web Development Bootcamp (2026-11-20, 14:00, Lab 5, 30 seats left). | Passed | screenshots/qa-b3-filter.png |
| B4 | Signup validation (short name) | Red message: Name must be at least 3 characters | Create Account with name "ai" (2 characters), email ag@gmail.com and a 6-character password. Red message "Name must be at least 3 characters" appeared above the form. | Passed | screenshots/qa-b4-signup-validation.png |
| B5 | Student registers for 2 events | Success message each time | Logged in as Test Student. Registered for Cloud Computing Seminar (green message "Registered successfully for Cloud Computing Seminar", 149 of 150 seats) and Career Guidance Seminar ("Registered successfully for Career Guidance Seminar", 119 of 120 seats). | Passed | screenshots/qa-b5-register-2.png, screenshots/qa-b5-register-7.png |
| B6 | My Registrations dashboard | Both events listed | My Registrations table lists Career Guidance Seminar, Cloud Computing Seminar and AI Workshop with date, time, location and registered-on time. Both events from B5 are listed (AI Workshop is a third registration made earlier). | Passed | screenshots/qa-b6-dashboard.png |
| B7 | Student cannot see Admin | No Admin link in navbar | Logged in as Test Student. The navbar shows Home, Events, My Registrations and Logout. There is no Admin link. | Passed | screenshots/qa-b7-no-admin-link.png |
| B8 | Admin create, edit, delete | Each action works, table updates | Logged in as Admin User (navbar shows Admin). Created the event "how iot's make smart world.." (2026-10-30, 15:00, 506 hall, ee1, Seminar, capacity 60): green message "Event created successfully" and the event appeared in the All Events table (0 / 60). Edited the title in the Edit Event form and the table updated. Clicked Delete, confirmed "Delete this event?" with OK, and the event was removed from the table. | Passed | screenshots/qa-b8-create.png, screenshots/qa-b8-edit.png, screenshots/qa-b8-delete.png |
| P1 | GET /api/events (no token) | 200 and list of events | 200 OK. Response is a JSON list of events (first item: id 1, AI Workshop, Workshop, 2026-11-05, 10:00, Computer Lab 2, capacity 40). | Passed | screenshots/qa-p1-list-events.png |
| P2 | PUT /api/events/1 (admin) | 200 and updated event | 200 OK. Response shows the updated event: id 1, title "QA Test Event", description "Testing", 2026-12-01, 10:00, Main Hall, Seminar, capacity 100. | Passed | screenshots/qa-p2-admin-update.png |
| P3 | POST /api/events then DELETE (admin) | 201, then 200 Event deleted successfully | POST returned 201 Created with the new event (id 10, "QA Temp Event", capacity 50). DELETE using the id saved from that POST returned 200 OK with {"message": "Event deleted successfully"}. | Passed | screenshots/qa-p3a-create.png, screenshots/qa-p3b-delete.png |
| P4 | PUT /api/events/1 (student) | 403 Admin access required | 403 Forbidden with {"error": "Admin access required"}. | Passed | screenshots/qa-p4-student-403.png |
| P5 | PUT /api/events/999 (admin) | 404 Event not found | 404 Not Found with {"error": "Event not found"}. | Passed | screenshots/qa-p5-not-found-404.png |
| P6 | DELETE /api/events/1 (no token) | 401 Please log in first | 401 Unauthorized with {"error": "Please log in first"}. | Passed | screenshots/qa-p6-no-token-401.png |
| P7 | POST /api/register {"event_id": 2} twice (student) | First 201, second 409 You are already registered | The request returned 409 Conflict with {"error": "You are already registered for this event"}, so duplicate registration is blocked. The first-time 201 was not reproduced because the student had already registered for event 2 (Cloud Computing Seminar) in browser test B5. | Partly passed (409 verified, 201 not reproduced) | screenshots/qa-p7-duplicate-409.png |
| P8 | POST /api/login wrong password | 401 Wrong email or password | 401 Unauthorized with {"error": "Wrong email or password"}. | Passed | screenshots/qa-p8-wrong-login-401.png |

## Setup requests

Before the API tests, both demo accounts were logged in with POST /api/login. The admin login returned 200 OK with role "admin" and the student login returned 200 OK with role "student" (Test Student). Screenshots: screenshots/qa-p0-login-admin.png and screenshots/qa-p0-login-student.png.

## Summary

Total tests: 16 (8 browser, 8 API).
Passed: 15 (B1 to B8, P1, P2, P3, P4, P5, P6, P8).
Partly passed: 1 (P7).
Failed: 0.

Problems and observations:

- P7: the screenshot shows 409 for event 2. The student had already registered for event 2 during B5, so the duplicate-registration rule is confirmed, but the first-time 201 response was not reproduced for this event.
- P2 changed event 1 (AI Workshop) to "QA Test Event" in the database, so this test data was left in the system.
- B4 used the name "ai" (2 characters) instead of "Al"; both are shorter than 3 characters.
