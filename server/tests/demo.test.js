const request = require('supertest');
const app = require('../app');

describe('Role-Based Access Control & Demo View-Only Restrictions', () => {
  let studentToken;
  let instructorToken;
  let adminToken;

  beforeAll(async () => {
    // Acquire tokens for all 3 demo accounts
    const studentRes = await request(app)
      .post('/api/auth/demo-login')
      .send({ role: 'student' });
    studentToken = studentRes.body.token;

    const instructorRes = await request(app)
      .post('/api/auth/demo-login')
      .send({ role: 'instructor' });
    instructorToken = instructorRes.body.token;

    const adminRes = await request(app)
      .post('/api/auth/demo-login')
      .send({ role: 'admin' });
    adminToken = adminRes.body.token;
  });

  describe('Demo Login & Session Generation', () => {
    it('should authenticate student demo account', () => {
      expect(studentToken).toBeDefined();
    });

    it('should authenticate instructor demo account', () => {
      expect(instructorToken).toBeDefined();
    });

    it('should authenticate admin demo account', () => {
      expect(adminToken).toBeDefined();
    });
  });

  describe('Role-Based Access Control Segregation', () => {
    it('should allow demo student to access student interests', async () => {
      const res = await request(app)
        .get('/api/users/interests')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('categoryAffinities');
    });

    it('should BLOCK demo student from accessing instructor dashboard', async () => {
      const res = await request(app)
        .get('/api/instructor/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it('should BLOCK demo student from accessing admin stats', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow demo instructor to access instructor dashboard', async () => {
      const res = await request(app)
        .get('/api/instructor/dashboard')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isDemo).toBe(true);
      expect(res.body.data.instructorName).toBe('Sunita Maharjan');
    });

    it('should BLOCK demo instructor from accessing admin portal', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow demo admin to access admin portal', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isDemo).toBe(true);
      expect(res.body.data.totalUsers).toBeGreaterThan(0);
    });
  });

  describe('Demo View-Only Mutation Restriction', () => {
    it('should block demo admin from deleting users (mutation attempt)', async () => {
      const res = await request(app)
        .delete('/api/admin/users/usr_01')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.isDemoRestriction).toBe(true);
    });

    it('should block demo instructor from publishing courses (mutation attempt)', async () => {
      const res = await request(app)
        .put('/api/instructor/courses/demo_c1/publish')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.isDemoRestriction).toBe(true);
    });
  });

  describe('Dynamic User Interest Tracking & Time-Decayed Affinities', () => {
    it('should track interactions and update affinity score', async () => {
      const res = await request(app)
        .post('/api/users/interactions')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          category: 'Distributed Systems',
          action: 'watch_video',
          courseId: 'course-01',
          courseTitle: 'Video Streaming Architecture',
          durationMinutes: 20,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app)
        .get('/api/users/interests')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(checkRes.status).toBe(200);
      const match = checkRes.body.data.categoryAffinities.find(
        (a) => a.category === 'Distributed Systems'
      );
      expect(match).toBeDefined();
      expect(match.score).toBeGreaterThan(0);
    });
  });
});
