const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const verifyToken = require("../middleware/authMiddleware");

// Проверяем, что контроллер загружен
if (!tasksController) {
  throw new Error("❌ Ошибка: tasksController не загружен!");
}

// CRUD маршруты
router.get("/", verifyToken, tasksController.getTasks);
router.get("/:id", verifyToken, tasksController.getTaskById);
router.post("/", verifyToken, tasksController.createTask);
router.put("/:id", verifyToken, tasksController.updateTask);
router.delete("/:id", verifyToken, tasksController.deleteTask);

module.exports = router;
