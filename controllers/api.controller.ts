import {
  fetchPlants,
  fetchPlantById,
  fetchNextDueByPlantId,
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
