const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Нет токена. Доступ запрещен." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Проверяем, есть ли у пользователя нужная роль
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Недостаточно прав." });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Неверный токен." });
    }
  };
};
