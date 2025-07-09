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
  describe("GET /plants", () => {
    test("200: Responds with an array of plants with correct properties", () => {
      return request(app)
        .get("/plants")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.plants)).toBe(true);
          expect(body.plants.length).not.toBe(0);
          body.topics.forEach((plant: any) => {
            expect(typeof plant.plant_id).toBe("number");
            expect(typeof plant.id).toBe("number");
            expect(typeof plant.plant_type_id).toBe("number");
            expect(typeof plant.nickname).toBe("string");
            expect(typeof plant.photo_url).toBe("string");
            expect(typeof plant.profile_description).toBe("string");
            expect(typeof plant.notes).toBe("string");
            expect(["alive", "dead", "infected"]).toContain(plant.plantstatus);
            expect(
              typeof plant.created_at === "string" || plant.created_at === null
            ).toBe(true);
          });
        });
    });
  });

  describe("GET /plants/:plant_id", () => {
    test("200: Responds with correct properties of plant with given id", () => {
      return request(app)
        .get("/plants/1")
        .expect(200)
        .then(({ body }) => {
          const plant = body.plant;
          expect(typeof body).toBe("object");
          expect(plant.plant_id).toBe(1);
          expect(typeof plant.id).toBe("number");
          expect(typeof plant.plant_type_id).toBe("number");
          expect(typeof plant.nickname).toBe("string");
          expect(typeof plant.photo_url).toBe("string");
          expect(typeof plant.profile_description).toBe("string");
          expect(typeof plant.notes).toBe("string");
          expect(["alive", "dead", "infected"]).toContain(plant.plantstatus);
          expect(
            typeof plant.created_at === "string" || plant.created_at === null
          ).toBe(true);
        });
    });
    test("404: Responds with error message if plant doesn't exist", () => {
      return request(app)
        .get("/plants/800")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Plant not found");
        });
    });
  });
  describe("GET /plants/:plant_id/care_schedules/next_due", () => {
    test("200: Responds with next due task with given id", () => {
      return request(app)
        .get("/plants/1/care_schedules/next_due")
        .expect(200)
        .then(({ body }) => {
          const task = body.care_task;
          expect(typeof task.care_tasks_id).toBe("number");
          expect(typeof task.schedule_id).toBe("number");
          expect(typeof task.due_at).toBe("string");
          expect(
            task.completed_at === null || typeof task.completed_at === "string"
          ).toBe(true);
          expect(typeof task.created_at).toBe("string");
        });
    });
    test("404: Responds with message when no due tasks remain", () => {
      return request(app)
        .get("/plants/100/care_schedules/next_due")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No upcoming tasks");
        });
    });
  });
  describe("POST /plants/", () => {
    test("201: Responds with posted plant and adds it to the database", () => {
      const newPlant = {
        id: 1,
        plant_type_id: 2,
        nickname: "Fernie",
        photo_url: "",
        profile_description: "A small green fern.",
        notes: "Needs watering every few days.",
        plantstatus: "alive",
      };
      return request(app)
        .post("/plants")
        .send(newPlant)
        .expect(201)
        .then(({ body }) => {
          const plant = body.plant;
          expect(plant).toEqual(newPlant);
          expect(typeof plant).toBe("object");
          expect(typeof plant.plant_id).toBe("number");
          expect(plant.id).toBe(1);
          expect(plant.plant_type_id).toBe(2);
          expect(plant.nickname).toBe("Fernie");
          expect(plant.photo_url).toBe("");
          expect(plant.profile_description).toBe("A small green fern.");
          expect(plant.notes).toBe("Needs watering every few days.");
          expect(plant.plantstatus).toBe("alive");
          expect(typeof plant.created_at).toBe("string");
        });
    });
    test("400: Responds with error if required input missing fields", () => {
      const badInput = { nickname: "one field" };
      return request(app)
        .post("/plants")
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
        plantstatus: "alive",
      };
      return request(app)
        .patch("/plants/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const plant = body.plant;

          expect(plant.plant_id).toBe(1);
          expect(plant.nickname).toBe("Leafy");
          expect(plant.notes).toBe("Moved to a sunnier location");
          expect(plant.plantstatus).toBe("alive");
        });
    });
    test("404: Responds with error if plant_id does not exist", () => {
      const update = {
        nickname: "Leafy",
        notes: "Moved to a sunnier location",
        plantstatus: "alive",
      };
      return request(app)
        .patch("/plants/999")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Plant not found");
        });
    });
    test("400: Responds with error if input is invalid", () => {
      const update = {
        plantstatus: "not valid status",
      };
      request(app)
        .patch("/plants/1999")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid plant status");
        });
    });
  });
});
