import { useState, useEffect, useCallback } from 'react';
import { fetchClientPortal } from '../services/clientService';
import { socket } from '../../../core/socket';
import { useTheme } from '../../../core/theme/themeContext';

export const useClientPortal = (slug, initialData = null) => {
  const [project, setProject] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const { setThemeColor } = useTheme();

  const loadPortal = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClientPortal(slug);
      setProject(data.project);
      if (data.project?.theme_color) {
        setThemeColor(data.project.theme_color);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al obtener informacion del proyecto');
    }
  }, [slug, setThemeColor]);

  useEffect(() => {
    if (!initialData) {
      loadPortal();
    } else if (initialData.theme_color) {
      setThemeColor(initialData.theme_color);
    }
  }, [initialData, loadPortal, setThemeColor]);

  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    const handleUpdated = (updated) => {
      if (!updated) return;
      const item = updated.data || updated;
      if (item.project_slug === slug || item.id === project?.id) {
        setProject((prev) => ({ ...prev, ...item }));
        if (item.theme_color) {
          setThemeColor(item.theme_color);
        }
      }
    };

    socket.on('client_portal:project-updated', handleUpdated);
    socket.on('client_portal:space-updated', handleUpdated);

    return () => {
      socket.off('client_portal:project-updated', handleUpdated);
      socket.off('client_portal:space-updated', handleUpdated);
    };
  }, [slug, project?.id, setThemeColor]);

  return {
    project,
    loading,
    error,
    refreshPortal: loadPortal,
  };
};
