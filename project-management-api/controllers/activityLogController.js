const db = require("../config/db");

// Получить все логи активности
exports.getActivityLogs = async (req, res) => {
  try {
    const [logs] = await db.query("SELECT * FROM Activity_Log ORDER BY timestamp DESC LIMIT 20");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Получить лог по ID
exports.getActivityLogById = async (req, res) => {
  const { id } = req.params;
  try {
    const [log] = await db.query("SELECT * FROM Activity_Log WHERE id = ?", [id]);
    if (!log.length) return res.status(404).json({ error: "Лог не найден" });
    res.json(log[0]);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Создать лог активности
exports.createActivityLog = async (req, res) => {
  const { user_id, action } = req.body;
  if (!user_id || !action) return res.status(400).json({ error: "Необходимо указать user_id и action" });

  try {
    await db.query("INSERT INTO Activity_Log (user_id, action) VALUES (?, ?)", [user_id, action]);
    res.status(201).json({ message: "Лог создан" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Удалить лог активности
exports.deleteActivityLog = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM Activity_Log WHERE id=?", [id]);
    res.json({ message: "Лог удален" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
