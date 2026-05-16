import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'deceivenet-super-secret-jwt-key-min-32-chars-2024';

export interface AccessClaims {
  sub: string;
  role: string;
}

export function signAccess(
  payload: AccessClaims,
  expiresIn: jwt.SignOptions['expiresIn'] = '15m'
): string {
  return jwt.sign(payload, SECRET, { expiresIn, issuer: 'deceivenet', audience: 'api' });
}

export function verifyAccess(token: string): AccessClaims {
  const decoded = jwt.verify(token, SECRET, {
    issuer: 'deceivenet',
    audience: 'api',
  });
  if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object')
    throw new Error('invalid_token');
  const sub = (decoded as jwt.JwtPayload).sub;
  const role = (decoded as { role?: string }).role;
  if (!sub || !role) throw new Error('invalid_token');
  return { sub, role };
}
