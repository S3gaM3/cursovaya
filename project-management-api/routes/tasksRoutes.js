const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

// Проверяем, что контроллер загружен
if (!tasksController) {
  throw new Error("❌ Ошибка: tasksController не загружен!");
}
if (!tasksController.getTasks) {
  throw new Error("❌ Ошибка: tasksController.getTasks не найден!");
}

// CRUD маршруты (убрана проверка токена для GET-запросов)
router.get("/", tasksController.getTasks);
router.get("/:id", tasksController.getTaskById);
router.post("/", tasksController.createTask);
router.put("/:id", tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
