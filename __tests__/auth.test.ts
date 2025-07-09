import request from "supertest";
import app from "../app";
import { supabase } from "../lib/supabaseClient";

describe("Auth Endpoints", () => {
  const testEmail = `test+${Date.now()}@example.com`;
  const testPassword = "password123";
  let createdUserId: string;

  afterAll(async () => {
    if (createdUserId) {
      await supabase.auth.admin.deleteUser(createdUserId);
    }
  });

  it("POST /auth/signup → creates a new user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ email: testEmail, password: testPassword })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user.id");
    expect(res.body.user.email).toBe(testEmail);

    createdUserId = res.body.user.id;
  });
});
