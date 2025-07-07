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
const seed = async ({
  careTasks: CareTasksType[],
  plantType: PlantTypesType,
  plants,
  users,
  careSchedule,
}) => {};
