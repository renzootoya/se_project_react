const Clothing = require('../models/Clothing');

exports.getClothing = async (req, res) => {
  try {
    const clothing = await Clothing.find().populate('owner', 'name avatar').populate('likes', '_id');
    res.status(200).json({ data: clothing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createClothing = async (req, res) => {
  try {
    const { name, imageUrl, weather } = req.body;

    if (!name || !imageUrl || !weather) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const clothing = new Clothing({ name, imageUrl, weather, owner: req.user.id });
    await clothing.save();
    await clothing.populate('owner', 'name avatar');

    res.status(201).json({ data: clothing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const clothing = await Clothing.findById(id);
    if (!clothing) {
      return res.status(404).json({ message: 'Clothing not found' });
    }

    if (clothing.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    clothing.likes.push(req.user.id);
    await clothing.save();

    res.status(200).json({
      message: 'Clothing liked',
      data: clothing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlikeClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const clothing = await Clothing.findById(id);
    if (!clothing) {
      return res.status(404).json({ message: 'Clothing not found' });
    }

    clothing.likes = clothing.likes.filter(likeId => likeId.toString() !== req.user.id);
    await clothing.save();

    res.status(200).json({
      message: 'Clothing unliked',
      data: clothing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const clothing = await Clothing.findById(id);
    if (!clothing) {
      return res.status(404).json({ message: 'Clothing not found' });
    }

    if (clothing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Clothing.findByIdAndDelete(id);

    res.status(200).json({ message: 'Clothing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
