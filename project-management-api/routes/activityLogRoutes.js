const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLogController");
const verifyToken = require("../middleware/authMiddleware");

// Проверяем, что контроллер загружен
if (!activityLogController) {
  throw new Error("❌ Ошибка: activityLogController не загружен!");
}
if (!activityLogController.getActivityLogs) {
  throw new Error("❌ Ошибка: activityLogController.getActivityLogs не найден!");
}

// CRUD маршруты
router.get("/", verifyToken, activityLogController.getActivityLogs);
router.get("/:id", verifyToken, activityLogController.getActivityLogById);
router.post("/", verifyToken, activityLogController.createActivityLog);
router.delete("/:id", verifyToken, activityLogController.deleteActivityLog);

module.exports = router;
