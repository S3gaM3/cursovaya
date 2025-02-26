const express = require("express");
const mysql = require("mysql2/promise"); // Используем pool для лучшей производительности
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Подключение к MySQL (через pool)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Проверка подключения к БД
(async () => {
  try {
    await db.getConnection();
    console.log("✅ Подключено к MySQL");

    // Удаляем все сессии при запуске сервера
    await db.query("DELETE FROM sessions");
    console.log("🗑️ Все сессии удалены при запуске сервера");
  } catch (err) {
    console.error("❌ Ошибка подключения к MySQL:", err);
    process.exit(1);
  }
})();
console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Подключение маршрутов
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const teamsRoutes = require("./routes/teamsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/activity-log", activityLogRoutes);

// Раздача статических файлов из `public`
app.use(express.static(path.join(__dirname, "public")));

// Проверка работы сервера
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));


module.exports = app;
