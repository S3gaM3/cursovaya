const db = require("../config/db");

// Получить всех пользователей (без пароля)
exports.getUsers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, name, email, role FROM Users ORDER BY id DESC");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};

// Получить пользователя по ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query("SELECT id, name, email, role FROM Users WHERE id = ?", [id]);
    if (!user.length) return res.status(404).json({ message: "Пользователь не найден" });

    res.status(200).json(user[0]);
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};

// Создать пользователя
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Заполните все поля" });

  try {
    const [existingUser] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length) return res.status(400).json({ message: "Email уже зарегистрирован" });

    await db.query("INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name, email, password, role || "member",
    ]);

    res.status(201).json({ message: "Пользователь создан" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};

// Обновить пользователя
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    await db.query("UPDATE Users SET name=?, email=?, role=? WHERE id=?", [name, email, role, id]);
    res.json({ message: "Пользователь обновлен" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};

// Удалить пользователя
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM Users WHERE id=?", [id]);
    res.json({ message: "Пользователь удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};
