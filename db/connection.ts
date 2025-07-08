import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({ path: `${__dirname}/../.env.${ENV}` });

const config: PoolConfig = {};

console.log("DATA BASE >>", process.env.PGDATABASE);

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 10;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

export default new Pool(config);
