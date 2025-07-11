import db from "../db/connection";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data/index";

const data = testData as any;

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("seed", () => {
  describe("profiles", () => {
    type ExistsRow = { exists: boolean };
    test("profiles table exists", async () => {
      const result = await (
        db.query as (query: string) => Promise<{ rows: ExistsRow[] }>
      )(`SELECT EXISTS (
           SELECT FROM information_schema.tables 
           WHERE table_name = 'profiles'
         );`);
      expect(result.rows[0].exists).toBe(true);
    });
  });
});
