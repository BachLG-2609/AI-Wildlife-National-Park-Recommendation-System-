import express from "express";

import {
  getAllAnimals,
  getAnimalById,
  searchAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animalController.js";

const router = express.Router();

// ==========================
// GET APIs
// ==========================

// Get all animals
router.get("/", getAllAnimals);

// Search animals by common name
// Example:
// GET /api/animals/search?keyword=tiger
router.get("/name/:name", getAnimalByName);

// Get animal by ID
// Example:
// GET /api/animals/8f43d1a8-xxxx-xxxx
router.get("/id/:id", getAnimalById);

// ==========================
// POST APIs
// ==========================

// Create new animal
router.post("/", createAnimal);

// ==========================
// PUT APIs
// ==========================

// Update animal
router.put("/:id", updateAnimal);

// ==========================
// DELETE APIs
// ==========================

// Delete animal
router.delete("/:id", deleteAnimal);

export default router;
