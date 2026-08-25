/**
 * Servicio de Almacenamiento Local de Contraseñas de Administración.
 * Garantiza que la contraseña que tú escribes al crear o editar cualquier proyecto
 * sea recordada y visible para ti con el icono del ojito 👁️ en todo momento.
 */

const STORAGE_KEY = 'admin_remembered_passwords';

const slugify = (str) => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Semilla inicial con claves conocidas para respaldos
const INITIAL_SEEDS = {
  'acme-ecommerce': 'MiPasswordSeguro123!',
  'acme-corporation': '123456',
  'starlight-retail': 'Starlight2026!',
};

export const getStoredPasswordsMap = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    return { ...INITIAL_SEEDS, ...stored };
  } catch {
    return INITIAL_SEEDS;
  }
};

export const rememberProjectPassword = (identifier, password) => {
  if (!identifier || !password) return;
  try {
    const map = getStoredPasswordsMap();
    const strId = String(identifier).toLowerCase().trim();
    const slugKey = slugify(identifier);

    if (strId) map[strId] = password;
    if (slugKey) map[slugKey] = password;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('No se pudo guardar la contraseña localmente:', err);
  }
};

export const getRememberedPassword = (project) => {
  if (!project) return '';

  // 1. Si la API devolvió la clave plana directa en el objeto del proyecto
  if (project.password) return project.password;
  if (project.clave) return project.clave;
  if (project.pass) return project.pass;
  if (project.raw_password) return project.raw_password;

  // 2. Buscar en la memoria local del navegador por todos los identificadores posibles
  const map = getStoredPasswordsMap();

  const candidates = [
    project.project_slug,
    project.slug,
    project.id ? String(project.id) : null,
    project.client_name,
    project.client_name ? slugify(project.client_name) : null,
    project.project_slug ? slugify(project.project_slug) : null,
  ].filter(Boolean);

  for (const cand of candidates) {
    const key = String(cand).toLowerCase().trim();
    if (map[key]) return map[key];
    const slugKey = slugify(cand);
    if (map[slugKey]) return map[slugKey];
  }

  return '';
};
