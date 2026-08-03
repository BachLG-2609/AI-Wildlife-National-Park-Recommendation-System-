import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ai_wildlife_national_park_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  port: process.env.DB_PORT,
});

// Connect database

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);

    return;
  }

  console.log("✅ MySQL connected successfully!");
});

export default db;
