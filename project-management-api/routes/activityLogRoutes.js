const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLogController");

// Проверяем, что контроллер загружен
if (!activityLogController) {
  throw new Error("❌ Ошибка: activityLogController не загружен!");
}
if (!activityLogController.getActivityLogs) {
  throw new Error("❌ Ошибка: activityLogController.getActivityLogs не найден!");
}

// CRUD маршруты (убрана проверка токена для GET-запросов)
router.get("/", activityLogController.getActivityLogs);
router.get("/:id", activityLogController.getActivityLogById);
router.post("/", activityLogController.createActivityLog);
router.delete("/:id", activityLogController.deleteActivityLog);

module.exports = router;
