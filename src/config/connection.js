import mysql from "mysql2/promise";

export async function createDbConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT), // ← importante, sigue leyendo
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}
