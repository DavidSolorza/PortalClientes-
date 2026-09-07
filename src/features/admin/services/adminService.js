import { apiClient } from '../../../core/api';
import { rememberProjectPassword } from './passwordStorageService';

export const fetchDashboardMetrics = async () => {
  const response = await apiClient.get('/dashboard');
  const d = response.data || {};
  return {
    total_projects: d.total_projects || d.total || 0,
    active_testing_links: d.active_testing_links || d.projects_with_testing_link || 0,
    stages_breakdown: d.stages_breakdown || d.stage_distribution || {},
  };
};

export const fetchProjects = async (stage = '', search = '') => {
  const params = {};
  if (stage) params.stage = stage;
  if (search) params.search = search;

  let response;
  try {
    response = await apiClient.get('/spaces', { params });
  } catch (primaryErr) {
    try {
      response = await apiClient.get('/projects', { params });
    } catch {
      throw primaryErr;
    }
  }

  const d = response.data || {};
  const projectsList = Array.isArray(d) ? d : d.data || d.projects || [];
  return {
    count: projectsList.length,
    projects: projectsList,
  };
};

export const createProject = async (projectData) => {
  let response;
  try {
    response = await apiClient.post('/spaces', projectData);
  } catch (primaryErr) {
    try {
      response = await apiClient.post('/projects', projectData);
    } catch {
      throw primaryErr;
    }
  }

  const pass = projectData.password || projectData.clave || projectData.pass;
  if (pass) {
    rememberProjectPassword(projectData.client_name, pass);
    rememberProjectPassword(projectData.project_slug, pass);
    rememberProjectPassword(projectData.slug, pass);

    const resObj = response.data?.data || response.data?.project || response.data || {};
    if (resObj.id) rememberProjectPassword(resObj.id, pass);
    if (resObj.project_slug) rememberProjectPassword(resObj.project_slug, pass);
    if (resObj.client_name) rememberProjectPassword(resObj.client_name, pass);
  }

  return response.data;
};

export const updateProject = async (idOrSlug, projectData) => {
  let response;
  try {
    response = await apiClient.put(`/spaces/${idOrSlug}`, projectData);
  } catch (primaryErr) {
    try {
      response = await apiClient.put(`/projects/${idOrSlug}`, projectData);
    } catch {
      try {
        response = await apiClient.patch(`/projects/${idOrSlug}`, projectData);
      } catch {
        throw primaryErr;
      }
    }
  }

  const pass = projectData.password || projectData.clave || projectData.pass;
  if (pass) {
    rememberProjectPassword(idOrSlug, pass);
    rememberProjectPassword(projectData.client_name, pass);
    rememberProjectPassword(projectData.project_slug, pass);

    const resObj = response.data?.data || response.data?.project || response.data || {};
    if (resObj.id) rememberProjectPassword(resObj.id, pass);
    if (resObj.project_slug) rememberProjectPassword(resObj.project_slug, pass);
    if (resObj.client_name) rememberProjectPassword(resObj.client_name, pass);
  }

  return response.data;
};

export const updateProjectEmail = async (idOrSlug, email) => {
  let response;
  try {
    response = await apiClient.patch(`/projects/${idOrSlug}`, { email });
  } catch (primaryErr) {
    try {
      response = await apiClient.patch(`/spaces/${idOrSlug}`, { email });
    } catch {
      throw primaryErr;
    }
  }
  return response.data;
};

export const resetProjectPassword = async (idOrSlug, payload = {}) => {
  let response;
  try {
    response = await apiClient.post(`/spaces/${idOrSlug}/reset-password`, payload);
  } catch (primaryErr) {
    try {
      response = await apiClient.post(`/projects/${idOrSlug}/reset-password`, payload);
    } catch {
      throw primaryErr;
    }
  }

  const resData = response.data || {};
  const newPass = resData.new_password || resData.password || payload.password;
  if (newPass) {
    rememberProjectPassword(idOrSlug, newPass);
    const resObj = resData.data || resData.project || resData;
    if (resObj.project_slug) rememberProjectPassword(resObj.project_slug, newPass);
    if (resObj.client_name) rememberProjectPassword(resObj.client_name, newPass);
  }

  return resData;
};

export const deleteProject = async (idOrSlug) => {
  let response;
  try {
    response = await apiClient.delete(`/spaces/${idOrSlug}`);
  } catch (primaryErr) {
    try {
      response = await apiClient.delete(`/projects/${idOrSlug}`);
    } catch {
      throw primaryErr;
    }
  }
  return response.data;
};
