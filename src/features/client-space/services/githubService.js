import axios from 'axios';
import { formatRelativeOr24h } from '../../../shared/utils/dateFormatter';

/**
 * Elimina emojis y simbolos decorativos preservando la estructura de lineas y saltos de parrafo
 */
const stripEmojis = (str) => {
  if (!str || typeof str !== 'string') return str || '';
  return str.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu,
    ''
  );
};

/**
 * Extrae owner y repo de cadenas o URLs de GitHub
 * Ejemplo: https://github.com/DavidSolorza/plantasLecheras.git -> { owner: 'DavidSolorza', repo: 'plantasLecheras' }
 */
export const parseGitHubRepo = (repoString) => {
  if (!repoString || typeof repoString !== 'string') return null;

  let clean = repoString.trim();
  clean = clean.replace(/\.git$/i, '');
  clean = clean.replace(/^https?:\/\/github\.com\//i, '');
  clean = clean.replace(/^git@github\.com:/i, '');

  const parts = clean.split('/').filter(Boolean);
  if (parts.length >= 2) {
    return {
      owner: parts[0],
      repo: parts[1],
    };
  }
  return null;
};

/**
 * Formatea fechas de commits a tiempo relativo o 24 Horas en español
 */
const formatRelativeTime = (dateStr) => {
  return formatRelativeOr24h(dateStr);
};

/**
 * Consulta ultimos commits públicos de la API REST de GitHub limpiando emojis
 */
export const fetchGitHubCommits = async (repoString) => {
  const parsed = parseGitHubRepo(repoString);
  if (!parsed) return [];

  try {
    const url = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=6`;
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (Array.isArray(response.data)) {
      return response.data.map((item) => {
        const fullMsg = stripEmojis(item.commit?.message || 'Commit registrado');
        const msgLines = fullMsg.split('\n');
        const title = msgLines[0];
        const desc = msgLines.slice(1).join(' ').trim();

        return {
          id: item.sha,
          sha: item.sha.substring(0, 7),
          title: title,
          desc: desc || `Por ${item.commit?.author?.name || item.author?.login || 'Colaborador'}`,
          author: item.commit?.author?.name || item.author?.login || 'Colaborador',
          time: formatRelativeTime(item.commit?.author?.date),
          url: item.html_url,
          type: 'commit',
        };
      });
    }
    return [];
  } catch (err) {
    console.warn('No se pudo obtener commits de GitHub:', err.message);
    return [];
  }
};

/**
 * Consulta y obtiene el contenido Markdown crudo del README.md limpiando emojis sin romper saltos de linea
 */
export const fetchGitHubReadme = async (repoString) => {
  const parsed = parseGitHubRepo(repoString);
  if (!parsed) return null;

  try {
    const url = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`;
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
      },
    });
    const rawContent = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    return stripEmojis(rawContent);
  } catch (err) {
    console.warn('No se pudo obtener README.md de GitHub:', err.message);
    return null;
  }
};
