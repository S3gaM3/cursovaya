-- Создание базы данных
CREATE DATABASE IF NOT EXISTS project_management;
USE project_management;

-- Таблица: Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'member') DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON Users(email);

-- Таблица: Projects
CREATE TABLE IF NOT EXISTS Projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('active', 'completed', 'on_hold') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_status ON Projects(status);

-- Таблица: Teams
CREATE TABLE IF NOT EXISTS Teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица: Team_Members
CREATE TABLE IF NOT EXISTS Team_Members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('leader', 'member') DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES Teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id) -- Запрещает дублирование пользователей в одной команде
);

-- Таблица: Tasks
CREATE TABLE IF NOT EXISTS Tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('new', 'in_progress', 'completed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    assigned_to INT DEFAULT NULL, 
    team_id INT DEFAULT NULL,
    project_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES Teams(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
    UNIQUE(title, project_id) -- Запрещает одинаковые названия задач в одном проекте
);

CREATE INDEX idx_tasks_status ON Tasks(status);
CREATE INDEX idx_tasks_priority ON Tasks(priority);

-- Таблица: Notifications
CREATE TABLE IF NOT EXISTS Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('info', 'warning', 'error') NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Таблица: Activity_Log
CREATE TABLE IF NOT EXISTS Activity_Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activity_user ON Activity_Log(user_id);

-- Таблица сессий
CREATE TABLE IF NOT EXISTS Sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Хранимая процедура для отчета по проекту
DELIMITER //
CREATE PROCEDURE GenerateProjectReport (IN p_project_id INT)
BEGIN
    SELECT 
        p.name AS project_name,
        p.description AS project_description,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
        COUNT(tm.id) AS total_team_members
    FROM Projects p
    LEFT JOIN Tasks t ON p.id = t.project_id
    LEFT JOIN Team_Members tm ON tm.team_id IN (SELECT id FROM Teams WHERE project_id = p.id)
    WHERE p.id = p_project_id
    GROUP BY p.id;
END //
DELIMITER ;

-- Триггеры для контроля уникальности данных
DELIMITER //

CREATE TRIGGER check_unique_email_before_insert
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE email = NEW.email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email уже существует!';
    END IF;
END //

CREATE TRIGGER check_unique_email_before_update
BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE email = NEW.email AND id != OLD.id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email уже существует!';
    END IF;
END //

CREATE TRIGGER check_unique_project_name_before_insert
BEFORE INSERT ON Projects
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Projects WHERE name = NEW.name) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Проект с таким именем уже существует!';
    END IF;
END //

CREATE TRIGGER check_unique_project_name_before_update
BEFORE UPDATE ON Projects
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Projects WHERE name = NEW.name AND id != OLD.id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Проект с таким именем уже существует!';
    END IF;
END //

CREATE TRIGGER check_unique_team_name_before_insert
BEFORE INSERT ON Teams
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Teams WHERE name = NEW.name) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Команда с таким именем уже существует!';
    END IF;
END //

CREATE TRIGGER check_unique_team_name_before_update
BEFORE UPDATE ON Teams
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Teams WHERE name = NEW.name AND id != OLD.id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Команда с таким именем уже существует!';
    END IF;
END //

CREATE TRIGGER check_unique_task_title_before_insert
BEFORE INSERT ON Tasks
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Tasks WHERE title = NEW.title AND project_id = NEW.project_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Задача с таким названием уже существует в этом проекте!';
    END IF;
END //

CREATE TRIGGER check_unique_task_title_before_update
BEFORE UPDATE ON Tasks
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Tasks WHERE title = NEW.title AND project_id = NEW.project_id AND id != OLD.id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Задача с таким названием уже существует в этом проекте!';
    END IF;
END //

DELIMITER ;
