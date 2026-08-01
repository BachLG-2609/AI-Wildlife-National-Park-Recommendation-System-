import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, toPublicUser } from "../models/userModel.js";

// 1. Cập nhật hàm signToken để đính kèm cả role vào payload
function signToken(userId, role) {
  return jwt.sign(
    { id: userId, role: role }, // 👈 Lưu role vào Token
    process.env.JWT_SECRET || "wildsense_dev_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body; // 👈 Nhận thêm trường role (optional)

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are all required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Truyền role vào create, userModel đã xử lý mặc định là "user" nếu role bị undefined
    const user = await User.create({ name, email, passwordHash, role });
    
    // Tạo token kèm theo role của user mới
    const token = signToken(user.id, user.role);

    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Truyền user.role vào hàm signToken khi Đăng nhập
    const token = signToken(user.id, user.role);
    
    // toPublicUser(user) sẽ tự động trả về thông tin user bao gồm cả trường 'role' cho Frontend
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}