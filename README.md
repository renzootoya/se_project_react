# WTWR - What to Wear Right Now

A full-stack React + Express + MongoDB application that helps users decide what to wear based on the current weather.

## Live Deployment

**Live App:** https://web-production-ac1da.up.railway.app

## Repositories

- **Frontend:** https://github.com/renzootoya/se_project_react
- **Backend:** https://github.com/renzootoya/se_project_express

## Features

- User registration and login with JWT authentication
- Add, view, and delete clothing items
- Like / unlike clothing items
- Edit user profile (name and avatar)
- Weather-based clothing filtering (hot, warm, cold)
- Protected routes for authenticated users

## Tech Stack

**Frontend:** React 18, React Router 6, Context API, CSS3

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, celebrate/joi, winston

## API Endpoints

### Auth
- `POST /signup` — register a new user
- `POST /signin` — login and receive JWT token

### Users (token required)
- `GET /users/me` — get current user
- `PATCH /users/me` — update name and avatar

### Clothing Items
- `GET /items` — get all items (public)
- `POST /items` — create item (token required)
- `DELETE /items/:itemId` — delete item (owner only)
- `PUT /items/:itemId/likes` — like item (token required)
- `DELETE /items/:itemId/likes` — unlike item (token required)

## Running Locally

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start backend (port 3001)
node backend/server.js

# Start frontend (port 3000)
npm start
```

Set `REACT_APP_API=http://localhost:3001` in a `.env` file for local development.
