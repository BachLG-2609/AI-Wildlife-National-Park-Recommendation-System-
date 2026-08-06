const parkSafariModel = require('../models/parkSafariModel');

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    data: null,
  });
};

const getAllSafariTypes = async (req, res) => {
  try {
    const safariTypes = await parkSafariModel.getAllSafariTypes();

    return res.status(200).json({
      success: true,
      message: 'Safari types retrieved successfully',
      data: safariTypes,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const getParkSafaris = async (req, res) => {
  try {
    const safaris = await parkSafariModel.getParkSafaris(req.params.parkId);

    return res.status(200).json({
      success: true,
      message: 'Park safaris retrieved successfully',
      data: safaris,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const createParkSafari = async (req, res) => {
  try {
    if (!req.body.safari_id) {
      return res.status(400).json({
        success: false,
        message: 'safari_id is required',
        data: null,
      });
    }

    const safari = await parkSafariModel.createParkSafari(
      req.params.parkId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: 'Safari added to park successfully',
      data: safari,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteParkSafari = async (req, res) => {
  try {
    const deleted = await parkSafariModel.deleteParkSafari(
      req.params.parkId,
      req.params.safariId,
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Park safari not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Safari removed from park successfully',
      data: null,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getAllSafariTypes,
  getParkSafaris,
  createParkSafari,
  deleteParkSafari,
};
