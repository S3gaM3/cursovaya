const db = require("../config/db");

const User = {
  create: (user, callback) => {
    const sql = "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [user.name, user.email, user.password], callback);
  },

  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM Users WHERE email = ?";
    console.log("📡 SQL-запрос к БД:", sql, email);

    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("❌ Ошибка SQL:", err);
        return callback(err, null);
      }

      console.log("🔍 Результаты запроса:", results);
      callback(null, results.length ? results[0] : null);
    });
  },
};

module.exports = User;
