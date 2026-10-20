# API Testing Report

Tested by: Omer Javed (70176744)

Tool: Postman. Server: http://localhost:5000

| Test | Method | URL | Expected | Result |
|------|--------|-----|----------|--------|
| List events | GET | /api/events | 200 and a list of events | Passed |
| Update event as admin | PUT | /api/events/1 | 200 and updated event | Passed |
| Delete event as admin | DELETE | /api/events/10 | 200 "Event deleted successfully" | Passed |
| Update event as student | PUT | /api/events/1 | 403 "Admin access required" | Passed |
| Update missing event | PUT | /api/events/999 | 404 "Event not found" | Passed |
| Delete without login | DELETE | /api/events/1 | 401 "Please log in first" | Passed |