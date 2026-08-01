const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Define Chatbot API endpoints
router.post('/session', chatController.startSession);        // Start new chat session
router.get('/sessions', chatController.getUserSessions);      // Get all user sessions
router.get('/session/:sessionId', chatController.getSessionMessages); // Get message history
router.post('/message', chatController.sendMessage);         // Send message & get AI response
router.delete('/session/:sessionId', chatController.deleteSession);   // Delete chat session

module.exports = router;
