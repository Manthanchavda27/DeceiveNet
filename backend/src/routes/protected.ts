import { Router, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { runtimeManager } from '../services/runtimeManager.js';
import { getRedis } from '../lib/redis.js';
import { ok, err } from '../lib/response.js';

const pagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});

function badQuery(res: Response, req: Request, error: ZodError) {
  res.status(400).json(err('VALIDATION_ERROR', 'Invalid query', { issues: error.flatten() }, req.requestId));
}

export function registerProtectedRoutes() {
  const router = Router();

  router.get('/users/me', async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: req.userId! },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
          mfaEnabled: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });
      res.json(ok(user));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.get('/honeypots', async (req: Request, res: Response) => {
    try {
      const q = pagination.safeParse(req.query);
      if (!q.success) {
        return badQuery(res, req, q.error);
      }
      const { page, per_page } = q.data;
      const where: Prisma.HoneypotWhereInput = { userId: req.userId! };
      const [total, rows] = await prisma.$transaction([
        prisma.honeypot.count({ where }),
        prisma.honeypot.findMany({
          where,
          skip: (page - 1) * per_page,
          take: per_page,
          orderBy: { deployedAt: 'desc' },
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            port: true,
            tags: true,
            deployedAt: true,
            lastActiveAt: true,
            containerId: true,
          },
        }),
      ]);
      res.json(ok(rows, {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page) || 1,
      }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.get('/honeypots/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const hp = await prisma.honeypot.findFirst({
        where: { id, userId: req.userId },
        include: { decoyServices: true },
      });
      if (!hp) {
        res.status(404).json(err('HONEYPOT_NOT_FOUND', 'Honeypot not found', undefined, req.requestId));
        return;
      }
      res.json(ok(hp));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.post('/honeypots', async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { message: 'Unauthorized user' }, requestId: req.requestId });
        return;
      }

      const body = req.body;
      if (!body?.name || !body?.type || (body.type !== 'SDK' && body.port == null)) {
        res.status(400).json({ success: false, error: { message: 'Missing required fields' }, requestId: req.requestId });
        return;
      }

      if (body.port != null) {
        const existing = await prisma.honeypot.findFirst({
          where: { port: body.port }
        });

        if (existing) {
          res.status(400).json({ success: false, error: { message: 'Port already in use' }, requestId: req.requestId });
          return;
        }
      }

      let hp;
      try {
        hp = await prisma.honeypot.create({
          data: {
            name: body.name,
            type: body.type,
            status: 'deploying',
            port: body.port,
            bindAddress: '0.0.0.0',
            config: (body.config ?? {}) as Prisma.InputJsonValue,
            tags: body.tags ? JSON.stringify(body.tags) : '[]',
            deployedAt: new Date(),
            lastActiveAt: new Date(),
            userId: req.userId!,
            metadata: { note: 'Provisioning...' } as Prisma.InputJsonValue,
          },
        });
        
        if (hp.type === 'SDK') {
          hp = await prisma.honeypot.update({ where: { id: hp.id }, data: { status: 'running' }});
        } else {
          // Start runtime
          const started = await runtimeManager.start(hp.id, hp.port!, hp.type);
          if (started) {
            hp = await prisma.honeypot.update({ where: { id: hp.id }, data: { status: 'running' }});
          } else {
            hp = await prisma.honeypot.update({ where: { id: hp.id }, data: { status: 'error' }});
          }
        }
      } catch (prismaError: any) {
        res.status(400).json({
          success: false,
          error: { message: prismaError.message || 'Prisma validation failed' },
          stack: prismaError.stack,
          requestId: req.requestId
        });
        return;
      }

      res.status(201).json(ok(hp));
    } catch (e: any) {
      res.status(500).json({
        success: false,
        error: { message: e.message || 'Internal error' },
        stack: e.stack,
        requestId: req.requestId
      });
    }
  });

  router.post('/honeypots/:id/start', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const hp = await prisma.honeypot.findFirst({ where: { id, userId: req.userId } });
      if (!hp) return res.status(404).json(err('NOT_FOUND', 'Honeypot not found', undefined, req.requestId));
      
      const started = await runtimeManager.start(hp.id, hp.port!, hp.type);
      const newStatus = started ? 'running' : 'error';
      const updated = await prisma.honeypot.update({ where: { id: hp.id }, data: { status: newStatus } });
      res.json(ok(updated));
    } catch (e) { res.status(500).json(err('INTERNAL_ERROR', 'Update failed', undefined, req.requestId)); }
  });

  router.post('/honeypots/:id/stop', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const hp = await prisma.honeypot.findFirst({ where: { id, userId: req.userId } });
      if (!hp) return res.status(404).json(err('NOT_FOUND', 'Honeypot not found', undefined, req.requestId));
      
      await runtimeManager.stop(hp.id);
      const updated = await prisma.honeypot.update({ where: { id: hp.id }, data: { status: 'stopped' } });
      res.json(ok(updated));
    } catch (e) { res.status(500).json(err('INTERNAL_ERROR', 'Update failed', undefined, req.requestId)); }
  });

  router.delete('/honeypots/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const hp = await prisma.honeypot.findFirst({ where: { id, userId: req.userId } });
      if (!hp) return res.status(404).json(err('NOT_FOUND', 'Honeypot not found', undefined, req.requestId));
      
      await runtimeManager.stop(hp.id);
      await prisma.honeypot.delete({ where: { id: hp.id } });
      res.json(ok({ deleted: true }));
    } catch (e) { res.status(500).json(err('INTERNAL_ERROR', 'Delete failed', undefined, req.requestId)); }
  });

  router.get('/events', async (req: Request, res: Response) => {
    try {
      const q = pagination.safeParse(req.query);
      if (!q.success) {
        return badQuery(res, req, q.error);
      }
      const { page, per_page } = q.data;
      const [total, rows] = await prisma.$transaction([
        prisma.event.count({ where: { honeypot: { userId: req.userId } } }),
        prisma.event.findMany({
          where: { honeypot: { userId: req.userId } },
          skip: (page - 1) * per_page,
          take: per_page,
          orderBy: { timestamp: 'desc' },
        }),
      ]);
      res.json(ok(rows, {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page) || 1,
      }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.get('/analytics/overview', async (req: Request, res: Response) => {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [activeHoneypots, totalAttacks, criticalAlerts] = await prisma.$transaction([
        prisma.honeypot.count({ where: { userId: req.userId!, status: 'running' } }),
        prisma.event.count({ where: { honeypot: { userId: req.userId! }, timestamp: { gte: since } } }),
        prisma.event.count({
          where: { honeypot: { userId: req.userId! }, severity: 'critical', timestamp: { gte: since } },
        }),
      ]);
      const uniqueAttackers = await prisma.event.groupBy({
        by: ['sourceIp'],
        where: { honeypot: { userId: req.userId! }, timestamp: { gte: since } },
        _count: true,
      });
      res.json(ok({
        active_honeypots: activeHoneypots,
        total_attacks_24h: totalAttacks,
        unique_attackers_24h: uniqueAttackers.length,
        critical_alerts_24h: criticalAlerts,
        trends: { note: 'Compare against previous 24h window' },
      }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.get('/alerts/rules', async (req: Request, res: Response) => {
    try {
      const q = pagination.safeParse(req.query);
      if (!q.success) {
        return badQuery(res, req, q.error);
      }
      const { page, per_page } = q.data;
      const [total, rows] = await prisma.$transaction([
        prisma.alertRule.count({ where: { createdById: req.userId! } }),
        prisma.alertRule.findMany({
          where: { createdById: req.userId! },
          skip: (page - 1) * per_page,
          take: per_page,
          orderBy: { createdAt: 'desc' },
        }),
      ]);
      res.json(ok(rows, {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page) || 1,
      }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.get('/webhooks', async (req: Request, res: Response) => {
    try {
      const q = pagination.safeParse(req.query);
      if (!q.success) {
        return badQuery(res, req, q.error);
      }
      const { page, per_page } = q.data;
      const [total, rows] = await prisma.$transaction([
        prisma.webhook.count({ where: { userId: req.userId! } }),
        prisma.webhook.findMany({
          where: { userId: req.userId! },
          skip: (page - 1) * per_page,
          take: per_page,
          select: {
            id: true,
            name: true,
            url: true,
            eventsSubscribed: true,
            enabled: true,
            createdAt: true,
          },
        }),
      ]);
      res.json(ok(rows, {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page) || 1,
      }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.get('/audit-logs', async (req: Request, res: Response) => {
    try {
      const q = pagination.safeParse(req.query);
      if (!q.success) {
        return badQuery(res, req, q.error);
      }
      const { page, per_page } = q.data;
      const [total, rows] = await prisma.$transaction([
        prisma.auditLog.count({ where: { userId: req.userId! } }),
        prisma.auditLog.findMany({
          where: { userId: req.userId! },
          skip: (page - 1) * per_page,
          take: per_page,
          orderBy: { timestamp: 'desc' },
        }),
      ]);
      res.json(ok(rows, {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page) || 1,
      }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.post('/internal/demo-event', async (req: Request, res: Response) => {
    try {
      let hp = await prisma.honeypot.findFirst();
      if (!hp) {
        // Create a dummy honeypot if none exists
        hp = await prisma.honeypot.create({
          data: {
            name: 'Demo-Honeypot-01',
            type: 'SSH',
            status: 'running',
            port: 22,
            bindAddress: '0.0.0.0',
            config: {} as Prisma.InputJsonValue,
            tags: '["demo", "ssh"]',
            deployedAt: new Date(),
            lastActiveAt: new Date(),
            userId: req.userId!,
          }
        });
      }
      const eventUuid = randomUUID();
      const ev = await prisma.event.create({
        data: {
          eventUuid,
          honeypotId: hp?.id,
          timestamp: new Date(),
          severity: 'medium',
          severityScore: 55,
          attackType: 'http_probe',
          sourceIp: '198.51.100.10',
          sourcePort: 4242,
          protocol: 'tcp',
          status: 'new',
          rawData: { demo: true } as Prisma.InputJsonValue,
          sourceGeo: { country: 'US', city: 'Demo' } as Prisma.InputJsonValue,
        },
      });

      const redis = getRedis();
      if (redis) {
        redis.publish('events:new', JSON.stringify(ev)).catch((err) => console.error('Failed to publish demo event', err));
      } else {
        if (req.app.locals.broadcastWs) {
          req.app.locals.broadcastWs({
            type: 'event.processed',
            id: ev.eventUuid,
            timestamp: ev.timestamp.toISOString(),
            data: ev,
          });
        }
      }
      res.status(201).json(ok(ev));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  return router;
}
