export function sanitizeHeaders(
  headers: Record<string, string | string[] | undefined>,
  options?: { redactHeaders?: boolean, redactCookies?: boolean }
): Record<string, string | string[] | undefined> {
  if (options?.redactHeaders === false && options?.redactCookies === false) return headers;
  
  const safeHeaders = { ...headers };
  const redactKeys = [];
  if (options?.redactHeaders !== false) redactKeys.push('authorization', 'x-api-key', 'secret', 'token');
  if (options?.redactCookies !== false) redactKeys.push('cookie', 'session');
  
  for (const key of Object.keys(safeHeaders)) {
    if (redactKeys.some(r => key.toLowerCase().includes(r))) {
      safeHeaders[key] = '[REDACTED]';
    }
  }
  return safeHeaders;
}

export function sanitizeBody(body: any, options?: { captureBodies?: boolean, maxPayloadSize?: number }): any {
  if (options?.captureBodies === false) return '[BODY_CAPTURE_DISABLED]';
  if (!body || typeof body !== 'object') {
    // Drop large string payloads
    if (typeof body === 'string') {
      const max = options?.maxPayloadSize || 4096;
      if (body.length > max) return '[TRUNCATED_EXCEEDED_MAX_SIZE]';
    }
    return body;
  }

  try {
    const payloadStr = JSON.stringify(body);
    const max = options?.maxPayloadSize || 4096;
    if (payloadStr.length > max) return '[TRUNCATED_EXCEEDED_MAX_SIZE]';

    const safeBody = JSON.parse(payloadStr); // Deep copy
    const redactKeys = ['password', 'token', 'secret', 'creditcard', 'ssn'];

    function recursiveRedact(obj: any) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          recursiveRedact(obj[key]);
        } else if (redactKeys.some(r => key.toLowerCase().includes(r))) {
          obj[key] = '[REDACTED]';
        }
      }
    }

    recursiveRedact(safeBody);
    return safeBody;
  } catch {
    return '[UNABLE_TO_SANITIZE]';
  }
}
