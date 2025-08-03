import pool from "../config/connection.js";

export const Usuario = {
  async crear({ id, nombre, email, contraseña_hash }) {
    const insertQuery = `
      INSERT INTO usuarios (id, nombre, email, contraseña_hash)
      VALUES (UUID_TO_BIN(?), ?, ?, ?)
    `;
    await pool.query(insertQuery, [id, nombre, email, contraseña_hash]);

    const selectQuery = `
      SELECT BIN_TO_UUID(id) AS id, nombre, email, creado_en
      FROM usuarios
      WHERE email = ?
    `;
    const [rows] = await pool.query(selectQuery, [email]);
    return rows[0];
  },

  async buscarPorEmail(email) {
    const [rows] = await pool.query(
      `
      SELECT BIN_TO_UUID(id) AS id, nombre, email, contraseña_hash
      FROM usuarios
      WHERE email = ?
    `,
      [email]
    );
    return rows[0];
  },

  async buscarPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT BIN_TO_UUID(id) AS id, nombre, email
      FROM usuarios
      WHERE id = UUID_TO_BIN(?)
    `,
      [id]
    );
    return rows[0];
  },
};
