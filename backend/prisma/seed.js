import { createHash, randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { PrismaClient, UserRole, UserStatus, HoneypotType, HoneypotStatus, DecoySessionStatus, EventSeverity, EventRecordStatus, AttackType, AlertHistoryStatus, AuditAction, Prisma, } from '@prisma/client';
const prisma = new PrismaClient();
const ATTACK_DIST = [
    ...Array(3000).fill(AttackType.ssh_brute_force),
    ...Array(750).fill(AttackType.http_probe),
    ...Array(500).fill(AttackType.sql_injection),
    ...Array(500).fill(AttackType.port_scan),
    ...Array(250).fill(AttackType.exploit_attempt),
];
const SEVERITY_FOR_ATTACK = {
    [AttackType.ssh_brute_force]: EventSeverity.medium,
    [AttackType.http_probe]: EventSeverity.low,
    [AttackType.sql_injection]: EventSeverity.high,
    [AttackType.port_scan]: EventSeverity.low,
    [AttackType.command_injection]: EventSeverity.high,
    [AttackType.credential_stuffing]: EventSeverity.medium,
    [AttackType.exploit_attempt]: EventSeverity.critical,
    [AttackType.malware_download]: EventSeverity.critical,
    [AttackType.dns_tunneling]: EventSeverity.high,
    [AttackType.custom]: EventSeverity.info,
};
const GEO = [
    { country: 'RU', city: 'Moscow', lat: 55.75, lon: 37.62, asn: 8359, isp: 'Mock-ISP' },
    { country: 'CN', city: 'Shanghai', lat: 31.23, lon: 121.47, asn: 4134, isp: 'Mock-ISP' },
    { country: 'BR', city: 'Sao Paulo', lat: -23.55, lon: -46.63, asn: 28573, isp: 'Mock-ISP' },
    { country: 'US', city: 'New York', lat: 40.71, lon: -74.0, asn: 15169, isp: 'Mock-ISP' },
    { country: 'PL', city: 'Warsaw', lat: 52.23, lon: 21.01, asn: 5617, isp: 'Mock-ISP' },
];
function randomIp() {
    return `${1 + Math.floor(Math.random() * 220)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${1 + Math.floor(Math.random() * 254)}`;
}
function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function tamperHashChain(payload, prev) {
    return createHash('sha256').update(prev + payload).digest('hex');
}
async function main() {
    await prisma.auditLog.deleteMany();
    await prisma.alertHistory.deleteMany();
    await prisma.alertRule.deleteMany();
    await prisma.webhookDeliveryLog.deleteMany();
    await prisma.webhook.deleteMany();
    await prisma.eventComment.deleteMany();
    await prisma.event.deleteMany();
    await prisma.payload.deleteMany();
    await prisma.decoySession.deleteMany();
    await prisma.decoyService.deleteMany();
    await prisma.honeypot.deleteMany();
    await prisma.threatIndicator.deleteMany();
    await prisma.threatActor.deleteMany();
    await prisma.settings.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
    const pass = {
        admin: await bcrypt.hash('Admin123!Secure', 12),
        analyst: await bcrypt.hash('Analyst123!Secure', 12),
        viewer: await bcrypt.hash('Viewer123!Secure', 12),
    };
    const [admin, analyst, viewer] = await Promise.all([
        prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@deceivenet.io',
                passwordHash: pass.admin,
                role: UserRole.admin,
                status: UserStatus.active,
            },
        }),
        prisma.user.create({
            data: {
                username: 'analyst1',
                email: 'analyst1@deceivenet.io',
                passwordHash: pass.analyst,
                role: UserRole.analyst,
                status: UserStatus.active,
            },
        }),
        prisma.user.create({
            data: {
                username: 'viewer1',
                email: 'viewer1@deceivenet.io',
                passwordHash: pass.viewer,
                role: UserRole.viewer,
                status: UserStatus.active,
            },
        }),
    ]);
    const h1 = await prisma.honeypot.create({
        data: {
            name: 'SSH-Honeypot-01',
            type: HoneypotType.ssh,
            status: HoneypotStatus.running,
            port: 2222,
            bindAddress: '0.0.0.0',
            config: { max_auth_tries: 3, log_all_commands: true },
            tags: ['prod', 'ssh'],
            deployedAt: new Date(),
            lastActiveAt: new Date(),
            containerId: 'demo-ssh-1',
        },
    });
    const h2 = await prisma.honeypot.create({
        data: {
            name: 'HTTP-Honeypot-Internal',
            type: HoneypotType.http,
            status: HoneypotStatus.running,
            port: 8080,
            bindAddress: '0.0.0.0',
            config: { server_header: 'nginx/1.18' },
            tags: ['http'],
            deployedAt: new Date(),
            lastActiveAt: new Date(),
            containerId: 'demo-http-1',
        },
    });
    const h3 = await prisma.honeypot.create({
        data: {
            name: 'MySQL-Decoy-Prod',
            type: HoneypotType.mysql,
            status: HoneypotStatus.stopped,
            port: 3306,
            bindAddress: '0.0.0.0',
            config: { server_version: '8.0.30' },
            tags: ['decommissioned'],
            deployedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
            lastActiveAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
            containerId: null,
        },
    });
    const d1 = await prisma.decoyService.create({
        data: {
            honeypotId: h1.id,
            name: 'ssh-primary',
            serviceType: 'ssh',
            port: 2222,
            banner: 'OpenSSH_8.2',
            enabled: true,
            config: {},
        },
    });
    const session1 = await prisma.decoySession.create({
        data: {
            decoyServiceId: d1.id,
            attackerIp: '198.51.100.2',
            sourcePort: 44123,
            sessionId: randomUUID(),
            protocol: 'tcp',
            startedAt: new Date(Date.now() - 3600_000),
            lastActiveAt: new Date(),
            status: DecoySessionStatus.active,
            commandsExecuted: 3,
            dataTransferred: BigInt(1200),
        },
    });
    const actor = await prisma.threatActor.create({
        data: {
            name: 'Actor-demo-1',
            firstSeen: new Date(Date.now() - 48 * 3600_000),
            lastSeen: new Date(),
            attackCount: 42,
            primaryAttackTypes: ['ssh_brute_force', 'http_probe'],
            commonIps: ['198.51.100.2'],
            targetedServices: ['ssh'],
            confidence: 'high',
            profileData: { notes: 'demo clustering stub' },
        },
    });
    await prisma.threatIndicator.create({
        data: {
            value: '198.51.100.2',
            type: 'ip',
            confidence: 90,
            severity: EventSeverity.high,
            firstSeen: new Date(Date.now() - 48 * 3600_000),
            lastSeen: new Date(),
            tags: ['scanner'],
            source: 'internal',
            threatActorId: actor.id,
            enrichmentData: {},
        },
    });
    const rules = await Promise.all([
        prisma.alertRule.create({
            data: {
                name: 'Critical Severity Alert',
                description: 'Any critical event',
                severity: EventSeverity.critical,
                conditions: {
                    logic: 'AND',
                    conditions: [{ field: 'severity', operator: 'equals', value: 'critical' }],
                },
                frequencyCount: 1,
                frequencyWindowMinutes: 5,
                enabled: true,
                notificationChannels: [{ type: 'slack', config: {} }],
                createdById: admin.id,
            },
        }),
        prisma.alertRule.create({
            data: {
                name: 'Brute Force Detection',
                description: 'SSH brute force burst',
                severity: EventSeverity.high,
                conditions: {
                    logic: 'AND',
                    conditions: [
                        { field: 'attack_type', operator: 'equals', value: 'ssh_brute_force' },
                    ],
                },
                frequencyCount: 10,
                frequencyWindowMinutes: 5,
                enabled: true,
                notificationChannels: [],
                createdById: admin.id,
            },
        }),
        prisma.alertRule.create({
            data: {
                name: 'Known Bad IP',
                description: 'Matches threat intel',
                severity: EventSeverity.medium,
                conditions: {
                    logic: 'AND',
                    conditions: [{ field: 'threat_intel.malicious', operator: 'equals', value: true }],
                },
                frequencyCount: 1,
                frequencyWindowMinutes: 60,
                enabled: true,
                notificationChannels: [],
                createdById: admin.id,
            },
        }),
    ]);
    await prisma.alertHistory.create({
        data: {
            alertRuleId: rules[0].id,
            triggeredAt: new Date(),
            eventIds: [],
            severity: EventSeverity.critical,
            status: AlertHistoryStatus.unacknowledged,
        },
    });
    await prisma.webhook.createMany({
        data: [
            {
                name: 'Slack SOC Channel',
                url: 'https://hooks.slack.com/services/REPLACE/ME',
                secretEnc: 'stub-encrypted',
                eventsSubscribed: ['alert.triggered'],
                enabled: false,
                retryCount: 3,
                timeoutSeconds: 30,
                headers: {},
            },
            {
                name: 'SIEM Integration',
                url: 'https://siem.example.invalid/ingest',
                secretEnc: 'stub-encrypted',
                eventsSubscribed: ['event.processed'],
                enabled: false,
                retryCount: 3,
                timeoutSeconds: 30,
                headers: {},
            },
        ],
    });
    const now = Date.now();
    const ms72h = 72 * 3600_000;
    for (let batch = 0; batch < 10; batch++) {
        const rows = [];
        for (let i = 0; i < 500; i++) {
            const idx = batch * 500 + i;
            const attack = ATTACK_DIST[idx % ATTACK_DIST.length];
            const sev = SEVERITY_FOR_ATTACK[attack] ?? EventSeverity.low;
            const ts = new Date(now - Math.random() * ms72h);
            const ip = idx % 50 === 0 ? '198.51.100.2' : randomIp();
            const geo = rand(GEO);
            const honeypot = idx % 3 === 0 ? h1.id : idx % 3 === 1 ? h2.id : h3.id;
            rows.push({
                eventUuid: randomUUID(),
                honeypotId: honeypot,
                decoyServiceId: idx % 10 === 0 ? d1.id : null,
                decoySessionId: idx === 0 ? session1.id : null,
                timestamp: ts,
                severity: idx % 333 === 0 ? EventSeverity.critical : sev,
                severityScore: idx % 333 === 0
                    ? 95
                    : sev === EventSeverity.critical
                        ? 92
                        : sev === EventSeverity.high
                            ? 72
                            : 45,
                attackType: attack,
                sourceIp: ip,
                sourcePort: 10000 + (idx % 30000),
                sourceGeo: geo,
                targetPort: 22,
                protocol: 'tcp',
                status: EventRecordStatus.new,
                rawData: { seed: true, idx },
                enrichedData: ip === '198.51.100.2'
                    ? { threat_intel: { malicious: true } }
                    : Prisma.JsonNull,
            });
        }
        await prisma.event.createMany({ data: rows });
    }
    await prisma.settings.create({
        data: {
            key: 'platform',
            value: { brand: 'DeceiveNet', tagline: 'Catch Every Intruder' },
            updatedBy: admin.id,
        },
    });
    let auditPrev = 'genesis';
    for (const user of [admin, analyst, viewer]) {
        const line = JSON.stringify({ user: user.id, action: 'seed' });
        auditPrev = tamperHashChain(line, auditPrev);
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                username: user.username,
                action: AuditAction.create,
                resourceType: 'seed',
                resourceId: user.id,
                details: { phase: 'bootstrap' },
                tamperHash: auditPrev,
            },
        });
    }
    console.log('Seed complete.', {
        users: [admin.email, analyst.email, viewer.email],
        honeypots: [h1.name, h2.name, h3.name],
        events: 5000,
        passwords: 'Admin123!Secure / Analyst123!Secure / Viewer123!Secure',
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
