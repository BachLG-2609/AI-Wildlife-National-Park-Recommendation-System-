import express from "express";
import dotenv from "dotenv";

import "./config/db.js";

import {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalByName,
} from "./models/animalModel.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "WildSense API Server is running",
  });
});

// =======================
// ANIMAL API
// =======================

// GET ALL ANIMALS
app.get("/api/animals", (req, res) => {
  getAllAnimals((error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    res.json(result);
  });
});

// GET ANIMAL BY ID
app.get("/api/animals/:id", (req, res) => {
  const id = req.params.id;
  getAnimalById(id, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "Animal not found",
      });
    }
    res.json(result[0]);
  });
});

// SEARCH ANIMAL BY NAME
app.get("/api/animals/search/:name", (req, res) => {
  const name = req.params.name;
  getAnimalByName(name, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    res.json(result);
  });
});

// CREATE ANIMAL
app.post("/api/animals", (req, res) => {
  createAnimal(req.body, (error, result) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(201).json({
      message: "Animal created successfully",
      animal_id: result.insertId,
    });
  });
});

// UPDATE ANIMAL
app.put("/api/animals/:id", (req, res) => {
  const id = req.params.id;
  updateAnimal(id, req.body, (error, result) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Animal not found",
      });
    }
    res.json({
      message: "Animal updated successfully",
    });
  });
});

// DELETE ANIMAL
app.delete("/api/animals/:id", (req, res) => {
  const id = req.params.id;
  deleteAnimal(id, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Animal not found",
      });
    }
    res.json({
      message: "Animal deleted successfully",
    });
  });
});

// =======================
// PARK ANIMAL API
// =======================

import {
  getAnimalsByPark,
  addAnimalToPark,
  updateParkAnimal,
  deleteParkAnimal,
} from "./models/parkAnimalModel.js";

// GET ANIMALS BY PARK ID
app.get("/api/park-animals/:parkId", (req, res) => {
  const parkId = req.params.parkId;
  getAnimalsByPark(parkId, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    res.json(result);
  });
});

// ADD ANIMAL INTO PARK
app.post("/api/park-animals", (req, res) => {
  addAnimalToPark(req.body, (error, result) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(201).json({
      message: "Animal added to park successfully",
      park_animal_id: result.insertId,
    });
  });
});

// UPDATE PARK ANIMAL
app.put("/api/park-animals/:id", (req, res) => {
  const id = req.params.id;
  updateParkAnimal(id, req.body, (error, result) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Park animal not found",
      });
    }
    res.json({
      message: "Park animal updated successfully",
    });
  });
});

// DELETE PARK ANIMAL
app.delete("/api/park-animals/:id", (req, res) => {
  const id = req.params.id;
  deleteParkAnimal(id, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Park animal not found",
      });
    }
    res.json({
      message: "Park animal deleted successfully",
    });
  });
});

// =======================
// ANIMAL IMAGE API
// =======================

import {
  getImagesByAnimalId,
  createAnimalImage,
  deleteAnimalImage,
} from "./models/animalImageModel.js";

// GET ALL IMAGES OF AN ANIMAL
app.get("/api/animal-images/:animalId", (req, res) => {
  const animalId = req.params.animalId;
  getImagesByAnimalId(animalId, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    res.json(result);
  });
});

app.post("/api/recognition-results", authenticateToken, (req, res, next) => {
  createRecognitionResult(req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Recognition result created successfully" });
  });
});

app.delete("/api/recognition-results/:id", authenticateToken, (req, res, next) => {
  deleteRecognitionResult(req.params.id, (error, result) => {
    if (error) return next(error);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Recognition result not found" });
    res.json({ message: "Recognition result deleted successfully" });
  });
});

// ==========================================
// 4. GLOBAL ERROR HANDLER & SERVER START
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Error Logs:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 WildSense API Server is running on http://localhost:${PORT}`);
});