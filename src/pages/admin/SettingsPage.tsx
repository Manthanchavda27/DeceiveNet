import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Plug,
  Users,
  Bell,
  Database,
  Key,
  Box,
  Copy,
  Eye,
  EyeOff,
  TestTube,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';

type SettingsTab =
  | 'General'
  | 'Honeypot Defaults'
  | 'Integrations'
  | 'Users & Roles'
  | 'Notifications'
  | 'Data Retention'
  | 'API Access';

const tabs: { label: SettingsTab; icon: React.ReactNode }[] = [
  { label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
  { label: 'Honeypot Defaults', icon: <Box className="w-4 h-4" /> },
  { label: 'Integrations', icon: <Plug className="w-4 h-4" /> },
  { label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
  { label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { label: 'Data Retention', icon: <Database className="w-4 h-4" /> },
  { label: 'API Access', icon: <Key className="w-4 h-4" /> },
];

const integrationDefs = [
  { name: 'VirusTotal', description: 'Scan IoCs against VirusTotal database', hasTest: true, status: 'Connected' as const },
  { name: 'AbuseIPDB', description: 'Check IP reputation scores', hasTest: true, status: 'Connected' as const },
  { name: 'AlienVault OTX', description: 'Threat intelligence feed', hasTest: false, status: 'Not Configured' as const },
  { name: 'Shodan', description: 'Internet-facing device discovery', hasTest: false, status: 'Disconnected' as const },
  { name: 'MaxMind GeoIP', description: 'IP geolocation lookups', hasTest: false, status: 'Connected' as const },
  { name: 'Slack', description: 'Send alerts to Slack channels', hasTest: true, status: 'Connected' as const },
  { name: 'SMTP', description: 'Email notification delivery', hasTest: true, status: 'Not Configured' as const },
  { name: 'Custom SIEM', description: 'Forward events to your SIEM', hasTest: false, status: 'Disconnected' as const },
];

const statusColors: Record<string, string> = {
  Connected: 'bg-emerald-400',
  Disconnected: 'bg-red-400',
  'Not Configured': 'bg-gray-500',
};

const fakeUsers = [
  { username: 'admin', email: 'admin@deceivenet.io', role: 'Admin' as const, lastLogin: '2m ago', status: 'Active' },
  { username: 'sarah.c', email: 'analyst@deceivenet.io', role: 'Analyst' as const, lastLogin: '1h ago', status: 'Active' },
  { username: 'viewer01', email: 'viewer@deceivenet.io', role: 'Viewer' as const, lastLogin: '5h ago', status: 'Active' },
];

const roleBadgeColors: Record<string, string> = {
  Admin: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  Analyst: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  Viewer: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
};

const fakeApiKeys = [
  { name: 'Production API Key', prefix: 'dn_prod_', created: '30d ago', lastUsed: '2m ago', status: 'Active' },
  { name: 'Development Key', prefix: 'dn_dev_', created: '14d ago', lastUsed: '1d ago', status: 'Active' },
  { name: 'CI/CD Pipeline', prefix: 'dn_ci_', created: '7d ago', lastUsed: '3h ago', status: 'Active' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('General');

  // General state
  const [instanceName, setInstanceName] = useState('DeceiveNet Production');
  const [timezone, setTimezone] = useState('UTC');
  const [logLevel, setLogLevel] = useState('Info');
  const [autoStartHoneypots, setAutoStartHoneypots] = useState(true);
  const [telemetry, setTelemetry] = useState(false);

  // Integration state
  const [integrationStatuses, _setIntegrationStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(integrationDefs.map((i) => [i.name, i.status]))
  );
  const [maxmindAutoUpdate, setMaxmindAutoUpdate] = useState(true);
  const [smtpPasswordVisible, setSmtpPasswordVisible] = useState(false);
  const [siemFormat, setSiemFormat] = useState('CEF');

  // Users state
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(fakeUsers.map((u) => [u.username, u.status]))
  );

  // Data Retention state
  const [eventRetention, setEventRetention] = useState('90d');
  const [payloadRetention, setPayloadRetention] = useState('30d');
  const [auditRetention, setAuditRetention] = useState('1y');

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(true);
  const [alertSeverity, setAlertSeverity] = useState('High');
  const [digestFrequency, setDigestFrequency] = useState('Daily');

  // Honeypot Defaults state
  const [defaultPortRange, setDefaultPortRange] = useState('10000-65535');
  const [defaultAutoStart, setDefaultAutoStart] = useState(true);
  const [defaultLogging, setDefaultLogging] = useState('Full');
  const [defaultCapturePayloads, setDefaultCapturePayloads] = useState(true);

  const handleToggleUserStatus = (username: string) => {
    setUserStatuses((prev) => ({
      ...prev,
      [username]: prev[username] === 'Active' ? 'Disabled' : 'Active',
    }));
  };

  function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
          enabled ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 animate-fadeIn">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Settings</h1>
          <p className="text-sm text-[#94a3b8] mt-1">
            Configure your DeceiveNet instance
          </p>
        </div>

        {/* Layout: Left nav + Right content */}
        <div className="flex gap-6">
          {/* Left Sub-navigation */}
          <nav className="w-56 shrink-0">
            <div className="admin-card p-2 space-y-0.5 sticky top-6">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.label
                      ? 'bg-[#ff6b35]/10 text-[#ff6b35]'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Content Panel */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* General Tab */}
            {activeTab === 'General' && (
              <div className="admin-card p-6 space-y-6">
                <h2 className="text-lg font-semibold text-[#f1f5f9]">General Settings</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Instance Name
                    </label>
                    <input
                      type="text"
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Logging Level
                    </label>
                    <select
                      value={logLevel}
                      onChange={(e) => setLogLevel(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="Debug">Debug</option>
                      <option value="Info">Info</option>
                      <option value="Warn">Warn</option>
                      <option value="Error">Error</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Auto-start Honeypots</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Automatically start honeypots on system boot</p>
                    </div>
                    <Toggle enabled={autoStartHoneypots} onToggle={() => setAutoStartHoneypots(!autoStartHoneypots)} />
                  </div>

                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Telemetry</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Send anonymous usage data to improve DeceiveNet</p>
                    </div>
                    <Toggle enabled={telemetry} onToggle={() => setTelemetry(!telemetry)} />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2a2a2a]">
                  <button className="admin-btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Honeypot Defaults Tab */}
            {activeTab === 'Honeypot Defaults' && (
              <div className="admin-card p-6 space-y-6">
                <h2 className="text-lg font-semibold text-[#f1f5f9]">Honeypot Default Settings</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Default Port Range
                    </label>
                    <input
                      type="text"
                      value={defaultPortRange}
                      onChange={(e) => setDefaultPortRange(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm"
                      placeholder="10000-65535"
                    />
                  </div>

                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Auto-start on Deploy</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Start honeypot immediately after deployment</p>
                    </div>
                    <Toggle enabled={defaultAutoStart} onToggle={() => setDefaultAutoStart(!defaultAutoStart)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Logging Mode
                    </label>
                    <select
                      value={defaultLogging}
                      onChange={(e) => setDefaultLogging(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="Full">Full (all connections + payloads)</option>
                      <option value="Partial">Partial (connections only)</option>
                      <option value="Minimal">Minimal (summary only)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Capture Attack Payloads</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Record full payload data from attacks</p>
                    </div>
                    <Toggle enabled={defaultCapturePayloads} onToggle={() => setDefaultCapturePayloads(!defaultCapturePayloads)} />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2a2a2a]">
                  <button className="admin-btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save Defaults
                  </button>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'Integrations' && (
              <div className="space-y-4">
                {integrationDefs.map((integ) => (
                  <div key={integ.name} className="admin-card p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${statusColors[integrationStatuses[integ.name]]}`}
                          />
                          <h3 className="font-semibold text-[#f1f5f9]">{integ.name}</h3>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          integrationStatuses[integ.name] === 'Connected'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : integrationStatuses[integ.name] === 'Disconnected'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}
                      >
                        {integrationStatuses[integ.name]}
                      </span>
                    </div>

                    <p className="text-sm text-[#64748b] mb-4">{integ.description}</p>

                    <div className="space-y-3">
                      {integ.name === 'VirusTotal' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            placeholder="Enter VirusTotal API key"
                            className="admin-input flex-1 px-3 py-2 text-sm"
                          />
                          <button className="admin-btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
                            <TestTube className="w-3.5 h-3.5" />
                            Test
                          </button>
                        </div>
                      )}
                      {integ.name === 'AbuseIPDB' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            placeholder="Enter AbuseIPDB API key"
                            className="admin-input flex-1 px-3 py-2 text-sm"
                          />
                          <button className="admin-btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
                            <TestTube className="w-3.5 h-3.5" />
                            Test
                          </button>
                        </div>
                      )}
                      {integ.name === 'AlienVault OTX' && (
                        <input
                          type="password"
                          placeholder="Enter AlienVault OTX API key"
                          className="admin-input w-full px-3 py-2 text-sm"
                        />
                      )}
                      {integ.name === 'Shodan' && (
                        <input
                          type="password"
                          placeholder="Enter Shodan API key"
                          className="admin-input w-full px-3 py-2 text-sm"
                        />
                      )}
                      {integ.name === 'MaxMind GeoIP' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="/var/lib/maxmind/GeoLite2-City.mmdb"
                            className="admin-input w-full px-3 py-2 text-sm"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#94a3b8]">Auto-update database</span>
                            <Toggle
                              enabled={maxmindAutoUpdate}
                              onToggle={() => setMaxmindAutoUpdate(!maxmindAutoUpdate)}
                            />
                          </div>
                        </div>
                      )}
                      {integ.name === 'Slack' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="https://hooks.slack.com/services/..."
                            className="admin-input flex-1 px-3 py-2 text-sm"
                          />
                          <button className="admin-btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
                            <TestTube className="w-3.5 h-3.5" />
                            Test
                          </button>
                        </div>
                      )}
                      {integ.name === 'SMTP' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="SMTP server"
                              className="admin-input px-3 py-2 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Port (587)"
                              className="admin-input px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Username"
                              className="admin-input px-3 py-2 text-sm"
                            />
                            <div className="relative">
                              <input
                                type={smtpPasswordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                className="admin-input w-full px-3 py-2 text-sm pr-10"
                              />
                              <button
                                onClick={() => setSmtpPasswordVisible(!smtpPasswordVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8]"
                              >
                                {smtpPasswordVisible ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="From address (alerts@deceivenet.io)"
                            className="admin-input w-full px-3 py-2 text-sm"
                          />
                          <button className="admin-btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
                            <TestTube className="w-3.5 h-3.5" />
                            Test Email
                          </button>
                        </div>
                      )}
                      {integ.name === 'Custom SIEM' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Syslog endpoint (e.g., tcp://siem.local:514)"
                            className="admin-input w-full px-3 py-2 text-sm"
                          />
                          <select
                            value={siemFormat}
                            onChange={(e) => setSiemFormat(e.target.value)}
                            className="admin-input w-full max-w-xs px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                          >
                            <option value="CEF">CEF (Common Event Format)</option>
                            <option value="JSON">JSON</option>
                            <option value="Syslog">Syslog (RFC 5424)</option>
                            <option value="LEEF">LEEF (Log Event Extended Format)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users & Roles Tab */}
            {activeTab === 'Users & Roles' && (
              <div className="space-y-6">
                {/* User Management */}
                <div className="admin-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#f1f5f9]">User Management</h2>
                    <button className="admin-btn-primary flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#242424] text-xs uppercase tracking-wider text-[#64748b]">
                          <th className="px-4 py-3 text-left">Username</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Last Login</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fakeUsers.map((user) => (
                          <tr
                            key={user.username}
                            className="hover:bg-[#242424] transition-colors border-b border-[#2a2a2a]/50"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-full bg-[#ff6b35] flex items-center justify-center text-xs font-semibold text-white">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                                <span className="text-sm text-[#f1f5f9]">{user.username}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#94a3b8]">{user.email}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColors[user.role]}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#64748b]">{user.lastLogin}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  userStatuses[user.username] === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}
                              >
                                {userStatuses[user.username]}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Edit">
                                  <Shield className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user.username)}
                                  className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                  title="Disable"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Role Definitions */}
                <div className="admin-card p-6">
                  <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Role Definitions</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#242424] rounded-lg border border-[#2a2a2a]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30">
                          Admin
                        </span>
                      </div>
                      <p className="text-sm text-[#94a3b8]">
                        Full access to all resources. Can manage users, configure integrations, and modify system settings.
                      </p>
                    </div>
                    <div className="p-4 bg-[#242424] rounded-lg border border-[#2a2a2a]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          Analyst
                        </span>
                      </div>
                      <p className="text-sm text-[#94a3b8]">
                        Can view all data, acknowledge alerts, and manage honeypots. Cannot modify system settings or users.
                      </p>
                    </div>
                    <div className="p-4 bg-[#242424] rounded-lg border border-[#2a2a2a]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-400 border border-slate-500/30">
                          Viewer
                        </span>
                      </div>
                      <p className="text-sm text-[#94a3b8]">
                        Read-only access to dashboards and reports. Cannot modify any resources or acknowledge alerts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="admin-card p-6 space-y-6">
                <h2 className="text-lg font-semibold text-[#f1f5f9]">Notification Preferences</h2>

                <div className="space-y-5">
                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Email Notifications</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Send alert notifications via email</p>
                    </div>
                    <Toggle enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
                  </div>

                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Slack Notifications</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Send alert notifications to Slack</p>
                    </div>
                    <Toggle enabled={slackNotifications} onToggle={() => setSlackNotifications(!slackNotifications)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Minimum Alert Severity
                    </label>
                    <select
                      value={alertSeverity}
                      onChange={(e) => setAlertSeverity(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="Critical">Critical only</option>
                      <option value="High">High and above</option>
                      <option value="Medium">Medium and above</option>
                      <option value="Low">All severities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Activity Digest
                    </label>
                    <select
                      value={digestFrequency}
                      onChange={(e) => setDigestFrequency(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="Realtime">Real-time</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2a2a2a]">
                  <button className="admin-btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Data Retention Tab */}
            {activeTab === 'Data Retention' && (
              <div className="admin-card p-6 space-y-6">
                <h2 className="text-lg font-semibold text-[#f1f5f9]">Data Retention & Storage</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Event Retention Period
                    </label>
                    <select
                      value={eventRetention}
                      onChange={(e) => setEventRetention(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="30d">30 days</option>
                      <option value="90d">90 days</option>
                      <option value="180d">180 days</option>
                      <option value="1y">1 year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Payload Retention Period
                    </label>
                    <select
                      value={payloadRetention}
                      onChange={(e) => setPayloadRetention(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="7d">7 days</option>
                      <option value="30d">30 days</option>
                      <option value="90d">90 days</option>
                      <option value="1y">1 year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Audit Log Retention
                    </label>
                    <select
                      value={auditRetention}
                      onChange={(e) => setAuditRetention(e.target.value)}
                      className="admin-input w-full max-w-md px-3 py-2 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="90d">90 days</option>
                      <option value="180d">180 days</option>
                      <option value="1y">1 year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  {/* Storage Usage Meter */}
                  <div className="p-4 bg-[#242424] rounded-lg border border-[#2a2a2a]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#f1f5f9]">Storage Usage</span>
                      <span className="text-sm text-[#94a3b8]">42% used</span>
                    </div>
                    <div className="w-full h-3 bg-[#0d0d0d] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#ff6b35]"
                        style={{ width: '42%' }}
                      />
                    </div>
                    <p className="text-xs text-[#64748b] mt-2">
                      4.2 GB of 10 GB used
                    </p>
                  </div>

                  <div className="flex items-center justify-between max-w-md py-2">
                    <div>
                      <span className="text-sm font-medium text-[#f1f5f9]">Auto-cleanup Schedule</span>
                      <p className="text-xs text-[#64748b] mt-0.5">Run retention cleanup daily at 03:00 UTC</p>
                    </div>
                    <Toggle enabled={true} onToggle={() => {}} />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#2a2a2a]">
                  <button className="admin-btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save Retention Settings
                  </button>
                  <button className="admin-btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
                    <Database className="w-4 h-4" />
                    Run Cleanup Now
                  </button>
                </div>
              </div>
            )}

            {/* API Access Tab */}
            {activeTab === 'API Access' && (
              <div className="space-y-6">
                {/* API Key List */}
                <div className="admin-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#f1f5f9]">API Keys</h2>
                    <button className="admin-btn-primary flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" />
                      Generate New API Key
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#242424] text-xs uppercase tracking-wider text-[#64748b]">
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Prefix</th>
                          <th className="px-4 py-3 text-left">Created</th>
                          <th className="px-4 py-3 text-left">Last Used</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fakeApiKeys.map((key) => (
                          <tr
                            key={key.prefix}
                            className="hover:bg-[#242424] transition-colors border-b border-[#2a2a2a]/50"
                          >
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#f1f5f9]">{key.name}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-sm text-[#64748b]">{key.prefix}****</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#64748b]">{key.created}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#64748b]">{key.lastUsed}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400">
                                {key.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                                  title="Copy key"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                  title="Revoke"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Rate Limiting */}
                <div className="admin-card p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-[#f1f5f9]">Rate Limiting</h2>
                  <div className="grid grid-cols-2 gap-4 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                        Requests per minute
                      </label>
                      <input
                        type="number"
                        defaultValue={1000}
                        className="admin-input w-full px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                        Burst limit
                      </label>
                      <input
                        type="number"
                        defaultValue={50}
                        className="admin-input w-full px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Allowed IPs */}
                <div className="admin-card p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-[#f1f5f9]">Allowed IPs (CIDR)</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[#94a3b8] bg-[#242424] rounded px-3 py-2 flex-1 border border-[#2a2a2a]">
                        10.0.0.0/8
                      </span>
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[#94a3b8] bg-[#242424] rounded px-3 py-2 flex-1 border border-[#2a2a2a]">
                        192.168.0.0/16
                      </span>
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add CIDR range (e.g., 172.16.0.0/12)"
                        className="admin-input flex-1 px-3 py-2 text-sm"
                      />
                      <button className="admin-btn-primary px-3 py-2 text-sm">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
