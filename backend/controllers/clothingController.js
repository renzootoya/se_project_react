const Clothing = require('../models/Clothing');

exports.getClothing = (req, res, next) => {
  Clothing.find()
    .populate('owner', 'name avatar')
    .populate('likes', '_id')
    .then((clothing) => res.status(200).json({ data: clothing }))
    .catch(next);
};

exports.createClothing = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;

  if (!name || !imageUrl || !weather || weather.length === 0) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  Clothing.create({ name, imageUrl, weather, owner: req.user.id })
    .then((clothing) => clothing.populate('owner', 'name avatar'))
    .then((clothing) => res.status(201).json({ data: clothing }))
    .catch(next);
};

exports.likeClothing = (req, res, next) => {
  Clothing.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((clothing) => {
      if (!clothing) {
        return res.status(404).json({ message: 'Item not found' });
      }
      return res.status(200).json({ data: clothing });
    })
    .catch(next);
};

exports.unlikeClothing = (req, res, next) => {
  Clothing.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((clothing) => {
      if (!clothing) {
        return res.status(404).json({ message: 'Item not found' });
      }
      return res.status(200).json({ data: clothing });
    })
    .catch(next);
};

exports.deleteClothing = (req, res, next) => {
  Clothing.findById(req.params.id)
    .then((clothing) => {
      if (!clothing) {
        return res.status(404).json({ message: 'Item not found' });
      }
      if (clothing.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this item' });
      }
      return Clothing.findByIdAndDelete(req.params.id).then(() =>
        res.status(200).json({ message: 'Item deleted successfully' })
      );
    })
    .catch(next);
};
