const request = require('supertest');
const app = require('../src/app');
const User = require('../src/modules/user/user.model');
const Course = require('../src/modules/course/course.model');

vi.mock('../../user/user.model');
vi.mock('../../course/course.model');

describe('Admin Module', () => {
  let adminToken;

  beforeEach(() => {
    vi.clearAllMocks();
    adminToken = 'Bearer admin_token_123';
  });

  describe('GET /api/admin/dashboard/stats', () => {
    it('should return dashboard statistics', async () => {
      User.countDocuments
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(20);
      Course.countDocuments.mockResolvedValue(30);

      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('totalCourses');
      expect(response.body.data).toHaveProperty('totalStudents');
      expect(response.body.data).toHaveProperty('totalInstructors');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/admin/dashboard/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return paginated users list', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      User.find.mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockUsers),
      });
      User.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter users by role', async () => {
      User.find.mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue([]),
      });
      User.countDocuments.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/admin/users?role=instructor')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(User.find).toHaveBeenCalledWith({ role: 'instructor' });
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user', async () => {
      const mockUser = {
        _id: '1',
        role: 'student',
        deleteOne: vi.fn().mockResolvedValue({}),
      };

      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .delete('/api/admin/users/1')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUser.deleteOne).toHaveBeenCalled();
    });

    it('should not delete admin user', async () => {
      const mockUser = {
        _id: '1',
        role: 'admin',
      };

      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .delete('/api/admin/users/1')
        .set('Authorization', adminToken);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent user', async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/admin/users/999')
        .set('Authorization', adminToken);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should update user role', async () => {
      const mockUser = {
        _id: '1',
        role: 'student',
        save: vi.fn().mockResolvedValue({}),
      };

      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/api/admin/users/1/role')
        .set('Authorization', adminToken)
        .send({ role: 'instructor' });

      expect(response.status).toBe(200);
      expect(mockUser.role).toBe('instructor');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should reject invalid role', async () => {
      const response = await request(app)
        .put('/api/admin/users/1/role')
        .set('Authorization', adminToken)
        .send({ role: 'invalid_role' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/admin/courses', () => {
    it('should return all courses', async () => {
      const mockCourses = [
        { _id: '1', title: 'Course 1' },
        { _id: '2', title: 'Course 2' },
      ];

      Course.find.mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockCourses),
      });
      Course.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/admin/courses')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('PUT /api/admin/courses/:id/approve', () => {
    it('should approve course', async () => {
      const mockCourse = {
        _id: '1',
        isPublished: false,
        save: vi.fn().mockResolvedValue({}),
      };

      Course.findById.mockResolvedValue(mockCourse);

      const response = await request(app)
        .put('/api/admin/courses/1/approve')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(mockCourse.isPublished).toBe(true);
      expect(mockCourse.save).toHaveBeenCalled();
    });

    it('should return 404 for non-existent course', async () => {
      Course.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/admin/courses/999/approve')
        .set('Authorization', adminToken);

      expect(response.status).toBe(404);
    });
  });
});
