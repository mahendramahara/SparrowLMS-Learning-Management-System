import api from '../utils/api';

export const getInstructorDashboard = async () => {
  const response = await api.get('/instructor/dashboard');
  return response.data;
};

export const getMyCourses = async (params = {}) => {
  const response = await api.get('/instructor/courses', { params });
  return response.data;
};

export const getMyStudents = async (params = {}) => {
  const response = await api.get('/instructor/students', { params });
  return response.data;
};

export const publishCourse = async courseId => {
  const response = await api.put(`/instructor/courses/${courseId}/publish`);
  return response.data;
};

export const unpublishCourse = async courseId => {
  const response = await api.put(`/instructor/courses/${courseId}/unpublish`);
  return response.data;
};

export const getCourseAnalytics = async (courseId, params = {}) => {
  const response = await api.get(`/instructor/courses/${courseId}/analytics`, { params });
  return response.data;
};

export const getStudentProgress = async (courseId, studentId) => {
  const response = await api.get(`/instructor/courses/${courseId}/students/${studentId}/progress`);
  return response.data;
};

export const getEarnings = async (params = {}) => {
  const response = await api.get('/instructor/earnings', { params });
  return response.data;
};

export const getCourseReviews = async (courseId, params = {}) => {
  const response = await api.get(`/instructor/courses/${courseId}/reviews`, { params });
  return response.data;
};

export const respondToReview = async (reviewId, response) => {
  const res = await api.post(`/instructor/reviews/${reviewId}/respond`, { response });
  return res.data;
};
