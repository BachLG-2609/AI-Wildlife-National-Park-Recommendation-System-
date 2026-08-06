const { randomUUID } = require('crypto');
const pool = require('../config/db');

const getFavoriteParks = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT fp.id AS favorite_id, fp.user_id, fp.park_id,
      fp.created_at AS favorited_at,
      p.park_name, p.country, p.province, p.latitude, p.longitude,
      p.description, p.entrance_fee, p.opening_time, p.closing_time,
      p.website, p.image_url, p.created_at, p.updated_at
     FROM favorite_parks fp
     INNER JOIN national_parks p ON p.id = fp.park_id
     WHERE fp.user_id = ?
     ORDER BY fp.created_at DESC`,
    [userId],
  );

  return rows;
};

const getFavoritePark = async (userId, parkId) => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, park_id, created_at
     FROM favorite_parks
     WHERE user_id = ? AND park_id = ?
     LIMIT 1`,
    [userId, parkId],
  );

  return rows[0] || null;
};

const addFavoritePark = async (userId, parkId) => {
  const id = randomUUID();

  await pool.execute(
    'INSERT INTO favorite_parks (id, user_id, park_id) VALUES (?, ?, ?)',
    [id, userId, parkId],
  );

  return getFavoritePark(userId, parkId);
};

const deleteFavoritePark = async (userId, parkId) => {
  const [result] = await pool.execute(
    'DELETE FROM favorite_parks WHERE user_id = ? AND park_id = ?',
    [userId, parkId],
  );

  return result.affectedRows > 0;
};

module.exports = {
  getFavoriteParks,
  addFavoritePark,
  deleteFavoritePark,
};
