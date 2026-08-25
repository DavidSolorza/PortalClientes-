import { useState, useEffect } from 'react';

/**
 * Hook personalizado useDebounce para retrasar la ejecución de valores de búsqueda
 * y evitar saturar el servidor con peticiones en cada pulsación de tecla (Previene error 429).
 * @param value Valor a debancear (ej: término de búsqueda)
 * @param delay Retraso en milisegundos (por defecto 300ms)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
