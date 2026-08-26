import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dashboard.servidor.blog/api/client-portal';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Interceptor de Solicitud: Inyecta cabeceras de autenticación automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const adminKey =
      localStorage.getItem('admin_api_key') ||
      localStorage.getItem('auth_token') ||
      import.meta.env.VITE_ADMIN_KEY ||
      'core_backend_secret_key_2026';

    if (adminKey) {
      config.headers['X-API-Key'] = adminKey;
      config.headers['Authorization'] = `Bearer ${adminKey}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo unificado de códigos de estado HTTP 4xx / 5xx
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : 500;
    const serverMessage = error.response?.data?.error || error.response?.data?.message;

    let userFriendlyMessage = serverMessage;

    if (!userFriendlyMessage) {
      switch (status) {
        case 400:
          userFriendlyMessage = 'Por favor completa los campos obligatorios con un formato válido.';
          break;
        case 401:
          userFriendlyMessage = 'Credenciales incorrectas o sesión no autorizada.';
          break;
        case 404:
          userFriendlyMessage = 'El espacio o recurso solicitado no fue encontrado.';
          break;
        case 409:
          userFriendlyMessage = 'Ya existe un espacio registrado con este nombre. Por favor usa uno diferente.';
          break;
        case 429:
          userFriendlyMessage = 'Demasiadas solicitudes consecutivas. Por favor espera unos momentos.';
          break;
        default:
          userFriendlyMessage = 'Ocurrió un error de conexión con el servidor.';
      }
    }

    const structuredError = {
      status,
      message: userFriendlyMessage,
      originalError: error,
    };

    return Promise.reject(structuredError);
  }
);
