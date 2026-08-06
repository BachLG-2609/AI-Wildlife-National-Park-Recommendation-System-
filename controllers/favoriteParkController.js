const favoriteParkModel = require('../models/favoriteParkModel');

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    data: null,
  });
};

const getFavoriteParks = async (req, res) => {
  try {
    const favorites = await favoriteParkModel.getFavoriteParks(
      req.params.userId,
    );

    return res.status(200).json({
      success: true,
      message: 'Favorite parks retrieved successfully',
      data: favorites,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const addFavoritePark = async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required',
        data: null,
      });
    }

    const favorite = await favoriteParkModel.addFavoritePark(
      req.body.user_id,
      req.params.parkId,
    );

    return res.status(201).json({
      success: true,
      message: 'Park added to favorites successfully',
      data: favorite,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteFavoritePark = async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required',
        data: null,
      });
    }

    const deleted = await favoriteParkModel.deleteFavoritePark(
      req.body.user_id,
      req.params.parkId,
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorite park not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Park removed from favorites successfully',
      data: null,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getFavoriteParks,
  addFavoritePark,
  deleteFavoritePark,
};
