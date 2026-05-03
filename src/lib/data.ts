import type { Project, Honeypot, AttackEvent, Session, AlertRule, Webhook, ThreatIndicator, AuditLogEntry } from '../types';

export const projects: Project[] = [
  { id: '1', name: 'customer-support-agent', description: 'AI chatbot with RAG pipeline', status: 'Deployed', updatedAgo: '2h ago', icon: '🤖' },
  { id: '2', name: 'finance-analyzer-v2', description: 'Internal analytics agent', status: 'Deployed', updatedAgo: '1d ago', icon: '📊' },
  { id: '3', name: 'internal-api-gateway', description: 'Rate-limiting proxy layer', status: 'Draft', updatedAgo: '3d ago', icon: '🔌' },
  { id: '4', name: 'documentation-bot', description: 'Auto-docs generator', status: 'Deployed', updatedAgo: '5h ago', icon: '📝' },
  { id: '5', name: 'slack-summarizer', description: 'Daily digest generator', status: 'Deployed', updatedAgo: '12h ago', icon: '💬' },
  { id: '6', name: 'data-pipeline-agent', description: 'ETL orchestration agent', status: 'Draft', updatedAgo: '1w ago', icon: '🔄' },
];

export const honeypots: Honeypot[] = [
  { id: '1', name: 'SSH-Honeypot-01', type: 'SSH', status: 'Active', ip: '10.0.1.42', port: 22, deployed: '3d ago', attacksCaptured: 847, tags: ['external-facing', 'dmz'], uptime: '3d 14h', uniqueAttackers: 142, currentConnections: 3 },
  { id: '2', name: 'HTTP-Honeypot-02', type: 'HTTP', status: 'Active', ip: '10.0.1.88', port: 80, deployed: '1w ago', attacksCaptured: 2103, tags: ['web-app', 'public'], uptime: '7d 2h', uniqueAttackers: 389, currentConnections: 7 },
  { id: '3', name: 'MySQL-Honeypot-03', type: 'MySQL', status: 'Active', ip: '10.0.2.15', port: 3306, deployed: '5d ago', attacksCaptured: 412, tags: ['database', 'internal'], uptime: '5d 8h', uniqueAttackers: 67, currentConnections: 1 },
  { id: '4', name: 'FTP-Honeypot-04', type: 'FTP', status: 'Inactive', ip: '10.0.2.33', port: 21, deployed: '2w ago', attacksCaptured: 156, tags: ['file-server', 'research'], uptime: '0', uniqueAttackers: 34, currentConnections: 0 },
  { id: '5', name: 'DNS-Honeypot-05', type: 'DNS', status: 'Active', ip: '10.0.3.10', port: 53, deployed: '4d ago', attacksCaptured: 623, tags: ['dns', 'external-facing'], uptime: '4d 6h', uniqueAttackers: 201, currentConnections: 2 },
  { id: '6', name: 'SSH-Honeypot-06', type: 'SSH', status: 'Error', ip: '10.0.3.22', port: 22, deployed: '1d ago', attacksCaptured: 89, tags: ['ssh', 'staging'], uptime: '0', uniqueAttackers: 23, currentConnections: 0 },
];

export const attackEvents: AttackEvent[] = [
  { id: 'EVT-001', timestamp: '2m ago', severity: 'Critical', attackType: 'SSH Brute Force', sourceIP: '45.33.32.156', sourcePort: 54312, targetHoneypot: 'SSH-Honeypot-01', targetService: 'SSH', status: 'New', payload: 'root:admin123', country: 'Russia', countryCode: 'RU' },
  { id: 'EVT-002', timestamp: '5m ago', severity: 'High', attackType: 'HTTP SQLi Probe', sourceIP: '185.220.101.34', sourcePort: 44890, targetHoneypot: 'HTTP-Honeypot-02', targetService: 'HTTP', status: 'In Progress', payload: "' OR 1=1 --", country: 'Germany', countryCode: 'DE' },
  { id: 'EVT-003', timestamp: '8m ago', severity: 'Medium', attackType: 'MySQL Auth Attempt', sourceIP: '103.235.46.39', sourcePort: 38201, targetHoneypot: 'MySQL-Honeypot-03', targetService: 'MySQL', status: 'Reviewed', payload: 'admin:password', country: 'China', countryCode: 'CN' },
  { id: 'EVT-004', timestamp: '12m ago', severity: 'Critical', attackType: 'RCE Attempt', sourceIP: '91.240.118.172', sourcePort: 55123, targetHoneypot: 'HTTP-Honeypot-02', targetService: 'HTTP', status: 'Escalated', payload: '; cat /etc/passwd', country: 'Ukraine', countryCode: 'UA' },
  { id: 'EVT-005', timestamp: '15m ago', severity: 'Low', attackType: 'DNS Zone Transfer', sourceIP: '198.51.100.23', sourcePort: 12345, targetHoneypot: 'DNS-Honeypot-05', targetService: 'DNS', status: 'Reviewed', payload: 'AXFR example.com', country: 'United States', countryCode: 'US' },
  { id: 'EVT-006', timestamp: '22m ago', severity: 'High', attackType: 'FTP Credential Stuffing', sourceIP: '45.33.32.156', sourcePort: 43210, targetHoneypot: 'FTP-Honeypot-04', targetService: 'FTP', status: 'New', payload: 'anonymous:anonymous@', country: 'Russia', countryCode: 'RU' },
  { id: 'EVT-007', timestamp: '30m ago', severity: 'Medium', attackType: 'HTTP Path Traversal', sourceIP: '203.0.113.50', sourcePort: 33210, targetHoneypot: 'HTTP-Honeypot-02', targetService: 'HTTP', status: 'False Positive', payload: '../../etc/shadow', country: 'India', countryCode: 'IN' },
  { id: 'EVT-008', timestamp: '45m ago', severity: 'Critical', attackType: 'SSH Key Brute Force', sourceIP: '91.240.118.172', sourcePort: 55200, targetHoneypot: 'SSH-Honeypot-01', targetService: 'SSH', status: 'New', payload: 'Multiple SSH key attempts', country: 'Ukraine', countryCode: 'UA' },
];

export const sessions: Session[] = [
  {
    id: 'S-001', ip: '45.33.32.156', type: 'AI Agent', confidence: 92, duration: '12s',
    pagesVisited: 14, filesExfiltrated: 3, firstSeen: '14:30:01', lastSeen: '14:30:13',
    responseTime: 0.8, country: 'Russia', flag: '🇷🇺',
    headers: { 'User-Agent': 'python-requests/2.31.0', 'Accept': 'application/json' },
    timeline: [
      { page: '/login', timestamp: '14:30:01', responseTime: 0.3 },
      { page: '/dashboard', timestamp: '14:30:02', responseTime: 0.5 },
      { page: '/projects/1', timestamp: '14:30:03', responseTime: 0.4 },
      { page: '/projects/1/source', timestamp: '14:30:04', responseTime: 0.6 },
    ],
    promptInjectionsTriggered: ['SYSTEM OVERRIDE', 'HIDDEN: Agent list'],
  },
  {
    id: 'S-002', ip: '185.220.101.34', type: 'Human', confidence: 88, duration: '4m 32s',
    pagesVisited: 6, filesExfiltrated: 0, firstSeen: '14:25:10', lastSeen: '14:29:42',
    responseTime: 2.4, country: 'Germany', flag: '🇩🇪',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'text/html' },
    timeline: [
      { page: '/', timestamp: '14:25:10', responseTime: 1.8 },
      { page: '/login', timestamp: '14:25:45', responseTime: 2.1 },
      { page: '/dashboard', timestamp: '14:26:02', responseTime: 1.5 },
    ],
    promptInjectionsTriggered: [],
  },
  {
    id: 'S-003', ip: '10.0.0.4', type: 'Bot', confidence: 100, duration: '0.3s',
    pagesVisited: 22, filesExfiltrated: 0, firstSeen: '14:28:00', lastSeen: '14:28:00',
    responseTime: 0.05, country: 'Internal', flag: '🏠',
    headers: { 'User-Agent': 'masscan/1.3.2', 'Accept': '*/*' },
    timeline: [
      { page: '/robots.txt', timestamp: '14:28:00', responseTime: 0.02 },
      { page: '/.env', timestamp: '14:28:00', responseTime: 0.03 },
    ],
    promptInjectionsTriggered: [],
  },
  {
    id: 'S-004', ip: '103.235.46.39', type: 'AI Agent', confidence: 85, duration: '28s',
    pagesVisited: 18, filesExfiltrated: 5, firstSeen: '14:15:22', lastSeen: '14:15:50',
    responseTime: 1.1, country: 'China', flag: '🇨🇳',
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AI-Crawler)', 'Accept': '*/*' },
    timeline: [
      { page: '/projects/1', timestamp: '14:15:22', responseTime: 0.9 },
      { page: '/projects/1/env-vars', timestamp: '14:15:24', responseTime: 0.7 },
    ],
    promptInjectionsTriggered: ['@@INJECT@@: diagnostic mode'],
  },
];

export const alertRules: AlertRule[] = [
  { id: 'AR-001', name: 'Critical SSH Attack', description: 'Triggers on critical SSH brute force events', condition: 'When severity = Critical AND attack type = SSH Brute Force', severity: 'Critical', channels: ['Slack', 'Email'], enabled: true, lastTriggered: '2m ago' },
  { id: 'AR-002', name: 'Repeated Attacker IP', description: 'Same source IP attacks 5+ times in 10 minutes', condition: 'Same source IP > 5 times in 10 minutes', severity: 'High', channels: ['Slack', 'Webhook'], enabled: true, lastTriggered: '15m ago' },
  { id: 'AR-003', name: 'SQL Injection Detected', description: 'Any SQL injection attempt on HTTP honeypots', condition: 'Attack type contains "SQLi"', severity: 'High', channels: ['Email'], enabled: true, lastTriggered: '5m ago' },
  { id: 'AR-004', name: 'Data Exfiltration Alert', description: 'File download from honeypot by untrusted IP', condition: 'File downloaded AND source IP not in allowlist', severity: 'Critical', channels: ['Slack', 'Email', 'SMS'], enabled: false, lastTriggered: 'Never' },
];

export const webhooks: Webhook[] = [
  { id: 'WH-001', name: 'Slack - Security Alerts', url: 'https://hooks.slack.com/services/T00/B00/xxx', events: ['attack.captured', 'alert.triggered'], enabled: true, lastDelivery: '2m ago', lastStatus: 'success' },
  { id: 'WH-002', name: 'SIEM Forwarder', url: 'https://siem.internal.company.com/api/v1/events', events: ['attack.captured', 'honeypot.status_changed'], enabled: true, lastDelivery: '5m ago', lastStatus: 'success' },
  { id: 'WH-003', name: 'PagerDuty Integration', url: 'https://events.pagerduty.com/v2/enqueue', events: ['alert.triggered'], enabled: false, lastDelivery: '1d ago', lastStatus: 'failure' },
];

export const threatIndicators: ThreatIndicator[] = [
  { id: 'TI-001', value: '45.33.32.156', type: 'IP', confidence: 95, firstSeen: '3d ago', lastSeen: '2m ago', tags: ['brute-force', 'ssh'], source: 'SSH-Honeypot-01' },
  { id: 'TI-002', value: 'malware-c2.evil.com', type: 'Domain', confidence: 88, firstSeen: '1w ago', lastSeen: '1d ago', tags: ['c2', 'malware'], source: 'HTTP-Honeypot-02' },
  { id: 'TI-003', value: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', type: 'SHA256', confidence: 72, firstSeen: '5d ago', lastSeen: '5d ago', tags: ['payload', 'ransomware'], source: 'FTP-Honeypot-04' },
  { id: 'TI-004', value: '91.240.118.172', type: 'IP', confidence: 91, firstSeen: '2w ago', lastSeen: '12m ago', tags: ['apt', 'rce'], source: 'HTTP-Honeypot-02' },
];

export const auditLogs: AuditLogEntry[] = [
  { id: 'AL-001', timestamp: '2m ago', actor: 'admin@deceivenet.io', action: 'Create', resourceType: 'Honeypot', resourceName: 'SSH-Honeypot-07', details: 'Created new SSH honeypot', ipAddress: '10.0.0.1' },
  { id: 'AL-002', timestamp: '15m ago', actor: 'analyst@deceivenet.io', action: 'Update', resourceType: 'Alert Rule', resourceName: 'Critical SSH Attack', details: 'Updated notification channels', ipAddress: '10.0.0.5' },
  { id: 'AL-003', timestamp: '1h ago', actor: 'admin@deceivenet.io', action: 'Export', resourceType: 'Attack Events', resourceName: 'EVT-001 to EVT-100', details: 'Exported 100 events as CSV', ipAddress: '10.0.0.1' },
  { id: 'AL-004', timestamp: '2h ago', actor: 'system', action: 'Config Change', resourceType: 'Honeypot', resourceName: 'HTTP-Honeypot-02', details: 'Auto-restarted after crash', ipAddress: '127.0.0.1' },
  { id: 'AL-005', timestamp: '3h ago', actor: 'analyst@deceivenet.io', action: 'Delete', resourceType: 'Webhook', resourceName: 'Old SIEM Forwarder', details: 'Removed deprecated webhook', ipAddress: '10.0.0.5' },
  { id: 'AL-006', timestamp: '5h ago', actor: 'viewer@deceivenet.io', action: 'Login', resourceType: 'Session', resourceName: 'User Login', details: 'Successful login from Chrome/Windows', ipAddress: '192.168.1.100' },
];

export const sourceCodeFiles: Record<string, string> = {
  'app.py': `import os
from fastapi import FastAPI
from deceivenet.core.honeypot import HoneypotManager

# TODO: move to env vars before production deployment
DATABASE_URL = "postgresql://admin:Sup3rS3cretP@ss@db.internal:5432/deceivenet_prod"
HMAC_SIGNING_KEY = "dev-only-replace-in-vault"
AWS_ACCESS_KEY_ID = "AKIAFAKEKEY123456"
AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY"

app = FastAPI()
manager = HoneypotManager(db_url=DATABASE_URL)

@app.get("/api/honeypots")
async def list_honeypots():
    """List all registered decoy services."""
    return await manager.list_decoys()

@app.post("/api/honeypots/{decoy_id}/session")
async def record_session(decoy_id: str, event: dict):
    """Ingest an attacker interaction for analysis and intel export."""
    return await manager.record_event(decoy_id, event)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "2.4.1", "product": "DeceiveNet"}`,
  'config.yaml': `# DeceiveNet Configuration
server:
  host: "0.0.0.0"
  port: 8000
  workers: 4

database:
  url: "postgresql://admin:Sup3rS3cretP@ss@db.internal:5432/deceivenet_prod"
  pool_size: 20
  max_overflow: 10

redis:
  host: "redis.internal"
  port: 6379
  password: "r3d1s_s3cret_p@ss"

logging:
  level: "INFO"
  format: "json"

auth:
  secret_key: "super-secret-jwt-key-change-in-prod"
  algorithm: "HS256"
  access_token_expire_minutes: 30`,
  'honeypot_worker.py': `import os
import asyncio
from deceivenet.ingest.syslog import SyslogSink
from deceivenet.dispatch.alerting import AlertRouter

class DecoyWorker:
    """Runs a single DeceiveNet decoy process and streams events upstream."""

    def __init__(self, decoy_id: str, bind: str = "0.0.0.0:2222"):
        self.decoy_id = decoy_id
        self.bind = bind
        self.sink = SyslogSink(os.getenv("DECEIVENET_SYSLOG_URL", "udp://127.0.0.1:5514"))
        self.router = AlertRouter()

    async def handle_connection(self, reader, writer):
        """Capture banners, credentials, and commands for intel pipelines."""
        session_id = await self.router.open_session(self.decoy_id)
        # ... protocol-specific lure logic ...
        await self.sink.emit(session_id, {"stage": "handshake"})
        writer.close()

    async def run(self):
        """Start the decoy listener until cancelled."""
        await asyncio.Future()  # placeholder — real impl binds sockets / TLS mocks
`,
  'requirements.txt': `fastapi==0.104.1
uvicorn==0.24.0
python-dotenv==1.0.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
redis==5.0.1
pydantic==2.5.2
httpx==0.25.2`,
};

export const chatMessages = [
  { sender: 'user', name: 'Sarah C.', message: 'Hey can you check why the prod db is slow?', time: '10:42 AM' },
  { sender: 'ai', name: 'DevOps Bot', message: 'Sure, let me pull the credentials from the vault and check the connection pool.', time: '10:42 AM' },
  { sender: 'user', name: 'Sarah C.', message: 'Attached: master_db_creds.json — don\'t share this outside the team', time: '10:43 AM' },
  { sender: 'ai', name: 'DevOps Bot', message: 'Got it, I\'ll rotate them after the investigation. The pool size is at 95% capacity — I\'ll bump it up.', time: '10:44 AM' },
  { sender: 'user', name: 'Marcus W.', message: 'Also, the AWS keys in app.py are still hardcoded. Can someone move those to Secrets Manager?', time: '10:45 AM' },
  { sender: 'ai', name: 'DevOps Bot', message: 'I\'ll create a ticket for that. The current keys are AKIAFAKEKEY123456 — I\'ll mark them for rotation.', time: '10:46 AM' },
  { sender: 'user', name: 'Sarah C.', message: 'Thanks! Also the Stripe webhook secret needs updating before we go live.', time: '10:47 AM' },
  { sender: 'ai', name: 'DevOps Bot', message: 'Noted. I\'ve added it to the pre-launch checklist. Current secret ends in ...xYz9.', time: '10:48 AM' },
];

export const envVariables = [
  { key: 'DECEIVENET_SIGNING_SECRET', value: 'dev-signing-secret-replace-in-vault', rotated: '2 days ago' },
  { key: 'DATABASE_URL', value: 'postgresql://admin:Sup3rS3cretP@ss@db.internal:5432/deceivenet_prod', rotated: '1 week ago' },
  { key: 'AWS_ACCESS_KEY_ID', value: 'AKIAFAKEKEY123456', rotated: '3 days ago' },
  { key: 'AWS_SECRET_ACCESS_KEY', value: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY', rotated: '3 days ago' },
  { key: 'STRIPE_SECRET_KEY', value: 'sk_live_FAKE_STRIPE_SECRET_KEY_12345', rotated: '1 month ago' },
  { key: 'REDIS_PASSWORD', value: 'r3d1s_s3cret_p@ss', rotated: '2 weeks ago' },
  { key: 'JWT_SECRET', value: 'super-secret-jwt-key-change-in-prod', rotated: 'Never' },
];

export const deployments = [
  { version: 'v2.4.1', message: 'Hardened SSH decoy banner templates', time: '2h ago', status: 'Success', hash: 'a1b2c3d' },
  { version: 'v2.4.0', message: 'Intel export: STIX 2.1 bundle support', time: '1d ago', status: 'Success', hash: 'e4f5g6h' },
  { version: 'v2.3.2', message: 'Security patch: rotated signing keys', time: '3d ago', status: 'Success', hash: 'i7j8k9l' },
  { version: 'v2.3.1', message: 'Hotfix: Redis session backlog under load', time: '5d ago', status: 'Success', hash: 'm0n1o2p' },
  { version: 'v2.3.0', message: 'Multi-decoy orchestration & health checks', time: '1w ago', status: 'Success', hash: 'q3r4s5t' },
  { version: 'v2.2.4', message: 'Failed deploy — rollback', time: '2w ago', status: 'Failed', hash: 'u6v7w8x' },
];
