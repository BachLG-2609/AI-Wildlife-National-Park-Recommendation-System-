const express = require('express');
const parkSafariController = require('../controllers/parkSafariController');

const router = express.Router();

router.get('/safari-types', parkSafariController.getAllSafariTypes);
router.get('/:parkId/safaris', parkSafariController.getParkSafaris);
router.post('/:parkId/safaris', parkSafariController.createParkSafari);
router.delete(
  '/:parkId/safaris/:safariId',
  parkSafariController.deleteParkSafari,
);

module.exports = router;
