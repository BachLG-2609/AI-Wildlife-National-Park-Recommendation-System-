const pool = require('../config/db');
const crypto = require('crypto');

class ChatModel {
  // ==========================================
  // CHAT SESSIONS
  // ==========================================

  static async createSession(userId, sessionTitle = 'New Chat') {
    const sessionId = crypto.randomUUID();
    const query = `
      INSERT INTO chat_sessions (session_id, user_id, session_title) 
      VALUES (:sessionId, :userId, :sessionTitle)
    `;
    await pool.query(query, { sessionId, userId, sessionTitle });
    
    return this.getSessionById(sessionId);
  }

  static async getSessionById(sessionId) {
    const query = `SELECT * FROM chat_sessions WHERE session_id = :sessionId`;
    const [rows] = await pool.query(query, { sessionId });
    return rows.length ? rows[0] : null;
  }

  static async getUserSessions(userId) {
    const query = `
      SELECT * FROM chat_sessions 
      WHERE user_id = :userId 
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query, { userId });
    return rows;
  }

  static async updateSessionTitle(sessionId, newTitle) {
    const query = `
      UPDATE chat_sessions 
      SET session_title = :newTitle 
      WHERE session_id = :sessionId
    `;
    const [result] = await pool.query(query, { newTitle, sessionId });
    return result.affectedRows > 0;
  }

  static async deleteSession(sessionId) {
    const query = `DELETE FROM chat_sessions WHERE session_id = :sessionId`;
    const [result] = await pool.query(query, { sessionId });
    return result.affectedRows > 0;
  }

  // ==========================================
  // CHAT MESSAGES
  // ==========================================

  static async addMessage(sessionId, sender, messageContent) {
    const messageId = crypto.randomUUID();
    
    if (!['user', 'assistant'].includes(sender)) {
      throw new Error("Sender must be 'user' or 'assistant'");
    }

    const query = `
      INSERT INTO chat_messages (message_id, session_id, sender, message_content)
      VALUES (:messageId, :sessionId, :sender, :messageContent)
    `;
    
    await pool.query(query, { messageId, sessionId, sender, messageContent });
    
    const getQuery = `SELECT * FROM chat_messages WHERE message_id = :messageId`;
    const [rows] = await pool.query(getQuery, { messageId });
    return rows[0];
  }

  static async getSessionMessages(sessionId) {
    const query = `
      SELECT * FROM chat_messages 
      WHERE session_id = :sessionId 
      ORDER BY sent_at ASC
    `;
    const [rows] = await pool.query(query, { sessionId });
    return rows;
  }
}

module.exports = ChatModel;
