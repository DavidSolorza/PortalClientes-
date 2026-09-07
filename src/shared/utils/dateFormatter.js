/**
 * Utilidad unificada de formateo de fechas y horas en formato 24 Horas (HH:mm)
 * convirtiendo marcas de tiempo UTC del servidor a la zona horaria local del cliente.
 */

export const parseDateInput = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;

  if (typeof dateInput === 'number') {
    return new Date(dateInput);
  }

  if (typeof dateInput === 'string') {
    let trimmed = dateInput.trim();
    if (!trimmed) return null;

    // Detectar patrones de marcas de tiempo ISO estándar YYYY-MM-DD HH:mm:ss o YYYY-MM-DDTHH:mm:ss
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);

    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);
      const second = match[6] ? parseInt(match[6], 10) : 0;

      // Verificar si especifica explícitamente una zona horaria con desplazamiento numérico (+/-HH:mm)
      const hasExplicitOffset = /[+-]\d{2}:?\d{2}$/.test(trimmed);

      if (!hasExplicitOffset) {
        // Construir directamente usando los valores locales para evitar cualquier conversión UTC no deseada (-5h)
        const localDate = new Date(year, month, day, hour, minute, second);
        if (!isNaN(localDate.getTime())) return localDate;
      }
    }

    // Fallback normal para fechas ISO completas con offset o formato estándar
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
};

/**
 * Formatea una fecha o marca de tiempo UTC a hora local en formato 24 Horas (ej: 20:50)
 */
export const format24HourTime = (dateInput) => {
  const date = parseDateInput(dateInput);
  if (!date) return 'Reciente';

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Formatea una fecha a fecha + hora 24 Horas local (ej: 24/08/2026 20:50)
 */
export const formatFullDateTime24h = (dateInput) => {
  const date = parseDateInput(dateInput);
  if (!date) return 'Sin fecha';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const timeStr = format24HourTime(date);

  return `${day}/${month}/${year} ${timeStr}`;
};

/**
 * Tiempo relativo o 24 Horas local en español
 */
export const formatRelativeOr24h = (dateInput) => {
  const date = parseDateInput(dateInput);
  if (!date) return 'Reciente';

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Hace un momento';
  if (diffSec < 3600) return `Hace ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) {
    return `Hoy a las ${format24HourTime(date)}`;
  }
  if (diffSec < 172800) {
    return `Ayer a las ${format24HourTime(date)}`;
  }

  return formatFullDateTime24h(date);
};
