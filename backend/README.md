# WTWR Backend API

Express.js backend for the WTWR (What to Wear Right Now) application.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/wtwr
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=3000
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "avatar": "https://example.com/avatar.jpg" (optional)
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### Login User
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### Get Current User
```
GET /api/users/me
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### Update User Profile
```
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://example.com/new-avatar.jpg"
}

Response (200):
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

### Clothing Routes (`/api/clothing`)

#### Get All Clothing Items
```
GET /api/clothing

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Winter Jacket",
      "imageUrl": "https://example.com/jacket.jpg",
      "weather": ["Cold"],
      "owner": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "likes": [],
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ]
}
```

#### Create Clothing Item
```
POST /api/clothing
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Summer T-Shirt",
  "imageUrl": "https://example.com/tshirt.jpg",
  "weather": ["Hot", "Warm"]
}

Response (201):
{
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Summer T-Shirt",
    "imageUrl": "https://example.com/tshirt.jpg",
    "weather": ["Hot", "Warm"],
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "likes": [],
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

#### Like Clothing Item
```
POST /api/clothing/like
Authorization: Bearer <token>
Content-Type: application/json

{
  "clothingId": "507f1f77bcf86cd799439012"
}

Response (200):
{
  "message": "Clothing liked",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Winter Jacket",
    "imageUrl": "https://example.com/jacket.jpg",
    "weather": ["Cold"],
    "owner": "507f1f77bcf86cd799439011",
    "likes": ["507f1f77bcf86cd799439011"],
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

#### Unlike Clothing Item
```
POST /api/clothing/unlike
Authorization: Bearer <token>
Content-Type: application/json

{
  "clothingId": "507f1f77bcf86cd799439012"
}

Response (200):
{
  "message": "Clothing unliked",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Winter Jacket",
    "imageUrl": "https://example.com/jacket.jpg",
    "weather": ["Cold"],
    "owner": "507f1f77bcf86cd799439011",
    "likes": [],
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

#### Delete Clothing Item
```
DELETE /api/clothing/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Clothing deleted successfully"
}
```

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from the `/api/auth/signup` or `/api/auth/signin` endpoints and expire after 7 days.

## 📊 Database Models

### User Model
```javascript
{
  name: String (required, 2-30 chars),
  email: String (required, unique, valid email),
  password: String (required, 6+ chars, hashed),
  avatar: String (optional),
  createdAt: Date (default: now)
}
```

### Clothing Model
```javascript
{
  name: String (required, 2-100 chars),
  imageUrl: String (required),
  weather: [String] (required, enum: ['Hot', 'Warm', 'Cool', 'Cold']),
  owner: ObjectId (required, ref: User),
  likes: [ObjectId] (ref: User),
  createdAt: Date (default: now)
}
```

## 🛡️ Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

Common error codes:
- `400` - Bad Request (missing fields, invalid data)
- `401` - Unauthorized (invalid token, not logged in)
- `403` - Forbidden (not authorized to perform action)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

## 🔄 Middleware

### Authentication Middleware (`/middleware/auth.js`)
- Verifies JWT token from Authorization header
- Extracts user ID from token
- Attaches user info to request object
- Returns 401 if token is invalid or missing

## 📝 Controllers

### Auth Controller (`/controllers/authController.js`)
- `signup` - Register new user
- `signin` - Login user
- `getCurrentUser` - Get authenticated user info
- `updateProfile` - Update user profile

### Clothing Controller (`/controllers/clothingController.js`)
- `getClothing` - Get all clothing items
- `createClothing` - Create new clothing item
- `likeClothing` - Like a clothing item
- `unlikeClothing` - Unlike a clothing item
- `deleteClothing` - Delete clothing item

## 🚀 Deployment

### Environment Variables
Set these on your hosting platform:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT (use strong random string)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Hosting Options
- **Heroku** - Easy deployment with Git
- **Railway** - Modern Node.js hosting
- **DigitalOcean** - VPS with full control
- **AWS** - Scalable cloud platform

## 🧪 Testing

Test endpoints using:
- **Postman** - GUI API testing tool
- **cURL** - Command-line tool
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

Example cURL request:
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📚 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - Cross-origin requests

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB credentials if using cloud

### JWT Token Errors
```
Error: Invalid token
```
- Ensure JWT_SECRET is set correctly
- Check token format in Authorization header
- Verify token hasn't expired

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
- Ensure CORS is enabled in app.js
- Check frontend URL is allowed
- Verify credentials are being sent

---

**For more information, see the main README.md**
