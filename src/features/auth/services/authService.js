import { apiClient } from '../../../core/api';

export const verifyClientLogin = async (slug, password) => {
  const response = await apiClient.post('/auth/verify', { slug, password });
  return response.data;
};
