# WTWR Frontend

React web application for the WTWR (What to Wear Right Now) project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
REACT_APP_API=http://localhost:3000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3001`

## Project Structure

```
src/
├── components/
│   ├── Header.js           # Navigation header with auth buttons
│   ├── Header.css
│   ├── RegisterModal.js    # User registration form
│   ├── LoginModal.js       # User login form
│   └── Modal.css           # Shared modal styles
├── pages/
│   ├── Home.js             # Clothing items display
│   ├── Home.css
│   ├── Profile.js          # User profile page
│   └── Profile.css
├── context/
│   └── CurrentUserContext.js  # Global user state management
├── utils/
│   ├── api.js              # API calls and axios setup
│   └── ProtectedRoute.js   # Route protection component
├── App.js                  # Main app component
├── App.css
├── index.js                # React entry point
└── index.css
```

## Components

### Header
- Displays WTWR logo
- Shows authentication buttons (Sign Up/Log In) when not logged in
- Shows user name and Sign Out button when logged in
- Manages modal visibility for auth forms

### RegisterModal
- Form for new user registration
- Fields: Name, Email, Password
- Validates input and handles registration
- Can switch to login modal

### LoginModal
- Form for user login
- Fields: Email, Password
- Validates credentials and handles login
- Can switch to registration modal

### Home Page
- Displays all available clothing items in a grid
- Shows clothing name, image, and weather tags
- Like/Unlike button for each item
- Requires login to like items

### Profile Page
- Displays current user information
- Shows user avatar, name, and email
- Edit profile functionality
- Can update name and avatar URL
- Protected route - only accessible when logged in

## Context

### CurrentUserContext
Manages global user state:
- `currentUser` - Current logged-in user data
- `isLoggedIn` - Authentication status
- `loading` - Loading state
- `login(token, user)` - Set user and token
- `logout()` - Clear user and token
- `updateUser(updatedUser)` - Update user data
- `API_URL` - Base API URL

## Utilities

### api.js
- Creates axios instance with base URL
- Automatically adds JWT token to request headers
- Exports API functions for auth and clothing endpoints

### ProtectedRoute.js
- Wrapper component for protected routes
- Redirects to home if not authenticated
- Shows loading state while checking auth

## Features

### Authentication Flow
1. User clicks Sign Up or Log In
2. Modal opens with form
3. Form submitted to backend
4. JWT token received and stored in localStorage
5. User data stored in CurrentUserContext
6. User redirected to home page

### Like/Unlike Flow
1. User clicks heart icon on clothing item
2. API call sent to backend with clothing ID
3. Item added/removed from user's likedClothes
4. UI updates to show liked status

### Profile Edit Flow
1. User navigates to profile page
2. Clicks "Edit Profile" button
3. Form appears with current data
4. User updates name and/or avatar
5. Changes saved to backend
6. Profile updated in context

## Available Scripts

```bash
npm start      # Start development server
npm build      # Build for production
npm test       # Run tests
npm eject      # Eject from create-react-app (irreversible)
```

## Environment Variables

- `REACT_APP_API` - Backend API base URL (default: http://localhost:3000/api)

## Styling

- Uses CSS modules and inline styles
- Responsive design with CSS Grid and Flexbox
- Mobile-first approach
- Color scheme:
  - Primary: #007bff (Blue)
  - Success: #28a745 (Green)
  - Danger: #dc3545 (Red)
  - Background: #f5f5f5 (Light Gray)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `react-scripts` - Create React App scripts

## Notes

- JWT token stored in localStorage
- Token automatically included in all API requests
- Token persists across page refreshes
- Token cleared on logout
- All routes except home require authentication for certain features
