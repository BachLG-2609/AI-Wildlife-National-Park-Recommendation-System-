import express from "express";

import {
  getImagesByAnimalId,
  createAnimalImage,
  deleteAnimalImage,
} from "../controllers/animalImageController.js";

const router = express.Router();

// =====================================
// GET
// =====================================

// Get all images of an animal
//
// Example:
// GET /api/animal-images/animal/12345

router.get("/animal/:animalId", getImagesByAnimalId);

// =====================================
// POST
// =====================================

// Add new image for animal
//
// Example:
// POST /api/animal-images

router.post("/", createAnimalImage);

// =====================================
// DELETE
// =====================================

// Delete image
//
// Example:
// DELETE /api/animal-images/12345

router.delete("/:id", deleteAnimalImage);

export default router;
