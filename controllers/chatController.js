const chatModel = require('../models/chatModel');
const { model } = require('../config/gemini');

const chatController = {
  // Create a new chat session
  async startSession(req, res) {
    try {
      // Once Part I (Auth) is integrated, req.user will be populated by authMiddleware.
      // For now, we fallback to a request body userId or a placeholder if testing.
      const userId = req.user?.id || req.body.userId;
      const title = req.body.title || 'New Wildlife Chat Session';

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required. Please login or provide userId in request body.'
        });
      }

      const session = await chatModel.createSession(userId, title);
      return res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Error in startSession:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while starting session.',
        error: error.message
      });
    }
  },

  // Get all chat sessions for the logged-in user
  async getUserSessions(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required. Please login or provide userId in query parameters.'
        });
      }

      const sessions = await chatModel.getUserSessions(userId);
      return res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Error in getUserSessions:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching sessions.',
        error: error.message
      });
    }
  },

  // Get message history for a specific session
  async getSessionMessages(req, res) {
    try {
      const { sessionId } = req.params;

      // Validate session exists
      const session = await chatModel.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found.'
        });
      }

      const messages = await chatModel.getSessionMessages(sessionId);
      return res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error in getSessionMessages:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving message history.',
        error: error.message
      });
    }
  },

  // Send a message and get Gemini AI's response
  async sendMessage(req, res) {
    try {
      const { sessionId, messageContent } = req.body;

      if (!sessionId || !messageContent) {
        return res.status(400).json({
          success: false,
          message: 'Missing sessionId or messageContent in request body.'
        });
      }

      // 1. Verify session exists
      const session = await chatModel.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Chat session not found.'
        });
      }

      // 2. Fetch existing history from DB BEFORE inserting new user message
      // (This prevents the model from seeing the current user query twice if we pass it manually)
      const previousMessages = await chatModel.getSessionMessages(sessionId);

      // 3. Save the new user message to the DB
      const userMessage = await chatModel.addMessage(
        sessionId,
        'user',
        messageContent
      );

      // 4. Map DB messages to Gemini API history format
      // Gemini expects: { role: 'user'|'model', parts: [{ text: string }] }
      const geminiHistory = previousMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message_content }]
      }));

      let aiReplyText = '';

      try {
        // 5. Start a chat with history and send the new message
        const chat = model.startChat({
          history: geminiHistory
        });

        const result = await chat.sendMessage(messageContent);
        aiReplyText = result.response.text();
      } catch (geminiError) {
        console.error('Gemini API call failed:', geminiError);
        aiReplyText = 'Sorry, I am currently unable to contact my AI knowledge base. Please check your Gemini API key configuration.';
      }

      // 6. Save the AI response to the DB
      const assistantMessage = await chatModel.addMessage(
        sessionId,
        'assistant',
        aiReplyText
      );

      return res.status(200).json({
        success: true,
        data: {
          userMessage,
          assistantMessage
        }
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while processing message.',
        error: error.message
      });
    }
  },

  // Delete a chat session
  async deleteSession(req, res) {
    try {
      const { sessionId } = req.params;

      const deleted = await chatModel.deleteSession(sessionId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Session not found or already deleted.'
        });
      }

      return res.json({
        success: true,
        message: 'Chat session and its messages deleted successfully.'
      });
    } catch (error) {
      console.error('Error in deleteSession:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while deleting session.',
        error: error.message
      });
    }
  }
};

module.exports = chatController;
