const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

// Регистрация
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Заполните все поля" });

  try {
    const [existingUser] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length) return res.status(400).json({ message: "Email уже зарегистрирован" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO Users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Регистрация успешна" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};

// Вход
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (!users.length) return res.status(401).json({ message: "Неверные учетные данные" });

    const user = users[0];

    // Проверяем наличие JWT_SECRET перед генерацией токена
    if (!process.env.JWT_SECRET) {
      console.error("❌ Ошибка: JWT_SECRET не установлен в .env");
      return res.status(500).json({ message: "Ошибка сервера: отсутствует JWT_SECRET" });
    }

    // Генерируем токен
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET, // ✅ Теперь секретный ключ передается корректно
      { expiresIn: "24h" }
    );

    res.json({ message: "Успешный вход", token });
  } catch (err) {
    console.error("Ошибка авторизации:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Выход
exports.logout = (req, res) => {
  res.status(200).json({ message: "Выход выполнен" });
};
