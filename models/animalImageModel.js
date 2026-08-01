import db from "../config/db.js";

// get all images of animal
const getImagesByAnimalId = (animalId, callback) => {
  const sql = `
        SELECT *
        FROM animal_images
        WHERE animal_id = ?
        ORDER BY is_primary DESC
    `;

  db.query(sql, [animalId], callback);
};

// add picture
const createAnimalImage = (data, callback) => {
  const sql = `
        INSERT INTO animal_images (
            animal_id,
            image_url,
            image_title,
            image_type,
            image_source,
            photographer,
            image_description,
            is_primary
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      data.animal_id,
      data.image_url,
      data.image_title,
      data.image_type,
      data.image_source,
      data.photographer,
      data.image_description,
      data.is_primary,
    ],
    callback,
  );
};

// delete picture
const deleteAnimalImage = (id, callback) => {
  const sql = `
        DELETE
        FROM animal_images
        WHERE id = ?
    `;

  db.query(sql, [id], callback);
};

export { getImagesByAnimalId, createAnimalImage, deleteAnimalImage };
