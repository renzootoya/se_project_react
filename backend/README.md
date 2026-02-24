# WTWR Backend

Express.js API server for the WTWR application with MongoDB integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file with your settings:
```
MONGODB_URI=mongodb://localhost:27017/wtwr
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=3000
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": ""
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": ""
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer jwt_token_here

Response (200):
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "likedClothes": ["clothing_id_1", "clothing_id_2"]
  }
}
```

#### Update User Profile
```
PATCH /api/auth/me
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg"
}

Response (200):
{
  "user": {
    "_id": "user_id",
    "name": "Jane Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### Clothing Endpoints

#### Get All Clothing
```
GET /api/clothing

Response (200):
{
  "clothing": [
    {
      "_id": "clothing_id",
      "name": "Winter Jacket",
      "imageUrl": "https://example.com/jacket.jpg",
      "weather": ["cold"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Clothing Item
```
POST /api/clothing
Content-Type: application/json

{
  "name": "Summer T-Shirt",
  "imageUrl": "https://example.com/tshirt.jpg",
  "weather": ["hot", "warm"]
}

Response (201):
{
  "clothing": {
    "_id": "clothing_id",
    "name": "Summer T-Shirt",
    "imageUrl": "https://example.com/tshirt.jpg",
    "weather": ["hot", "warm"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Like Clothing Item
```
POST /api/clothing/like
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "clothingId": "clothing_id"
}

Response (200):
{
  "message": "Clothing liked",
  "likedClothes": ["clothing_id_1", "clothing_id_2"]
}
```

#### Unlike Clothing Item
```
POST /api/clothing/unlike
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "clothingId": "clothing_id"
}

Response (200):
{
  "message": "Clothing unliked",
  "likedClothes": ["clothing_id_1"]
}
```

## Error Handling

All errors follow this format:
```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Database Models

### User Schema
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `avatar` (String, optional)
- `likedClothes` (Array of ObjectIds, references Clothing)
- `createdAt` (Date, default: now)

### Clothing Schema
- `name` (String, required)
- `imageUrl` (String, required)
- `weather` (Array of Strings: 'hot', 'warm', 'cold')
- `createdAt` (Date, default: now)

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `validator` - Input validation
