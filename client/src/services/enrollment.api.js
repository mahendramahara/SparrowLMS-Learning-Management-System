import api from '../utils/api';

export const enrollInCourse = async courseId => {
  const response = await api.post('/enrollments', { courseId });
  return response.data;
};

export const getMyEnrollments = async (params = {}) => {
  const response = await api.get('/enrollments/my-enrollments', { params });
  return response.data;
};

export const getEnrollmentById = async enrollmentId => {
  const response = await api.get(`/enrollments/${enrollmentId}`);
  return response.data;
};

export const unenrollFromCourse = async enrollmentId => {
  const response = await api.delete(`/enrollments/${enrollmentId}`);
  return response.data;
};

export const getEnrollmentProgress = async enrollmentId => {
  const response = await api.get(`/enrollments/${enrollmentId}/progress`);
  return response.data;
};

export const updateProgress = async (enrollmentId, progressData) => {
  const response = await api.put(`/enrollments/${enrollmentId}/progress`, progressData);
  return response.data;
};

export const markLessonComplete = async (enrollmentId, lessonId) => {
  const response = await api.post(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`);
  return response.data;
};

export const getCertificate = async enrollmentId => {
  const response = await api.get(`/enrollments/${enrollmentId}/certificate`);
  return response.data;
};
