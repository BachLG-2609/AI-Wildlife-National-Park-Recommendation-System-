import animalRecognitionModel from "../models/animalRecognitionModel.js";

// =====================================
// Get recognition history by user
// =====================================
export const getRecognitionsByUser = (req, res) => {
  const { userId } = req.params;

  animalRecognitionModel.getRecognitionsByUser(userId, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to get recognition history.",
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
// Create new recognition
// =====================================
export const createRecognition = (req, res) => {
  const data = req.body;

  animalRecognitionModel.createRecognition(data, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to create recognition.",
      });
    }

    res.status(201).json({
      success: true,

      message: "Recognition created successfully.",

      data: result,
    });
  });
};

// =====================================
// Update recognition result by AI
// =====================================
export const updateRecognition = (req, res) => {
  const { id } = req.params;

  const data = req.body;

  animalRecognitionModel.updateRecognition(id, data, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to update recognition.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Recognition updated successfully.",

      data: result,
    });
  });
};
