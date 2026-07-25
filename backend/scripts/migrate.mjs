#!/usr/bin/env node
// Retries prisma migrate deploy until the DB is reachable (handles Render cold-start)
import { execSync } from 'child_process';

const MAX = 10;
const WAIT = 5000;

for (let i = 1; i <= MAX; i++) {
  try {
    console.log(`[migrate] attempt ${i}/${MAX}...`);
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('[migrate] done.');
    process.exit(0);
  } catch {
    if (i === MAX) { console.error('[migrate] all attempts failed.'); process.exit(1); }
    console.log(`[migrate] failed, retrying in ${WAIT / 1000}s...`);
    await new Promise(r => setTimeout(r, WAIT));
  }
}
