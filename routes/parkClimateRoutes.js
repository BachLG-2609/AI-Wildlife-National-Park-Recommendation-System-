const express = require('express');
const parkClimateController = require('../controllers/parkClimateController');

const router = express.Router();

router.get('/:parkId/climate', parkClimateController.getParkClimate);
router.post('/:parkId/climate', parkClimateController.createParkClimate);
router.put(
  '/:parkId/climate/:climateId',
  parkClimateController.updateParkClimate,
);
router.delete(
  '/:parkId/climate/:climateId',
  parkClimateController.deleteParkClimate,
);
router.put('/:parkId/climate', parkClimateController.updateParkClimate);
router.delete('/:parkId/climate', parkClimateController.deleteParkClimate);

module.exports = router;
