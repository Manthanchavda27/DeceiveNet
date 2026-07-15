# DeceiveNet Interview Readiness Report

## Demo frontend direction

The demo frontend in this folder is separate from the original app. The UI was revised to avoid the overly bold AI-generated feel: it now uses a calmer honeypot/security SaaS style with white surfaces, muted green/teal security accents, restrained typography, clear navigation, and subtle scan/float animations.

## Demo flow that works

- Public Home page is open to everyone.
- Login/Register is required before opening Console, Decoys, Attack Lab, Events, or Report.
- Register/Login stores a local demo user in `localStorage`.
- Console shows active decoys, captured events, critical events, confidence, recent activity, and decoy health.
- Decoys page lets you add a demo decoy.
- Attack Lab lets you simulate a safe local attack by choosing source IP, target decoy, technique, payload, and severity.
- Events page shows the captured attacker details: event ID, source IP, target, payload, confidence, severity, and status.
- Mark triaged updates the selected event.
- Report page lists production-readiness gaps.

## What is real vs simulated

This demo proves the frontend workflow and interviewer story. The attack is a controlled local simulation, not a real network attack. It does not expose ports, run malware, scan hosts, or touch external systems. For a safe demo, use the Attack Lab page to create an event and then inspect it in Events.

## Backend fixes completed locally

- Fixed malformed `backend/tsconfig.json`.
- Fixed invalid syntax in `backend/prisma/seed.ts`.
- Installed backend dependencies in `backend/`.
- Generated Prisma Client.
- Fixed backend TypeScript issues in JWT signing, Redis imports, WebSocket handling, and callback typings.
- Backend `npm run build` now passes.

## Remaining backend/security gaps

- `npm audit` reports 3 high-severity vulnerabilities through `bcrypt@5.1.1` / `@mapbox/node-pre-gyp` / `tar`. The suggested audit fix upgrades bcrypt to `6.0.0`, which is a breaking-change path and should be tested before accepting.
- Frontend demo is still local-state driven; it is not yet wired to real Fastify auth/events endpoints.
- Real honeypot provisioning is not implemented. The backend stores honeypot records but does not launch isolated containers/services.
- RabbitMQ workers for ingestion, alert evaluation, webhook delivery, retry, and dead-letter queues are still needed.
- Alert rule engine needs suppression, escalation, deduplication, and rule test mode.
- Production auth should add access-token revocation/blacklist, stronger JWT key management, MFA flow, and route-level RBAC coverage.
- Event enrichment should add GeoIP, ASN, reputation, MITRE ATT&CK mapping, payload classification, and confidence scoring.
- Deployment still needs Dockerfiles for app services, env examples, migration commands, health checks, CI/CD, and observability.

## Interviewer-impressing priorities

1. Show the demo path: Home -> Register/Login -> Console -> Attack Lab -> Events -> Mark triaged.
2. Explain that the safe simulator represents what a real honeypot sensor would send to the backend.
3. Wire the demo frontend to the Fastify API and WebSocket endpoint next.
4. Add one real minimal honeypot listener, such as a safe SSH/HTTP mock service, that posts captured attempts to `/api/events`.
5. Add tests and CI output so interviewers see engineering discipline, not only UI polish.

## How to run the demo frontend

```bash
cd demo-frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5174/`.

## Safe test steps

1. Open `http://127.0.0.1:5174/`.
2. Click `Register` or `Login`.
3. Submit the pre-filled demo credentials.
4. Open `Attack Lab`.
5. Keep or change the source IP, target decoy, technique, payload, and severity.
6. Click `Run controlled test`.
7. The app navigates to `Events`.
8. Select the newest event and inspect the attacker details.
9. Click `Mark triaged`.

## Verification performed

- Demo frontend: `npm run typecheck` passed.
- Demo frontend: `npm run build` passed.
- Backend: `npm run db:generate` passed.
- Backend: `npm run build` passed.
- Backend: `npm audit --audit-level=high` found 3 high-severity dependency issues noted above.
