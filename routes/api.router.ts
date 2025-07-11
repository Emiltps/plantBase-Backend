import express from "express";
import authRouter from "./auth";
import { requireAuth } from "../middleware/auth";
import {
  getPlants,
  getPlantById,
  getPlantsByUser,
  getNextDueByPlantId,
  postPlant,
  patchPlant,
  deletePlantByPlantId,
  postCareScheduleByPlantId,
  patchCareScheduleByCareScheduleId,
  deleteCareScheduleByCareScheduleId,
  patchCareTaskCompletedAt,
} from "../controllers/api.controller";
import path from "path";

const router = express.Router();

router.use("/", express.static(path.join(__dirname, "../public")));

router.use("/auth", authRouter);

router.get("/plants/:plant_id", requireAuth, getPlantById);

router.get("/users/:user_id/plants", requireAuth, getPlantsByUser);

router.get(
  "/plants/:plant_id/care_schedules/next_due",
  requireAuth,
  getNextDueByPlantId
);

router.post("/plants", requireAuth, postPlant);

router.patch("/plants/:plant_id", requireAuth, patchPlant);

router.delete("/plants/:plant_id", requireAuth, deletePlantByPlantId);

router.post(
  "/plants/:plant_id/care_schedules",
  requireAuth,
  postCareScheduleByPlantId
);

router.patch(
  "/care_schedules/:care_schedule_id",
  requireAuth,
  patchCareScheduleByCareScheduleId
);

router.delete(
  "/care_schedules/:care_schedule_id",
  requireAuth,
  deleteCareScheduleByCareScheduleId
);

router.patch(
  "/care_tasks/:care_tasks_id/complete",
  requireAuth,
  patchCareTaskCompletedAt
);

export default router;
