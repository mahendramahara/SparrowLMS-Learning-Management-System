const request = require('supertest');
const app = require('../app');

describe('Auth Module', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail to register with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login Test User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
    });

    it('should fail without email or password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const token = 'valid_token_here';

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update user profile', async () => {
      const token = 'valid_token_here';
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/demo-login', () => {
    it('should login as demo student', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .send({ role: 'student' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('student');
      expect(res.body.user.isDemo).toBe(true);
      expect(res.body).toHaveProperty('token');
    });

    it('should login as demo instructor', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .send({ role: 'instructor' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('instructor');
    });

    it('should login as demo admin', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .send({ role: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('admin');
    });

    it('should fail with invalid demo role', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .send({ role: 'unknown_role' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/send-otp', () => {
    it('should send verification OTP', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ email: 'newapplicant@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail without email', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
