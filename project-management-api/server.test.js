require('dotenv').config({ path: '.env.test' }); // Загружаем тестовые переменные окружения
const request = require('supertest');
const app = require('./server'); // Импортируем сам Express-приложение, а не сервер
const db = require('./db'); // Подключаем базу данных
const jwt = require('jsonwebtoken');

let adminToken, managerToken, userToken;
let createdUserId, createdProjectId, createdTaskId, createdTeamId;

// 📌 Функция для генерации тестовых JWT-токенов
const generateToken = (role) => jwt.sign({ userId: 1, email: `${role}@test.com`, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

beforeAll(async () => {
  adminToken = generateToken('admin');
  managerToken = generateToken('manager');
  userToken = generateToken('member');
});

// 📌 **Тесты для аутентификации**
describe('🛡️ Auth API', () => {
  test('✅ Должен зарегистрировать пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тестовый Пользователь', email: 'testuser@example.com', password: 'Test1234', passwordConfirmation: 'Test1234' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  test('✅ Должен войти и получить токен', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'Test1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });
});

// 📌 **Тесты для пользователей**
describe('👤 Users API', () => {
  test('✅ Должен создать нового пользователя (admin)', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test User', email: 'testadmin@example.com', password: 'Admin1234', role: 'admin' });

    expect(res.statusCode).toBe(201);
    createdUserId = res.body.id;
  });

  test('❌ Не должен создать пользователя без токена', async () => {
    const res = await request(app).post('/api/users').send({ name: 'User' });

    expect(res.statusCode).toBe(401);
  });

  test('✅ Должен получить список пользователей (admin)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('❌ Должен запретить менеджеру удалять пользователя', async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(403);
  });
});

// 📌 **Тесты для проектов**
describe('📁 Projects API', () => {
  test('✅ Должен создать проект (admin)', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Новый проект', description: 'Описание проекта', start_date: '2024-05-01' });

    expect(res.statusCode).toBe(201);
    createdProjectId = res.body.id;
  });

  test('✅ Должен получить список проектов', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('❌ Должен запретить менеджеру удалять проект', async () => {
    const res = await request(app)
      .delete(`/api/projects/${createdProjectId}`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(403);
  });
});

// 📌 **Тесты для задач**
describe('📝 Tasks API', () => {
  test('✅ Должен создать задачу (admin)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Тестовая задача', project_id: createdProjectId });

    expect(res.statusCode).toBe(201);
    createdTaskId = res.body.taskId;
  });

  test('✅ Должен получить список задач', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('❌ Не должен создавать задачу без токена', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Задача без токена' });

    expect(res.statusCode).toBe(401);
  });

  test('✅ Должен удалить задачу (admin)', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});

// 📌 **Тесты для команд**
describe('👥 Teams API', () => {
  test('✅ Должен создать команду (admin)', async () => {
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Новая команда' });

    expect(res.statusCode).toBe(201);
    createdTeamId = res.body.id;
  });

  test('✅ Должен получить список команд', async () => {
    const res = await request(app)
      .get('/api/teams')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  test('✅ Должен удалить команду (admin)', async () => {
    const res = await request(app)
      .delete(`/api/teams/${createdTeamId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});
