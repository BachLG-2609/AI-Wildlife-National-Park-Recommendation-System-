const { randomUUID } = require('crypto');
const pool = require('../config/db');

const getAllSafariTypes = async () => {
  const [rows] = await pool.execute(
    'SELECT id, safari_name, description, created_at FROM safari_types ORDER BY safari_name ASC',
  );

  return rows;
};

const getParkSafariById = async (parkId, safariId) => {
  const [rows] = await pool.execute(
    `SELECT ps.id AS park_safari_id, ps.park_id, ps.safari_id,
      st.safari_name, st.description AS safari_description,
      ps.price, ps.duration_hours, ps.availability, ps.created_at
     FROM park_safari ps
     INNER JOIN safari_types st ON st.id = ps.safari_id
     WHERE ps.park_id = ? AND ps.safari_id = ?
     LIMIT 1`,
    [parkId, safariId],
  );

  return rows[0] || null;
};

const getParkSafaris = async (parkId) => {
  const [rows] = await pool.execute(
    `SELECT ps.id AS park_safari_id, ps.park_id, ps.safari_id,
      st.safari_name, st.description AS safari_description,
      ps.price, ps.duration_hours, ps.availability, ps.created_at
     FROM park_safari ps
     INNER JOIN safari_types st ON st.id = ps.safari_id
     WHERE ps.park_id = ?
     ORDER BY st.safari_name ASC`,
    [parkId],
  );

  return rows;
};

const createParkSafari = async (parkId, safariData) => {
  const id = randomUUID();

  await pool.execute(
    `INSERT INTO park_safari
      (id, park_id, safari_id, price, duration_hours, availability)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      parkId,
      safariData.safari_id,
      safariData.price ?? null,
      safariData.duration_hours ?? null,
      safariData.availability ?? 'Available',
    ],
  );

  return getParkSafariById(parkId, safariData.safari_id);
};

const deleteParkSafari = async (parkId, safariId) => {
  const [result] = await pool.execute(
    'DELETE FROM park_safari WHERE park_id = ? AND safari_id = ?',
    [parkId, safariId],
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllSafariTypes,
  getParkSafaris,
  createParkSafari,
  deleteParkSafari,
};
