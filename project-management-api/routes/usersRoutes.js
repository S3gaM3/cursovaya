const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyToken = require("../middleware/authMiddleware");

// Проверяем, что контроллер загружен
if (!usersController) {
  throw new Error("❌ Ошибка: usersController не загружен!");
}
if (!usersController.createUser) {
  throw new Error("❌ Ошибка: usersController.createUser не найден!");
}

// CRUD маршруты
router.get("/", verifyToken, usersController.getUsers);
router.get("/:id", verifyToken, usersController.getUserById);
router.post("/", verifyToken, usersController.createUser);
router.put("/:id", verifyToken, usersController.updateUser);
router.delete("/:id", verifyToken, usersController.deleteUser);

module.exports = router;
