const request = require('supertest');
const app = require('../src/app');
const User = require('../src/modules/user/user.model');

vi.mock('../user.model');

describe('User Module', () => {
  let authToken;
  let adminToken;

  beforeEach(() => {
    vi.clearAllMocks();
    authToken = 'Bearer valid_token_123';
    adminToken = 'Bearer admin_token_456';
  });

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com', role: 'student' },
        { _id: '2', name: 'User 2', email: 'user2@example.com', role: 'instructor' },
      ];

      User.find.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', authToken);

      expect(response.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const mockUser = {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
      };

      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
    });

    it('should return 404 for non-existent user', async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/999')
        .set('Authorization', authToken);

      expect(response.status).toBe(404);
    });
  });
});
