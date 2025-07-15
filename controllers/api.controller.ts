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
  fetchScheduleById,
  fetchUserById,
  fetchPlantsByOwner,
  fetchCareSchedulesByPlantId,
  fetchCareTasksByUserId,
} from "../models/api.models";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { supabase } from "../lib/supabaseClient";

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

export const getPlantsByUser: RequestHandler = (req, res, next) => {
  const { user_id } = req.params;
  const authId = (req as any).user.id;

  fetchUserById(user_id)
    .then((foundUserId) => {
      if (foundUserId !== authId) {
        // user exists but this isn’t their data
        return Promise.reject({ status: 403, msg: "Forbidden" });
      }
      return fetchPlantsByOwner(foundUserId);
    })
    .then((plants) => {
      res.status(200).json({ plants });
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
  const { task_type, interval_days, next_due: suppliedNextDue } = req.body;

  if (task_type === undefined || !interval_days === undefined) {
    res.status(400).json({ msg: "Missing required fields" });
    return;
  }

  const next_due =
    suppliedNextDue && !isNaN(Date.parse(suppliedNextDue))
      ? suppliedNextDue
      : new Date().toISOString();

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
  const care_task_id = Number(req.params.care_tasks_id);
  if (isNaN(care_task_id)) {
    res.status(400).json({ msg: "Invalid care task ID" });
    return;
  }

  updateCareTaskCompletedAt(care_task_id)
    .then((updatedTask) => {
      const schedule_id = (updatedTask as any).schedule_id;
      return fetchScheduleById(schedule_id).then((schedule) => {
        const oldMs = new Date(schedule.next_due).getTime();
        const newMs = oldMs + schedule.interval_days * 24 * 60 * 60 * 1000;
        const newNextDue = new Date(newMs).toISOString();
        return updateCareScheduleById(schedule_id, {
          next_due: newNextDue,
        }).then((updatedSchedule) => {
          res.status(200).json({
            care_task: updatedTask,
            care_schedule: updatedSchedule,
          });
        });
      });
    })
    .catch(next);
};

// GET /plants/:plant_id/care_schedules
export const getCareSchedulesByPlant: RequestHandler = (req, res, next) => {
  const { plant_id } = req.params;
  const userId = (req as any).user.id;

  fetchPlantById(plant_id)
    .then((plant) => {
      if (plant.owner_id !== userId) {
        return Promise.reject({ status: 403, msg: "Forbidden" });
      }
      return fetchCareSchedulesByPlantId(Number(plant_id));
    })
    .then((schedules) => {
      res.status(200).json({ schedules });
    })
    .catch(next);
};

// GET /users/:user_id/care_tasks
export const getCareTasksByUser: RequestHandler = (req, res, next) => {
  const { user_id } = req.params;
  const userId = (req as any).user.id;

  if (user_id !== userId) {
    res.status(403).json({ msg: "Forbidden" });
    return;
  }

  fetchCareTasksByUserId(userId)
    .then((tasks) => {
      res.status(200).json({ tasks });
    })
    .catch(next);
};

// GET /users/:user_id/profile
export const getProfileByUser: RequestHandler = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const authId = (req as any).user.id;
    if (authId !== user_id) {
      res.status(403).json({ msg: "Forbidden" });
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("username, profile_image")
      .eq("id", user_id)
      .single();
    if (error) {
      res.status(400).json({ msg: error.message });
      return;
    }
    res.status(200).json({ profile: data });
    return;
  } catch (err) {
    next(err);
  }
};

// PATCH /users/:user_id/profile
export const patchProfileByUser: RequestHandler = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const authId = (req as any).user.id;
    if (authId !== user_id) {
      res.status(403).json({ msg: "Forbidden" });
      return;
    }
    const { username, profile_image } = req.body;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user_id, username, profile_image }, { onConflict: "id" });
    if (error) {
      res.status(400).json({ msg: error.message });
      return;
    }
    res.sendStatus(204);
    return;
  } catch (err) {
    next(err);
  }
};
