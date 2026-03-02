# WTWR - What to Wear Right Now

A full-stack React + Express + MongoDB application.

## 🔗 Backend Repository

**Backend API:** https://github.com/renzootoya/se_project_react

The backend is built with Express.js and MongoDB. Make sure to clone and run the backend server on port 3000 before running the frontend.

[Backend Code - se_project_backend](https://github.com/renzootoya/se_project_backend)



## 🎯 Key Features

### Authentication
- User registration with name, email, password, and optional avatar
- User login with email and password
- JWT token storage in localStorage
- Automatic token verification on app load
- Protected routes for authenticated users only

### User Profile
- View user information (name, email, avatar)
- Edit profile with validation
- Avatar preview when editing
- Success/error messages

### Clothing Management
- Browse all clothing items
- View item details (name, image, weather tags)
- Like/unlike items (logged-in users only)
- Like count display
- Weather-based organization (Hot, Warm, Cool, Cold)

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly buttons

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API=http://localhost:3000/api
```

For production:
```
REACT_APP_API=https://your-backend-url.com/api
```

## 📦 Dependencies

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `react-scripts` - Build scripts

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
Ejects from Create React App (irreversible).

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is sent with every API request in Authorization header
5. On app load, token is verified and user is auto-logged in if valid
6. Protected routes redirect to home if user is not logged in

## 🎨 Styling

- CSS3 with responsive design
- Mobile-first approach
- Flexbox and CSS Grid layouts
- Smooth transitions and hover effects
- Professional color scheme

### Color Palette
- Primary: #007bff (Blue)
- Success: #28a745 (Green)
- Danger: #dc3545 (Red)
- Background: #f5f5f5 (Light Gray)
- Text: #333 (Dark Gray)

## 📱 Responsive Breakpoints

- Desktop: Full layout
- Tablet (768px): Adjusted spacing
- Mobile (< 768px): Single column, optimized for touch

## 🧪 Testing

Test the app locally:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Open browser to `http://localhost:3001`

### Test Scenarios

**Registration:**
1. Click "Register"
2. Fill in name, email, password
3. Click "Sign Up"
4. Should be logged in automatically

**Login:**
1. Click "Sign In"
2. Enter email and password
3. Click "Log In"
4. Should be logged in

**Like Item:**
1. Log in
2. Click heart icon on any item
3. Heart should fill in red
4. Like count should increase

**Edit Profile:**
1. Log in
2. Click "Profile"
3. Click "Edit Profile"
4. Update name/avatar
5. Click "Save Changes"
6. Changes should be reflected

**Logout:**
1. Click "Sign Out"
2. Should return to home
3. Should see login/register buttons

## 🚀 Deployment

### Netlify

1. Build the project:
```bash
npm run build
```

2. Connect GitHub repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable: `REACT_APP_API=<backend-url>`
6. Deploy

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `REACT_APP_API=<backend-url>`
4. Deploy

### Manual Deployment

1. Build: `npm run build`
2. Upload `build` folder to web server
3. Configure server to serve `index.html` for all routes
4. Set `REACT_APP_API` environment variable

## 🐛 Troubleshooting

### Blank Page
- Check browser console for errors
- Verify `REACT_APP_API` is set correctly
- Ensure backend is running

### Login Not Working
- Check network tab in DevTools
- Verify backend URL is correct
- Ensure backend is running on correct port

### Token Not Persisting
- Check if localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### CORS Errors
- Verify backend CORS is configured
- Check `REACT_APP_API` environment variable
- Ensure backend is running

## 📚 Component Documentation

### Header Component
Displays navigation and user information.

Props:
- `isLoggedIn` - Boolean
- `currentUser` - User object
- `onLogout` - Logout handler
- `onShowRegister` - Show register modal
- `onShowLogin` - Show login modal
- `showRegisterModal` - Register modal visibility
- `setShowRegisterModal` - Set register modal visibility
- `showLoginModal` - Login modal visibility
- `setShowLoginModal` - Set login modal visibility
- `onRegister` - Register handler
- `onLogin` - Login handler

### Main Component
Displays clothing items and weather guide.

Props:
- `currentUser` - Current user object
- `isLoggedIn` - Boolean
- `clothingItems` - Array of items
- `setClothingItems` - Update items

### Profile Component
Displays and edits user profile.

Props:
- `currentUser` - Current user object
- `onUpdateProfile` - Update handler

### ItemCard Component
Displays individual clothing item.

Props:
- `item` - Clothing item object
- `isLoggedIn` - Boolean
- `currentUser` - Current user object
- `onLike` - Like handler

## 🔄 State Management

App-level state:
- `isLoggedIn` - Authentication status
- `currentUser` - Current user data
- `clothingItems` - All clothing items
- `showRegisterModal` - Register modal visibility
- `showLoginModal` - Login modal visibility
- `loading` - Initial load state

Context:
- `CurrentUserContext` - Global user state

## 📝 API Integration

All API calls use the `REACT_APP_API` environment variable as the base URL.

Example:
```javascript
const response = await fetch(`${process.env.REACT_APP_API}/clothing`);
```

Authentication:
```javascript
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
  }
});
```

---

**For backend documentation, see backend/README.md**
