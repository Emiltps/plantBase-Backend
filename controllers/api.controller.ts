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
} from "../models/api.models";
import { Request, Response, NextFunction } from "express";

// GET /plants
export const getPlants = (req: Request, res: Response, next: NextFunction) => {
  fetchPlants()
    .then((plants) => {
      res.status(200).json({ plants });
    })
    .catch(next);
};

// GET /plants/:plants_id
export const getPlantById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { plant_id } = req.params;

  fetchPlantById(Number(plant_id))
    .then((plant) => {
      res.status(200).json({ plant });
    })
    .catch(next);
};

// GET /plants/:plant_id/care_schedule/next_due
export const getNextDueByPlantId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { plant_id } = req.params;

  fetchNextDueByPlantId(Number(plant_id))
    .then((nextDue) => {
      res.status(200).json({ nextDue });
    })
    .catch(next);
};

// POST /plants
export const postPlant = (req: Request, res: Response, next: NextFunction) => {
  const user_id: string = req.user.id;

  if (!user_id) {
    return res.status(401).json({ msg: "Unauthorised" });
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

  insertPlant({
    id: user_id,
    plant_type_id,
    nickname,
    photo_url,
    profile_description,
    notes,
    status,
    died_at,
  })
    .then(({ newPlant }) => {
      res.status(201).json({ plant: newPlant });
    })
    .catch(next);
};

// DELETE /plants/:plant_id
export const deletePlantByPlantId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { plant_id } = req.params;
  removePlant(Number(plant_id))
    .then((plant) => {
      res.status(204).send();
    })
    .catch(next);
};

// PATCH /plants/:plant_id
export const patchPlant = (req: Request, res: Response, next: NextFunction) => {
  const plant_id = req.params.plant_id;
  const updateData = req.body;

  updatePlantById(Number(plant_id), updateData)
    .then((updatedPlant) => {
      res.status(200).json({ plant: updatedPlant });
    })
    .catch(next);
};

// POST /plants/:plant_id/care_schedules
export const postCareScheduleByPlantId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id: string = req.user.id;

  if (!user_id) {
    return res.status(401).json({ msg: "Unauthorised" });
  }

  const plant_id = Number(req.params.plant_id);
  const { task_type, interval_days, next_due } = req.body;

  if (!task_type || !interval_days || !next_due) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  const careSchedule: CareScheduleType = {
    plant_id,
    task_type,
    interval_days,
    next_due,
  };

  insertCareScheduleByPlantId(plant_id, careSchedule)
    .then((newSchedule) => {
      res.status(201).json({ schedule: newSchedule.rows[0] });
    })
    .catch(next);
};
