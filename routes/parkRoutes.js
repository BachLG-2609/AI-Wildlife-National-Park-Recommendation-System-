const express = require('express');
const parkController = require('../controllers/parkController');

const router = express.Router();

router.get('/safari-types', parkController.getAllSafariTypes);
router.get('/favorites/:userId', parkController.getFavoriteParks);

router.get('/:parkId/climate', parkController.getParkClimate);
router.post('/:parkId/climate', parkController.createParkClimate);
router.put(
  '/:parkId/climate/:climateId',
  parkController.updateParkClimate,
);
router.delete(
  '/:parkId/climate/:climateId',
  parkController.deleteParkClimate,
);
router.put('/:parkId/climate', parkController.updateParkClimate);
router.delete('/:parkId/climate', parkController.deleteParkClimate);

router.get('/:parkId/safaris', parkController.getParkSafaris);
router.post('/:parkId/safaris', parkController.createParkSafari);
router.delete(
  '/:parkId/safaris/:safariId',
  parkController.deleteParkSafari,
);

router.post('/:parkId/favorite', parkController.addFavoritePark);
router.delete('/:parkId/favorite', parkController.deleteFavoritePark);

router.get('/', parkController.getAllParks);
router.get('/:id', parkController.getParkById);
router.post('/', parkController.createPark);
router.put('/:id', parkController.updatePark);
router.delete('/:id', parkController.deletePark);

module.exports = router;
