# DeceiveNet: Honeypot Intelligence & Telemetry Platform

DeceiveNet is a modern, professional cybersecurity MVP designed to provide real-time honeypot intelligence. It allows users to deploy managed honeypots (HTTP, SSH, Redis) or integrate a standalone SDK into their own applications to capture and analyze malicious activity.

![Dashboard Preview](https://raw.githubusercontent.com/Manthanchavda27/DeceiveNet/main/preview.png)

## 🚀 Key Features

- **Multi-Tenant Dashboard**: Secure, isolated project management for multiple users.
- **Managed Honeypots**: One-click deployment of HTTP, SSH, and Redis honeypots.
- **DeceiveNet SDK**: Standalone Node.js middleware for deep telemetry ingestion in existing Express apps.
- **Real-Time Feed**: Live attack monitoring via WebSockets.
- **Threat Detection**: Integrated SQLi, XSS, Path Traversal, and Scanner detection.
- **Privacy Controls**: Recursive object redaction for PII protection before egress.

## 🛠 Architecture

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Prisma (PostgreSQL/SQLite), WebSockets.
- **SDK**: Standalone TypeScript package with HMAC-signed ingestion.
- **Database**: PostgreSQL (Production) / SQLite (Development).

## 📂 Repository Structure

```text
DeceiveNet/
├── frontend/           # React dashboard application
├── backend/            # Express API and Honeypot Runtime
├── sdk/                # standalone deceivenet-sdk package
├── fake-login-test/    # Sample application demonstrating SDK integration
└── README.md
```

## 🏁 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. SDK Integration Example
See the `fake-login-test` directory for a complete example.

```javascript
const { DeceiveNet } = require('deceivenet-sdk');

app.use(DeceiveNet({
  projectId: "YOUR_PROJECT_ID",
  token: "YOUR_API_KEY",
  endpoint: "http://localhost:3000/api/sdk/events",
  interceptRoutes: ['/login', '/admin'],
  debug: true
}));
```

## 🔒 Security & Isolation

DeceiveNet implements strict multi-user isolation. Users can only see, manage, and receive telemetry for projects they own. WebSocket events are filtered server-side to ensure zero data leakage between tenants.

## 📄 License
MIT License. See `LICENSE` for details.
