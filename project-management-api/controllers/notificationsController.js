const db = require("../config/db");

// Получить все уведомления
exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query("SELECT * FROM Notifications ORDER BY created_at DESC LIMIT 10");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
