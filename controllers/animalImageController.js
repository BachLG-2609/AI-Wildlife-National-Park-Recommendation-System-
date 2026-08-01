import animalImageModel from "../models/animalImageModel.js";

// =====================================
// Get all images of an animal
// =====================================
export const getImagesByAnimalId = (req, res) => {
  const { animalId } = req.params;

  animalImageModel.getImagesByAnimalId(animalId, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to get animal images.",
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
// Create new animal image
// =====================================
export const createAnimalImage = (req, res) => {
  const data = req.body;

  animalImageModel.createAnimalImage(data, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to create animal image.",
      });
    }

    res.status(201).json({
      success: true,

      message: "Animal image created successfully.",

      data: result,
    });
  });
};

// =====================================
// Delete animal image
// =====================================
export const deleteAnimalImage = (req, res) => {
  const { id } = req.params;

  animalImageModel.deleteAnimalImage(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to delete animal image.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Animal image deleted successfully.",

      data: result,
    });
  });
};
