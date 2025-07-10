import db from "../db/connection";
import CareScheduleType from "../db/types/care_schedule";
import PlantType from "../db/types/plant_type";
import { TaskType } from "../db/types/care_schedule";

// GET /plants
export const fetchPlants = () => {
  return db
    .query(
      `SELECT id,
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
export const fetchPlantById = (plant_id: number) => {
  return db
    .query(
      `SELECT id,
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

export const fetchNextDueByPlantId = (plant_id: number) => {
  return db
    .query(
      `SELECT s.next_due, s.task_type
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

// POST /plants
export const insertPlant = (plantData: PlantType) => {
  const {
    id,
    plant_type_id,
    nickname,
    photo_url,
    profile_description,
    notes,
    status,
    died_at,
  } = plantData;

  return db
    .query(
      `INSERT INTO plants (
        id,
        plant_type_id,
        nickname,
        photo_url,
        profile_description,
        notes,
        status,
        died_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`,
      [
        id,
        plant_type_id,
        nickname,
        photo_url ?? null,
        profile_description ?? null,
        notes ?? null,
        status ?? "alive",
        died_at ?? null,
      ]
    )
    .then(({ rows }) => rows[0]);
};

// DELETE /plants/:plant_id
export const removePlant = (plant_id: number) => {
  if (isNaN(plant_id)) {
    return Promise.reject({ status: 400, msg: "Invalid plant ID" });
  }
  return db
    .query(`DELETE FROM plants WHERE plant_id = $1 RETURNING *`, [plant_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Plant not found" });
      }
      return rows[0];
    });
};

// PATCH /plants/:plant_id
export const updatePlantById = (
  plant_id: number,
  updateData: Partial<{
    plant_type_id: number;
    nickname: string;
    photo_url: string;
    profile_description: string;
    notes: string;
    status: string;
    died_at: string | null;
  }>
) => {
  const fields = Object.keys(updateData);

  if (!fields.length) {
    return Promise.reject({ status: 400, msg: "No fields to update" });
  }

  const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  const values = Object.values(updateData);

  return db
    .query(
      `UPDATE plants SET ${setQuery} WHERE plant_id = $${
        fields.length + 1
      } RETURNING *;`,
      [...values, plant_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Plant not found" });
      }
      return rows[0];
    });
};

// POST /plants/:plant_id/care_schedules
export const insertCareScheduleByPlantId = (
  plant_id: number,
  careScheduleData: CareScheduleType
) => {
  const { task_type, interval_days, next_due, created_at } = careScheduleData;
  return db
    .query(
      `INSERT INTO care_schedule (
      plant_id,
      task_type,
      interval_days,
      next_due,
      created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [plant_id, task_type, interval_days, next_due, created_at || new Date()]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

// PATCH /care_schedules/:care_schedule_id
export const updateCareScheduleById = (
  care_schedule_id: number,
  updateData: Partial<{
    plant_id: number;
    task_type: TaskType;
    interval_days: number;
    next_due: string;
  }>
) => {
  const fields = Object.keys(updateData);

  if (!fields.length) {
    return Promise.reject({ status: 400, msg: "No fields to update" });
  }

  const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  const values = Object.values(updateData);

  return db
    .query(
      `UPDATE care_schedule SET ${setQuery} WHERE care_schedule_id = $${
        fields.length + 1
      } RETURNING *;`,
      [...values, care_schedule_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Schedule not found" });
      }
      return rows[0];
    });
};
