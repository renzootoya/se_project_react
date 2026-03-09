const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

const authRoutes = require('./routes/auth');
const clothingRoutes = require('./routes/clothing');

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/clothing', clothingRoutes);

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
