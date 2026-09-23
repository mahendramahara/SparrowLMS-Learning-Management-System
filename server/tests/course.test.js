const request = require('supertest');
const app = require('../src/app');

describe('Course Module', () => {
  describe('GET /api/courses', () => {
    it('should return list of published courses', async () => {
      const response = await request(app).get('/api/courses');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should return 404 for non-existent course', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app).get(`/api/courses/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/courses', () => {
    it('should return 401 without authentication', async () => {
      const courseData = {
        title: 'New Course',
        description: 'Course description',
      };

      const response = await request(app)
        .post('/api/courses')
        .send(courseData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should return 401 without authentication', async () => {
      const updateData = {
        title: 'Updated Course',
      };

      const response = await request(app)
        .put('/api/courses/1')
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).delete('/api/courses/1');

      expect(response.status).toBe(401);
    });
  });
});
