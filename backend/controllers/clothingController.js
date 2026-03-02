const Clothing = require('../models/Clothing');

exports.getClothing = async (req, res) => {
  try {
    const clothing = await Clothing.find().populate('owner', 'name avatar').populate('likes', '_id');
    res.status(200).json({ data: clothing });
  } catch (error) {
    console.error('Error fetching clothing:', error);
    // Return sample data if database is not available
    const sampleData = [
      {
        _id: '1',
        name: 'T-Shirt',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        weather: ['hot', 'warm'],
        owner: { _id: '0', name: 'Admin', avatar: '' },
        likes: []
      },
      {
        _id: '2',
        name: 'Jeans',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400',
        weather: ['warm', 'cool'],
        owner: { _id: '0', name: 'Admin', avatar: '' },
        likes: []
      },
      {
        _id: '3',
        name: 'Sweater',
        imageUrl: 'https://images.unsplash.com/photo-1556821552-5ff63b1b5786?w=400',
        weather: ['cool', 'cold'],
        owner: { _id: '0', name: 'Admin', avatar: '' },
        likes: []
      },
      {
        _id: '4',
        name: 'Winter Coat',
        imageUrl: 'https://images.unsplash.com/photo-1539533057440-7814a9d790ff?w=400',
        weather: ['cold'],
        owner: { _id: '0', name: 'Admin', avatar: '' },
        likes: []
      }
    ];
    res.status(200).json({ data: sampleData });
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
