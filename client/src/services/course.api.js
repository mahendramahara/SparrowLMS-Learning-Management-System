import api from '../utils/api';

export const getCourses = async (params = {}) => {
  const response = await api.get('/courses', { params });
  return response.data;
};

export const getMyCourses = async (params = {}) => {
  const response = await api.get('/courses/my-courses', { params });
  return response.data;
};

export const getCourseById = async id => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async courseData => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const toggleCoursePublish = async id => {
  const response = await api.patch(`/courses/${id}/publish`);
  return response.data;
};

export const deleteCourse = async id => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

export const getCoursesByCategory = async (category, params = {}) => {
  const response = await api.get(`/courses/category/${category}`, { params });
  return response.data;
};

export const searchCourses = async (query, params = {}) => {
  const response = await api.get('/courses/search', { params: { q: query, ...params } });
  return response.data;
};

export const getPopularCourses = async (params = {}) => {
  const response = await api.get('/courses/popular', { params });
  return response.data;
};
