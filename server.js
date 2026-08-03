import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. IMPORT CÁC MODEL KẾT NỐI DATABASE
import "./config/db.js";

// Models Động vật & Công viên
import {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalByName,
} from "./models/animalModel.js";

import {
  getAnimalsByPark,
  addAnimalToPark,
  updateParkAnimal,
  deleteParkAnimal,
} from "./models/parkAnimalModel.js";

import {
  getImagesByAnimalId,
  createAnimalImage,
  deleteAnimalImage,
} from "./models/animalImageModel.js";

// Models AI & Nhận diện
import {
  getRecognitionsByUser,
  createRecognition,
  updateRecognition,
} from "./models/animalRecognitionModel.js";

import {
  getResultsByRecognition,
  createRecognitionResult,
  deleteRecognitionResult,
} from "./models/recognitionResultModel.js";

// Models User (Nên tạo file userModel.js tương tự các model trên nếu dùng DB thực)
import {
  findUserByEmail,
  createUser,
  updateUserPreferences,
} from "./models/userModel.js"; // Giả định import từ userModel

// ==========================================
// KHỞI TẠO APP & MIDDLEWARES
// ==========================================
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "wildsense_secret_key_2026";

app.use(cors());
app.use(express.json());

// Middleware xác thực JWT dùng chung
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Chưa xác thực đăng nhập!" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    req.user = decoded;
    next();
  });
};

// Endpoint kiểm tra trang chủ
app.get("/", (req, res) => {
  res.json({ message: "WildSense AI Portal Backend is running successfully" });
});

// ==========================================
// 1. AUTHENTICATION & USER API
// ==========================================

// Đăng ký
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    findUserByEmail(email, async (err, existingUser) => {
      if (err) return next(err);
      if (existingUser) return res.status(400).json({ message: "Email này đã được đăng ký!" });

      const hashedPassword = await bcrypt.hash(password, 10);
      createUser({ name, email, password: hashedPassword }, (err, newUser) => {
        if (err) return next(err);

        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
          message: "Đăng ký tài khoản thành công!",
          token,
          user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
      });
    });
  } catch (err) {
    next(err);
  }
});

// Đăng nhập
app.post("/api/auth/login", (req, res, next) => {
  const { email, password } = req.body;
  findUserByEmail(email, async (err, user) => {
    if (err || !user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: { id: user.id, name: user.name, email: user.email, preferences: user.preferences },
    });
  });
});

// Cập nhật Sở thích người dùng (Preferences)
app.post("/api/users/preferences", authenticateToken, (req, res, next) => {
  updateUserPreferences(req.user.userId, req.body, (err, updatedUser) => {
    if (err) return next(err);
    res.json({ message: "Lưu sở thích thành công!", user: updatedUser });
  });
});

// ==========================================
// 2. ANIMAL & PARK API
// ==========================================

// GET ALL ANIMALS
app.get("/api/animals", (req, res, next) => {
  getAllAnimals((error, result) => {
    if (error) return next(error);
    res.json(result);
  });
});

// GET ANIMAL BY ID
app.get("/api/animals/:id", (req, res, next) => {
  getAnimalById(req.params.id, (error, result) => {
    if (error) return next(error);
    if (!result || result.length === 0) return res.status(404).json({ message: "Animal not found" });
    res.json(result[0]);
  });
});

// SEARCH ANIMAL BY NAME
app.get("/api/animals/search/:name", (req, res, next) => {
  getAnimalByName(req.params.name, (error, result) => {
    if (error) return next(error);
    res.json(result);
  });
});

// CREATE ANIMAL
app.post("/api/animals", authenticateToken, (req, res, next) => {
  createAnimal(req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Animal created successfully", animal_id: result.insertId });
  });
});

// UPDATE ANIMAL
app.put("/api/animals/:id", authenticateToken, (req, res, next) => {
  updateAnimal(req.params.id, req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Animal not found" });
    res.json({ message: "Animal updated successfully" });
  });
});

// DELETE ANIMAL
app.delete("/api/animals/:id", authenticateToken, (req, res, next) => {
  deleteAnimal(req.params.id, (error, result) => {
    if (error) return next(error);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Animal not found" });
    res.json({ message: "Animal deleted successfully" });
  });
});

// --- PARK ANIMALS ---
app.get("/api/park-animals/:parkId", (req, res, next) => {
  getAnimalsByPark(req.params.parkId, (error, result) => {
    if (error) return next(error);
    res.json(result);
  });
});

app.post("/api/park-animals", authenticateToken, (req, res, next) => {
  addAnimalToPark(req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Animal added to park successfully", park_animal_id: result.insertId });
  });
});

app.put("/api/park-animals/:id", authenticateToken, (req, res, next) => {
  updateParkAnimal(req.params.id, req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Park animal not found" });
    res.json({ message: "Park animal updated successfully" });
  });
});

app.delete("/api/park-animals/:id", authenticateToken, (req, res, next) => {
  deleteParkAnimal(req.params.id, (error, result) => {
    if (error) return next(error);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Park animal not found" });
    res.json({ message: "Park animal deleted successfully" });
  });
});

// --- ANIMAL IMAGES ---
app.get("/api/animal-images/:animalId", (req, res, next) => {
  getImagesByAnimalId(req.params.animalId, (error, result) => {
    if (error) return next(error);
    res.json(result);
  });
});

app.post("/api/animal-images", authenticateToken, (req, res, next) => {
  createAnimalImage(req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Animal image created successfully", image_id: result.insertId });
  });
});

app.delete("/api/animal-images/:id", authenticateToken, (req, res, next) => {
  deleteAnimalImage(req.params.id, (error, result) => {
    if (error) return next(error);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Animal image not found" });
    res.json({ message: "Animal image deleted successfully" });
  });
});

// ==========================================
// 3. AI RECOGNITION API (LỊCH SỬ & KẾT QUẢ AI)
// ==========================================

app.get("/api/animal-recognitions/user/:userId", authenticateToken, (req, res, next) => {
  getRecognitionsByUser(req.params.userId, (error, result) => {
    if (error) return next(error);
    res.json(result);
  });
});

app.post("/api/animal-recognitions", authenticateToken, (req, res, next) => {
  createRecognition(req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Recognition created successfully", insertId: result.insertId });
  });
});

app.put("/api/animal-recognitions/:id", authenticateToken, (req, res, next) => {
  updateRecognition(req.params.id, req.body, (error, result) => {
    if (error) return res.status(400).json({ message: error.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Recognition not found" });
    res.json({ message: "Recognition updated successfully" });
  });
});

app.get("/api/recognition-results/:recognitionId", (req, res, next) => {
  getResultsByRecognition(req.params.recognitionId, (error, result) => {
    if (error) return next(error);
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
