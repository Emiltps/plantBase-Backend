import request from "supertest";
import app from "../app";

describe("Documentation and static file routes", () => {
  test("GET / should serve the public index.html", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/<title>PlantBase API<\/title>/);
  });

  test("GET /api should also serve the public index.html", async () => {
    const res = await request(app).get("/api/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/<title>PlantBase API<\/title>/);
  });

  test("GET /api/json should return the endpoints JSON", async () => {
    const res = await request(app)
      .get("/api/json")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("GET /api");
    expect(typeof res.body["GET /api"].description).toBe("string");
    expect(res.body).toHaveProperty("POST /api/plants");
  });
});
