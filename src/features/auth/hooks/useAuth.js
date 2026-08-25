import { useState } from 'react';
import { verifyClientLogin } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginClient = async (slug, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await verifyClientLogin(slug, password);
      setLoading(false);
      return data.project;
    } catch (err) {
      setLoading(false);
      let userMsg = err.message;
      if (err.status === 401) {
        userMsg = 'Contraseña incorrecta o el espacio no existe.';
      } else if (err.status === 404) {
        userMsg = 'El proyecto o espacio especificado no fue encontrado.';
      } else if (err.status === 429) {
        userMsg = 'Demasiados intentos consecutivos. Espera un momento antes de reintentar.';
      }
      setError(userMsg);
      throw err;
    }
  };

  return {
    loginClient,
    loading,
    error,
    setError,
  };
};
