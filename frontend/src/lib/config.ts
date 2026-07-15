const DEFAULT_API_ORIGIN = 'http://localhost:3000';

function normalizeOrigin(value: string | undefined) {
  if (!value) return undefined;
  return value.replace(/\/+$/, '');
}

export const API_ORIGIN = normalizeOrigin(import.meta.env.VITE_API_URL) ?? DEFAULT_API_ORIGIN;
export const API_BASE_URL = `${API_ORIGIN}/api`;

export function getWebSocketUrl() {
  if (import.meta.env.VITE_WS_URL) {
    const wsUrl = normalizeOrigin(import.meta.env.VITE_WS_URL)!;
    return wsUrl.endsWith('/api/ws') ? wsUrl : `${wsUrl}/api/ws`;
  }

  const url = new URL(API_ORIGIN);
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${url.host}/api/ws`;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof TypeError) {
    return import.meta.env.PROD && !import.meta.env.VITE_API_URL
      ? 'The production API URL is not configured. Set VITE_API_URL in Netlify and redeploy.'
      : 'Unable to reach the API. Please check that the backend server is running.';
  }

  return error instanceof Error ? error.message : fallback;
}
