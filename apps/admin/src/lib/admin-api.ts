const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('alwaheed_admin_token');
}

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('alwaheed_admin_token', token);
  }
}

export function removeAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('alwaheed_admin_token');
    localStorage.removeItem('alwaheed_admin_user');
  }
}

export async function adminFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      removeAdminToken();
      window.location.href = '/login';
    }
    throw new Error(data?.error?.message || `Admin API Error: ${res.statusText}`);
  }

  return data.data !== undefined ? data.data : data;
}
