# Installation Guide

## Requirements

| Software | Version | Notes |
|----------|---------|-------|
| Node.js | v24 or newer | The database uses Node's built-in `node:sqlite` module, so no separate database software is needed |
| npm | Comes with Node.js | Installs the packages |
| Git | Any recent version | Needed to clone the repository |
| Web browser | Chrome, Edge or Firefox | |
| Postman | Optional | Only for testing the API |

Check your versions:

```
node -v
npm -v
git --version
```

## Step 1: Get the code

```
git clone https://github.com/umerfaheemgit-hub/campus-event-management.git
cd campus-event-management
```

## Step 2: Install the back end

```
cd backend
npm install
```

This installs the four packages the project uses: `express`, `cors`, `bcryptjs` and `jsonwebtoken`. A `node_modules` folder is created. It is not stored in Git.

## Step 3: Create the database

```
npm run seed
```

This creates `backend/database/campus.db` with the three tables, 2 demo users and 8 sample events. If the database already has events, the command prints `Database already has data. Seed skipped.` and changes nothing.

To start again from scratch, stop the server, delete `backend/database/campus.db`, and run `npm run seed` again.

## Step 4: Start the server

```
npm start
```

The terminal shows:

```
Server running at http://localhost:5000
```

Leave this window open while you use the system. Press **Ctrl + C** to stop it.

## Step 5: Open the application

There is **no separate front-end installation**. The Express server serves the front-end files too. Open this address in your browser:

```
http://localhost:5000
```

Open the site through this address and not by double-clicking the HTML files, otherwise the pages cannot reach the API.

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Student | student@campus.edu | student123 |

You can also create a new student account from the Login page (Register).

## Configuration (optional)

| Setting | How | Default |
|---------|-----|---------|
| Port | Environment variable `PORT` | 5000 |
| JWT secret | Environment variable `JWT_SECRET` | A built-in demo value. Set your own for any real deployment |

Windows (cmd) example:

```
set PORT=3000
npm start
```

## Troubleshooting

| Problem | Cause and fix |
|---------|---------------|
| `Cannot find module 'express'` | The packages are missing. Run `npm install` inside the `backend` folder |
| `Could not read package.json` | You are in the wrong folder. Run `cd backend` first |
| `EADDRINUSE` or "address already in use" | Another server is already using port 5000. Stop it with Ctrl + C in its window, or use a different `PORT` |
| The pages show no events | The database is empty. Run `npm run seed` |
| Login says "Invalid or expired token" | The token lasts 2 hours. Log out and log in again |
| The page looks unstyled or old after an update | Hard refresh the browser with Ctrl + F5 |
| `node:sqlite` error on startup | Your Node.js is too old. Install v24 or newer |

## Testing the API with Postman

1. Send `POST http://localhost:5000/api/login` with the admin or student credentials.
2. Copy the `token` from the response.
3. For protected requests, open the **Authorization** tab, choose **Bearer Token**, and paste the token.

The endpoints are described in [api-documentation.md](api-documentation.md), and the test results are in [api-testing.md](api-testing.md).
