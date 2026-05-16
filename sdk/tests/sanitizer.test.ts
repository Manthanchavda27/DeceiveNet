import { describe, it, expect } from 'vitest';
import { sanitizeHeaders, sanitizeBody } from '../src/sanitizer';

describe('Sanitizer', () => {
  it('redacts sensitive headers', () => {
    const headers = { 'authorization': 'Bearer token', 'content-type': 'application/json' };
    const safe = sanitizeHeaders(headers);
    expect(safe['authorization']).toBe('[REDACTED]');
    expect(safe['content-type']).toBe('application/json');
  });

  it('redacts sensitive body fields deeply', () => {
    const body = { user: 'john', password: 'secretpassword', nested: { token: '123' } };
    const safe = sanitizeBody(body);
    expect(safe.password).toBe('[REDACTED]');
    expect(safe.nested.token).toBe('[REDACTED]');
    expect(safe.user).toBe('john');
  });

  it('drops body if disabled by privacy flags', () => {
    const body = { data: 'test' };
    const safe = sanitizeBody(body, { captureBodies: false });
    expect(safe).toBe('[BODY_CAPTURE_DISABLED]');
  });

  it('truncates large strings', () => {
    const huge = "a".repeat(5000);
    const safe = sanitizeBody(huge, { maxPayloadSize: 4096 });
    expect(safe).toBe('[TRUNCATED_EXCEEDED_MAX_SIZE]');
  });
});
