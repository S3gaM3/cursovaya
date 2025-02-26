const db = require("../config/db");

// Получить все команды
exports.getTeams = async (req, res) => {
  try {
    const [teams] = await db.query("SELECT * FROM Teams ORDER BY created_at DESC");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Получить команду по ID
exports.getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const [team] = await db.query("SELECT * FROM Teams WHERE id = ?", [id]);
    if (!team.length) return res.status(404).json({ error: "Команда не найдена" });
    res.json(team[0]);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Создать команду
exports.createTeam = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Название команды обязательно" });

  try {
    await db.query("INSERT INTO Teams (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Команда создана" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Обновить команду
exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Название команды обязательно" });

  try {
    await db.query("UPDATE Teams SET name=? WHERE id=?", [name, id]);
    res.json({ message: "Команда обновлена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Удалить команду
exports.deleteTeam = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM Teams WHERE id=?", [id]);
    res.json({ message: "Команда удалена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
