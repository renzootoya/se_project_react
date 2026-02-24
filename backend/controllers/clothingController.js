const User = require('../models/User');
const Clothing = require('../models/Clothing');

exports.likeClothing = async (req, res) => {
  try {
    const { clothingId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.likedClothes.includes(clothingId)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    user.likedClothes.push(clothingId);
    await user.save();

    res.status(200).json({
      message: 'Clothing liked',
      likedClothes: user.likedClothes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlikeClothing = async (req, res) => {
  try {
    const { clothingId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.likedClothes = user.likedClothes.filter(id => id.toString() !== clothingId);
    await user.save();

    res.status(200).json({
      message: 'Clothing unliked',
      likedClothes: user.likedClothes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClothing = async (req, res) => {
  try {
    const clothing = await Clothing.find();
    res.status(200).json({ clothing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createClothing = async (req, res) => {
  try {
    const { name, imageUrl, weather } = req.body;

    const clothing = new Clothing({ name, imageUrl, weather });
    await clothing.save();

    res.status(201).json({ clothing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
