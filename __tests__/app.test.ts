import db from "../db/connection";
import seed from "../db/seeds/seed";
import data from "../db/data/test-data";
import app from "../app";
import request from "supertest";

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("router tests", () => {
  describe.skip("GET /plants", () => {
    test("200: Responds with an array of plants with correct properties", () => {
      return request(app)
        .get("/api/plants")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.plants)).toBe(true);
          expect(body.plants.length).not.toBe(0);
          body.plants.forEach((plant: any) => {
            expect(typeof plant.plant_id).toBe("number");
            expect(typeof plant.owner_id).toBe("string");
            expect(typeof plant.plant_type_id).toBe("number");
            expect(typeof plant.nickname).toBe("string");
            expect(typeof plant.photo_url).toBe("string");
            expect(typeof plant.profile_description).toBe("string");
            expect(typeof plant.notes).toBe("string");
            expect(["alive", "dead", "infected"]).toContain(plant.status);
            expect(
              typeof plant.created_at === "string" || plant.created_at === null
            ).toBe(true);
          });
        });
    });
  });

  describe("GET /users/:user_id/plants", () => {
    test("200: Responds with an array of plants belonging to the authenticated user", () => {
      return request(app)
        .get(`/api/users/00000000-0000-0000-0000-000000000000/plants`)
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.plants)).toBe(true);
          body.plants.forEach((plant: any) => {
            expect(plant.owner_id).toBe("00000000-0000-0000-0000-000000000000");
          });
        });
    });
    test("404: Responds with error if user does not exist", () => {
      return request(app)
        .get("/api/users/22222222-2222-2222-2222-222222222222/plants")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
    test("403: Responds with forbidden if requesting another user's plants", () => {
      return request(app)
        .get("/api/users/12e3f4a5-b6c7-4d89-8e01-23f45c67d890/plants")
        .expect(403)
        .then(({ body }) => {
          expect(body.msg).toBe("Forbidden");
        });
    });
  });

  describe("GET /plants/:plant_id", () => {
    test("200: Responds with correct properties of plant with given id", () => {
      return request(app)
        .get("/api/plants/1")
        .expect(200)
        .then(({ body }) => {
          const plant = body.plant;
          expect(typeof body).toBe("object");
          expect(plant.plant_id).toBe(1);
          expect(typeof plant.owner_id).toBe("string");
          expect(typeof plant.plant_type_id).toBe("number");
          expect(typeof plant.nickname).toBe("string");
          expect(typeof plant.photo_url).toBe("string");
          expect(typeof plant.profile_description).toBe("string");
          expect(typeof plant.notes).toBe("string");
          expect(["alive", "dead", "infected"]).toContain(plant.status);
          expect(
            typeof plant.created_at === "string" || plant.created_at === null
          ).toBe(true);
        });
    });
    test("404: Responds with error message if plant doesn't exist", () => {
      return request(app)
        .get("/api/plants/800")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Plant not found");
        });
    });
  });
  describe("GET /plants/:plant_id/care_schedules/next_due", () => {
    test("200: Responds with next due task with given id", () => {
      return request(app)
        .get("/api/plants/1/care_schedules/next_due")
        .expect(200)
        .then(({ body }) => {
          const task = body.nextDue;
          expect(typeof task.task_type).toBe("string");
          expect(typeof task.next_due).toBe("string");
        });
    });
    test("404: Responds with message when no due tasks remain", () => {
      return request(app)
        .get("/api/plants/100/care_schedules/next_due")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No upcoming tasks");
        });
    });
  });

  describe("POST /plants", () => {
    test("201: Responds with posted plant and adds it to the database", () => {
      const newPlant = {
        plant_type_id: 2,
        nickname: "Fernie",
        photo_url: "",
        profile_description: "A small green fern.",
        notes: "Needs watering every few days.",
        status: "alive",
      };
      return request(app)
        .post("/api/plants")
        .send(newPlant)
        .expect(201)
        .then(({ body }) => {
          const plant = body.plant;
          expect(typeof plant).toBe("object");
          expect(typeof plant.plant_id).toBe("number");
          expect(typeof plant.owner_id).toBe("string");
          expect(plant.owner_id).toBe("00000000-0000-0000-0000-000000000000");
          expect(plant.plant_type_id).toBe(2);
          expect(plant.nickname).toBe("Fernie");
          expect(plant.photo_url).toBe("");
          expect(plant.profile_description).toBe("A small green fern.");
          expect(plant.notes).toBe("Needs watering every few days.");
          expect(plant.status).toBe("alive");
          expect(typeof plant.created_at).toBe("string");
        });
    });
    test("400: Responds with error if required input missing fields", () => {
      const badInput = { nickname: "one field" };
      return request(app)
        .post("/api/plants")
        .send(badInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields");
        });
    });
  });

  describe("PATCH /plants/:plant_id", () => {
    test("200: Updates plant with new data and responds with the updated plant", () => {
      const update = {
        nickname: "Leafy",
        notes: "Moved to a sunnier location",
        status: "alive",
      };
      return request(app)
        .patch("/api/plants/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const plant = body.plant;

          expect(plant.plant_id).toBe(1);
          expect(plant.nickname).toBe("Leafy");
          expect(plant.notes).toBe("Moved to a sunnier location");
          expect(plant.status).toBe("alive");
        });
    });
    test("404: Responds with error if plant_id does not exist", () => {
      const update = {
        nickname: "Leafy",
        notes: "Moved to a sunnier location",
        status: "alive",
      };
      return request(app)
        .patch("/api/plants/999")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Plant not found");
        });
    });
    test("400: Responds with error if input is invalid", () => {
      const update = {
        status: "not valid status",
      };
      return request(app)
        .patch("/api/plants/1999")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid plant status");
        });
    });
  });

  describe("DELETE /plants/:plant_id", () => {
    test("204: Responds with no content and deletes the given plant", () => {
      return request(app)
        .delete("/api/plants/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404: Responds with error if no plant at given id", () => {
      return request(app)
        .delete("/api/plants/905")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("plant not found");
        });
    });
  });

  describe("POST /plants/:plant_id/schedules", () => {
    test("201: Adds news care schedule and responds with the created schedule", () => {
      const newSchedule = {
        task_type: "water",
        interval_days: 7,
      };
      return request(app)
        .post("/api/plants/1/care_schedules")
        .send(newSchedule)
        .expect(201)
        .then(({ body }) => {
          const schedule = body.schedule;
          expect(typeof schedule).toBe("object");
          expect(typeof schedule.care_schedule_id).toBe("number");
          expect(schedule.plant_id).toBe(1);
          expect(schedule.task_type).toBe("water");
          expect(schedule.interval_days).toBe(7);
          expect(typeof schedule.created_at).toBe("string");
        });
    });

    test("400: Responds with error if fields are missing", () => {
      return request(app)
        .post("/api/plants/1/care_schedules")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields");
        });
    });
    test("404: Responds with error if plant_id does not exist", () => {
      const newSchedule = {
        task_type: "water",
        interval_days: 7,
      };
      return request(app)
        .post("/api/plants/999/care_schedules")
        .send(newSchedule)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Plant not found");
        });
    });
  });

  describe("PATCH /schedules/:care_schedule_id", () => {
    test("200: Updates interval_days and return updated schedule", () => {
      const updatedDays = {
        interval_days: 10,
      };
      return request(app)
        .patch("/api/care_schedules/1")
        .send(updatedDays)
        .expect(200)
        .then(({ body }) => {
          const schedule = body.schedule;
          expect(schedule).toBeDefined();
          expect(schedule.care_schedule_id).toBe(1);
          expect(schedule.interval_days).toBe(10);
          expect(typeof schedule.next_due).toBe("string");
          expect(typeof schedule.created_at).toBe("string");
        });
    });
    test("200: Updates next_due field", () => {
      const updatedDue = {
        next_due: "2025-07-20T00:00:00.000Z",
      };

      return request(app)
        .patch("/api/care_schedules/1")
        .send(updatedDue)
        .expect(200)
        .then(({ body }) => {
          const schedule = body.schedule;
          expect(schedule.care_schedule_id).toBe(1);
          expect(schedule.next_due).toBe("2025-07-20T00:00:00.000Z");
        });
    });
    test("400: Missing field returns an error", () => {
      return request(app)
        .patch("/api/care_schedules/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("No fields to update");
        });
    });
    test("404: Non-existent care_schedule_id returns error", () => {
      return request(app)
        .patch("/api/care_schedules/999")
        .send({ interval_days: 5 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Schedule not found");
        });
    });
    test("400: Invalid data type ", () => {
      const invalidInterval = { interval_days: "every day" };
      return request(app)
        .patch("/api/care_schedules/1")
        .send(invalidInterval)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid data types");
        });
    });

    describe("DELETE /schedules/:care_schedule_id", () => {
      test("204: Deletes a schedule and returns no content", () => {
        return request(app)
          .delete("/api/care_schedules/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });

      test("404: Error when schedule does not exist", () => {
        return request(app)
          .delete("/api/care_schedules/939")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Schedule not found");
          });
      });

      test("400: Error for invalid ID", () => {
        return request(app)
          .delete("/api/care_schedules/adf342")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid schedule ID");
          });
      });
    });
  });

  describe("PATCH /care_tasks/:care_tasks_id/complete", () => {
    test("200: Completes a care task and returns the updated task", () => {
      return request(app)
        .patch("/api/care_tasks/1/complete")
        .expect(200)
        .then(({ body }) => {
          const task = body.care_task;
          expect(task.care_tasks_id).toBe(1);
          expect(typeof task.completed_at).toBe("string");
        });
    });

    test("404: Error when care task does not exist", () => {
      return request(app)
        .patch("/api/care_tasks/999/complete")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Care task not found");
        });
    });

    test("400: Error for invalid care task ID", () => {
      return request(app)
        .patch("/api/care_tasks/adr4d4/complete")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid care task ID");
        });
    });
  });
});
