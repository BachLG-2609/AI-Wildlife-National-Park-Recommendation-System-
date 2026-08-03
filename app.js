const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');

const parkRoutes = require('./routes/parkRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/parks', parkRoutes);

// Mock Auth Middleware
// Once Part I (Auth & User Module) is complete, replace this with the real authMiddleware.
// This middleware ensures req.user is populated, simulating JWT validation.
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Use the token string directly as the user ID for testing
    req.user = { id: token, roleId: 2 };
  } else if (req.headers['x-user-id']) {
    req.user = { id: req.headers['x-user-id'], roleId: 2 };
  } else {
    // Default fallback mock user ID (ensure this UUID exists in your users table)
    req.user = { id: 'test-user-uuid', roleId: 2 };
  }
  next();
});

// Routes
app.use('/api/chat', chatRoutes);

// Base route for sanity checks
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to WildSense AI Portal - Part IV Chatbot API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found.'
  });
});

module.exports = app;
