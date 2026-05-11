const bcrypt = require("bcryptjs");
const { getPostgres } = require("../config/db");

class User {
  static async create({ phone, name, password, role = "farmer" }) {
    const db = await getPostgres();
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (phone, name, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, phone, name, role, created_at`,
      [phone, name, hash, role]
    );
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const db = await getPostgres();
    const result = await db.query(
      `SELECT id, phone, name, password_hash, role, created_at
       FROM users WHERE phone = $1`,
      [phone]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const db = await getPostgres();
    const result = await db.query(
      `SELECT id, phone, name, role, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User;
