# DeceiveNet backend

**Tagline:** Catch Every Intruder  
**Role:** API surface, auth, persistence, and real-time hooks for the DeceiveNet platform.

This is a **first production-oriented slice** of the architecture in your full specification: a **unified Node.js (Fastify) service** with the **complete PostgreSQL schema (Prisma)**, **Redis** clients, **seed data** (5k+ events, users, honeypots, rules, webhooks), and working **auth + core REST + WebSocket** transport.

The spec describes **many independent microservices** (Honeypot Manager, Event Pipeline, Alert Engine, etc.). Here they are represented as **clear module boundaries in code** and **event-shaped contracts** you can split out later; only the **API edge + database + dev relay** are fully wired in this repository.

## What is implemented in this tree

| Area | Status |
|------|--------|
| PostgreSQL schema (users, honeypots, events, alerts, webhooks, threat intel, audit, …) | **Prisma model** — run migrations / `db push` |
| Auth (register, login, refresh, logout) | **Working** (JWT access + hashed refresh tokens) |
| Honeypots & events (list, some create) | **Working** (CRUD subset) |
| Analytics overview (counts) | **Working** (DB aggregates) |
| WebSocket `/api/ws?token=` | **Working** (dev relay; subscribe to bus in production) |
| Docker Compose (Postgres, Redis, RabbitMQ, MinIO) | **Root `docker-compose.yml`** |
| Seed (3 users, 3 honeypots, 5k events, rules, webhooks, actor) | **`npm run db:seed`** |
| Message broker consumers, Influx, full pipeline throughput | **Planned** — add workers next |

## Quick start

1. **Start data stores** (from repo root):

   ```bash
   docker compose up -d postgres redis
   ```

2. **Backend env** — copy `backend/.env.example` to `backend/.env` and set `JWT_SECRET` (32+ random chars).

3. **Install & database**:

   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

4. **API** runs at `http://localhost:3000` (see `PORT`).

### Default seed logins

| User | Password |
|------|----------|
| `admin@deceivenet.io` | `Admin123!Secure` |
| `analyst1@deceivenet.io` | `Analyst123!Secure` |
| `viewer1@deceivenet.io` | `Viewer123!Secure` |

## Key HTTP routes (subset)

- `GET /api/health` — liveness + dependency checks  
- `POST /api/auth/login` — returns `accessToken` + `refreshToken`  
- `GET /api/honeypots` — paginated (requires `Authorization: Bearer …`)  
- `GET /api/events` — paginated  
- `GET /api/analytics/overview`  
- `POST /api/internal/demo-event` — **admin**; creates a demo event and **broadcasts** on WebSocket (`event.processed` envelope)  

## WebSocket

Connect to `ws://localhost:3000/api/ws?token=<access_jwt>`.  
Server sends `system.connected` then streams messages produced by `broadcastWs` (e.g. after `demo-event`).

## Next steps (from your spec)

1. **Split services** — extract Honeypot Manager (Docker), Event Pipeline (consumer), Alert Engine (rule eval), etc., each with the same Prisma schema or read replicas.  
2. **RabbitMQ** — publish `event.processed`, `alert.triggered`, … (compose already includes `rabbitmq`).  
3. **Timescale/Influx** — move high-volume rollups off Postgres.  
4. **RS256 JWT** + Redis token blacklist for logout of access tokens.  
5. **Honeypot images** — wire `DOCKER_HOST` and isolated network from env.  

## License

As per the project owner.
