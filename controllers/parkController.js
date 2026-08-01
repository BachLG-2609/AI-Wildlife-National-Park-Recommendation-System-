const parkModel = require('../models/parkModel');

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    data: null,
  });
};

const sendNotFound = (res) =>
  res.status(404).json({
    success: false,
    message: 'Park not found',
    data: null,
  });

const getAllParks = async (req, res) => {
  try {
    const parks = await parkModel.getAllParks();

    return res.status(200).json({
      success: true,
      message: 'Parks retrieved successfully',
      data: parks,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const getParkById = async (req, res) => {
  try {
    const park = await parkModel.getParkById(req.params.id);

    if (!park) {
      return sendNotFound(res);
    }

    return res.status(200).json({
      success: true,
      message: 'Park retrieved successfully',
      data: park,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const createPark = async (req, res) => {
  try {
    if (!req.body.park_name || !req.body.country) {
      return res.status(400).json({
        success: false,
        message: 'park_name and country are required',
        data: null,
      });
    }

    const park = await parkModel.createPark(req.body);

    return res.status(201).json({
      success: true,
      message: 'Park created successfully',
      data: park,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const updatePark = async (req, res) => {
  try {
    const park = await parkModel.updatePark(req.params.id, req.body);

    if (!park) {
      return sendNotFound(res);
    }

    return res.status(200).json({
      success: true,
      message: 'Park updated successfully',
      data: park,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const deletePark = async (req, res) => {
  try {
    const deleted = await parkModel.deletePark(req.params.id);

    if (!deleted) {
      return sendNotFound(res);
    }

    return res.status(200).json({
      success: true,
      message: 'Park deleted successfully',
      data: null,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getAllParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
};
