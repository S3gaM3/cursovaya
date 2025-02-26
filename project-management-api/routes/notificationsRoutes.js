const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notificationsController");
const db = require("../config/db");

// Проверяем, что контроллер загружен
if (!notificationsController) {
  throw new Error("❌ Ошибка: notificationsController не загружен!");
}
if (!notificationsController.getNotificationById) {
  throw new Error("❌ Ошибка: notificationsController.getNotificationById не найден!");
}

// ✅ Получить последние 10 уведомлений
router.get("/", notificationsController.getNotifications);

// ✅ Получить уведомление по ID
router.get("/:id", notificationsController.getNotificationById);

// ✅ Создать новое уведомление
router.post("/", notificationsController.createNotification);

// ✅ Обновить уведомление
router.put("/:id", notificationsController.updateNotification);

// ✅ Удалить уведомление
router.delete("/:id", notificationsController.deleteNotification);

module.exports = router;
