import db from "../db/connection";
import seed from "../db/seeds/seed";

const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe.skip("seed", () => {
  describe("users", () => {
    type ExistsRow = { exists: boolean };
    test("users table exists", async () => {
      const result = await (
        db.query as (query: string) => Promise<{ rows: ExistsRow[] }>
      )(`SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'users'
    )`);
      expect(result.rows[0].exists).toBe(true);
    });
  });
});
