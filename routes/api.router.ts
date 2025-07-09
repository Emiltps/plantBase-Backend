import express from "express";
import {
  getPlants,
  getPlantsById,
  getNextDueByPlantId,
  postPlant,
  patchPlantsById,
  deletePlantsById,
  postPlantsByIdSchedules,
  patchSchedulesById,
  deleteSchedulesById,
  completeCareTasks,
} from "../controllers/api.controller";

const router = express.Router();

router.get("/plants", getPlants);

router.get("/plants/:plant_id", getPlantsById);

router.get("/plants/:plant_id/care_schedules/next_due", getNextDueByPlantId);

router.post("/plants", postPlant);

router.patch("/plants/:plant_id", patchPlantsById);

router.delete("/plants/:plant_id", deletePlantsById);

router.post("/plants/:plant_id/schedules", postPlantsByIdSchedules);

router.patch("/schedules/:care_schedule_id", patchSchedulesById);

router.delete("/schedules/:care_schedule_id", deleteSchedulesById);

router.patch("/care_tasks/:care_tasks_id/complete", completeCareTasks);

export default router;
