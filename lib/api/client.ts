/**
 * Backend API Client
 * All API calls go through the FastAPI backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Get user ID from localStorage (set after OAuth login)
 */
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
}

/**
 * Make authenticated API request to backend
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${BACKEND_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  // Get user ID and add to headers
  const userId = getUserId();

  // Add credentials to include cookies
  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-Id': userId }),
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * API endpoints
 */
export const api = {
  // Chat endpoints
  chat: {
    send: (data: any) => apiRequest('/api/chat', { method: 'POST', body: JSON.stringify(data) }),
    getById: (chatId: string) => apiRequest(`/api/chat/${chatId}`),
    getHistory: () => apiRequest('/api/chat/history'),
    delete: (chatId: string) => apiRequest(`/api/chat/${chatId}`, { method: 'DELETE' }),
    getMessages: (chatId: string) => apiRequest(`/api/chat/${chatId}/messages`),
  },

  // Document endpoints
  document: {
    create: (data: any) => apiRequest('/api/document', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string, createdAt: string) => apiRequest(`/api/document/${id}`, { params: { created_at: createdAt } }),
    update: (id: string, createdAt: string, data: any) =>
      apiRequest(`/api/document/${id}`, { method: 'PATCH', params: { created_at: createdAt }, body: JSON.stringify(data) }),
    delete: (id: string, createdAt: string) =>
      apiRequest(`/api/document/${id}`, { method: 'DELETE', params: { created_at: createdAt } }),
    list: () => apiRequest('/api/document'),
  },

  // Vote endpoints
  vote: {
    create: (data: { chatId: string; messageId: string; isUpvoted: boolean }) =>
      apiRequest('/api/vote', { method: 'POST', body: JSON.stringify(data) }),
    get: (chatId: string, messageId: string) => apiRequest(`/api/vote/${chatId}/${messageId}`),
  },

  // Suggestion endpoints
  suggestion: {
    create: (data: any) => apiRequest('/api/document/suggestions', { method: 'POST', body: JSON.stringify(data) }),
    list: (documentId: string, createdAt: string) =>
      apiRequest(`/api/document/suggestions/${documentId}`, { params: { created_at: createdAt } }),
  },

  // Auth endpoints
  auth: {
    status: () => apiRequest('/auth/status'),
    me: () => apiRequest('/auth/me'),
    establishSession: (userId: string) =>
      apiRequest('/auth/establish-session', { method: 'POST', body: JSON.stringify({ user_id: userId }) }),
  },
};

/**
 * Get backend URL for direct usage (e.g., in DefaultChatTransport)
 */
export function getBackendUrl(path: string = ''): string {
  return `${BACKEND_URL}${path}`;
}
