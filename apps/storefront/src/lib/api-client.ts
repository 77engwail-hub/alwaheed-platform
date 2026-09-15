const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In browser, relative URL avoids cross-origin and private network access restrictions
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  // Server-side (Node.js runtime) requires absolute URL
  return 'http://127.0.0.1:4000/api/v1';
};

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 30 }, // ISR caching
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `API Error: ${res.statusText}`);
    }

    return data.data !== undefined ? data.data : data;
  } catch (err: any) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw err;
  }
}
