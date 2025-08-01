export class AuthModel {
  constructor ({ db }) {
    this.db = db;
  }

  loginUser = async (user) => {
    // obtener el registro del usuario
    const [results] = await this.db.query(
      `SELECT BIN_TO_UUID(id) as id, name, email, phone, password_hash, must_change_password, created_at
        FROM pubs_comments.users WHERE email = ?`,
      [user]
    );

    return results[0];
  };

  register = async (user) => {
    const query = `INSERT INTO pubs_comments.users
                    (id, name, email, phone, password_hash, must_change_password, created_at)
                    VALUES(UUID_TO_BIN(?), ?, ?, ?, ?, 0, CURRENT_TIMESTAMP);`;

    const [rows] = await this.db.query(query, [...user]);

    return rows;
  };

  updatePassword = async (id, passwordHash) => {
    const query = `UPDATE users SET password_hash = ?,
              must_change_password = 0 WHERE id = UUID_TO_BIN(?)`;

    const [rows] = await this.db.query(query, [passwordHash, id]);

    return rows;
  };
}
