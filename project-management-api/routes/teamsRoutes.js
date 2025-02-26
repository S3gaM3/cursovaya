const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");
const verifyToken = require("../middleware/authMiddleware");

// Проверяем, что контроллер загружен
if (!teamsController) {
  throw new Error("❌ Ошибка: teamsController не загружен!");
}
if (!teamsController.getTeams) {
  throw new Error("❌ Ошибка: teamsController.getTeams не найден!");
}

// CRUD маршруты
router.get("/", verifyToken, teamsController.getTeams);
router.get("/:id", verifyToken, teamsController.getTeamById);
router.post("/", verifyToken, teamsController.createTeam);
router.put("/:id", verifyToken, teamsController.updateTeam);
router.delete("/:id", verifyToken, teamsController.deleteTeam);

module.exports = router;
