export interface DetectionResult {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  type: string;
}

export function detectSqlInjection(payload: string): DetectionResult {
  if (/union\s+select/i.test(payload) || /' OR '1'='1/i.test(payload)) {
    return { detected: true, severity: 'critical', confidence: 0.9, type: 'SQL Injection' };
  }
  return { detected: false, severity: 'low', confidence: 0, type: '' };
}

export function detectXss(payload: string): DetectionResult {
  if (/<script>|javascript:/i.test(payload)) {
    return { detected: true, severity: 'high', confidence: 0.8, type: 'Cross-Site Scripting (XSS)' };
  }
  return { detected: false, severity: 'low', confidence: 0, type: '' };
}

export function detectPathTraversal(payload: string): DetectionResult {
  if (/\.\.\//.test(payload) || /etc\/passwd/.test(payload)) {
    return { detected: true, severity: 'high', confidence: 0.85, type: 'Path Traversal' };
  }
  return { detected: false, severity: 'low', confidence: 0, type: '' };
}

export function detectScanners(userAgent: string): DetectionResult {
  if (userAgent.includes('nmap') || userAgent.includes('masscan')) {
    return { detected: true, severity: 'medium', confidence: 0.95, type: 'Scanner' };
  }
  return { detected: false, severity: 'low', confidence: 0, type: '' };
}
