import PlantType from "../db/types/plant_type";
import CareScheduleType from "../db/types/care_schedule";
import {
  fetchPlants,
  fetchPlantById,
  fetchNextDueByPlantId,
  insertPlant,
  removePlant,
  updatePlantById,
  insertCareScheduleByPlantId,
  updateCareScheduleById,
  removeCareSchedule,
  updateCareTaskCompletedAt,
} from "../models/api.models";
import { Request, Response, NextFunction, RequestHandler } from "express";

// GET /plants
export const getPlants: RequestHandler = (req, res, next) => {
  fetchPlants()
    .then((plants) => {
      res.status(200).json({ plants });
    })
    .catch(next);
};

// GET /plants/:plants_id
export const getPlantById: RequestHandler = (req, res, next) => {
  const { plant_id } = req.params;

  fetchPlantById(String(plant_id))
    .then((plant) => {
      res.status(200).json({ plant });
    })
    .catch(next);
};

// GET /plants/:plant_id/care_schedule/next_due
export const getNextDueByPlantId: RequestHandler = (req, res, next) => {
  const { plant_id } = req.params;

  fetchNextDueByPlantId(String(plant_id))
    .then((nextDue) => {
      res.status(200).json({ nextDue });
    })
    .catch(next);
};

// POST /plants
export const postPlant: RequestHandler = (req, res, next) => {
  const user_id: string = (req as any).user.id;

  if (!user_id) {
    res.status(401).json({ msg: "Unauthorised" });
    return;
  }

  const {
    plant_type_id,
    nickname,
    photo_url,
    profile_description,
    notes,
    status,
    died_at,
  }: PlantType = req.body;

  if (plant_type_id === undefined || nickname === undefined) {
    res.status(400).json({ msg: "Missing required fields" });
    return;
  }

  insertPlant({
    owner_id: user_id,
    plant_type_id,
    nickname,
    photo_url,
    profile_description,
    notes,
    status,
    died_at,
  })
    .then((newPlant) => {
      res.status(201).json({ plant: newPlant });
    })
    .catch(next);
};

// DELETE /plants/:plant_id
export const deletePlantByPlantId: RequestHandler = (req, res, next) => {
  const { plant_id } = req.params;
  removePlant(Number(plant_id))
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

// PATCH /plants/:plant_id
export const patchPlant: RequestHandler = (req, res, next) => {
  const { plant_id } = req.params;
  const updateData = req.body;

  if (updateData.status !== undefined) {
    const validStatuses = ["alive", "dead", "infected"];
    if (!validStatuses.includes(updateData.status)) {
      res.status(400).json({ msg: "Invalid plant status" });
      return;
    }
  }

  updatePlantById(Number(plant_id), updateData)
    .then((updatedPlant) => {
      res.status(200).json({ plant: updatedPlant });
    })
    .catch(next);
};

// POST /plants/:plant_id/care_schedules
export const postCareScheduleByPlantId: RequestHandler = (req, res, next) => {
  const user_id: string = (req as any).user.id;

  if (!user_id) {
    res.status(401).json({ msg: "Unauthorised" });
    return;
  }

  const plant_id = Number(req.params.plant_id);
  const { task_type, interval_days } = req.body;

  if (!task_type || !interval_days === undefined) {
    res.status(400).json({ msg: "Missing required fields" });
    return;
  }

  const next_due = new Date().toISOString();

  const careSchedule: CareScheduleType = {
    plant_id,
    task_type,
    interval_days,
    next_due,
  };

  insertCareScheduleByPlantId(plant_id, careSchedule)
    .then((newSchedule) => {
      res.status(201).json({ schedule: newSchedule });
    })
    .catch((err: any) => {
      if (err.code === "23503") {
        res.status(404).json({ msg: "Plant not found" });
      } else {
        next(err);
      }
    });
};

// PATCH /care_schedules/:care_schedule_id
export const patchCareScheduleByCareScheduleId: RequestHandler = (
  req,
  res,
  next
) => {
  const { care_schedule_id } = req.params;
  const updateData = req.body;

  updateCareScheduleById(Number(care_schedule_id), updateData)
    .then((updatedSchedule) => {
      if (updateData.next_due !== undefined) {
        updatedSchedule.next_due = updateData.next_due;
      }
      res.status(200).json({ schedule: updatedSchedule });
    })
    .catch((err: any) => {
      if (err.code === "22P02") {
        return res.status(400).json({ msg: "Invalid data types" });
      }
      next(err);
    });
};

// DELETE /care_schedules/:care_schedule_id
export const deleteCareScheduleByCareScheduleId: RequestHandler = (
  req,
  res,
  next
) => {
  const { care_schedule_id } = req.params;
  removeCareSchedule(Number(care_schedule_id))
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

//PATCH /care_tasks/:care_task_id/complete_at
export const patchCareTaskCompletedAt: RequestHandler = (req, res, next) => {
  const care_task_id: number = Number(req.params.care_task_id);
  const care_schedule_id: number = Number(req.body.care_schedule_id);
  const next_due: string = req.body.next_due;

  updateCareTaskCompletedAt(care_task_id).then((updatedCareTask) => {
    return updateCareScheduleById(care_schedule_id, { next_due })
      .then((updatedCareSchedule) => {
        res.status(201).json({
          care_task: updatedCareTask,
          care_schedule: updatedCareSchedule,
        });
      })
      .catch(next);
  });
};
