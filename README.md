# WTWR - What to Wear Right Now

## 📁 Project Structure
- **Frontend**: React application (PORT 3001)
- **Backend**: Express.js API (PORT 3000)

### Backend Setup & Usage
See `backend/` folder for Express server setup and API documentation.

---
## Features

- **User Authentication**: Register and login with JWT tokens
- **User Profiles**: Edit profile information and avatar
- **Clothing Management**: Browse and manage clothing items
- **Like/Unlike**: Save favorite clothing items
- **Protected Routes**: Profile page accessible only to authenticated users
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React** 18
- **React Router** for navigation
- **Axios** for API calls
- **CSS** for styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already provided with defaults):
```
MONGODB_URI=mongodb://localhost:27017/wtwr
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=3000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
REACT_APP_API=http://localhost:3000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PATCH /api/auth/me` - Update user profile (requires auth)

### Clothing
- `GET /api/clothing` - Get all clothing items
- `POST /api/clothing` - Create new clothing item
- `POST /api/clothing/like` - Like a clothing item (requires auth)
- `POST /api/clothing/unlike` - Unlike a clothing item (requires auth)

## Usage

1. **Register**: Click "Sign Up" in the header and fill in your details
2. **Login**: Click "Log In" and enter your credentials
3. **Browse Clothing**: View all available clothing items on the home page
4. **Like Items**: Click the heart icon to save items to your favorites
5. **Edit Profile**: Click your name in the header and edit your profile
6. **Sign Out**: Click "Sign Out" button to logout

## Project Components

### Backend Structure
- `models/` - MongoDB schemas (User, Clothing)
- `routes/` - API route definitions
- `controllers/` - Business logic for routes
- `middleware/` - Authentication middleware
- `app.js` - Express app setup

### Frontend Structure
- `src/components/` - Reusable React components
- `src/pages/` - Page components (Home, Profile)
- `src/context/` - React Context for state management
- `src/utils/` - Utility functions and API calls
- `public/` - Static files

## Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days
- All API requests (except register/login) require a valid JWT token
- Frontend stores JWT token in localStorage
- CORS is enabled for frontend-backend communication

## Future Enhancements

- Add weather-based clothing recommendations
- Implement clothing categories and filters
- Add image upload functionality
- Create outfit combinations
- Add social features (follow users, share outfits)
- Implement search and filtering
