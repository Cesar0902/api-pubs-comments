import pool from "../config/connection.js";

export const Comentario = {
  async crear({ id, contenido, usuario_id, publicacion_id }) {
    const [result] = await pool.query(
      `INSERT INTO comentarios (id, contenido, usuario_id, publicacion_id)
      VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?), UUID_TO_BIN(?))`,
      [id, contenido, usuario_id, publicacion_id]
    );
    return result;
  },

  async listarPorPublicacion(publicacion_id) {
    const [rows] = await pool.query(
      `SELECT 
        BIN_TO_UUID(c.id) AS id,
        c.contenido,
        BIN_TO_UUID(c.usuario_id) AS usuario_id,
        u.nombre AS autor,
        c.creado_en
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.publicacion_id = UUID_TO_BIN(?)
      ORDER BY c.creado_en DESC`,
      [publicacion_id]
    );
    return rows;
  },

  async buscarAutorPorId(id) {
    const [rows] = await pool.query(
      `SELECT BIN_TO_UUID(usuario_id) AS usuario_id FROM comentarios WHERE id = UUID_TO_BIN(?)`,
      [id]
    );
    return rows[0];
  },

  async eliminar(id) {
    const [result] = await pool.query(
      `DELETE FROM comentarios WHERE id = UUID_TO_BIN(?)`,
      [id]
    );
    return result;
  },
};
