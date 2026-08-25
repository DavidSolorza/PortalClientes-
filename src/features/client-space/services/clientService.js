import { apiClient } from '../../../core/api';

export const fetchClientPortal = async (slug) => {
  let response;
  try {
    response = await apiClient.get(`/portal/${slug}`);
  } catch {
    response = await apiClient.get(`/espacio/${slug}`);
  }
  const d = response.data || {};
  const project = d.data || d.project || d;
  return { project };
};
