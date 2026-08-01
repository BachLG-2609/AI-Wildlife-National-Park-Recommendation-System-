import parkAnimalModel from "../models/parkAnimalModel.js";

// =====================================
// Get animals by park ID
// =====================================
export const getAnimalsByPark = (req, res) => {
  const { parkId } = req.params;

  parkAnimalModel.getAnimalsByPark(parkId, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to get animals in park.",
      });
    }

    res.status(200).json({
      success: true,

      count: results.length,

      data: results,
    });
  });
};

// =====================================
// Add animal to park
// =====================================
export const addAnimalToPark = (req, res) => {
  const data = req.body;

  parkAnimalModel.addAnimalToPark(data, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to add animal to park.",
      });
    }

    res.status(201).json({
      success: true,

      message: "Animal added to park successfully.",

      data: result,
    });
  });
};

// =====================================
// Update animal information in park
// =====================================
export const updateParkAnimal = (req, res) => {
  const { id } = req.params;

  const data = req.body;

  parkAnimalModel.updateParkAnimal(id, data, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to update park animal.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Park animal updated successfully.",

      data: result,
    });
  });
};

// =====================================
// Delete animal from park
// =====================================
export const deleteParkAnimal = (req, res) => {
  const { id } = req.params;

  parkAnimalModel.deleteParkAnimal(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to delete park animal.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Animal removed from park successfully.",

      data: result,
    });
  });
};
