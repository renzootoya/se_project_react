const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/me', auth, authController.getCurrentUser);
router.patch('/me', auth, authController.updateProfile);

module.exports = router;
