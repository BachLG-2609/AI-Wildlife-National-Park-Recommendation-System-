const { randomUUID } = require('crypto');
const pool = require('../config/db');

const PARK_COLUMNS = [
  'id',
  'park_name',
  'country',
  'province',
  'latitude',
  'longitude',
  'description',
  'entrance_fee',
  'opening_time',
  'closing_time',
  'website',
  'image_url',
  'created_at',
  'updated_at',
].join(', ');

const WRITABLE_COLUMNS = [
  'park_name',
  'country',
  'province',
  'latitude',
  'longitude',
  'description',
  'entrance_fee',
  'opening_time',
  'closing_time',
  'website',
  'image_url',
];

const getAllParks = async () => {
  const [rows] = await pool.execute(
    `SELECT ${PARK_COLUMNS} FROM national_parks ORDER BY created_at DESC`,
  );

  return rows;
};

const getParkById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT ${PARK_COLUMNS} FROM national_parks WHERE id = ? LIMIT 1`,
    [id],
  );

  return rows[0] || null;
};

const createPark = async (parkData) => {
  const id = randomUUID();
  const values = WRITABLE_COLUMNS.map((column) => parkData[column] ?? null);
  const placeholders = WRITABLE_COLUMNS.map(() => '?').join(', ');

  await pool.execute(
    `INSERT INTO national_parks (id, ${WRITABLE_COLUMNS.join(', ')}) VALUES (?, ${placeholders})`,
    [id, ...values],
  );

  return getParkById(id);
};

const updatePark = async (id, parkData) => {
  const columnsToUpdate = WRITABLE_COLUMNS.filter((column) =>
    Object.prototype.hasOwnProperty.call(parkData, column),
  );

  if (columnsToUpdate.length === 0) {
    const error = new Error('No valid park fields were provided');
    error.statusCode = 400;
    throw error;
  }

  const setClause = columnsToUpdate.map((column) => `${column} = ?`).join(', ');
  const values = columnsToUpdate.map((column) => parkData[column]);
  const [result] = await pool.execute(
    `UPDATE national_parks SET ${setClause} WHERE id = ?`,
    [...values, id],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getParkById(id);
};

const deletePark = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM national_parks WHERE id = ?',
    [id],
  );

  return result.affectedRows > 0;
};

const CLIMATE_COLUMNS = [
  'id',
  'park_id',
  'season',
  'climate_type',
  'average_temperature',
  'rainfall_mm',
  'best_visit',
  'created_at',
].join(', ');

const CLIMATE_WRITABLE_COLUMNS = [
  'season',
  'climate_type',
  'average_temperature',
  'rainfall_mm',
  'best_visit',
];

const getClimateById = async (parkId, climateId) => {
  const [rows] = await pool.execute(
    `SELECT ${CLIMATE_COLUMNS} FROM park_climate WHERE id = ? AND park_id = ? LIMIT 1`,
    [climateId, parkId],
  );

  return rows[0] || null;
};

const getParkClimate = async (parkId) => {
  const [rows] = await pool.execute(
    `SELECT ${CLIMATE_COLUMNS} FROM park_climate WHERE park_id = ? ORDER BY created_at DESC`,
    [parkId],
  );

  return rows;
};

const createParkClimate = async (parkId, climateData) => {
  const id = randomUUID();
  const values = CLIMATE_WRITABLE_COLUMNS.map((column) => {
    if (column === 'best_visit') {
      return climateData[column] ?? false;
    }

    return climateData[column] ?? null;
  });
  const placeholders = CLIMATE_WRITABLE_COLUMNS.map(() => '?').join(', ');

  await pool.execute(
    `INSERT INTO park_climate (id, park_id, ${CLIMATE_WRITABLE_COLUMNS.join(', ')}) VALUES (?, ?, ${placeholders})`,
    [id, parkId, ...values],
  );

  return getClimateById(parkId, id);
};

const updateParkClimate = async (parkId, climateId, climateData) => {
  const columnsToUpdate = CLIMATE_WRITABLE_COLUMNS.filter((column) =>
    Object.prototype.hasOwnProperty.call(climateData, column),
  );

  if (columnsToUpdate.length === 0) {
    const error = new Error('No valid climate fields were provided');
    error.statusCode = 400;
    throw error;
  }

  const setClause = columnsToUpdate.map((column) => `${column} = ?`).join(', ');
  const values = columnsToUpdate.map((column) => climateData[column]);
  const [result] = await pool.execute(
    `UPDATE park_climate SET ${setClause} WHERE id = ? AND park_id = ?`,
    [...values, climateId, parkId],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getClimateById(parkId, climateId);
};

const deleteParkClimate = async (parkId, climateId) => {
  const [result] = await pool.execute(
    'DELETE FROM park_climate WHERE id = ? AND park_id = ?',
    [climateId, parkId],
  );

  return result.affectedRows > 0;
};

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
  getAllParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
  getParkClimate,
  createParkClimate,
  updateParkClimate,
  deleteParkClimate,
  getAllSafariTypes,
  getParkSafaris,
  createParkSafari,
  deleteParkSafari,
  getFavoriteParks,
  addFavoritePark,
  deleteFavoritePark,
};
