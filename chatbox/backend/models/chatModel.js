const pool = require('../config/db');

const chatModel = {
  // Create a new chat session for a user
  async createSession({ userId, title }) {
    // Generate UUID if not automatically done by DB, but since the schema has DEFAULT(UUID())
    // we can either let DB do it, or pass it. Let's let the DB generate it.
    // However, to return it, we can query it, or generate UUID in Node.
    // For convenience and reliability, let's use the DB's UUID generation by using UUID() in the insert
    // or generating one. Since we don't have uuid npm package installed, we can query the database
    // to get the generated session. Or we can select UUID() first.
    // Let's generate a UUID in Node or let the database return it.
    // A clean way is:
    const [uuidResult] = await pool.query('SELECT UUID() as uuid');
    const sessionId = uuidResult[0].uuid;

    await pool.query(
      `INSERT INTO chat_sessions (session_id, user_id, session_title)
       VALUES (:sessionId, :userId, :title)`,
      { sessionId, userId, title }
    );

    return this.getSessionById(sessionId);
  },

  // Get session details by ID
  async getSessionById(sessionId) {
    const [rows] = await pool.query(
      `SELECT * FROM chat_sessions WHERE session_id = :sessionId`,
      { sessionId }
    );
    return rows[0] || null;
  },

  // Get all chat sessions for a specific user
  async getSessionsByUser(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM chat_sessions WHERE user_id = :userId ORDER BY created_at DESC`,
      { userId }
    );
    return rows;
  },

  // Insert a message into chat_messages
  async createMessage({ sessionId, sender, messageContent }) {
    const [uuidResult] = await pool.query('SELECT UUID() as uuid');
    const messageId = uuidResult[0].uuid;

    await pool.query(
      `INSERT INTO chat_messages (message_id, session_id, sender, message_content)
       VALUES (:messageId, :sessionId, :sender, :messageContent)`,
      { messageId, sessionId, sender, messageContent }
    );

    const [rows] = await pool.query(
      `SELECT * FROM chat_messages WHERE message_id = :messageId`,
      { messageId }
    );
    return rows[0];
  },

  // Get all messages for a session (in order of sending)
  async getMessagesBySession(sessionId) {
    const [rows] = await pool.query(
      `SELECT * FROM chat_messages WHERE session_id = :sessionId ORDER BY sent_at ASC`,
      { sessionId }
    );
    return rows;
  },

  // Delete a session (will cascade delete messages due to FOREIGN KEY constraint ON DELETE CASCADE)
  async deleteSession(sessionId) {
    const [result] = await pool.query(
      `DELETE FROM chat_sessions WHERE session_id = :sessionId`,
      { sessionId }
    );
    return result.affectedRows > 0;
  }
};

module.exports = chatModel;
