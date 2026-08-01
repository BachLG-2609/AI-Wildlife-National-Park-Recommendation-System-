import db from "../config/db.js";

// get full animals
const getAllAnimals = (callback) => {
  const sql = `
        SELECT *
        FROM animals
        ORDER BY common_name ASC
    `;

  db.query(sql, callback);
};

// get animals by ID
const getAnimalById = (id, callback) => {
  const sql = `
        SELECT *
        FROM animals
        WHERE id = ?
    `;

  db.query(sql, [id], callback);
};

// add animal
const createAnimal = (animalData, callback) => {
  const sql = `
        INSERT INTO animals (
            common_name,
            scientific_name,
            kingdom,
            phylum,
            animal_class,
            animal_order,
            family,
            genus,
            species,
            conservation_status,
            habitat,
            diet,
            average_lifespan,
            average_weight,
            average_height,
            description,
            fun_fact,
            image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      animalData.common_name,
      animalData.scientific_name,
      animalData.kingdom,
      animalData.phylum,
      animalData.animal_class,
      animalData.animal_order,
      animalData.family,
      animalData.genus,
      animalData.species,
      animalData.conservation_status,
      animalData.habitat,
      animalData.diet,
      animalData.average_lifespan,
      animalData.average_weight,
      animalData.average_height,
      animalData.description,
      animalData.fun_fact,
      animalData.image_url,
    ],
    callback,
  );
};

// update new animal
const updateAnimal = (id, animalData, callback) => {
  const sql = `
        UPDATE animals
        SET
            common_name = ?,
            scientific_name = ?,
            kingdom = ?,
            phylum = ?,
            animal_class = ?,
            animal_order = ?,
            family = ?,
            genus = ?,
            species = ?,
            conservation_status = ?,
            habitat = ?,
            diet = ?,
            average_lifespan = ?,
            average_weight = ?,
            average_height = ?,
            description = ?,
            fun_fact = ?,
            image_url = ?
        WHERE id = ?
    `;

  db.query(
    sql,
    [
      animalData.common_name,
      animalData.scientific_name,
      animalData.kingdom,
      animalData.phylum,
      animalData.animal_class,
      animalData.animal_order,
      animalData.family,
      animalData.genus,
      animalData.species,
      animalData.conservation_status,
      animalData.habitat,
      animalData.diet,
      animalData.average_lifespan,
      animalData.average_weight,
      animalData.average_height,
      animalData.description,
      animalData.fun_fact,
      animalData.image_url,
      id,
    ],
    callback,
  );
};

// delete animal
const deleteAnimal = (id, callback) => {
  const sql = `
        DELETE FROM animals
        WHERE id = ?
    `;

  db.query(sql, [id], callback);
};

// Get animal by common name
const getAnimalByName = (commonName, callback) => {
  const sql = `
        SELECT *
        FROM animals
        WHERE common_name LIKE ?
        ORDER BY common_name ASC
    `;

  db.query(sql, [`%${commonName}%`], callback);
};

export {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalByName,
};
