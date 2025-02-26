USE project_management;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Users;
TRUNCATE TABLE Projects;
TRUNCATE TABLE Teams;
TRUNCATE TABLE Team_Members;
TRUNCATE TABLE Tasks;
TRUNCATE TABLE Notifications;
TRUNCATE TABLE Activity_Log;
SET FOREIGN_KEY_CHECKS = 1;

-- Заполнение пользователей (увеличено)
INSERT INTO Users (name, email, password, role) VALUES
('Иван Петров', 'ivan.petrov@example.com', 'hash1', 'admin'),
('Мария Смирнова', 'maria.smirnova@example.com', 'hash2', 'manager'),
('Алексей Сидоров', 'alexey.sidorov@example.com', 'hash3', 'member'),
('Ольга Васильева', 'olga.vasileva@example.com', 'hash4', 'member'),
('Петр Иванов', 'peter.ivanov@example.com', 'hash5', 'admin'),
('Анна Кузнецова', 'anna.kuznetsova@example.com', 'hash6', 'manager'),
('Дмитрий Петров', 'dmitriy.petrov@example.com', 'hash7', 'member'),
('Елена Васильева', 'elena.vasileva@example.com', 'hash8', 'member');

-- Заполнение проектов (увеличено)
INSERT INTO Projects (name, description, start_date, end_date, status) VALUES
('Разработка CRM', 'CRM для отдела продаж', '2024-01-10', '2024-06-20', 'active'),
('Автоматизация склада', 'ПО для склада', '2024-02-01', '2024-07-15', 'on_hold'),
('Мобильное приложение', 'Приложение для заказов', '2024-03-15', '2024-09-10', 'active'),
('Интернет-магазин', 'Онлайн-платформа', '2024-04-01', '2024-10-30', 'active'),
('Ремонт оборудования', 'Обслуживание техники', '2024-05-10', '2024-08-05', 'completed');

-- Заполнение команд (увеличено)
INSERT INTO Teams (name) VALUES
('Фронтенд-разработка'),
('Бэкенд-разработка'),
('Аналитика данных'),
('Техническая поддержка'),
('Маркетинг');

-- Заполнение участников команд (увеличено)
INSERT INTO Team_Members (team_id, user_id, role) VALUES
(1, 1, 'leader'),
(1, 3, 'member'),
(2, 2, 'leader'),
(2, 4, 'member'),
(3, 5, 'leader'),
(3, 6, 'member'),
(4, 7, 'member'),
(5, 8, 'leader');

-- Заполнение задач (увеличено)
INSERT INTO Tasks (title, description, status, priority, assigned_to, team_id, project_id, start_date, end_date) VALUES
('Разработка API', 'Создать API для авторизации', 'in_progress', 'high', 3, 2, 1, '2024-01-15', '2024-03-01'),
('Оптимизация БД', 'Улучшить индексы', 'new', 'high', 4, 2, 1, '2024-01-20', '2024-04-10'),
('Разработка UI', 'Создать дизайн для CRM', 'in_progress', 'medium', NULL, 1, 3, '2024-02-10', '2024-05-01'),
('Платежная система', 'Интеграция Stripe', 'new', 'high', 3, 1, 3, '2024-02-15', '2024-06-01'),
('Отчеты по продажам', 'Создать отчеты', 'completed', 'low', 2, 3, 1, '2024-01-25', '2024-04-15'),
('Рефакторинг кода', 'Оптимизация структуры', 'new', 'medium', 5, 1, 2, '2024-02-20', '2024-05-10'),
('Документация API', 'Создать OpenAPI спецификацию', 'new', 'low', 6, 2, 2, '2024-03-01', '2024-06-01'),
('Написание тестов', 'Юнит-тестирование', 'in_progress', 'high', 7, 2, 3, '2024-03-10', '2024-06-15'),
('Анализ данных', 'Сбор бизнес-метрик', 'new', 'medium', NULL, 3, 4, '2024-04-01', '2024-07-01'),
('Техподдержка клиентов', 'Ответы на заявки', 'in_progress', 'high', 8, 4, 5, '2024-04-10', '2024-07-20');

-- Заполнение уведомлений (увеличено)
INSERT INTO Notifications (user_id, content, type, is_read) VALUES
(1, 'Новая задача: Разработка API', 'info', FALSE),
(2, 'Завершена задача "Отчеты по продажам"', 'info', TRUE),
(3, 'Ожидает выполнения: Оптимизация БД', 'warning', FALSE),
(4, 'Вы добавлены в проект: Автоматизация склада', 'info', FALSE),
(5, 'Назначена новая задача: Рефакторинг кода', 'info', FALSE),
(6, 'Ваша задача "Документация API" начата', 'info', FALSE),
(7, 'Вы в новой команде: Аналитика', 'info', FALSE),
(8, 'Задача "Техподдержка клиентов" в работе', 'info', FALSE);

-- Заполнение лога активности (увеличено)
INSERT INTO Activity_Log (user_id, action) VALUES
(1, 'Создал проект "Разработка CRM"'),
(2, 'Добавил задачу "Платежная система"'),
(3, 'Завершил задачу "Отчеты по продажам"'),
(4, 'Присоединился к команде "Бэкенд-разработка"'),
(5, 'Создал проект "Интернет-магазин"'),
(6, 'Добавил новую задачу "Рефакторинг кода"'),
(7, 'Начал тестирование API'),
(8, 'Принял запрос в техподдержку');

