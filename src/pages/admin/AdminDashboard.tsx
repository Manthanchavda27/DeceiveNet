import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Server, Swords, Fingerprint, BellRing, TrendingUp } from 'lucide-react';
import { attackEvents, honeypots } from '../../lib/data';

const countryFlags: Record<string, string> = {
  RU: '\u{1F1F7}\u{1F1FA}',
  DE: '\u{1F1E9}\u{1F1EA}',
  CN: '\u{1F1E8}\u{1F1F3}',
  UA: '\u{1F1FA}\u{1F1E6}',
  US: '\u{1F1FA}\u{1F1F8}',
  IN: '\u{1F1EE}\u{1F1F3}',
};

const severityBadgeClass: Record<string, string> = {
  Critical: 'severity-critical',
  High: 'severity-high',
  Medium: 'severity-medium',
  Low: 'severity-low',
};

const topHoneypots = [...honeypots]
  .sort((a, b) => b.attacksCaptured - a.attacksCaptured)
  .slice(0, 5);

const topAttackTypes: Record<string, string> = {
  'SSH-Honeypot-01': 'SSH Brute Force',
  'HTTP-Honeypot-02': 'HTTP SQLi Probe',
  'MySQL-Honeypot-03': 'Auth Attempt',
  'FTP-Honeypot-04': 'Cred Stuffing',
  'DNS-Honeypot-05': 'Zone Transfer',
  'SSH-Honeypot-06': 'SSH Brute Force',
};

const lastAttackTimes: Record<string, string> = {
  'SSH-Honeypot-01': '2m ago',
  'HTTP-Honeypot-02': '5m ago',
  'MySQL-Honeypot-03': '8m ago',
  'FTP-Honeypot-04': '22m ago',
  'DNS-Honeypot-05': '15m ago',
  'SSH-Honeypot-06': '1h ago',
};

const hourlyData = [
  8, 5, 3, 2, 2, 4, 10, 25, 45, 62, 78, 85,
  90, 82, 75, 68, 58, 42, 35, 28, 20, 15, 12, 10,
];

const mapDots = [
  { left: '18%', top: '35%', color: '#ef4444', pulse: true },
  { left: '22%', top: '30%', color: '#ff6b35', pulse: false },
  { left: '48%', top: '25%', color: '#ff6b35', pulse: true },
  { left: '50%', top: '32%', color: '#ef4444', pulse: false },
  { left: '52%', top: '28%', color: '#f59e0b', pulse: false },
  { left: '55%', top: '35%', color: '#ff6b35', pulse: true },
  { left: '78%', top: '38%', color: '#f59e0b', pulse: false },
  { left: '80%', top: '32%', color: '#ff6b35', pulse: true },
  { left: '75%', top: '30%', color: '#ef4444', pulse: true },
  { left: '82%', top: '42%', color: '#f59e0b', pulse: false },
  { left: '15%', top: '65%', color: '#ff6b35', pulse: false },
  { left: '30%', top: '70%', color: '#f59e0b', pulse: false },
  { left: '65%', top: '60%', color: '#ff6b35', pulse: true },
  { left: '45%', top: '72%', color: '#f59e0b', pulse: false },
  { left: '85%', top: '68%', color: '#ff6b35', pulse: false },
];

export function AdminDashboard() {
  const [timelineRange, setTimelineRange] = useState<'24h' | '7d' | '30d'>('24h');

  const maxHourly = Math.max(...hourlyData);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Dashboard</h1>
          <p className="text-sm text-[#94a3b8] mt-1">Real-time overview of your deception network</p>
        </div>

        {/* Top Section - Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Honeypots */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">5</div>
            <div className="text-sm text-[#94a3b8] mt-1">Active Honeypots</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">+2</span>
            </div>
          </div>

          {/* Total Attacks Captured */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Swords className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">4,230</div>
            <div className="text-sm text-[#94a3b8] mt-1">Total Attacks Captured</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">+187</span>
            </div>
          </div>

          {/* Unique Attackers */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">712</div>
            <div className="text-sm text-[#94a3b8] mt-1">Unique Attackers</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">+43</span>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <BellRing className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">2</div>
            <div className="text-sm text-[#94a3b8] mt-1">Critical Alerts</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">+1</span>
            </div>
          </div>
        </div>

        {/* Middle Section - Two Columns */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Live Attack Map */}
          <div className="lg:w-[60%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Live Attack Map</h2>

              {/* World Map Placeholder */}
              <div
                className="relative bg-[#0d0d0d] rounded-lg h-80 overflow-hidden"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 39px, #1a1a1a 39px, #1a1a1a 40px),
                    repeating-linear-gradient(90deg, transparent, transparent 39px, #1a1a1a 39px, #1a1a1a 40px)
                  `,
                }}
              >
                {/* Map dots */}
                {mapDots.map((dot, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${dot.pulse ? 'animate-pulse-dot' : ''}`}
                    style={{
                      left: dot.left,
                      top: dot.top,
                      backgroundColor: dot.color,
                      boxShadow: dot.pulse ? `0 0 8px ${dot.color}` : `0 0 4px ${dot.color}40`,
                    }}
                  />
                ))}

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-[#0d0d0d]/80 px-3 py-2 rounded-md border border-[#2a2a2a]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                    <span className="text-xs text-[#94a3b8]">Critical</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                    <span className="text-xs text-[#94a3b8]">High</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-xs text-[#94a3b8]">Medium</span>
                  </div>
                </div>
              </div>

              {/* Top 5 Most Targeted Honeypots */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Top 5 Most Targeted Honeypots</h3>
                <div className="overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#64748b] font-medium pb-2">Honeypot</th>
                        <th className="text-right text-[#64748b] font-medium pb-2">Attacks</th>
                        <th className="text-right text-[#64748b] font-medium pb-2 hidden sm:table-cell">Top Attack</th>
                        <th className="text-right text-[#64748b] font-medium pb-2 hidden md:table-cell">Last Attack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topHoneypots.map((hp) => (
                        <tr key={hp.id} className="border-b border-[#2a2a2a]/50">
                          <td className="py-2.5 text-[#f1f5f9] font-medium">{hp.name}</td>
                          <td className="py-2.5 text-right text-[#ff6b35] font-mono">{hp.attacksCaptured.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-[#94a3b8] hidden sm:table-cell">{topAttackTypes[hp.name] || 'N/A'}</td>
                          <td className="py-2.5 text-right text-[#64748b] hidden md:table-cell">{lastAttackTimes[hp.name] || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Recent Attack Events Feed */}
          <div className="lg:w-[40%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Recent Attack Events</h2>

              <div className="max-h-96 overflow-y-auto dark-scrollbar space-y-2">
                {attackEvents.map((event) => (
                  <div key={event.id} className="bg-[#242424] rounded-lg p-3">
                    {/* Top row: severity badge + attack type */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${severityBadgeClass[event.severity]}`}>
                        {event.severity}
                      </span>
                      <span className="text-xs text-[#f1f5f9] font-medium">{event.attackType}</span>
                    </div>

                    {/* Middle: attacker IP + country flag */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-[#00d4ff]">{event.sourceIP}</span>
                      <span className="text-sm">{countryFlags[event.countryCode || ''] || ''}</span>
                    </div>

                    {/* Bottom: targeted honeypot + timestamp */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#94a3b8]">{event.targetHoneypot}</span>
                      <span className="text-xs text-[#64748b]">{event.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/admin/attack-events"
                className="block mt-4 text-center text-[#00d4ff] text-sm hover:underline"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - Attack Timeline Chart */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#f1f5f9]">Attack Volume</h2>
            <div className="flex items-center gap-1">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimelineRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                    timelineRange === range
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* CSS-based area chart */}
          <div className="relative h-48 flex items-end gap-[2px] px-8">
            {/* Y-axis tick marks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-[#64748b] font-mono">
              <span>{maxHourly}</span>
              <span>{Math.round(maxHourly / 2)}</span>
              <span>0</span>
            </div>

            {/* Bars */}
            {hourlyData.map((value, i) => {
              const heightPercent = (value / maxHourly) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 relative group"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div
                    className="w-full h-full rounded-t-sm transition-all duration-200 group-hover:opacity-80"
                    style={{
                      background: `linear-gradient(to top, #ff6b35, rgba(255, 107, 53, 0.1))`,
                    }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#242424] text-[#f1f5f9] text-xs px-2 py-1 rounded border border-[#2a2a2a] whitespace-nowrap z-10">
                    {String(i).padStart(2, '0')}:00 - {value} attacks
                  </div>
                </div>
              );
            })}

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between translate-y-5 text-[10px] text-[#64748b] font-mono">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
