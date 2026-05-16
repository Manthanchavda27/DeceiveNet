import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'node:crypto';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { ok, err } from '../lib/response.js';
import { signAccess } from '../lib/jwt.js';

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters');

const registerSchema = z.object({
  username: z.string().min(3).max(64),
  email: z.string().email(),
  password: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

function hashRefresh(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}

async function appendAudit(entry: {
  userId?: string | null;
  username: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: any;
  ip?: string;
  userAgent?: string;
}) {
  const prev = await prisma.auditLog.findFirst({ orderBy: { timestamp: 'desc' } });
  const payload = JSON.stringify({
    prev: prev?.tamperHash ?? 'genesis',
    ...entry,
    ts: new Date().toISOString(),
  });
  const tamperHash = createHash('sha256').update(payload).digest('hex');
  await prisma.auditLog.create({
    data: {
      userId: entry.userId,
      username: entry.username,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      details: entry.details === undefined ? Prisma.JsonNull : entry.details,
      ipAddress: entry.ip,
      userAgent: entry.userAgent,
      tamperHash,
    },
  });
}

export function registerAuthRoutes() {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(err('VALIDATION_ERROR', 'Invalid body', { issues: parsed.error.flatten() }, req.requestId));
        return;
      }
      const pw = passwordSchema.safeParse(parsed.data.password);
      if (!pw.success) {
        res.status(400).json(
          err(
            'VALIDATION_ERROR',
            'Password must be at least 6 characters',
            undefined,
            req.requestId
          )
        );
        return;
      }
      const { username, email, password } = parsed.data;
      const passwordHash = await bcrypt.hash(password, 12);
      
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
          role: 'viewer',
          status: 'active',
        },
      });
      await appendAudit({
        userId: user.id,
        username: user.username,
        action: 'create',
        resourceType: 'user',
        resourceId: user.id,
        details: { email: user.email },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.status(201).json(
        ok({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        })
      );
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        res.status(409).json(err('AUTH_DUPLICATE', 'Username or email already registered', undefined, req.requestId));
        return;
      }
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(err('VALIDATION_ERROR', 'Invalid body', { issues: parsed.error.flatten() }, req.requestId));
        return;
      }
      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.status === 'disabled') {
        await appendAudit({
          userId: null,
          username: email,
          action: 'login',
          resourceType: 'session',
          resourceId: 'login',
          details: { success: false, reason: 'unknown_user' },
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        });
        res.status(401).json(err('AUTH_INVALID_CREDENTIALS', 'Invalid email or password', undefined, req.requestId));
        return;
      }
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        res.status(423).json(err('AUTH_LOCKED', 'Account temporarily locked', undefined, req.requestId));
        return;
      }
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        const fails = user.failedAttempts + 1;
        const lock =
          fails >= 5
            ? { failedAttempts: 0, lockoutUntil: new Date(Date.now() + 15 * 60 * 1000) }
            : { failedAttempts: fails, lockoutUntil: null as Date | null };
        await prisma.user.update({
          where: { id: user.id },
          data: lock,
        });
        await appendAudit({
          userId: user.id,
          username: user.username,
          action: 'login',
          resourceType: 'session',
          resourceId: 'login',
          details: { success: false },
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        });
        res.status(401).json(err('AUTH_INVALID_CREDENTIALS', 'Invalid email or password', undefined, req.requestId));
        return;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lockoutUntil: null, lastLoginAt: new Date() },
      });
      const refreshRaw = randomBytes(48).toString('base64url');
      const refreshHash = hashRefresh(refreshRaw);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({
        data: { userId: user.id, tokenHash: refreshHash, expiresAt },
      });
      const accessToken = signAccess({ sub: user.id, role: user.role });
      await appendAudit({
        userId: user.id,
        username: user.username,
        action: 'login',
        resourceType: 'session',
        resourceId: 'login',
        details: { success: true },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      res.json(
        ok({
          token: accessToken,
          refreshToken: refreshRaw,
          expiresIn: 900,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        })
      );
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.post('/refresh', async (req: Request, res: Response) => {
    try {
      const parsed = refreshSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(err('VALIDATION_ERROR', 'Invalid body', undefined, req.requestId));
        return;
      }
      const hash = hashRefresh(parsed.data.refreshToken);
      const existing = await prisma.refreshToken.findFirst({
        where: { tokenHash: hash, revoked: false, expiresAt: { gt: new Date() } },
      });
      if (!existing) {
        res.status(401).json(err('AUTH_INVALID_REFRESH', 'Refresh token invalid', undefined, req.requestId));
        return;
      }
      const user = await prisma.user.findUnique({ where: { id: existing.userId } });
      if (!user || user.status !== 'active') {
        res.status(401).json(err('AUTH_USER_INACTIVE', 'User inactive', undefined, req.requestId));
        return;
      }
      await prisma.refreshToken.update({ where: { id: existing.id }, data: { revoked: true } });
      const newRaw = randomBytes(48).toString('base64url');
      const newHash = hashRefresh(newRaw);
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: newHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      const accessToken = signAccess({ sub: user.id, role: user.role });
      res.json(ok({ token: accessToken, refreshToken: newRaw, expiresIn: 900 }));
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  router.post('/logout', async (req: Request, res: Response) => {
    try {
      const parsed = refreshSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json(err('VALIDATION_ERROR', 'Invalid body', undefined, req.requestId));
        return;
      }
      const hash = hashRefresh(parsed.data.refreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hash },
        data: { revoked: true },
      });
      res.status(204).send();
    } catch (e) {
      console.error(e);
      res.status(500).json(err('INTERNAL_ERROR', 'Database error', undefined, req.requestId));
    }
  });

  return router;
}
