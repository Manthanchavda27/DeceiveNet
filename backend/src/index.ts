import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { verifyAccess } from './lib/jwt.js';
import { prisma } from './lib/prisma.js';
import { registerPublicRoutes } from './routes/public.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerProtectedRoutes } from './routes/protected.js';
import { requireAuth } from './middleware/auth.js';
import { sdkRouter } from './routes/sdk.js';
import { getRedis } from './lib/redis.js';

const PORT = Number(process.env.PORT ?? 3000);
const DEFAULT_CORS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://deceivenet.netlify.app',
];
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
  : DEFAULT_CORS;

type WsClient = { socket: WebSocket; userId: string };

const wsClients = new Set<WsClient>();

export function broadcastEvent(userId: string, obj: unknown) {
  const msg = JSON.stringify(obj);
  for (const c of wsClients) {
    if (c.userId === userId) {
      try {
        if (c.socket.readyState === WebSocket.OPEN) {
          c.socket.send(msg);
        }
      } catch {
        /* ignore */
      }
    }
  }
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/api/ws' });

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTHENTICATED ?? 300),
});
app.use(limiter);

app.use((req, res, next) => {
  req.requestId =
    (req.headers['x-request-id'] as string) ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  next();
});

const subscriber = getRedis()?.duplicate();
if (subscriber) {
  subscriber.subscribe('events:new').catch((err) => {
    console.error('Failed to subscribe to events:new Redis channel', err);
  });

  subscriber.on('message', (_channel, _message) => {
    // Redis broadcasting is skipped for now because we broadcast directly
    // based on user isolation in httpHoneypot.ts
  });
}

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'DeceiveNet API running', docs: '/api/health' });
});

// Routes
app.use('/api', registerPublicRoutes());
app.use('/api/auth', registerAuthRoutes());
app.use('/api/sdk', sdkRouter);

const protectedRouter = registerProtectedRoutes();
app.use('/api', requireAuth, protectedRouter);

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    ws.close(1008, 'missing token');
    return;
  }
  let userId: string;
  try {
    const claims = verifyAccess(token);
    userId = claims.sub;
  } catch {
    ws.close(1008, 'invalid token');
    return;
  }

  const client: WsClient = { socket: ws, userId };
  wsClients.add(client);

  ws.send(
    JSON.stringify({
      type: 'system.connected',
      timestamp: new Date().toISOString(),
      data: { message: 'Connected to DeceiveNet real-time relay. Listening for events.' },
    })
  );

  ws.on('message', (raw) => {
    const text = raw.toString();
    if (text === 'ping' || text === '{"type":"ping"}') {
      ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
    }
  });

  ws.on('close', () => {
    wsClients.delete(client);
  });
});

async function start() {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  console.log(`[boot] DATABASE_URL configured: ${dbConfigured}`);
  console.log(`[boot] CORS origins: ${CORS_ORIGIN.join(', ')}`);

  if (!dbConfigured) {
    console.error(
      '[boot] WARNING: DATABASE_URL is not set. Auth and all DB routes will fail. Set it in the Render dashboard.'
    );
  } else {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('[boot] Database connection OK');
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[boot] Database connection FAILED: ${message}`);
    }
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`DeceiveNet API listening on :${PORT}`);
  });
}

start().catch((e) => {
  console.error('[boot] Fatal startup error', e);
  process.exit(1);
});
