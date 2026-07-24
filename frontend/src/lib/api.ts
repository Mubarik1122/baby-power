import { clearAdminSession } from './auth';
import { getApiOrigin, getApiUrl } from './api-config';

const API_URL = getApiUrl();

function hasAuthHeader(headers?: HeadersInit): boolean {
  if (!headers) return false;
  const record = headers as Record<string, string>;
  if (record.Authorization) return true;
  if (headers instanceof Headers) return headers.has('Authorization');
  return false;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isGet = !options.method || options.method === 'GET';
  const isServer = typeof window === 'undefined';
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(isGet ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...(isServer && isGet ? { next: { revalidate: 60 } } : { cache: 'no-store' }),
    });
  } catch {
    throw new Error(
      'Unable to reach the server. Please try again in a moment — the API may be waking up.'
    );
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? `API not found (${API_URL}${endpoint}). Check NEXT_PUBLIC_API_URL includes /api on Vercel.`
          : res.status === 502 || res.status === 503
            ? 'Server is temporarily unavailable. Please try again in a moment.'
            : `API error (${res.status}). Expected JSON from the backend.`
      );
    }
    throw new Error('API returned an unexpected response. Check NEXT_PUBLIC_API_URL on Vercel.');
  }

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && hasAuthHeader(options.headers)) {
      clearAdminSession();
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function parseAdminResponse(r: Response) {
  const data = await r.json();
  if (r.status === 401) {
    clearAdminSession();
    throw new Error('Session expired. Please log in again.');
  }
  if (!r.ok) throw new Error(data.message || 'API request failed');
  return data;
}

// Public API
export const getProducts = (params?: Record<string, string>) => {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  return fetchAPI<{ success: boolean; data: import('./types').Product[]; pagination: import('./types').Pagination }>(`/products${query}`);
};

export const getProductBySlug = (slug: string) =>
  fetchAPI<{ success: boolean; data: import('./types').Product }>(`/products/slug/${slug}`);

export const getCategories = (active = true) =>
  fetchAPI<{ success: boolean; data: import('./types').Category[] }>(`/categories${active ? '' : '?active=false'}`);

export const getCategoryBySlug = (slug: string) =>
  fetchAPI<{ success: boolean; data: import('./types').Category }>(`/categories/slug/${slug}`);

export const getFAQs = () =>
  fetchAPI<{ success: boolean; data: import('./types').FAQ[] }>('/faqs');

export const getPageBySlug = (slug: string) =>
  fetchAPI<{ success: boolean; data: import('./types').Page }>(`/pages/slug/${slug}`);

export const getBanners = (active = true) =>
  fetchAPI<{ success: boolean; data: import('./types').Banner[] }>(`/banners${active ? '' : '?active=false'}`);

export const getSettings = () =>
  fetchAPI<{ success: boolean; data: import('./types').SiteSettings }>('/settings');

export const getAdminSettings = (token: string) =>
  fetchAPI<{ success: boolean; data: import('./types').SiteSettings }>('/settings/admin', {
    headers: authHeaders(token),
  });

export const submitContact = (data: Record<string, string>) =>
  fetchAPI('/leads/contact', { method: 'POST', body: JSON.stringify(data) });

export const submitQuotation = (data: Record<string, unknown>) =>
  fetchAPI('/leads/quotation', { method: 'POST', body: JSON.stringify(data) });

// Admin API
export const adminLogin = (email: string, password: string) =>
  fetchAPI<{ success: boolean; token: string; user: import('./types').User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getMe = (token: string) =>
  fetchAPI<{ success: boolean; user: import('./types').User }>('/auth/me', {
    headers: authHeaders(token),
  });

export const getDashboardStats = (token: string) =>
  fetchAPI<{ success: boolean; data: import('./types').DashboardStats }>('/dashboard/stats', {
    headers: authHeaders(token),
  });

export const getLeads = (token: string, params?: Record<string, string>) => {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  return fetchAPI<{ success: boolean; data: import('./types').Lead[]; pagination: import('./types').Pagination }>(`/leads${query}`, {
    headers: authHeaders(token),
  });
};

export const updateLeadStatus = (token: string, id: string, status: string) =>
  fetchAPI(`/leads/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });

export const deleteLead = (token: string, id: string) =>
  fetchAPI(`/leads/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const createProduct = (token: string, formData: FormData) =>
  fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  }).then(parseAdminResponse);

export const updateProduct = (token: string, id: string, formData: FormData) =>
  fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  }).then(parseAdminResponse);

export const deleteProduct = (token: string, id: string) =>
  fetchAPI(`/products/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const toggleProduct = (token: string, id: string) =>
  fetchAPI(`/products/${id}/toggle`, { method: 'PATCH', headers: authHeaders(token) });

export const createCategory = (token: string, formData: FormData) =>
  fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  }).then(parseAdminResponse);

export const updateCategory = (token: string, id: string, formData: FormData) =>
  fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  }).then(parseAdminResponse);

export const deleteCategory = (token: string, id: string) =>
  fetchAPI(`/categories/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const createFAQ = (token: string, data: Record<string, unknown>) =>
  fetchAPI('/faqs', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) });

export const updateFAQ = (token: string, id: string, data: Record<string, unknown>) =>
  fetchAPI(`/faqs/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data) });

export const deleteFAQ = (token: string, id: string) =>
  fetchAPI(`/faqs/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const getPages = (token: string) =>
  fetchAPI<{ success: boolean; data: import('./types').Page[] }>('/pages', { headers: authHeaders(token) });

export const updatePage = (token: string, id: string, data: Record<string, unknown>) =>
  fetchAPI(`/pages/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data) });

export const createBanner = (token: string, formData: FormData) =>
  fetch(`${API_URL}/banners`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  }).then(parseAdminResponse);

export const updateBanner = (token: string, id: string, formData: FormData) =>
  fetch(`${API_URL}/banners/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  }).then(parseAdminResponse);

export const deleteBanner = (token: string, id: string) =>
  fetchAPI(`/banners/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const toggleBanner = (token: string, id: string) =>
  fetchAPI(`/banners/${id}/toggle`, { method: 'PATCH', headers: authHeaders(token) });

export const updateSettings = (token: string, data: Record<string, string | number>) =>
  fetchAPI('/settings', { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data) });

export function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${getApiOrigin()}${path}`;
}
