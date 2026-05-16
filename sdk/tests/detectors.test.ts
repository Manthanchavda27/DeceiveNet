import { describe, it, expect } from 'vitest';
import { detectSqlInjection, detectXss, detectPathTraversal } from '../src/detectors';

describe('Detectors', () => {
  it('detects SQL Injection', () => {
    const res = detectSqlInjection("admin' OR '1'='1");
    expect(res.detected).toBe(true);
    expect(res.type).toBe('SQL Injection');
  });

  it('detects XSS', () => {
    const res = detectXss("<script>alert(1)</script>");
    expect(res.detected).toBe(true);
    expect(res.type).toBe('Cross-Site Scripting (XSS)');
  });

  it('detects Path Traversal', () => {
    const res = detectPathTraversal("../../../etc/passwd");
    expect(res.detected).toBe(true);
  });

  it('ignores safe traffic', () => {
    const res = detectSqlInjection("John Doe");
    expect(res.detected).toBe(false);
  });
});
