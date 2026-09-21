import api from '../utils/api';

export const uploadVideoChunk = async (chunkData, onProgress) => {
  const formData = new FormData();
  formData.append('chunk', chunkData.chunk);
  formData.append('chunkIndex', chunkData.chunkIndex);
  formData.append('totalChunks', chunkData.totalChunks);
  formData.append('filename', chunkData.filename);
  formData.append('uploadId', chunkData.uploadId);

  const response = await api.post('/videos/upload-chunk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted, chunkData.chunkIndex);
      }
    },
  });

  return response.data;
};

export const initiateUpload = async fileData => {
  const response = await api.post('/videos/initiate-upload', fileData);
  return response.data;
};

export const completeUpload = async (uploadId, fileData) => {
  const response = await api.post('/videos/complete-upload', { uploadId, ...fileData });
  return response.data;
};

export const cancelUpload = async uploadId => {
  const response = await api.post('/videos/cancel-upload', { uploadId });
  return response.data;
};

export const getVideoById = async videoId => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

export const getVideoStreamUrl = async (videoId, quality = 'auto') => {
  const response = await api.get(`/videos/${videoId}/stream`, { params: { quality } });
  return response.data;
};

export const getVideoProgress = async videoId => {
  const response = await api.get(`/videos/${videoId}/progress`);
  return response.data;
};

export const updateVideoProgress = async (videoId, progressData) => {
  const response = await api.post(`/videos/${videoId}/progress`, progressData);
  return response.data;
};

export const deleteVideo = async videoId => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

export const getVideoSubtitles = async (videoId, language = 'en') => {
  const response = await api.get(`/videos/${videoId}/subtitles`, { params: { language } });
  return response.data;
};
