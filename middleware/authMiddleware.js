import jwt from "jsonwebtoken";

// Middleware 1: Kiểm tra xem user đã đăng nhập (có Token hợp lệ) chưa
export function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "wildsense_dev_secret_change_me"
    );

    // Lưu thông tin decoded vào req để các middleware/controller phía sau dùng
    req.userId = decoded.id;
    req.user = decoded; // 👈 Bổ sung: Lưu nguyên decoded object (gồm id và role)
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
}

// Middleware 2: Kiểm tra xem user có phải là ADMIN hay không (Dùng sau hàm protect)
export function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next(); // Là Admin -> Cho qua
  } else {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
}