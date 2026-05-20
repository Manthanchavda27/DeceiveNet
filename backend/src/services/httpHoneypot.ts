import express, { Request, Response } from 'express';
import { Server } from 'http';
import { prisma } from '../lib/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { broadcastEvent } from '../index.js';

// Simple Rate Limit in memory to protect the honeypot
const rateLimit = new Map<string, number>();

setInterval(() => {
  rateLimit.clear();
}, 60000); // Clear every minute

export function createHttpHoneypot(honeypotId: string, port: number): Server {
  const app = express();
  
  // Truncate payloads to prevent SQLite explosion
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Middleware to capture all traffic
  app.use(async (req: Request, res: Response) => {
    // Basic Rate Limiting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const count = (rateLimit.get(ip) || 0) + 1;
    rateLimit.set(ip, count);

    if (count > 50) {
      // Drop connection to prevent flooding
      req.socket.destroy();
      return;
    }

    const path = req.path;
    const method = req.method;
    const headers = req.headers;
    const payload = req.body;
    const rawQuery = req.url;

    // Simulated Attack Detection Engine
    let attackType = 'probe';
    let severity = 'low';
    let severityScore = 1;

    const combinedPayload = JSON.stringify(payload) + rawQuery;
    
    if (/union\s+select/i.test(combinedPayload) || /' OR '1'='1/i.test(combinedPayload)) {
      attackType = 'SQL Injection';
      severity = 'critical';
      severityScore = 9;
    } else if (/<script>|javascript:/i.test(combinedPayload)) {
      attackType = 'Cross-Site Scripting (XSS)';
      severity = 'high';
      severityScore = 7;
    } else if (/\.\.\//.test(combinedPayload) || /etc\/passwd/.test(combinedPayload)) {
      attackType = 'Path Traversal';
      severity = 'high';
      severityScore = 8;
    } else if (headers['user-agent']?.includes('nmap') || headers['user-agent']?.includes('masscan')) {
      attackType = 'Scanner';
      severity = 'medium';
      severityScore = 4;
    } else if (path === '/login' || path === '/admin') {
      attackType = 'Credential Access';
      severity = 'high';
      severityScore = 6;
    }

    try {
      // Save Event to DB
      const event = await prisma.event.create({
        data: {
          eventUuid: uuidv4(),
          honeypotId,
          timestamp: new Date(),
          severity,
          severityScore,
          attackType,
          sourceIp: ip,
          protocol: 'HTTP',
          rawData: {
            method,
            path,
            headers,
            payload: payload && Object.keys(payload).length > 0 ? payload : undefined,
          },
          targetPort: port,
        },
        include: {
          honeypot: { select: { name: true, userId: true } }
        }
      });
      console.log(`[Honeypot ${port}] Event saved: ${event.id}`);

      // Broadcast telemetry ONLY to the owner via WebSocket
      if (event.honeypot?.userId) {
        broadcastEvent(event.honeypot.userId, {
          id: event.id,
          honeypotId: event.honeypotId,
          honeypotName: event.honeypot.name,
          attackType: event.attackType,
          severity: event.severity,
          sourceIp: event.sourceIp,
          timestamp: event.timestamp,
        });
      }
    } catch (e: any) {
      console.error(`[Honeypot ${port}] Failed to save event:`, e?.message || e);
    }

    // Always simulate generic vulnerable response
    res.set('Server', 'Apache/2.4.41 (Ubuntu)');
    res.set('X-Powered-By', 'PHP/7.4.3');
    
    if (path.includes('login') || path.includes('admin')) {
      res.status(200).send('<html><body><h1>Admin Portal</h1><form method="POST"><input name="user"/><input name="pass" type="password"/><button>Login</button></form></body></html>');
    } else {
      res.status(200).send('<html><body><h1>It works!</h1></body></html>');
    }
  });

  return app.listen(port, () => {
    console.log(`[Runtime] Honeypot ${honeypotId} listening on port ${port}`);
  });
}
