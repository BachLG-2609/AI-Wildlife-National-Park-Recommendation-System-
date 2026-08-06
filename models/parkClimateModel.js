const { randomUUID } = require('crypto');
const pool = require('../config/db');

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

module.exports = {
  getParkClimate,
  createParkClimate,
  updateParkClimate,
  deleteParkClimate,
};
