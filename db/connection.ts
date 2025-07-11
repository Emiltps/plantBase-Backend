import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";
import path from "path";

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

const config: PoolConfig = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 10;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

if (ENV === "production") {
  console.log(`Connected to production DB via ${process.env.DATABASE_URL}`);
} else {
  console.log(`Connected to local DB ${process.env.PGDATABASE}`);
}
export default new Pool(config);
