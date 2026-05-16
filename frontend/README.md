# DeceiveNet — Frontend

Vite + React + TypeScript main frontend: public marketing pages, authentication UI, and the admin console.

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |

## Structure

```
frontend/
├── public/                  Static assets (manifest, robots.txt)
├── src/
│   ├── components/
│   │   ├── admin/           AdminLayout (sidebar + topbar)
│   │   └── public/          PublicLayout (nav + footer)
│   ├── lib/
│   │   └── data.ts          Mock data (honeypots, events, etc.)
│   ├── pages/
│   │   ├── admin/           Dashboard, Honeypots, Events, Analytics…
│   │   └── public/          Landing, Login, Dashboard, ProjectDetail
│   ├── types/
│   │   └── index.ts         Shared TypeScript interfaces
│   ├── App.tsx              React Router routes
│   ├── index.css            Tailwind + CSS variables + custom classes
│   └── main.tsx             Entry point
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig*.json
```

## Routes

| Path | Component |
|------|-----------|
| `/` | LandingPage |
| `/login` | LoginPage |
| `/dashboard` | DashboardPage |
| `/projects/:id` | ProjectDetailPage |
| `/admin` | AdminDashboard |
| `/admin/honeypots` | HoneypotsPage |
| `/admin/honeypots/:id` | HoneypotDetailPage |
| `/admin/decoy-services` | DecoyServicesPage |
| `/admin/attack-events` | AttackEventsPage |
| `/admin/payloads` | PayloadsPage |
| `/admin/analytics` | AnalyticsPage |
| `/admin/alerts` | AlertsPage |
| `/admin/threat-intel` | ThreatIntelPage |
| `/admin/webhooks` | WebhooksPage |
| `/admin/audit-logs` | AuditLogsPage |
| `/admin/settings` | SettingsPage |
