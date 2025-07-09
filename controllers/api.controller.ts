import PlantType from "../db/types/plant_type";
import {
  fetchPlants,
  fetchPlantById,
  fetchNextDueByPlantId,
  insertPlant,
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
  const user_id = req.user.id;

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
    user_id,
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
