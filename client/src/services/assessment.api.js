import api from '../utils/api';

export const getAssessments = async courseId => {
  const response = await api.get(`/courses/${courseId}/assessments`);
  return response.data;
};

export const getAssessmentById = async assessmentId => {
  const response = await api.get(`/assessments/${assessmentId}`);
  return response.data;
};

export const createAssessment = async (courseId, assessmentData) => {
  const response = await api.post(`/courses/${courseId}/assessments`, assessmentData);
  return response.data;
};

export const updateAssessment = async (assessmentId, assessmentData) => {
  const response = await api.put(`/assessments/${assessmentId}`, assessmentData);
  return response.data;
};

export const deleteAssessment = async assessmentId => {
  const response = await api.delete(`/assessments/${assessmentId}`);
  return response.data;
};

export const startAssessment = async assessmentId => {
  const response = await api.post(`/assessments/${assessmentId}/start`);
  return response.data;
};

export const submitAssessment = async (assessmentId, answers) => {
  const response = await api.post(`/assessments/${assessmentId}/submit`, { answers });
  return response.data;
};

export const getAssessmentResults = async assessmentId => {
  const response = await api.get(`/assessments/${assessmentId}/results`);
  return response.data;
};

export const getMyAttempts = async assessmentId => {
  const response = await api.get(`/assessments/${assessmentId}/my-attempts`);
  return response.data;
};
