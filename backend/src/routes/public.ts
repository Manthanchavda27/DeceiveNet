import { Router, Request, Response } from 'express';
import { ok } from '../lib/response.js';
import { prisma } from '../lib/prisma.js';
import { getRedis } from '../lib/redis.js';

function safeDbError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  // Never leak connection strings / passwords in public health responses
  return message
    .replace(/postgresql:\/\/[^\s"']+/gi, 'postgresql://***')
    .replace(/neon\.tech[^\s"']*/gi, 'neon.tech/***')
    .slice(0, 240);
}

export function registerPublicRoutes() {
  const router = Router();

  router.get('/health', async (req: Request, res: Response) => {
    let database: 'ok' | 'error' = 'ok';
    let databaseError: string | undefined;
    const databaseConfigured = Boolean(process.env.DATABASE_URL);

    if (!databaseConfigured) {
      database = 'error';
      databaseError = 'DATABASE_URL is not set on this host';
    } else {
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (e) {
        database = 'error';
        databaseError = safeDbError(e);
      }
    }

    let redis: 'ok' | 'skipped' | 'error' = 'skipped';
    const r = getRedis();
    if (r) {
      redis = 'ok';
      try {
        await r.ping();
      } catch {
        redis = 'error';
      }
    }

    res.json(
      ok({
        status: database === 'ok' ? 'ok' : 'degraded',
        version: '0.1.0',
        uptime_seconds: Math.floor(process.uptime()),
        dependencies: {
          database,
          databaseConfigured,
          databaseError,
          redis,
          broker: 'skipped',
        },
      })
    );
  });

  router.get('/version', (req: Request, res: Response) => {
    res.json(ok({ name: 'deceivenet-backend', version: '0.1.0', tagline: 'Catch Every Intruder' }));
  });

  router.get('/ready', async (req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json(ok({ ready: true }));
    } catch {
      res.status(503).json({ success: false, error: { code: 'NOT_READY', message: 'Database unavailable' } });
    }
  });

  return router;
}
