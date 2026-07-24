import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Neon sometimes appends `channel_binding=require`, which breaks Prisma/pg
 * on several hosted runtimes (including Render). Strip it before connecting.
 */
function sanitizeDatabaseUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.searchParams.delete('channel_binding');
    return url.toString();
  } catch {
    return raw
      .replace(/([?&])channel_binding=[^&]*&?/gi, '$1')
      .replace(/[?&]$/, '')
      .replace(/\?&/, '?');
  }
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = sanitizeDatabaseUrl(process.env.DATABASE_URL);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
