const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/$/, '');

export function apiUrl(path) {
  const normalizedPath = `/${path.replace(/^\//, '')}`;

  // Use Vite's same-origin proxy in development so the browser does not need backend CORS.
  return import.meta.env.DEV ? normalizedPath : `${API_BASE_URL}${normalizedPath}`;
}
