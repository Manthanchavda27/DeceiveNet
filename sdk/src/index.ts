import { Request, Response, NextFunction } from 'express';
import { TelemetryDispatcher } from './dispatcher';
import { detectSqlInjection, detectXss, detectPathTraversal, detectScanners } from './detectors';
import { sanitizeHeaders, sanitizeBody } from './sanitizer';

export interface SDKConfig {
  projectId: string;
  token: string;
  endpoint?: string;
  interceptRoutes?: string[];
  debug?: boolean;
  privacy?: {
    redactHeaders?: boolean;
    redactCookies?: boolean;
    captureBodies?: boolean;
    maxPayloadSize?: number;
  };
}

export function DeceiveNet(config: SDKConfig) {
  if (!config.projectId || !config.token) {
    throw new Error('DeceiveNet SDK: projectId and token are required.');
  }

  const dispatcher = new TelemetryDispatcher({
    projectId: config.projectId,
    token: config.token,
    endpoint: config.endpoint,
    debug: config.debug,
    privacy: config.privacy
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    // Fail silently, never block the user's application
    try {
      // Fast path exit if routes are specified and we don't match
      if (config.interceptRoutes && config.interceptRoutes.length > 0) {
        const matches = config.interceptRoutes.some(r => req.path.startsWith(r));
        if (!matches) return next();
      }

      const method = req.method;
      const path = req.path;
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      
      const safeHeaders = sanitizeHeaders(req.headers, config.privacy);
      const safeBody = sanitizeBody(req.body, config.privacy);
      const rawQuery = req.url;

      const combinedPayload = JSON.stringify(req.body) + rawQuery;

      // Run detectors
      const detections = [
        detectSqlInjection(combinedPayload),
        detectXss(combinedPayload),
        detectPathTraversal(combinedPayload),
        detectScanners(req.headers['user-agent'] || '')
      ];

      const highestThreat = detections.reduce((prev, current) => {
        return (current.detected && current.confidence > prev.confidence) ? current : prev;
      }, { detected: false, severity: 'low', confidence: 0, type: 'probe' });

      // Always log the event if it hit the middleware
      dispatcher.enqueue({
        timestamp: new Date().toISOString(),
        severity: highestThreat.severity,
        attackType: highestThreat.type,
        sourceIp: ip,
        protocol: 'HTTP',
        rawData: {
          method,
          path,
          headers: safeHeaders,
          payload: safeBody && Object.keys(safeBody).length > 0 ? safeBody : undefined
        }
      });

    } catch (e) {
      // Do nothing. Never crash the host app.
      console.error('[DeceiveNet SDK] Internal Error', e);
    }

    next();
  };
}
