/** Normalise NEXT_PUBLIC_API_URL — must end with `/api` for route paths like `/auth/login`. */
export function getApiUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const trimmed = raw.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

/** Origin only (no `/api`) — for `/uploads/...` image paths. */
export function getApiOrigin() {
  return getApiUrl().replace(/\/api$/, '');
}
