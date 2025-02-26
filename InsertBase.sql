USE project_management;

-- Очистка таблиц перед вставкой данных (если нужно)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Users;
TRUNCATE TABLE Projects;
TRUNCATE TABLE Teams;
TRUNCATE TABLE Team_Members;
TRUNCATE TABLE Tasks;
TRUNCATE TABLE Notifications;
TRUNCATE TABLE Activity_Log;
SET FOREIGN_KEY_CHECKS = 1;

-- Заполнение пользователей
INSERT INTO Users (name, email, password, role) VALUES
('Иван Петров', 'ivan.petrov@example.com', '$2a$10$e5N3M/3WZT/zH4XUE4wQoObURQ3QoIDhVf4X80k', 'admin'),
('Мария Смирнова', 'maria.smirnova@example.com', '$2a$10$TGv5bcYYJckIHFuMQS1zKOfgxuH/ae1r.YmZ5kJ', 'manager'),
('Алексей Сидоров', 'alexey.sidorov@example.com', '$2a$10$yT29TxvsoqV2fxDiz2Wwe6hF1J/RO8XPphw', 'member'),
('Ольга Васильева', 'olga.vasileva@example.com', '$2a$10$T3oUqGFTJ', 'member');

-- Заполнение проектов
INSERT INTO Projects (name, description, start_date, end_date, status) VALUES
('Разработка CRM', 'Создание системы управления клиентами для отдела продаж', '2024-01-10', '2024-06-20', 'active'),
('Автоматизация склада', 'Разработка ПО для автоматизации учета на складе', '2024-02-01', '2024-07-15', 'on_hold'),
('Мобильное приложение', 'Разработка мобильного приложения для заказов доставки', '2024-03-15', '2024-09-10', 'active');

-- Заполнение команд
INSERT INTO Teams (name) VALUES
('Разработка фронтенда'),
('Бэкенд-разработка'),
('Аналитика данных');

-- Заполнение участников команд
INSERT INTO Team_Members (team_id, user_id, role) VALUES
(1, 1, 'leader'),
(1, 3, 'member'),
(2, 2, 'leader'),
(2, 4, 'member'),
(3, 1, 'member'),
(3, 2, 'member');

-- Заполнение задач
INSERT INTO Tasks (title, description, status, priority, assigned_to, team_id, project_id, start_date, end_date) VALUES
('Разработка API авторизации', 'Создать REST API для регистрации и входа пользователей', 'in_progress', 'high', 3, 2, 1, '2024-01-15', '2024-03-01'),
('Разработка базы данных', 'Спроектировать и развернуть БД MySQL', 'new', 'high', 4, 2, 1, '2024-01-20', '2024-04-10'),
('Дизайн мобильного интерфейса', 'Разработать UI/UX для мобильного приложения', 'in_progress', 'medium', NULL, 1, 3, '2024-02-10', '2024-05-01'),
('Подключение системы платежей', 'Интегрировать Stripe в мобильное приложение', 'new', 'high', 3, 1, 3, '2024-02-15', '2024-06-01'),
('Создание отчетов по продажам', 'Разработать модуль отчетности для CRM', 'completed', 'low', 2, 3, 1, '2024-01-25', '2024-04-15');

-- Заполнение уведомлений
INSERT INTO Notifications (user_id, content, type, is_read) VALUES
(1, 'Вам назначена новая задача: Разработка API авторизации', 'info', FALSE),
(2, 'Ваша задача "Создание отчетов по продажам" завершена!', 'info', TRUE),
(3, 'Задача "Разработка базы данных" ожидает выполнения', 'warning', FALSE),
(4, 'Вы назначены на новый проект: Автоматизация склада', 'info', FALSE);

-- Заполнение лога активности
INSERT INTO Activity_Log (user_id, action) VALUES
(1, 'Создал новый проект "Разработка CRM"'),
(2, 'Добавил новую задачу "Подключение системы платежей"'),
(3, 'Завершил задачу "Создание отчетов по продажам"'),
(4, 'Присоединился к команде "Бэкенд-разработка"');

