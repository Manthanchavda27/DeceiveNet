import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RotateCcw, Download, Copy, ArrowLeft } from 'lucide-react';
import { honeypots, attackEvents } from '../../lib/data';

type DetailTab = 'Overview' | 'Events' | 'Configuration' | 'Logs';

const severityBadgeClass: Record<string, string> = {
  Critical: 'severity-critical',
  High: 'severity-high',
  Medium: 'severity-medium',
  Low: 'severity-low',
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Active':
      return (
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-emerald-400 text-xs font-medium">Active</span>
        </span>
      );
    case 'Inactive':
      return (
        <span className="flex items-center gap-1.5">
          <span className="inline-flex rounded-full h-2 w-2 bg-slate-500" />
          <span className="text-slate-500 text-xs font-medium">Inactive</span>
        </span>
      );
    case 'Error':
      return (
        <span className="flex items-center gap-1.5">
          <span className="inline-flex rounded-full h-2 w-2 bg-red-400" />
          <span className="text-red-400 text-xs font-medium">Error</span>
        </span>
      );
    default:
      return null;
  }
}

// Mini attack timeline bar heights (24 hours, last 24h)
const attackTimelineData = [8, 5, 3, 2, 2, 4, 10, 25, 45, 62, 78, 85, 90, 82, 75, 68, 58, 42, 35, 28, 20, 15, 12, 10];

// Top attacker IPs for this honeypot (mock data)
function getTopAttackers(honeypotName: string) {
  const attackerMap: Record<string, { ip: string; attacks: number; lastSeen: string }[]> = {
    'SSH-Honeypot-01': [
      { ip: '45.33.32.156', attacks: 342, lastSeen: '2m ago' },
      { ip: '91.240.118.172', attacks: 198, lastSeen: '45m ago' },
      { ip: '103.235.46.39', attacks: 87, lastSeen: '1h ago' },
      { ip: '198.51.100.23', attacks: 56, lastSeen: '3h ago' },
      { ip: '203.0.113.50', attacks: 34, lastSeen: '6h ago' },
    ],
    'HTTP-Honeypot-02': [
      { ip: '185.220.101.34', attacks: 523, lastSeen: '5m ago' },
      { ip: '91.240.118.172', attacks: 310, lastSeen: '12m ago' },
      { ip: '203.0.113.50', attacks: 189, lastSeen: '30m ago' },
      { ip: '198.51.100.23', attacks: 94, lastSeen: '2h ago' },
      { ip: '45.33.32.156', attacks: 67, lastSeen: '4h ago' },
    ],
    'MySQL-Honeypot-03': [
      { ip: '103.235.46.39', attacks: 201, lastSeen: '8m ago' },
      { ip: '45.33.32.156', attacks: 88, lastSeen: '1h ago' },
      { ip: '185.220.101.34', attacks: 52, lastSeen: '3h ago' },
      { ip: '198.51.100.23', attacks: 41, lastSeen: '5h ago' },
      { ip: '91.240.118.172', attacks: 30, lastSeen: '8h ago' },
    ],
    'FTP-Honeypot-04': [
      { ip: '45.33.32.156', attacks: 78, lastSeen: '22m ago' },
      { ip: '198.51.100.23', attacks: 35, lastSeen: '1h ago' },
      { ip: '103.235.46.39', attacks: 22, lastSeen: '4h ago' },
      { ip: '185.220.101.34', attacks: 13, lastSeen: '6h ago' },
      { ip: '91.240.118.172', attacks: 8, lastSeen: '1d ago' },
    ],
    'DNS-Honeypot-05': [
      { ip: '198.51.100.23', attacks: 245, lastSeen: '15m ago' },
      { ip: '45.33.32.156', attacks: 134, lastSeen: '2h ago' },
      { ip: '203.0.113.50', attacks: 92, lastSeen: '4h ago' },
      { ip: '185.220.101.34', attacks: 87, lastSeen: '6h ago' },
      { ip: '103.235.46.39', attacks: 65, lastSeen: '12h ago' },
    ],
    'SSH-Honeypot-06': [
      { ip: '91.240.118.172', attacks: 42, lastSeen: '1h ago' },
      { ip: '45.33.32.156', attacks: 21, lastSeen: '3h ago' },
      { ip: '103.235.46.39', attacks: 14, lastSeen: '8h ago' },
      { ip: '198.51.100.23', attacks: 8, lastSeen: '1d ago' },
      { ip: '185.220.101.34', attacks: 4, lastSeen: '2d ago' },
    ],
  };
  return attackerMap[honeypotName] || [];
}

function generateYamlConfig(hp: typeof honeypots[0]) {
  return `# DeceiveNet Honeypot Configuration
# Auto-generated for ${hp.name}

honeypot:
  name: ${hp.name}
  type: ${hp.type}
  status: ${hp.status}

network:
  bind_address: "0.0.0.0"
  listen_ip: "${hp.ip}"
  port: ${hp.port}
  protocol: ${hp.type.toLowerCase()}

emulation:
  os: "Ubuntu 22.04 LTS"
  kernel: "5.15.0-91-generic"
  services:
    - ${hp.type}
  version_fingerprint: "${hp.type}-2.4.1"

logging:
  level: "INFO"
  format: "json"
  output: "/var/log/deceivenet/${hp.name}.log"
  rotate: true
  max_size_mb: 512

security:
  allow_post_explotation: true
  capture_payloads: true
  sandbox_enabled: true
  max_connections: 100

alerts:
  on_brute_force: true
  on_new_attacker: true
  on_data_exfiltration: true
  webhook: "https://hooks.slack.com/services/T00/B00/xxx"`;
}

function generateLogLines(hp: typeof honeypots[0]) {
  const timestamps = [
    '2026-05-02T14:30:01Z',
    '2026-05-02T14:28:45Z',
    '2026-05-02T14:25:12Z',
    '2026-05-02T14:22:33Z',
    '2026-05-02T14:18:09Z',
    '2026-05-02T14:15:44Z',
    '2026-05-02T14:10:27Z',
    '2026-05-02T14:05:51Z',
    '2026-05-02T13:58:16Z',
    '2026-05-02T13:50:03Z',
    '2026-05-02T13:42:28Z',
    '2026-05-02T13:35:55Z',
  ];
  const messages = [
    `[INFO] Connection accepted from 45.33.32.156:54312 on ${hp.type} service`,
    `[WARN] Authentication failure - username: root, password: ******* (attempt 1/5)`,
    `[WARN] Authentication failure - username: admin, password: ******* (attempt 2/5)`,
    `[ALERT] Brute force detected from 45.33.32.156 - rate: 12 attempts/min`,
    `[INFO] Session opened for attacker 45.33.32.156 - tracking ID: S-001`,
    `[INFO] Command captured: "cat /etc/passwd" from 91.240.118.172`,
    `[DEBUG] Payload fingerprint: sha256:a1b2c3d4e5f6...`,
    `[INFO] Data exfiltration attempt: /etc/shadow (3KB) from 91.240.118.172`,
    `[WARN] Rate limit approaching for IP 45.33.32.156 (92/100 connections)`,
    `[INFO] New unique attacker identified: 198.51.100.23 (country: US)`,
    `[DEBUG] Emulated response sent: Linux ubuntu 5.15.0-91-generic`,
    `[INFO] Connection closed for 45.33.32.156:54312 - duration: 12.3s`,
  ];
  return timestamps.map((ts, i) => `${ts} ${messages[i]}`).join('\n');
}

export function HoneypotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [yamlCopied, setYamlCopied] = useState(false);

  const honeypot = honeypots.find((h) => h.id === id);

  if (!honeypot) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-[#f1f5f9] mb-2">Honeypot not found</h2>
        <p className="text-sm text-[#64748b] mb-4">The honeypot with ID "{id}" does not exist.</p>
        <Link to="/admin/honeypots" className="text-[#00d4ff] hover:underline text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Honeypots
        </Link>
      </div>
    );
  }

  const relatedEvents = attackEvents.filter((e) => e.targetHoneypot === honeypot.name);
  const topAttackers = getTopAttackers(honeypot.name);
  const yamlConfig = generateYamlConfig(honeypot);
  const logLines = generateLogLines(honeypot);
  const maxTimelineValue = Math.max(...attackTimelineData);

  const tabs: DetailTab[] = ['Overview', 'Events', 'Configuration', 'Logs'];

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlConfig);
    setYamlCopied(true);
    setTimeout(() => setYamlCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Back link */}
        <Link to="/admin/honeypots" className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Honeypots
        </Link>

        {/* Header Section */}
        <div className="admin-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#f1f5f9]">{honeypot.name}</h1>
              <StatusBadge status={honeypot.status} />
              <span className="bg-[#242424] text-[#94a3b8] rounded px-2 py-0.5 text-xs">
                {honeypot.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="admin-btn-ghost text-sm">Edit Configuration</button>
              <button className="admin-btn-ghost text-sm flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
              <button className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-md transition-colors">
                Delete
              </button>
              <button className="admin-btn-ghost text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                Download Logs
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-xs text-[#64748b] mb-1">Uptime</div>
              <div className="text-lg font-semibold text-[#f1f5f9] font-mono">{honeypot.uptime || '0'}</div>
            </div>
            <div className="bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-xs text-[#64748b] mb-1">Total Attacks</div>
              <div className="text-lg font-semibold text-[#ff6b35]">{honeypot.attacksCaptured.toLocaleString()}</div>
            </div>
            <div className="bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-xs text-[#64748b] mb-1">Unique Attackers</div>
              <div className="text-lg font-semibold text-[#00d4ff]">{honeypot.uniqueAttackers ?? 0}</div>
            </div>
            <div className="bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-xs text-[#64748b] mb-1">Current Connections</div>
              <div className="text-lg font-semibold text-[#f1f5f9]">{honeypot.currentConnections ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-[#2a2a2a]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-[#ff6b35] text-[#f1f5f9]'
                  : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#2a2a2a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Configuration Summary */}
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Configuration Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                <div>
                  <span className="text-xs text-[#64748b]">IP Address</span>
                  <div className="text-sm text-[#f1f5f9] font-mono mt-0.5">{honeypot.ip}</div>
                </div>
                <div>
                  <span className="text-xs text-[#64748b]">Port</span>
                  <div className="text-sm text-[#f1f5f9] font-mono mt-0.5">{honeypot.port}</div>
                </div>
                <div>
                  <span className="text-xs text-[#64748b]">Bind Address</span>
                  <div className="text-sm text-[#f1f5f9] font-mono mt-0.5">0.0.0.0</div>
                </div>
                <div>
                  <span className="text-xs text-[#64748b]">Protocol</span>
                  <div className="text-sm text-[#f1f5f9] mt-0.5">{honeypot.type}</div>
                </div>
                <div>
                  <span className="text-xs text-[#64748b]">Version Fingerprint</span>
                  <div className="text-sm text-[#f1f5f9] font-mono mt-0.5">{honeypot.type.toLowerCase()}-2.4.1</div>
                </div>
                <div>
                  <span className="text-xs text-[#64748b]">OS Emulation</span>
                  <div className="text-sm text-[#f1f5f9] mt-0.5">Ubuntu 22.04 LTS</div>
                </div>
              </div>
            </div>

            {/* Mini Attack Timeline */}
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Attack Timeline (Last 24h)</h2>
              <div className="flex items-end gap-[2px] h-32">
                {attackTimelineData.map((value, i) => {
                  const heightPercent = (value / maxTimelineValue) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 relative group"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div
                        className="w-full h-full rounded-t-sm transition-all duration-200 group-hover:opacity-80"
                        style={{
                          background: `linear-gradient(to top, #ff6b35, rgba(255, 107, 53, 0.2))`,
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#242424] text-[#f1f5f9] text-xs px-2 py-1 rounded border border-[#2a2a2a] whitespace-nowrap z-10">
                        {String(i).padStart(2, '0')}:00 - {value} attacks
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-[#64748b] font-mono">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>

            {/* Top Attacker IPs */}
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Top 5 Attacker IPs</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-[#64748b] font-medium pb-2">IP Address</th>
                    <th className="text-right text-[#64748b] font-medium pb-2">Attacks</th>
                    <th className="text-right text-[#64748b] font-medium pb-2">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {topAttackers.map((attacker, i) => (
                    <tr key={i} className="border-b border-[#2a2a2a]/50">
                      <td className="py-2.5 text-[#00d4ff] font-mono">{attacker.ip}</td>
                      <td className="py-2.5 text-right text-[#f1f5f9] font-semibold">{attacker.attacks.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-[#64748b]">{attacker.lastSeen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="admin-card p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">
              Attack Events
              <span className="ml-2 text-sm font-normal text-[#64748b]">({relatedEvents.length})</span>
            </h2>
            {relatedEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      <th className="text-left text-[#64748b] font-medium pb-3 pr-4">Timestamp</th>
                      <th className="text-left text-[#64748b] font-medium pb-3 pr-4">Attacker IP</th>
                      <th className="text-left text-[#64748b] font-medium pb-3 pr-4">Attack Type</th>
                      <th className="text-left text-[#64748b] font-medium pb-3 pr-4">Severity</th>
                      <th className="text-left text-[#64748b] font-medium pb-3">Payload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedEvents.map((event) => (
                      <tr key={event.id} className="border-b border-[#2a2a2a]/50 hover:bg-[#242424]/30">
                        <td className="py-3 pr-4 text-[#64748b] whitespace-nowrap">{event.timestamp}</td>
                        <td className="py-3 pr-4 text-[#00d4ff] font-mono">{event.sourceIP}</td>
                        <td className="py-3 pr-4 text-[#f1f5f9]">{event.attackType}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${severityBadgeClass[event.severity]}`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="py-3 text-[#94a3b8] font-mono text-xs max-w-[200px] truncate">
                          {event.payload}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-[#64748b] text-sm">No attack events recorded for this honeypot.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Configuration' && (
          <div className="admin-card p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#f1f5f9]">Configuration</h2>
              <button
                onClick={handleCopyYaml}
                className="admin-btn-ghost text-sm flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                {yamlCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 font-mono text-sm text-[#E2E8F0] overflow-x-auto">
              <pre className="whitespace-pre">{yamlConfig}</pre>
            </div>
          </div>
        )}

        {activeTab === 'Logs' && (
          <div className="admin-card p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Live Logs</h2>
            <div className="bg-black rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre">{logLines}</pre>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[#64748b]">Showing latest 12 log entries</span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs text-emerald-400">Auto-scroll active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
