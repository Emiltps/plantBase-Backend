import db from "../connection";
import format from "pg-format";

import CareScheduleType from "../types/care_schedule";
import PlantType from "../types/plant_type";
import PlantTypesType from "../types/plant_types_type";
import ProfileType from "../types/profile_type";
import CareTasksType from "../types/care_tasks_type";

type seedData = {
  careTasksData: CareTasksType[];
  plantTypesData: PlantTypesType[];
  plantsData: PlantType[];
  profilesData: ProfileType[];
  careScheduleData: CareScheduleType[];
};

const seed = async ({
  careTasksData,
  plantTypesData,
  plantsData,
  profilesData,
  careScheduleData,
}: seedData) => {
  if (process.env.NODE_ENV !== "production") {
    await db.query(`CREATE SCHEMA IF NOT EXISTS auth;`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY,
        email TEXT
      );
    `);
    const authInsertQuery = format(
      `INSERT INTO auth.users (id, email) VALUES %L ON CONFLICT (id) DO NOTHING;`,
      profilesData.map(({ id, email }) => [id, email])
    );
    await db.query(authInsertQuery);
  }

  await db.query(`DROP TABLE IF EXISTS care_tasks`);
  await db.query(`DROP TABLE IF EXISTS care_schedule`);
  await db.query(`DROP TABLE IF EXISTS plants`);
  await db.query(`DROP TABLE IF EXISTS plant_types`);
  await db.query(`DROP TABLE IF EXISTS profiles`);
  await db.query(`DROP TYPE IF EXISTS task_type`);
  await db.query(`DROP TYPE IF EXISTS plantstatus`);

  await db.query(`CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username VARCHAR(60) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    profile_image TEXT,
    expo_push_token TEXT[], 
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await db.query(`CREATE TABLE plant_types (
    plant_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT
  )`);

  await db.query(
    `CREATE TYPE plantstatus AS ENUM ('alive', 'dead', 'infected')`
  );

  await db.query(`CREATE TABLE plants (
    plant_id SERIAL PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id),
    plant_type_id INT REFERENCES plant_types(plant_type_id),
    nickname VARCHAR(100) NOT NULL,
    photo_url TEXT,
    profile_description TEXT,
    notes TEXT,
    status plantstatus DEFAULT 'alive',
    created_at TIMESTAMP DEFAULT NOW(),
    died_at TIMESTAMP DEFAULT NULL
  )`);
  await db.query(
    `CREATE TYPE task_type AS ENUM ('water', 'fertilise', 'prune', 'other')`
  );
  await db.query(`CREATE TABLE care_schedule (
    care_schedule_id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(plant_id),
    task_type task_type NOT NULL,
    interval_days INT NOT NULL,
    next_due TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await db.query(`
    CREATE TABLE care_tasks (
    care_tasks_id SERIAL PRIMARY KEY,
    schedule_id INT   REFERENCES care_schedule(care_schedule_id),
    due_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
    )`);

  const profilesInsertQueryStr = format(
    `INSERT INTO profiles (id, username, email, full_name, profile_image, expo_push_token, created_at) VALUES %L RETURNING *;`,
    profilesData.map(
      ({ id, username, email, full_name, profile_image, expo_push_token, created_at }) => [
        id,
        username,
        email,
        full_name,
        profile_image,
        `{${expo_push_token.join(",")}}`,
        created_at,
      ]
    )
  );
  await db.query(profilesInsertQueryStr);

  const plantTypesInsertQueryStr = format(
    `INSERT INTO plant_types (name, image_url) VALUES %L RETURNING *;`,
    plantTypesData.map(({ name, image_url }) => [name, image_url])
  );
  await db.query(plantTypesInsertQueryStr);

  const plantsInsertQueryStr = format(
    `INSERT INTO plants (owner_id, plant_type_id, nickname, photo_url, profile_description, notes, status, created_at, died_at) VALUES %L RETURNING *;`,
    plantsData.map(
      ({
        owner_id,
        plant_type_id,
        nickname,
        photo_url,
        profile_description,
        notes,
        status,
        created_at,
        died_at,
      }) => [
        owner_id,
        plant_type_id,
        nickname,
        photo_url,
        profile_description,
        notes,
        status,
        created_at,
        died_at,
      ]
    )
  );
  await db.query(plantsInsertQueryStr);

  const careScheduleInsertQueryStr = format(
    `INSERT INTO care_schedule (plant_id, task_type, interval_days, next_due, created_at) VALUES %L RETURNING *;`,
    careScheduleData.map(
      ({ plant_id, task_type, interval_days, next_due, created_at }) => [
        plant_id,
        task_type,
        interval_days,
        next_due,
        created_at,
      ]
    )
  );
  await db.query(careScheduleInsertQueryStr);

  const careTasksInsertQueryStr = format(
    `INSERT INTO care_tasks (schedule_id, due_at, completed_at, created_at) VALUES %L RETURNING *;`,
    careTasksData.map(({ schedule_id, due_at, completed_at, created_at }) => [
      schedule_id,
      due_at,
      completed_at,
      created_at,
    ])
  );
  await db.query(careTasksInsertQueryStr);
};

export default seed;
