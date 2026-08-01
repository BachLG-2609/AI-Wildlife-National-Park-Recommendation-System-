import db from "../config/db.js";

// Lấy toàn bộ kết quả AI của một lần nhận diện
const getResultsByRecognition = (recognitionId, callback) => {
  const sql = `
        SELECT
            rr.*,
            a.common_name,
            a.scientific_name
        FROM recognition_results rr
        JOIN animals a
            ON rr.animal_id = a.id
        WHERE recognition_id = ?
        ORDER BY prediction_rank ASC
    `;

  db.query(sql, [recognitionId], callback);
};

// Thêm kết quả AI
const createRecognitionResult = (data, callback) => {
  const sql = `
        INSERT INTO recognition_results(
            recognition_id,
            animal_id,
            confidence_score,
            prediction_rank
        )
        VALUES (?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      data.recognition_id,
      data.animal_id,
      data.confidence_score,
      data.prediction_rank,
    ],
    callback,
  );
};

// Xóa kết quả AI
const deleteRecognitionResult = (id, callback) => {
  const sql = `
        DELETE
        FROM recognition_results
        WHERE id = ?
    `;

  db.query(sql, [id], callback);
};

export {
  getResultsByRecognition,
  createRecognitionResult,
  deleteRecognitionResult,
};
