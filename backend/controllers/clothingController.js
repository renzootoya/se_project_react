const Clothing = require('../models/Clothing');

exports.getClothing = async (req, res) => {
  try {
    const clothing = await Clothing.find()
      .populate('owner', 'name avatar')
      .populate('likes', '_id');
    return res.status(200).json({ data: clothing });
  } catch (err) {
    console.error('getClothing error:', err.message);
    if (err.name === 'MongoNotConnectedError' || err.name === 'MongoServerSelectionError') {
      return res.status(503).json({ data: [], message: 'Database unavailable' });
    }
    return res.status(500).json({ data: [], message: err.message });
  }
};

exports.createClothing = async (req, res) => {
  try {
    const { name, imageUrl, weather } = req.body;

    if (!name || !imageUrl || !weather || weather.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const clothing = new Clothing({ name, imageUrl, weather, owner: req.user.id });
    await clothing.save();
    await clothing.populate('owner', 'name avatar');

    return res.status(201).json({ data: clothing });
  } catch (err) {
    console.error('createClothing error:', err.message);
    return res.status(500).json({ message: err.message || 'Failed to create item' });
  }
};

exports.likeClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const clothing = await Clothing.findById(id);
    if (!clothing) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const alreadyLiked = clothing.likes.some(
      (likeId) => likeId.toString() === req.user.id
    );
    if (!alreadyLiked) {
      clothing.likes.push(req.user.id);
      await clothing.save();
    }

    return res.status(200).json({ data: clothing });
  } catch (err) {
    console.error('likeClothing error:', err.message);
    return res.status(500).json({ message: err.message || 'Failed to like item' });
  }
};

exports.unlikeClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const clothing = await Clothing.findById(id);
    if (!clothing) {
      return res.status(404).json({ message: 'Item not found' });
    }

    clothing.likes = clothing.likes.filter(
      (likeId) => likeId.toString() !== req.user.id
    );
    await clothing.save();

    return res.status(200).json({ data: clothing });
  } catch (err) {
    console.error('unlikeClothing error:', err.message);
    return res.status(500).json({ message: err.message || 'Failed to unlike item' });
  }
};

exports.deleteClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const clothing = await Clothing.findById(id);
    if (!clothing) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (clothing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Clothing.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('deleteClothing error:', err.message);
    return res.status(500).json({ message: err.message || 'Failed to delete item' });
  }
};
