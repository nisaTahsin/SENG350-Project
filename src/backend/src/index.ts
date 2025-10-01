// src/index.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

// Log environment variables (for testing only)
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ DB connected successfully');
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
}

testConnection();
