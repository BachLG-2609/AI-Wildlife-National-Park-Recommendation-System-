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

const getParkClimate = async (req, res) => {
  try {
    const climate = await parkModel.getParkClimate(req.params.parkId);

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
    const climate = await parkModel.createParkClimate(
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

    const climate = await parkModel.updateParkClimate(
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

    const deleted = await parkModel.deleteParkClimate(
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

const getAllSafariTypes = async (req, res) => {
  try {
    const safariTypes = await parkModel.getAllSafariTypes();

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
    const safaris = await parkModel.getParkSafaris(req.params.parkId);

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

    const safari = await parkModel.createParkSafari(
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
    const deleted = await parkModel.deleteParkSafari(
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

const getFavoriteParks = async (req, res) => {
  try {
    const favorites = await parkModel.getFavoriteParks(req.params.userId);

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

    const favorite = await parkModel.addFavoritePark(
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

    const deleted = await parkModel.deleteFavoritePark(
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
  getAllParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
  getParkClimate,
  createParkClimate,
  updateParkClimate,
  deleteParkClimate,
  getAllSafariTypes,
  getParkSafaris,
  createParkSafari,
  deleteParkSafari,
  getFavoriteParks,
  addFavoritePark,
  deleteFavoritePark,
};
