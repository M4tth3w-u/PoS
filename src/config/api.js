const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/$/, '');

export function apiUrl(path) {
  const normalizedPath = `/${path.replace(/^\//, '')}`;

  // Use Vite's same-origin proxy in development so the browser does not need backend CORS.
  return import.meta.env.DEV ? normalizedPath : `${API_BASE_URL}${normalizedPath}`;
}

export function resolveImageUrl(imgPath) {
  if (!imgPath || imgPath === '-' || imgPath === 'undefined' || imgPath === 'null') {
    return '/images/hero-food.jpg';
  }
  if (
    imgPath.startsWith('data:') ||
    imgPath.startsWith('blob:') ||
    imgPath.startsWith('http://') ||
    imgPath.startsWith('https://')
  ) {
    return imgPath;
  }
  if (imgPath.startsWith('food_')) {
    return `${API_BASE_URL}/images/${imgPath}`;
  }
  if (imgPath.startsWith('/images/food_') || imgPath.startsWith('images/food_')) {
    const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    return `${API_BASE_URL}${normalized}`;
  }
  return imgPath;
}
