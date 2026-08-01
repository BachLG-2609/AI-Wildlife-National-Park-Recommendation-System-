const fs = require('fs');
const path = require('path');

// Đường dẫn tới file chứa dữ liệu người dùng
const DATA_DIR = __dirname;
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Khởi tạo file data nếu chưa tồn tại
const initDatabase = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

// Đọc danh sách users từ file
const getAllUsers = () => {
  initDatabase();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Lỗi đọc file dữ liệu:', error);
    return [];
  }
};

// Lưu danh sách users vào file
const saveUsers = (users) => {
  initDatabase();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Lỗi ghi file dữ liệu:', error);
  }
};

// các hàm thao tác với Database
const db = {
  // Tìm user theo Email
  findUserByEmail: (email) => {
    const users = getAllUsers();
    return users.find((user) => user.email === email);
  },

  // Tìm user theo ID
  findUserById: (id) => {
    const users = getAllUsers();
    return users.find((user) => user.id === id);
  },

  // Tạo user mới
  createUser: (userData) => {
    const users = getAllUsers();
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // Đã được mã hóa bcrypt từ controller
      preferences: null,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  // Cập nhật khảo sát sở thích (Preferences) cho user
  updateUserPreferences: (userId, preferences) => {
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].preferences = preferences;
      saveUsers(users);
      return users[userIndex];
    }
    return null;
  }
};

module.exports = db;