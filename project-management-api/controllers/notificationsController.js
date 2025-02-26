const db = require("../config/db");

// Получить все уведомления
exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query(
      "SELECT * FROM Notifications ORDER BY created_at DESC LIMIT 10"
    );
    res.json(notifications);
  } catch (err) {
    console.error("❌ Ошибка загрузки уведомлений:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Получить уведомление по ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [notification] = await db.query(
      "SELECT * FROM Notifications WHERE id = ?",
      [id]
    );

    if (notification.length === 0) {
      return res.status(404).json({ error: "Уведомление не найдено" });
    }

    res.json(notification[0]);
  } catch (err) {
    console.error("❌ Ошибка загрузки уведомления:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Создать уведомление
exports.createNotification = async (req, res) => {
  try {
    const { user_id, content, type } = req.body;

    const [result] = await db.query(
      "INSERT INTO Notifications (user_id, content, type) VALUES (?, ?, ?)",
      [user_id, content, type]
    );

    res.status(201).json({ message: "Уведомление создано", id: result.insertId });
  } catch (err) {
    console.error("❌ Ошибка создания уведомления:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Обновить уведомление
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type, is_read } = req.body;

    const [result] = await db.query(
      "UPDATE Notifications SET content = ?, type = ?, is_read = ? WHERE id = ?",
      [content, type, is_read, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Уведомление не найдено" });
    }

    res.json({ message: "Уведомление обновлено" });
  } catch (err) {
    console.error("❌ Ошибка обновления уведомления:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Удалить уведомление
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Notifications WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Уведомление не найдено" });
    }

    res.json({ message: "Уведомление удалено" });
  } catch (err) {
    console.error("❌ Ошибка удаления уведомления:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};