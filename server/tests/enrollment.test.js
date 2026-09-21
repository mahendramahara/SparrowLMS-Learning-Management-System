const { describe, it, expect, beforeEach } = require('vitest');
const request = require('supertest');
const app = require('../app');

describe('Enrollment Module', () => {
  let authToken;

  beforeEach(() => {
    authToken = 'Bearer valid_token_123';
  });

  describe('POST /api/enrollments', () => {
    it('should enroll user in course', async () => {
      const enrollmentData = {
        courseId: '507f1f77bcf86cd799439011',
      };

      const response = await request(app)
        .post('/api/enrollments')
        .set('Authorization', authToken)
        .send(enrollmentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Enrolled in course successfully');
    });

    it('should return 401 without authentication', async () => {
      const enrollmentData = {
        courseId: '507f1f77bcf86cd799439011',
      };

      const response = await request(app)
        .post('/api/enrollments')
        .send(enrollmentData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/enrollments/my-enrollments', () => {
    it('should return user enrollments', async () => {
      const response = await request(app)
        .get('/api/enrollments/my-enrollments')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/enrollments/my-enrollments');

      expect(response.status).toBe(401);
    });
  });
});
