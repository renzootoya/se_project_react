const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Disable Mongoose command buffering so requests fail fast
// instead of hanging when MongoDB is not connected
mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json());

// MongoDB Connection with fast-fail timeout
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  'mongodb://localhost:27017/wtwr';

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,   // fail after 5s if can't reach DB
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('MongoDB connected to', MONGO_URI.split('@').pop()))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// API Routes
const authRoutes = require('./routes/auth');
const clothingRoutes = require('./routes/clothing');

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/clothing', clothingRoutes);

// Global error handler — catches unhandled errors from routes
// and returns JSON instead of hanging or crashing
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
