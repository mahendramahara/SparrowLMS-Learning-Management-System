import api from '../utils/api';

export const uploadMedia = async (file, type = 'resource', onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/upload/media?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
};

export const removeMedia = async (publicId, resourceType = 'image') => {
  const response = await api.delete('/upload/media', {
    data: { publicId, resourceType },
  });
  return response.data;
};
