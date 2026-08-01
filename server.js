import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ================= 1. CẤU HÌNH DATABASE TỰ ĐỘNG (LƯU TẠI data/users.json) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const initDatabase = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const getAllUsers = () => {
  initDatabase();
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  initDatabase();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
};

const db = {
  findUserByEmail: (email) => getAllUsers().find((user) => user.email === email),
  findUserById: (id) => getAllUsers().find((user) => user.id === id),
  createUser: (userData) => {
    const users = getAllUsers();
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      preferences: null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  },
  updateUserPreferences: (userId, preferences) => {
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].preferences = preferences;
      saveUsers(users);
      return users[userIndex];
    }
    return null;
  },
};

// ================= 2. KHỞI TẠO EXPRESS APP =================
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "wildsense_secret_key_2026";

app.use(cors());
app.use(express.json());

// Endpoint kiểm tra trang chủ
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "WildSense AI Portal backend" });
});

// ================= 3. API AUTHENTICATION (ĐĂNG KÍ & ĐĂNG NHẬP) =================

// API Đăng ký
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    if (db.findUserByEmail(email)) {
      return res.status(400).json({ message: "Email này đã được đăng ký!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.createUser({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, preferences: newUser.preferences },
    });
  } catch (err) {
    next(err);
  }
});

// API Đăng nhập
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: { id: user.id, name: user.name, email: user.email, preferences: user.preferences },
    });
  } catch (err) {
    next(err);
  }
});

// ================= 4. API USER (KHẢO SÁT PREFERENCES) =================

app.post("/api/users/preferences", (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Chưa xác thực đăng nhập!" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const updatedUser = db.updateUserPreferences(decoded.userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng!" });
    }

    res.json({
      message: "Lưu sở thích thành công!",
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, preferences: updatedUser.preferences },
    });
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
});

// ================= 5. MIDDLEWARE XỬ LÝ LỖI =================
app.use((err, req, res, next) => {
  console.error("❌ Unexpected Error:", err);
  res.status(500).json({ message: "Unexpected server error" });
});

// ================= 6. KHỞI CHẠY SERVER =================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 WildSense backend running on http://localhost:${PORT}`);
});