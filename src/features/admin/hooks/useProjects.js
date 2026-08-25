import { useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardMetrics,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/adminService';
import { socket } from '../../../core/socket';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Aplicar Debounce a las peticiones de búsqueda (300ms) para evitar error HTTP 429
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projData, metricData] = await Promise.all([
        fetchProjects(selectedStage, debouncedSearchTerm),
        fetchDashboardMetrics(),
      ]);
      setProjects(projData.projects || []);
      setMetrics(metricData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || err.error || 'Error al cargar datos del servidor');
    }
  }, [selectedStage, debouncedSearchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Escuchar eventos de WebSockets (soporta eventos space- y project-)
  useEffect(() => {
    const handleCreated = (newProject) => {
      if (!newProject) return;
      const item = newProject.data || newProject;
      setProjects((prev) => [item, ...prev.filter((p) => p.id !== item.id && p.project_slug !== item.project_slug)]);
      fetchDashboardMetrics().then(setMetrics).catch(() => {});
    };

    const handleUpdated = (updatedProject) => {
      if (!updatedProject) return;
      const item = updatedProject.data || updatedProject;
      setProjects((prev) =>
        prev.map((p) => (p.id === item.id || p.project_slug === item.project_slug ? { ...p, ...item } : p))
      );
      fetchDashboardMetrics().then(setMetrics).catch(() => {});
    };

    const handleDeleted = (deletedInfo) => {
      if (!deletedInfo) return;
      const item = deletedInfo.data || deletedInfo;
      setProjects((prev) => prev.filter((p) => p.id !== item.id && p.project_slug !== item.project_slug));
      fetchDashboardMetrics().then(setMetrics).catch(() => {});
    };

    socket.on('client_portal:project-created', handleCreated);
    socket.on('client_portal:space-created', handleCreated);
    socket.on('client_portal:project-updated', handleUpdated);
    socket.on('client_portal:space-updated', handleUpdated);
    socket.on('client_portal:project-deleted', handleDeleted);
    socket.on('client_portal:space-deleted', handleDeleted);

    return () => {
      socket.off('client_portal:project-created', handleCreated);
      socket.off('client_portal:space-created', handleCreated);
      socket.off('client_portal:project-updated', handleUpdated);
      socket.off('client_portal:space-updated', handleUpdated);
      socket.off('client_portal:project-deleted', handleDeleted);
      socket.off('client_portal:space-deleted', handleDeleted);
    };
  }, []);

  const handleCreate = async (data) => {
    const res = await createProject(data);
    loadData();
    return res;
  };

  const handleUpdate = async (idOrSlug, data) => {
    const res = await updateProject(idOrSlug, data);
    loadData();
    return res;
  };

  const handleDelete = async (idOrSlug) => {
    const res = await deleteProject(idOrSlug);
    loadData();
    return res;
  };

  return {
    projects,
    metrics,
    loading,
    error,
    selectedStage,
    setSelectedStage,
    searchTerm,
    setSearchTerm,
    refreshData: loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
