import express from "express";

import {
  getAnimalsByPark,
  addAnimalToPark,
  updateParkAnimal,
  deleteParkAnimal,
} from "../controllers/parkAnimalController.js";

const router = express.Router();

// =====================================
// GET
// =====================================

// Get all animals inside a park
// Example:
// GET /api/park-animals/park/12345

router.get("/park/:parkId", getAnimalsByPark);

// =====================================
// POST
// =====================================

// Add animal into park

// Example:
// POST /api/park-animals

router.post("/", addAnimalToPark);

// =====================================
// PUT
// =====================================

// Update animal information in park

// Example:
// PUT /api/park-animals/12345

router.put("/:id", updateParkAnimal);

// =====================================
// DELETE
// =====================================

// Remove animal from park

// Example:
// DELETE /api/park-animals/12345

router.delete("/:id", deleteParkAnimal);

export default router;
