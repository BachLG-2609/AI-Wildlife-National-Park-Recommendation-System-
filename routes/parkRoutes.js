const express = require('express');
const parkController = require('../controllers/parkController');

const router = express.Router();

router.get('/', parkController.getAllParks);
router.get('/:id', parkController.getParkById);
router.post('/', parkController.createPark);
router.put('/:id', parkController.updatePark);
router.delete('/:id', parkController.deletePark);

module.exports = router;
