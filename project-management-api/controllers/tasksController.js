const db = require("../config/db");

// Получить список всех задач
exports.getTasks = async (req, res) => {
  try {
    const [tasks] = await db.query("SELECT * FROM Tasks ORDER BY created_at DESC");
    res.json(tasks);
  } catch (err) {
    console.error("❌ Ошибка загрузки задач:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Получить задачу по ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const [task] = await db.query("SELECT * FROM Tasks WHERE id = ?", [id]);
    if (!task.length) return res.status(404).json({ error: "Задача не найдена" });
    res.json(task[0]);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Создать новую задачу
exports.createTask = async (req, res) => {
  const { title, description, status, priority, assigned_to, team_id, project_id, start_date, end_date } = req.body;
  
  if (!title || !project_id) {
    return res.status(400).json({ error: "Необходимо указать название задачи и ID проекта" });
  }

  try {
    await db.query(
      "INSERT INTO Tasks (title, description, status, priority, assigned_to, team_id, project_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, status || "new", priority || "medium", assigned_to, team_id, project_id, start_date, end_date]
    );
    res.status(201).json({ message: "Задача успешно создана" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Обновить задачу
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assigned_to, team_id, start_date, end_date } = req.body;

  try {
    await db.query(
      "UPDATE Tasks SET title=?, description=?, status=?, priority=?, assigned_to=?, team_id=?, start_date=?, end_date=? WHERE id=?",
      [title, description, status, priority, assigned_to, team_id, start_date, end_date, id]
    );
    res.json({ message: "Задача обновлена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Удалить задачу
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM Tasks WHERE id=?", [id]);
    res.json({ message: "Задача удалена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
