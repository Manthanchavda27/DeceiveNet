import { Request, Response, NextFunction } from 'express';
import { err } from '../lib/response.js';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'deceivenet-super-secret-jwt-key-min-32-chars-2024';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json(err('AUTH_REQUIRED', 'Missing or invalid Authorization header', undefined, req.requestId));
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, SECRET, {
      issuer: 'deceivenet',
      audience: 'api',
    });
    if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
      throw new Error('invalid_token_payload');
    }

    req.userId = (decoded as jwt.JwtPayload).sub;
    req.userRole = (decoded as any).role;
    next();
  } catch (e) {
    console.error("JWT VERIFY ERROR:", e);
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
      requestId: req.requestId
    });
    return;
  }
}

export function requireRole(...roles: string[]) {
  return function roleGuard(req: Request, res: Response, next: NextFunction) {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json(err('AUTH_FORBIDDEN', 'Insufficient permissions', undefined, req.requestId));
      return;
    }
    next();
  };
}
