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

module.exports = {
  getAllParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
};
