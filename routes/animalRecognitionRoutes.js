import express from "express";

import {
  getRecognitionsByUser,
  createRecognition,
  updateRecognition,
} from "../controllers/animalRecognitionController.js";

const router = express.Router();

// =====================================
// GET
// =====================================

// Get recognition history of user
//
// Example:
// GET /api/recognitions/user/12345

router.get("/user/:userId", getRecognitionsByUser);

// =====================================
// POST
// =====================================

// Create new animal recognition
//
// Example:
// POST /api/recognitions

router.post("/", createRecognition);

// =====================================
// PUT
// =====================================

// Update recognition result after AI prediction
//
// Example:
// PUT /api/recognitions/12345

router.put("/:id", updateRecognition);

export default router;
