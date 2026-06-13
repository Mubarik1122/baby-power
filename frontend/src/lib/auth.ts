const TOKEN_KEY = 'bp_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/** Clear stale session and send user back to login (e.g. after server restart). */
export function clearAdminSession() {
  removeToken();
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    window.location.href = '/admin/login';
  }
}
