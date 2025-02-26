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
  if (!email || !password) return res.status(400).json({ message: "Введите email и пароль" });

  try {
    const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (!users.length) return res.status(404).json({ message: "Пользователь не найден" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Неверные учетные данные" });

    const token = generateToken(user);
    res.status(200).json({ message: "Вход выполнен", token });
  } catch (err) {
    res.status(500).json({ message: "Ошибка базы данных", error: err.message });
  }
};

// Выход
exports.logout = (req, res) => {
  res.status(200).json({ message: "Выход выполнен" });
};
