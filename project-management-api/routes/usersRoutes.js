const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Проверяем, что контроллер загружен
if (!usersController) {
  throw new Error("❌ Ошибка: usersController не загружен!");
}
if (!usersController.createUser) {
  throw new Error("❌ Ошибка: usersController.createUser не найден!");
}

// CRUD маршруты (убрана проверка токена для GET-запросов)
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
