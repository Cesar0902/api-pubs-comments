export class AuthModel {
  constructor({ db }) {
    this.db = db;
  }

  loginUser = async (user) => {
    // obtener el registro del usuario
    const [results] = await this.db.query(
      `SELECT BIN_TO_UUID(id) as id, name, email,phone,must_change_password,password_hash,role,created_at  FROM users WHERE email = ?  `,
      [user]
    );

    return results[0];
  };

  register = async (user) => {
    const query = `INSERT INTO users (id, name, email, phone, password_hash, must_change_password, role) 
                      VALUES ( UUID_TO_BIN(?), ?, ?, ?, ?, 1, ?)`;

    const [rows] = await this.db.query(query, [...user]);

    return rows;
  };

  updatePassword = async (id, password_hash) => {
    const query = `UPDATE users SET password_hash = ?,
              must_change_password = 0 WHERE id = UUID_TO_BIN(?)`;

    const [rows] = await this.db.query(query, [password_hash, id]);

    return rows;
  };
}
