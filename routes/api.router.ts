import express from "express";
import authRouter from "./auth";
import {
  getPlants,
  getPlantsById,
  getNextDueByPlantId,
  postPlant,
  patchPlant,
  deletePlantByPlantId,
  postPlantsByIdSchedules,
  patchSchedulesById,
  deleteSchedulesById,
  completeCareTasks,
} from "../controllers/api.controller";

const router = express.Router();

router.use("/auth", authRouter);

router.get("/plants", getPlants);

router.get("/plants/:plant_id", getPlantsById);

router.get("/plants/:plant_id/care_schedules/next_due", getNextDueByPlantId);

router.post("/plants", postPlant);

router.patch("/plants/:plant_id", patchPlant);

router.delete("/plants/:plant_id", deletePlantByPlantId);

router.post("/plants/:plant_id/schedules", postPlantsByIdSchedules);

router.patch("/schedules/:care_schedule_id", patchSchedulesById);

router.delete("/schedules/:care_schedule_id", deleteSchedulesById);

router.patch("/care_tasks/:care_tasks_id/complete", completeCareTasks);

export default router;
