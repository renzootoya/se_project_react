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
    enum: ['Hot', 'Warm', 'Cool', 'Cold'],
    required: [true, 'Please specify weather type']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clothing', clothingSchema);
