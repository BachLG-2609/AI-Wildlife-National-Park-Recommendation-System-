import animalModel from "../models/animalModel.js";

// ================================
// get all animals
// ================================
export const getAllAnimals = (req, res) => {
  animalModel.getAllAnimals((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve animals.",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

// ================================
// get animai by ID
// ================================
export const getAnimalById = (req, res) => {
  const { id } = req.params;

  animalModel.getAnimalById(id, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Animal not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

// ================================
// add new animal
// ================================
export const createAnimal = (req, res) => {
  const animalData = req.body;

  animalModel.createAnimal(animalData, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Unable to create animal.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Animal created successfully.",
      data: result,
    });
  });
};

// ================================
// update new information of animal
// ================================
export const updateAnimal = (req, res) => {
  const { id } = req.params;

  const animalData = req.body;

  animalModel.updateAnimal(id, animalData, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to update animal.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Animal updated successfully.",
    });
  });
};

// ================================
// delete animal
// ================================
export const deleteAnimal = (req, res) => {
  const { id } = req.params;

  animalModel.deleteAnimal(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete animal.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Animal deleted successfully.",
    });
  });
};

// ================================
// search animal by name
// ================================
export const getAnimalByName = (req, res) => {
  const { name } = req.params;

  animalModel.getAnimalByName(name, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Search failed.",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No animals found.",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};
