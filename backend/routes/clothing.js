const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');
const auth = require('../middleware/auth');

router.get('/', clothingController.getClothing);
router.post('/', auth, clothingController.createClothing);
router.post('/like', auth, clothingController.likeClothing);
router.post('/unlike', auth, clothingController.unlikeClothing);
router.delete('/:id', auth, clothingController.deleteClothing);

module.exports = router;
