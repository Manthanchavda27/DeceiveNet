import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL;
console.log('URL set:', Boolean(url));
if (url) {
  console.log('URL host:', url.replace(/:[^:@]+@/, ':***@'));
}

const prisma = new PrismaClient();

try {
  const r = await prisma.$queryRawUnsafe('SELECT 1 as ok');
  console.log('DB_OK', r);
  const tables = await prisma.$queryRawUnsafe(
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
  );
  console.log('TABLES', tables);
  const users = await prisma.user.count().catch((e) => ({ error: e.message }));
  console.log('USER_COUNT', users);
} catch (e) {
  console.error('DB_FAIL', e.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
