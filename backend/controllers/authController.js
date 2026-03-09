const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'wtwr_jwt_secret_key';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

exports.signup = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      return User.create({ name, avatar: avatar || '', email, password });
    })
    .then((user) => {
      if (!user || user.statusCode) return; // already responded
      const token = generateToken(user._id);
      return res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch(next);
};

exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return user.matchPassword(password).then((isValid) => {
        if (!isValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id);
        return res.status(200).json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        });
      });
    })
    .catch(next);
};

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch(next);
};

exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  User.findByIdAndUpdate(
    req.user.id,
    { name, avatar: avatar || '' },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch(next);
};
