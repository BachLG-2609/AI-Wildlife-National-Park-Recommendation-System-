const parkClimateModel = require('../models/parkClimateModel');

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    data: null,
  });
};

const getParkClimate = async (req, res) => {
  try {
    const climate = await parkClimateModel.getParkClimate(req.params.parkId);

    return res.status(200).json({
      success: true,
      message: 'Park climate retrieved successfully',
      data: climate,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const createParkClimate = async (req, res) => {
  try {
    const climate = await parkClimateModel.createParkClimate(
      req.params.parkId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: 'Park climate created successfully',
      data: climate,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const updateParkClimate = async (req, res) => {
  try {
    const climateId = req.params.climateId || req.body.id;

    if (!climateId) {
      return res.status(400).json({
        success: false,
        message: 'Climate id is required',
        data: null,
      });
    }

    const climate = await parkClimateModel.updateParkClimate(
      req.params.parkId,
      climateId,
      req.body,
    );

    if (!climate) {
      return res.status(404).json({
        success: false,
        message: 'Park climate not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Park climate updated successfully',
      data: climate,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteParkClimate = async (req, res) => {
  try {
    const climateId =
      req.params.climateId || req.query.climateId || req.body?.id;

    if (!climateId) {
      return res.status(400).json({
        success: false,
        message: 'Climate id is required',
        data: null,
      });
    }

    const deleted = await parkClimateModel.deleteParkClimate(
      req.params.parkId,
      climateId,
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Park climate not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Park climate deleted successfully',
      data: null,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getParkClimate,
  createParkClimate,
  updateParkClimate,
  deleteParkClimate,
};
