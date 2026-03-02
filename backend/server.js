const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/wtwr', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// API Routes
const authRoutes = require('./routes/auth');
const clothingRoutes = require('./routes/clothing');

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/clothing', clothingRoutes);

// Serve static files from root build folder
const frontendBuildPath = path.join(__dirname, '../build');
app.use(express.static(frontendBuildPath));

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
