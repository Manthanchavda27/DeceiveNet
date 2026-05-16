import { randomUUID } from 'node:crypto';

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return { success: true as const, data, meta };
}

export function err(
  code: string,
  message: string,
  details?: Record<string, unknown>,
  requestId?: string
) {
  return {
    success: false as const,
    error: { code, message, details },
    request_id: requestId ?? randomUUID(),
  };
}
