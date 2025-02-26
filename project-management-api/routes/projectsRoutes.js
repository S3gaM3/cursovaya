const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");
const verifyToken = require("../middleware/authMiddleware");

// Проверяем, что контроллер загружен
if (!projectsController) {
  throw new Error("❌ Ошибка: projectsController не загружен!");
}
if (!projectsController.updateProject) {
  throw new Error("❌ Ошибка: projectsController.updateProject не найден!");
}
// Получить статистику по задачам в проектах
router.get("/tasks/status", verifyToken, async (req, res) => {
  try {
    const [tasks] = await db.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new
      FROM Tasks
    `);
    res.json(tasks[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CRUD маршруты
router.get("/", verifyToken, projectsController.getProjects);
router.get("/:id", verifyToken, projectsController.getProjectById);
router.post("/", verifyToken, projectsController.createProject);
router.put("/:id", verifyToken, projectsController.updateProject);
router.delete("/:id", verifyToken, projectsController.deleteProject);

module.exports = router;
