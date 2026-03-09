const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  'mongodb://localhost:27017/wtwr';

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    const safeUri = MONGO_URI.includes('@')
      ? MONGO_URI.split('@')[1]
      : MONGO_URI;
    console.log('MongoDB connected to', safeUri);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    server: 'ok',
    database: states[dbState] || 'unknown',
    mongoUri: MONGO_URI.includes('localhost') ? 'local' : 'cloud',
  });
});

// API Routes
const authRoutes = require('./routes/auth');
const clothingRoutes = require('./routes/clothing');

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/clothing', clothingRoutes);

// Serve React static build
const frontendBuildPath = path.join(__dirname, '../build');
app.use(express.static(frontendBuildPath));

// Catch-all: serve React app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Global error handler — must be last
app.use((err, req, res, next) => {
  console.error('Server error:', err.name, err.message);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An error occurred on the server';
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('MongoDB URI:', MONGO_URI.includes('@') ? '***@' + MONGO_URI.split('@')[1] : MONGO_URI);
});
