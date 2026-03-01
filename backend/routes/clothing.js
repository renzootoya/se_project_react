const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');
const auth = require('../middleware/auth');

router.get('/', clothingController.getClothing);
router.post('/', auth, clothingController.createClothing);
router.post('/:id/like', auth, clothingController.likeClothing);
router.delete('/:id/unlike', auth, clothingController.unlikeClothing);
router.delete('/:id', auth, clothingController.deleteClothing);

module.exports = router;
