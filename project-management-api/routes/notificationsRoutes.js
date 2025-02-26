const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Получить последние 10 уведомлений
router.get("/", async (req, res) => {
  try {
    const [notifications] = await db.query("SELECT * FROM Notifications ORDER BY created_at DESC LIMIT 10");
    res.json(notifications);
  } catch (err) {
    console.error("❌ Ошибка загрузки уведомлений:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
