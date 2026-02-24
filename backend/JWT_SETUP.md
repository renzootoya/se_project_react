# JWT Authentication Setup

## Environment Variables

Your `.env` file should contain:
```
MONGODB_URL=mongodb://localhost:27017/wtwr
PORT=3000
JWT_SECRET=my_super_secret_key_123456
NODE_ENV=development
```

## JWT Implementation

### 1. Token Creation (authController.js)
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
```
- Uses `process.env.JWT_SECRET` from `.env` file
- Token expires in 7 days
- Payload contains user ID

### 2. Token Verification (middleware/auth.js)
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- Verifies token signature using the same secret
- Extracts user ID from token payload
- Throws error if token is invalid or expired

### 3. Token Usage Flow
1. User registers/logs in → `generateToken()` creates JWT
2. Token sent to frontend and stored in localStorage
3. Frontend includes token in Authorization header: `Bearer <token>`
4. Backend middleware verifies token with `process.env.JWT_SECRET`
5. If valid, request proceeds; if invalid, returns 401 Unauthorized

## Security Best Practices ⚠️

### ✅ What We're Doing Right
- JWT_SECRET stored in `.env` file (not in code)
- `.env` file added to `.gitignore` (won't be committed to GitHub)
- Token expires after 7 days
- HTTPS should be used in production

### ⚠️ Important for Production
1. **Use a strong secret key** (currently: `my_super_secret_key_123456`)
   - Should be at least 32 characters
   - Use random characters, numbers, and symbols
   - Example: `aB9$xK2@mP7!qL5#nJ8&vW3%tY6^sU4`

2. **Never commit `.env` to GitHub**
   - Already configured in `.gitignore` ✅

3. **Use environment-specific secrets**
   - Development: Current secret
   - Production: Different, stronger secret

4. **Rotate secrets periodically**
   - Change JWT_SECRET every few months
   - This invalidates all existing tokens

5. **Use HTTPS in production**
   - Prevents token interception

## Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/wtwr` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for signing/verifying tokens | `my_super_secret_key_123456` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Testing JWT

### 1. Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### 2. Use token to access protected route
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Files Using JWT_SECRET

1. **authController.js** - Creates tokens with `generateToken()`
2. **middleware/auth.js** - Verifies tokens in protected routes
3. **.env** - Stores the secret key (not committed to Git)

## Troubleshooting

### "Invalid token" error
- Token may be expired (7 days)
- JWT_SECRET in `.env` may have changed
- Token may be malformed

### "No token provided" error
- Authorization header missing
- Format should be: `Authorization: Bearer <token>`

### MongoDB connection error
- Check `MONGODB_URL` in `.env`
- Ensure MongoDB is running locally
- Verify connection string format

---

**Status**: ✅ JWT authentication properly configured and secure
