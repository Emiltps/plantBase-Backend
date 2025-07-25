import db from "../db/connection";
import CareScheduleType from "../db/types/care_schedule";
import PlantType from "../db/types/plant_type";
import { TaskType } from "../db/types/care_schedule";
import CareTasksType from "../db/types/care_tasks_type";

// GET /plants
export const fetchPlants = () => {
  return db
    .query(
      `SELECT plant_id,
        plant_type_id,
        owner_id,
        nickname,
        photo_url,
        profile_description,
        notes,
        status,
        created_at,
        died_at
        FROM plants
        ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};

// GET /plants/:plant_id
export const fetchPlantById = (plant_id: string) => {
  return db
    .query(
      `SELECT plant_id,
        plant_type_id,
        owner_id,
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

export const fetchUserById = (user_id: string) => {
  return db
    .query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM profiles WHERE id = $1)`,
      [user_id]
    )
    .then(({ rows }) => {
      if (!rows[0].exists) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return user_id;
    });
};

export const fetchPlantsByOwner = (owner_id: string) => {
  return db
    .query(
      `SELECT plant_id,
            plant_type_id,
            owner_id,
            nickname,
            photo_url,
            profile_description,
            notes,
            status,
            created_at,
            died_at
     FROM plants
     WHERE owner_id = $1
     ORDER BY created_at DESC;`,
      [owner_id]
    )
    .then(({ rows }) => rows);
};
//GET /plants/:plant_id/care_schedule/next_due

export const fetchNextDueByPlantId = (plant_id: string) => {
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
          msg: "No upcoming tasks",
        });
      }
      return rows[0];
    });
};

// POST /plants
export const insertPlant = (plantData: PlantType) => {
  const {
    owner_id,
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
        owner_id,
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
        owner_id,
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
export const removePlant = async (plant_id: number) => {
  if (isNaN(plant_id)) {
    return Promise.reject({ status: 400, msg: "Invalid plant ID" });
  }

  await db.query(
    `DELETE FROM care_tasks
     WHERE schedule_id IN (
       SELECT care_schedule_id FROM care_schedule WHERE plant_id = $1
     )`,
    [plant_id]
  );

  await db.query(`DELETE FROM care_schedule WHERE plant_id = $1`, [plant_id]);

  const { rows } = await db.query(
    `DELETE FROM plants WHERE plant_id = $1 RETURNING *`,
    [plant_id]
  );

  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "plant not found" });
  }

  return rows[0];
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

// Fetch a single care_schedule by ID
export const fetchScheduleById = (care_schedule_id: number) => {
  return db
    .query(
      `SELECT care_schedule_id, plant_id, task_type, interval_days, next_due, created_at
       FROM care_schedule
       WHERE care_schedule_id = $1`,
      [care_schedule_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Schedule not found" });
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

// DELETE /care_schedules/:care_schedule_id
export const removeCareSchedule = (care_schedule_id: number) => {
  if (isNaN(care_schedule_id)) {
    return Promise.reject({ status: 400, msg: "Invalid schedule ID" });
  }
  return db
    .query(`DELETE FROM care_tasks WHERE schedule_id = $1`, [care_schedule_id])
    .then(() =>
      db.query(
        `DELETE FROM care_schedule WHERE care_schedule_id = $1 RETURNING *`,
        [care_schedule_id]
      )
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Schedule not found" });
      }
      return rows[0];
    });
};

//PATCH /care_tasks/:care_task_id/complete_at
export const updateCareTaskCompletedAt = (care_task_id: number) => {
  return db
    .query(
      `UPDATE care_tasks
      SET completed_at = NOW()
      WHERE care_tasks_id = $1
      RETURNING *`,
      [care_task_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Care task not found" });
      }
      return rows[0];
    });
};

// Fetch all care schedules for a given plant, ensuring the plant exists
export const fetchCareSchedulesByPlantId = (plant_id: number) => {
  return db
    .query<CareScheduleType>(
      `SELECT care_schedule_id, plant_id, task_type, interval_days, next_due, created_at
       FROM care_schedule
       WHERE plant_id = $1`,
      [plant_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Care schedules not found" });
      }
      return rows;
    });
};

// Fetch all care tasks belonging to a given user across all their plants
export const fetchCareTasksByUserId = async (
  userId: string
): Promise<
  (CareTasksType & { task_type: string; nickname: string; photo_url: string })[]
> => {
  const SQL = `
    SELECT 
      ct.*,
      cs.task_type,
      p.nickname,
      p.photo_url
    FROM care_tasks AS ct
    JOIN care_schedule AS cs
      ON ct.schedule_id = cs.care_schedule_id
    JOIN plants AS p
      ON cs.plant_id = p.plant_id
    WHERE p.owner_id::text = $1
    ORDER BY ct.due_at;
  `;

  const { rows } = await db.query<
    CareTasksType & { task_type: string; nickname: string; photo_url: string }
  >(SQL, [userId]);

  // rows may be empty; return as-is
  return rows;
};
