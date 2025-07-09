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
            expect(typeof plant.user_id).toBe("number");
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

  describe("GET /plants:plant_id", () => {
    test("200: Responds with correct properties of plant with given id", () => {
      return request(app)
        .get("/plants/1")
        .expect(200)
        .then(({ body }) => {});
    });
  });
});
