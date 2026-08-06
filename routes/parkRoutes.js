const express = require('express');
const parkController = require('../controllers/parkController');
const parkClimateRoutes = require('./parkClimateRoutes');
const parkFacilityRoutes = require('./parkFacilityRoutes');
const parkSafariRoutes = require('./parkSafariRoutes');
const favoriteParkRoutes = require('./favoriteParkRoutes');

const router = express.Router();

router.use('/', parkClimateRoutes);
router.use('/', parkFacilityRoutes);
router.use('/', parkSafariRoutes);
router.use('/', favoriteParkRoutes);

router.get('/', parkController.getAllParks);
router.get('/:id', parkController.getParkById);
router.post('/', parkController.createPark);
router.put('/:id', parkController.updatePark);
router.delete('/:id', parkController.deletePark);

module.exports = router;
