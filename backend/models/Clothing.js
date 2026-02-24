const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 2,
    maxlength: 100
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  weather: {
    type: [String],
    enum: ['hot', 'warm', 'cold'],
    required: [true, 'Please specify weather type']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clothing', clothingSchema);
