import recognitionResultModel from "../models/recognitionResultModel.js";

// =====================================
// Get AI results by recognition ID
// =====================================
export const getResultsByRecognition = (req, res) => {
  const { recognitionId } = req.params;

  recognitionResultModel.getResultsByRecognition(
    recognitionId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,

          message: "Failed to get recognition results.",
        });
      }

      res.status(200).json({
        success: true,

        count: results.length,

        data: results,
      });
    },
  );
};

// =====================================
// Create AI recognition result
// =====================================
export const createRecognitionResult = (req, res) => {
  const data = req.body;

  recognitionResultModel.createRecognitionResult(data, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to create recognition result.",
      });
    }

    res.status(201).json({
      success: true,

      message: "Recognition result created successfully.",

      data: result,
    });
  });
};

// =====================================
// Delete recognition result
// =====================================
export const deleteRecognitionResult = (req, res) => {
  const { id } = req.params;

  recognitionResultModel.deleteRecognitionResult(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,

        message: "Failed to delete recognition result.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Recognition result deleted successfully.",

      data: result,
    });
  });
};
