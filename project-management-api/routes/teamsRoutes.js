const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");

// Проверяем, что контроллер загружен
if (!teamsController) {
  throw new Error("❌ Ошибка: teamsController не загружен!");
}
if (!teamsController.getTeams) {
  throw new Error("❌ Ошибка: teamsController.getTeams не найден!");
}

// CRUD маршруты (убрана проверка токена для GET-запросов)
router.get("/", teamsController.getTeams);
router.get("/:id", teamsController.getTeamById);
router.post("/", teamsController.createTeam);
router.put("/:id", teamsController.updateTeam);
router.delete("/:id", teamsController.deleteTeam);

module.exports = router;
