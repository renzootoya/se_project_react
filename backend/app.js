const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/wtwr', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/auth');
const clothingRoutes = require('./routes/clothing');

// Auth routes — standard project 12/13 paths
app.post('/signup', authController.signup);
app.post('/signin', authController.signin);
app.get('/users/me', authMiddleware, authController.getCurrentUser);
app.patch('/users/me', authMiddleware, authController.updateProfile);

// Clothing items — standard project 12/13 paths
app.use('/items', clothingRoutes);

// Serve React static build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Global error handler — must be last middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.name, err.message);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An error occurred on the server';
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
