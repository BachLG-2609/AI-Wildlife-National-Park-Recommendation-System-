import express from "express";

import {
  getResultsByRecognition,
  createRecognitionResult,
  deleteRecognitionResult,
} from "../controllers/recognitionResultController.js";

const router = express.Router();

// =====================================
// GET
// =====================================

// Get all AI predictions of a recognition
//
// Example:
// GET /api/recognition-results/recognition/REC001

router.get("/recognition/:recognitionId", getResultsByRecognition);

// =====================================
// POST
// =====================================

// Add AI prediction result
//
// Example:
// POST /api/recognition-results

router.post("/", createRecognitionResult);

// =====================================
// DELETE
// =====================================

// Delete AI prediction result
//
// Example:
// DELETE /api/recognition-results/RESULT001

router.delete("/:id", deleteRecognitionResult);

export default router;
