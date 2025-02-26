const db = require("../config/db");

// Обновить проект
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, start_date, end_date, status } = req.body;

  if (!name) return res.status(400).json({ error: "Название проекта обязательно" });

  try {
    await db.query(
      "UPDATE Projects SET name=?, description=?, start_date=?, end_date=?, status=? WHERE id=?",
      [name, description, start_date, end_date, status, id]
    );
    res.json({ message: "Проект обновлен" });
  } catch (err) {
    console.error("Ошибка обновления проекта:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Убедимся, что все функции экспортируются корректно
exports.getProjects = async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM Projects ORDER BY created_at DESC");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [project] = await db.query("SELECT * FROM Projects WHERE id = ?", [id]);
    if (!project.length) return res.status(404).json({ error: "Проект не найден" });
    res.json(project[0]);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.createProject = async (req, res) => {
  const { name, description, start_date, end_date, status } = req.body;
  if (!name) return res.status(400).json({ error: "Название проекта обязательно" });

  try {
    await db.query(
      "INSERT INTO Projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)",
      [name, description, start_date, end_date, status || "active"]
    );
    res.status(201).json({ message: "Проект создан" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM Projects WHERE id=?", [id]);
    res.json({ message: "Проект удален" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
