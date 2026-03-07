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
    serverSelectionTimeoutMS: 15000, // 15s to handle DNS + TLS on cold start
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

// Health check — call /api/health to see server and DB status
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    server: 'ok',
    database: states[dbState] || 'unknown',
    mongoUri: MONGO_URI ? 'set' : 'NOT SET',
  });
});

// API Routes
const authRoutes = require('./routes/auth');
const clothingRoutes = require('./routes/clothing');

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/clothing', clothingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Serve React build (static files)
const frontendBuildPath = path.join(__dirname, '../build');
app.use(express.static(frontendBuildPath));

// Catch-all: send React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MONGODB_URI is', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
  console.log('MONGODB_URL is', process.env.MONGODB_URL ? 'SET' : 'NOT SET');
});
