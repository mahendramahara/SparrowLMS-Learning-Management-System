import api from '../utils/api';

export const getAllAssignments = async (params = {}) => {
  const response = await api.get('/assignments', { params });
  return response.data;
};

export const getAssignments = async courseId => {
  const response = await api.get(`/courses/${courseId}/assignments`);
  return response.data;
};

export const getAssignmentById = async assignmentId => {
  const response = await api.get(`/assignments/${assignmentId}`);
  return response.data;
};

export const createAssignment = async (courseIdOrData, maybeData) => {
  if (typeof courseIdOrData === 'string' && maybeData) {
    const response = await api.post(`/courses/${courseIdOrData}/assignments`, maybeData);
    return response.data;
  }
  const response = await api.post('/assignments', courseIdOrData);
  return response.data;
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async assignmentId => {
  const response = await api.delete(`/assignments/${assignmentId}`);
  return response.data;
};

export const submitAssignment = async (assignmentId, submissionData) => {
  const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
  return response.data;
};

export const getSubmissions = async (assignmentId, params = {}) => {
  const response = await api.get(`/assignments/${assignmentId}/submissions`, { params });
  return response.data;
};

export const getMySubmission = async assignmentId => {
  const response = await api.get(`/assignments/${assignmentId}/my-submission`);
  return response.data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const response = await api.put(`/submissions/${submissionId}/grade`, gradeData);
  return response.data;
};

export const getSubmissionFeedback = async submissionId => {
  const response = await api.get(`/submissions/${submissionId}/feedback`);
  return response.data;
};
