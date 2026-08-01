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

// Các hàm thao tác với Database
const db = {
  // Lấy toàn bộ danh sách users (Hỗ trợ cho Admin xem danh sách)
  getAllUsers: () => {
    return getAllUsers();
  },

  // Tìm user theo Email
  findUserByEmail: (email) => {
    const users = getAllUsers();
    return users.find((user) => user.email === email.toLowerCase());
  },

  // Tìm user theo ID
  findUserById: (id) => {
    const users = getAllUsers();
    return users.find((user) => user.id === id);
  },

  // Tạo user mới (Đã bổ sung trường role)
  createUser: (userData) => {
    const users = getAllUsers();
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password, // Đã được mã hóa bcrypt từ controller
      role: userData.role === 'admin' ? 'admin' : 'user', // 👈 BỔ SUNG: Mặc định là 'user', có thể truyền 'admin' nếu cần
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
  },

  // 👈 BỔ SUNG: Cập nhật thông tin tổng quát hoặc đổi role của user (dành cho Admin)
  updateUser: (userId, updates) => {
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updates
      };
      saveUsers(users);
      return users[userIndex];
    }
    return null;
  },

  // 👈 BỔ SUNG: Xóa user theo ID (dành cho Admin)
  deleteUser: (userId) => {
    const users = getAllUsers();
    const filteredUsers = users.filter((u) => u.id !== userId);
    if (filteredUsers.length === users.length) {
      return false; // Không tìm thấy user để xóa
    }
    saveUsers(filteredUsers);
    return true;
  }
};

module.exports = db;