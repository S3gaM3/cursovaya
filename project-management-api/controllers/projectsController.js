const db = require("../config/db");

// Получить все проекты
exports.getProjects = async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM Projects ORDER BY created_at DESC");

    // Проверяем, что API всегда возвращает массив
    if (!Array.isArray(projects)) {
      return res.status(500).json({ error: "Некорректные данные" });
    }

    res.json(projects);
  } catch (err) {
    console.error("Ошибка при загрузке проектов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
