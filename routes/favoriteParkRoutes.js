const express = require('express');
const favoriteParkController = require('../controllers/favoriteParkController');

const router = express.Router();

router.get('/favorites/:userId', favoriteParkController.getFavoriteParks);
router.post('/:parkId/favorite', favoriteParkController.addFavoritePark);
router.delete('/:parkId/favorite', favoriteParkController.deleteFavoritePark);

module.exports = router;
