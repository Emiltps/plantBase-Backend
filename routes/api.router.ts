import express from "express";
import {
  getPlants,
  getPlantsById,
  getPlantsByIdNextDue,
  postPlants,
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

router.get("/plants/:plant_id/care_schedules/next_due", getPlantsByIdNextDue);

router.post("/plants", postPlants);

router.patch("/plants/:id", patchPlantsById);

router.delete("/plants/:id", deletePlantsById);

router.post("/plants/:id/schedules", postPlantsByIdSchedules);

router.patch("/schedules/:id", patchSchedulesById);

router.delete("/schedules/:id", deleteSchedulesById);

router.patch("/care_tasks/:id/complete", completeCareTasks);

export default router;
