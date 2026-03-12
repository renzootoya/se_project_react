const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');
const auth = require('../middleware/auth');

router.get('/', clothingController.getClothing);
router.post('/', auth, clothingController.createClothing);
router.put('/:id/likes', auth, clothingController.likeClothing);
router.delete('/:id/likes', auth, clothingController.unlikeClothing);
router.delete('/:id', auth, clothingController.deleteClothing);

module.exports = router;
