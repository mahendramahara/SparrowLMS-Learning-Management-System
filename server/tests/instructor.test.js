const { describe, it, expect, beforeEach, vi } = require('vitest');
const request = require('supertest');
const app = require('../app');
const Course = require('../src/modules/course/course.model');

vi.mock('../../course/course.model');

describe('Instructor Module', () => {
  let instructorToken;

  beforeEach(() => {
    vi.clearAllMocks();
    instructorToken = 'Bearer instructor_token_123';
  });

  describe('GET /api/instructor/dashboard', () => {
    it('should return instructor dashboard statistics', async () => {
      Course.countDocuments
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(3);

      Course.find.mockResolvedValue([
        { enrolled: 50, rating: 4.5 },
        { enrolled: 30, rating: 4.0 },
      ]);

      const response = await request(app)
        .get('/api/instructor/dashboard')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCourses');
      expect(response.body.data).toHaveProperty('publishedCourses');
      expect(response.body.data).toHaveProperty('draftCourses');
      expect(response.body.data).toHaveProperty('totalEnrollments');
      expect(response.body.data).toHaveProperty('averageRating');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/instructor/dashboard');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/instructor/courses', () => {
    it('should return instructor courses', async () => {
      const mockCourses = [
        { _id: '1', title: 'Course 1', instructor: 'instructor_id' },
        { _id: '2', title: 'Course 2', instructor: 'instructor_id' },
      ];

      Course.find.mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockCourses),
      });
      Course.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/instructor/courses')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter courses by published status', async () => {
      Course.find.mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue([]),
      });
      Course.countDocuments.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/instructor/courses?isPublished=true')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/instructor/students', () => {
    it('should return instructor students', async () => {
      const mockCourses = [
        { _id: '1', title: 'Course 1', enrolled: 50 },
        { _id: '2', title: 'Course 2', enrolled: 30 },
      ];

      Course.find.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockCourses),
      });

      const response = await request(app)
        .get('/api/instructor/students')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('PUT /api/instructor/courses/:id/publish', () => {
    it('should publish course', async () => {
      const mockCourse = {
        _id: '1',
        instructor: { toString: () => 'instructor_id' },
        isPublished: false,
        save: vi.fn().mockResolvedValue({}),
      };

      Course.findById.mockResolvedValue(mockCourse);

      const response = await request(app)
        .put('/api/instructor/courses/1/publish')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
      expect(mockCourse.isPublished).toBe(true);
      expect(mockCourse.save).toHaveBeenCalled();
    });

    it('should return 404 for non-existent course', async () => {
      Course.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/instructor/courses/999/publish')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/instructor/courses/:id/unpublish', () => {
    it('should unpublish course', async () => {
      const mockCourse = {
        _id: '1',
        instructor: { toString: () => 'instructor_id' },
        isPublished: true,
        save: vi.fn().mockResolvedValue({}),
      };

      Course.findById.mockResolvedValue(mockCourse);

      const response = await request(app)
        .put('/api/instructor/courses/1/unpublish')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
      expect(mockCourse.isPublished).toBe(false);
      expect(mockCourse.save).toHaveBeenCalled();
    });
  });

  describe('GET /api/instructor/courses/:id/analytics', () => {
    it('should return course analytics', async () => {
      const mockCourse = {
        _id: '1',
        title: 'Course 1',
        instructor: { toString: () => 'instructor_id' },
        enrolled: 100,
        rating: 4.5,
        reviewCount: 50,
        price: 99.99,
      };

      Course.findById.mockResolvedValue(mockCourse);

      const response = await request(app)
        .get('/api/instructor/courses/1/analytics')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('courseId');
      expect(response.body.data).toHaveProperty('enrolled');
      expect(response.body.data).toHaveProperty('revenue');
    });

    it('should return 403 for unauthorized instructor', async () => {
      const mockCourse = {
        _id: '1',
        instructor: { toString: () => 'another_instructor_id' },
      };

      Course.findById.mockResolvedValue(mockCourse);

      const response = await request(app)
        .get('/api/instructor/courses/1/analytics')
        .set('Authorization', instructorToken);

      expect(response.status).toBe(403);
    });
  });
});
