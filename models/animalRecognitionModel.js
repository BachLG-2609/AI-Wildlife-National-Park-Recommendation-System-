import db from "../config/db.js";

// get recognize history of user
const getRecognitionsByUser = (userId, callback) => {
  const sql = `
        SELECT *
        FROM animal_recognitions
        WHERE user_id = ?
        ORDER BY recognition_time DESC
    `;

  db.query(sql, [userId], callback);
};

// create new recognition
const createRecognition = (data, callback) => {
  const sql = `
        INSERT INTO animal_recognitions (
            user_id,
            detected_animal_id,
            uploaded_image,
            confidence_score,
            recognition_status,
            ai_model,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      data.user_id,
      data.detected_animal_id,
      data.uploaded_image,
      data.confidence_score,
      data.recognition_status,
      data.ai_model,
      data.notes,
    ],
    callback,
  );
};

// update recognition by AI
const updateRecognition = (id, data, callback) => {
  const sql = `
        UPDATE animal_recognitions
        SET
            detected_animal_id = ?,
            confidence_score = ?,
            recognition_status = ?,
            notes = ?
        WHERE id = ?
    `;

  db.query(
    sql,
    [
      data.detected_animal_id,
      data.confidence_score,
      data.recognition_status,
      data.notes,
      id,
    ],
    callback,
  );
};

export { getRecognitionsByUser, createRecognition, updateRecognition };
