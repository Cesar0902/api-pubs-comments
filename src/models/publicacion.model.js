import pool from "../config/connection.js";

export const Publicacion = {
  async contar() {
    const result = await pool.query(
      "SELECT COUNT(*) AS total FROM publicaciones"
    );
    const rows = Array.isArray(result) ? result[0] : result;

    if (!Array.isArray(rows) || rows.length === 0) return 0;

    return rows[0] || 0;
  },
  async listar({ limit = 10, offset = 0 }) {
    const [rows] = await pool.query(
      `SELECT 
        BIN_TO_UUID(p.id) AS id,
        p.titulo,
        p.contenido,
        BIN_TO_UUID(p.usuario_id) AS usuario_id,
        u.nombre AS autor,
        p.creado_en,
        p.actualizado_en
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.creado_en DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT 
        BIN_TO_UUID(p.id) AS id,
        p.titulo,
        p.contenido,
        BIN_TO_UUID(p.usuario_id) AS usuario_id,
        u.nombre AS autor,
        p.creado_en,
        p.actualizado_en
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = UUID_TO_BIN(?)`,
      [id]
    );
    return rows[0];
  },

  async crear({ id, titulo, contenido, usuario_id }) {
    const [result] = await pool.query(
      `INSERT INTO publicaciones (id, titulo, contenido, usuario_id) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?))`,
      [id, titulo, contenido, usuario_id]
    );
    return result;
  },

  async actualizar(id, { titulo, contenido }) {
    const updates = [];
    const params = [];

    if (titulo !== undefined) {
      updates.push("titulo = ?");
      params.push(titulo);
    }
    if (contenido !== undefined) {
      updates.push("contenido = ?");
      params.push(contenido);
    }

    if (updates.length === 0) return null;

    params.push(id);

    const [result] = await pool.query(
      `UPDATE publicaciones SET ${updates.join(
        ", "
      )}, actualizado_en = CURRENT_TIMESTAMP WHERE id = UUID_TO_BIN(?)`,
      params
    );
    return result;
  },

  async eliminar(id) {
    const [result] = await pool.query(
      `DELETE FROM publicaciones WHERE id = UUID_TO_BIN(?)`,
      [id]
    );
    return result;
  },

  async buscarAutorPorId(id) {
    const [rows] = await pool.query(
      `SELECT BIN_TO_UUID(usuario_id) AS usuario_id FROM publicaciones WHERE id = UUID_TO_BIN(?)`,
      [id]
    );
    return rows[0];
  },
};
