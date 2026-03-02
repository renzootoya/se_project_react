# WTWR - What to Wear Right Now

A full-stack React + Express + MongoDB application for managing clothing items and getting outfit recommendations based on weather.

## 🚀 Live Deployment

**GitHub Repository:** https://github.com/renzootoya/se_project_react

**Backend Repository:** https://github.com/renzootoya/se_project_backend

### Option 1: Run Locally (Recommended for Testing)

**Step 1: Start Backend Server**
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:3000
```

**Step 2: Start Frontend Server (in new terminal)**
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3001
```

**Step 3: Open in Browser**
```
http://localhost:3001
```

### Option 2: Deploy Everything to Railway (Recommended)

Railway will automatically build and serve both frontend and backend from a single application.

**IMPORTANT: Before Deploying, You Need MongoDB**

1. **Create a MongoDB Atlas account** (free tier available):
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a cluster (M0 free tier)
   - Create a database user with username and password
   - Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/wtwr?retryWrites=true&w=majority`)

**Steps to Deploy on Railway:**

1. **Go to https://railway.app** and sign in with GitHub
2. **Click "New Project"** → **"Deploy from GitHub"**
3. **Select the `se_project_react` repository**
4. **Railway will automatically start building**
   - It will build the frontend (`npm run build:all`)
   - It will start the backend server which serves both API and static files
5. **CRITICAL: Add Environment Variables** in Railway dashboard:
   - Click on the "web" service
   - Go to **Variables** tab
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB connection string from Atlas
     - `JWT_SECRET`: Any random string (e.g., `your_secret_key_12345`)
     - `NODE_ENV`: `production`
6. **Click "Deploy"** or wait for auto-redeploy
7. **Wait for deployment to complete** (takes 2-5 minutes)
8. **Railway will show your live URL** (e.g., `https://web-production-xxxx.up.railway.app`)

**How it works:**
- Frontend is built and placed in `frontend/build`
- Backend server (`server.js`) serves both:
  - API routes at `/api/*`
  - Static frontend files at `/`
  - React Router catch-all for SPA navigation

**Your app will be live at:** `https://your-railway-url.up.railway.app`

**Troubleshooting:**
- If nothing is clickable: Check that `MONGODB_URI` is set in Railway Variables
- If you see "Site not found": Wait a few more minutes for deployment to complete
- If login doesn't work: Verify `JWT_SECRET` is set

> **For Tutor:** After deployment with MongoDB configured, the app will be fully functional!

## 🚀 Features

- **User Authentication**: Register and login with JWT tokens
- **User Profiles**: Edit profile information and avatar
- **Clothing Management**: Browse and manage clothing items
- **Like/Unlike**: Save favorite clothing items
- **Protected Routes**: Profile page accessible only to authenticated users
- **Responsive Design**: Works on desktop and mobile devices
- **Weather-Based Filtering**: Organize clothes by weather type (Hot, Warm, Cool, Cold)

## 📋 Tech Stack

### Frontend
- **React** 18 - UI library
- **React Router** 6 - Client-side routing
- **CSS3** - Styling with responsive design
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
project-14/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Main.jsx
│   │   │   ├── Main.css
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemCard.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── LoginModal.jsx
│   │   │   ├── RegisterModal.jsx
│   │   │   ├── Modal.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Profile.jsx
│   │   │   └── Profile.css
│   │   ├── contexts/
│   │   │   └── CurrentUserContext.jsx
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── App.jsx
│   ├── package.json
│   └── .gitignore
│
└── backend/
    ├── models/
    │   ├── User.js
    │   └── Clothing.js
    ├── routes/
    │   ├── auth.js
    │   └── clothing.js
    ├── controllers/
    │   ├── authController.js
    │   └── clothingController.js
    ├── middleware/
    │   └── auth.js
    ├── app.js
    ├── package.json
    ├── .env
    └── .gitignore
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already provided with defaults):
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

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API=http://localhost:3000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `GET /api/users/me` - Get current user (requires Bearer token)
- `PATCH /api/users/me` - Update user profile (requires Bearer token)

### Clothing
- `GET /api/clothing` - Get all clothing items
- `POST /api/clothing` - Create new clothing item (requires Bearer token)
- `POST /api/clothing/like` - Like a clothing item (requires Bearer token)
- `POST /api/clothing/unlike` - Unlike a clothing item (requires Bearer token)
- `DELETE /api/clothing/:id` - Delete clothing item (requires Bearer token)

## 🎯 Usage

1. **Register**: Click "Register" in the header and fill in your details
2. **Login**: Click "Sign In" and enter your credentials
3. **Browse Clothing**: View all available clothing items on the home page
4. **Like Items**: Click the heart icon to save items to your favorites
5. **Edit Profile**: Click "Profile" in the header to edit your information
6. **Sign Out**: Click "Sign Out" button to logout

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend generates JWT token
3. Token is stored in localStorage
4. Token is sent with every authenticated request in Authorization header
5. Backend verifies token and grants access to protected resources
6. On app load, token is verified and user is automatically logged in if valid

## 📝 Component Details

### Header Component
- Displays WTWR logo
- Shows user info when logged in (avatar, name)
- Login/Register buttons when logged out
- Sign Out button when logged in
- Navigation to Profile page

### Main Component
- Displays weather guide with 4 weather types
- Shows grid of all clothing items
- Each item card displays image, name, weather tags, and like count
- Like button available for logged-in users

### Profile Component
- Shows user information (name, email, avatar)
- Edit button to modify profile
- Form for updating name and avatar
- Validation and error handling

### ItemCard Component
- Displays clothing item image
- Shows item name and weather tags
- Like button with heart icon
- Like count display
- Responsive hover effects

## 🔄 State Management

### App.jsx State
- `isLoggedIn` - Boolean indicating if user is authenticated
- `currentUser` - Current user object with _id, name, email, avatar
- `clothingItems` - Array of all clothing items
- `showRegisterModal` - Boolean for register modal visibility
- `showLoginModal` - Boolean for login modal visibility
- `loading` - Boolean for initial token verification

### Context
- `CurrentUserContext` - Provides currentUser and isLoggedIn to all components

## 🛡️ Security Features

- Passwords hashed with bcryptjs before storage
- JWT tokens expire after 7 days
- All API requests (except register/login) require valid JWT token
- Bearer token authentication in Authorization header
- CORS enabled for frontend-backend communication
- Protected routes redirect unauthenticated users to home

## 🎨 Styling

- Modern, clean UI with blue accent color (#007bff)
- Responsive design using CSS Grid and Flexbox
- Mobile-first approach with media queries
- Smooth transitions and hover effects
- Professional color scheme (white, light gray, blue)

## 📱 Responsive Breakpoints

- Desktop: Full layout with all features
- Tablet (768px): Adjusted spacing and grid
- Mobile (< 768px): Single column layout, hidden user name in header

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variable: `REACT_APP_API=<backend-url>`

### Backend (Heroku/Railway)
1. Set environment variables on hosting platform
2. Deploy using Git or CLI
3. Ensure MongoDB connection string is set

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct
- Check MONGODB_URI in .env file

### Token Not Persisting
- Check if localStorage is enabled in browser
- Verify JWT_SECRET is set in backend .env

### CORS Errors
- Ensure backend CORS is configured correctly
- Check REACT_APP_API environment variable

### Login/Register Not Working
- Verify backend is running on correct port
- Check network tab in browser DevTools
- Ensure email is not already registered

## 📚 Future Enhancements

- Add weather API integration for real-time weather
- Implement clothing categories and filters
- Add image upload functionality
- Create outfit combinations
- Add social features (follow users, share outfits)
- Implement search and advanced filtering
- Add dark mode toggle
- Create mobile app with React Native

## 📄 License

ISC

## 👤 Author

Created as part of Project 14 - WTWR Application

---

**Happy coding! 🎉**
