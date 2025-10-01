import * as dotenv from "dotenv";
dotenv.config();

console.log("DB config from env:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "password",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mydb",
  port: Number(process.env.DB_PORT) || 5432,
});

export default pool;
