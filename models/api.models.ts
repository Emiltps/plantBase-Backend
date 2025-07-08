import db from "../db/connection";

// GET /plants
exports.fetchPlants = () => {
  return db
    .query(
      `SELECT user_id,
        plant_type_id,
        nickname,
        photo_url,
        profile_description,
        notes,
        status,
        created_at,
        died_at
        FROM plants;`
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};

// GET /plants/:plant_id
exports.fetchPlantById = (plant_id: number) => {
  return db
    .query(
      `SELECT user_id,
        plant_type_id,
        nickname,
        photo_url,
        profile_description,
        notes,
        status,
        created_at,
        died_at
        FROM plants
        WHERE plant_id = $1`,
      [plant_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Plant not found" });
      }
      return rows[0];
    });
};

//GET /plants/:plant_id/care_schedule/next_due

exports.fetchNextDueByPlantId = (plant_id: number) => {
  return db
    .query(
      `SELECT s.next_due 
        FROM care_schedule s
        JOIN plants p
        ON s.plant_id = p.plant_id
        WHERE s.plant_id = $1
        `,
      [plant_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Upcoming task date not found",
        });
      }
      return rows[0];
    });
};
