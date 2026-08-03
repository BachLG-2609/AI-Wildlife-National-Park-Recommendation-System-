import db from "../config/db.js";

// get list of animal in the park
const getAnimalsByPark = (parkId, callback) => {
  const sql = `
        SELECT
            pa.*,
            a.common_name,
            a.scientific_name,
            a.image_url
        FROM park_animals pa
        JOIN animals a
            ON pa.animal_id = a.id
        WHERE pa.park_id = ?
    `;

  db.query(sql, [parkId], callback);
};

// add animal into the park
const addAnimalToPark = (data, callback) => {
  const sql = `
        INSERT INTO park_animals(
            park_id,
            animal_id,
            population_estimate,
            best_viewing_season,
            endangered_in_park,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      data.park_id,
      data.animal_id,
      data.population_estimate,
      data.best_viewing_season,
      data.endangered_in_park,
      data.notes,
    ],
    callback,
  );
};

// update animal in the park
const updateParkAnimal = (id, data, callback) => {
  const sql = `
        UPDATE park_animals
        SET
            population_estimate = ?,
            best_viewing_season = ?,
            endangered_in_park = ?,
            notes = ?
        WHERE id = ?
    `;

  db.query(
    sql,
    [
      data.population_estimate,
      data.best_viewing_season,
      data.endangered_in_park,
      data.notes,
      id,
    ],
    callback,
  );
};

// delete animal from the park
const deleteParkAnimal = (id, callback) => {
  const sql = `
        DELETE FROM park_animals
        WHERE id = ?
    `;

  db.query(sql, [id], callback);
};

export {
  getAnimalsByPark,
  addAnimalToPark,
  updateParkAnimal,
  deleteParkAnimal,
};
