import db from "../connection";
import format from "pg-format";
import careTasks from "../data/test-data/care_tasks";
import plantType from "../data/test-data/plant_types";
import plants from "../data/test-data/plants";
import users from "../data/test-data/users";
import careSchedule from "../data/test-data/care_schedule";

import CareScheduleType from "../types/care_schedule";
import PlantType from "../types/plant_type";
import PlantTypesType from "../types/plant_types_type";
import UserType from "../types/user_type";
import CareTasksType from "../types/care_tasks_type";

type seedData = {
  careTasks: CareTasksType[];
  plantType: PlantTypesType[];
  plants: PlantType[];
  users: UserType[];
  careSchedule: CareScheduleType[];
};

const seed = async ({
  careTasks,
  plantType,
  plants,
  users,
  careSchedule,
}: seedData) => {
  await db.query(`CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(60) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    profile_image TEXT,
    expo_push_token TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await db.query(`CREATE TABLE plant_types (
    plant_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
    image_url TEXT
  )`);

  await db.query(`
    CREATE TYPE plantstatus AS ENUM (alive, dead, infected)
    CREATE TABLE plants (
    plant_id SERIAL NOT NULL,
    user_id INT REFERENCES users(user_id),
    plant_type_id INT REFERENCES plant_types(plant_type_id),
    nickname VARCHAR(100) NOT NULL,
    photo_url TEXT,
    profile_description TEXT,
    notes TEXT,
    status plantstatus DEFAULT alive,
    created_at TIMESTAMP DEFAULT NOW(),
    died_at TIMESTAMP DEFAULT NULL;
  )`);
  await db.query(`
    CREATE TYPE task_type AS ENUM (water, fertilise, prune,other)
    CREATE TABLE care_schedule (
    care_schedule_id SERIAL PRIMARY KEY NOT NULL,
    plant_id INT REFERENCES plants(plant_id),
    status task_type NOT NULL,
    interval_days INT NOT NULL,
    next_due TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    )`);

  await db.query(`
    CREATE TABLE care_tasks (
    care_tasks_id SERIAL PRIMARY KEY NOT NULL,
    schedule_id REFERENCES care_schedule(care_schedule_id),
    due_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    )`);
};
