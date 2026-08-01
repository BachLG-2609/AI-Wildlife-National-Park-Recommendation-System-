const createNotImplementedError = () => {
  const error = new Error('Park database operations are not implemented yet');
  error.statusCode = 501;
  return error;
};

const getAllParks = async () => {
  // TODO: Add the SQL query to retrieve all parks when the database schema is finalized.
  throw createNotImplementedError();
};

const getParkById = async (id) => {
  // TODO: Add the SQL query to retrieve a park by id when the database schema is finalized.
  void id;
  throw createNotImplementedError();
};

const createPark = async (parkData) => {
  // TODO: Add the SQL query to create a park when the database schema is finalized.
  void parkData;
  throw createNotImplementedError();
};

const updatePark = async (id, parkData) => {
  // TODO: Add the SQL query to update a park when the database schema is finalized.
  void id;
  void parkData;
  throw createNotImplementedError();
};

const deletePark = async (id) => {
  // TODO: Add the SQL query to delete a park when the database schema is finalized.
  void id;
  throw createNotImplementedError();
};

module.exports = {
  getAllParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
};
