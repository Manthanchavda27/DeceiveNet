import { useState, useEffect } from 'react';
import { Server, Swords, Fingerprint, BellRing, Zap } from 'lucide-react';
import { fetchOverview, fetchHoneypots, fetchEvents, triggerDemoAttack } from '../../lib/api';
import { useWebSockets } from '../../lib/useWebSockets';

const severityBadgeClass: Record<string, string> = {
  critical: 'severity-critical',
  high: 'severity-high',
  medium: 'severity-medium',
  low: 'severity-low',
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
  const [overview, setOverview] = useState<any>(null);
  const [honeypots, setHoneypots] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const { lastEvent, connected } = useWebSockets();

  useEffect(() => {
    async function loadData() {
      try {
        const [o, h, e] = await Promise.all([
          fetchOverview(),
          fetchHoneypots(),
          fetchEvents(),
        ]);
        setOverview(o);
        setHoneypots(h);
        setEvents(e);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }
    loadData();
  }, []);

  // Handle incoming real-time websocket events
  useEffect(() => {
    if (lastEvent) {
      // Prepend the new event
      setEvents((prev) => [lastEvent, ...prev]);
      
      // Update overview counters instantly
      setOverview((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          total_attacks_24h: prev.total_attacks_24h + 1,
          critical_alerts_24h: lastEvent.severity === 'critical' ? prev.critical_alerts_24h + 1 : prev.critical_alerts_24h,
        };
      });
    }
  }, [lastEvent]);

  const handleDemoAttack = async () => {
    try {
      setLoadingDemo(true);
      await triggerDemoAttack();
    } catch (err) {
      console.error(err);
      alert('Failed to trigger demo attack. Make sure you are logged in.');
    } finally {
      setLoadingDemo(false);
    }
  };

  const maxHourly = Math.max(...hourlyData);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Dashboard</h1>
            <p className="text-sm text-[#94a3b8] mt-1">Real-time overview of your deception network</p>
          </div>
          <button
            onClick={handleDemoAttack}
            disabled={loadingDemo}
            className="flex items-center gap-2 bg-[#ff6b35] hover:bg-[#ff8559] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Zap size={18} />
            {loadingDemo ? 'Simulating...' : 'Simulate Demo Attack'}
          </button>
        </div>

        {/* Top Section - Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">{overview?.active_honeypots ?? 0}</div>
            <div className="text-sm text-[#94a3b8] mt-1">Active Honeypots</div>
          </div>
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Swords className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">{overview?.total_attacks_24h ?? 0}</div>
            <div className="text-sm text-[#94a3b8] mt-1">Total Attacks Captured</div>
          </div>
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">{overview?.unique_attackers_24h ?? 0}</div>
            <div className="text-sm text-[#94a3b8] mt-1">Unique Attackers</div>
          </div>
          <div className="admin-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <BellRing className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div className="text-3xl font-bold text-[#f1f5f9]">{overview?.critical_alerts_24h ?? 0}</div>
            <div className="text-sm text-[#94a3b8] mt-1">Critical Alerts</div>
          </div>
        </div>

        {/* Middle Section - Two Columns */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Live Attack Map */}
          <div className="lg:w-[60%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Live Attack Map</h2>
              <div
                className="relative bg-[#0d0d0d] rounded-lg h-80 overflow-hidden"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 39px, #1a1a1a 39px, #1a1a1a 40px),
                    repeating-linear-gradient(90deg, transparent, transparent 39px, #1a1a1a 39px, #1a1a1a 40px)
                  `,
                }}
              >
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
              </div>

              {/* Dynamic Honeypots List */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Active Honeypots</h3>
                <div className="overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#64748b] font-medium pb-2">Honeypot</th>
                        <th className="text-left text-[#64748b] font-medium pb-2">Type</th>
                        <th className="text-left text-[#64748b] font-medium pb-2">Status</th>
                        <th className="text-right text-[#64748b] font-medium pb-2">Deployed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {honeypots.slice(0, 5).map((hp) => (
                        <tr key={hp.id} className="border-b border-[#2a2a2a]/50">
                          <td className="py-2.5 text-[#f1f5f9] font-medium">{hp.name}</td>
                          <td className="py-2.5 text-[#94a3b8]">{hp.type}</td>
                          <td className="py-2.5 text-[#emerald-400] capitalize">{hp.status}</td>
                          <td className="py-2.5 text-right text-[#64748b]">{new Date(hp.deployedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {honeypots.length === 0 && (
                        <tr><td colSpan={4} className="py-4 text-center text-[#64748b]">No honeypots deployed</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Recent Attack Events Feed */}
          <div className="lg:w-[40%]">
            <div className="admin-card p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#f1f5f9]">Recent Attack Events</h2>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></span>
                  <span className="text-xs text-[#94a3b8]">{connected ? 'Live' : 'Disconnected'}</span>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto dark-scrollbar space-y-2 flex-1">
                {events.map((event) => {
                  // Parse sourceGeo if it's a string
                  let geo = { country: 'Unknown' };
                  try {
                    geo = typeof event.sourceGeo === 'string' ? JSON.parse(event.sourceGeo) : (event.sourceGeo || geo);
                  } catch {}

                  return (
                    <div key={event.id} className="bg-[#242424] rounded-lg p-3 transition-all duration-300 animate-fadeIn">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border capitalize ${severityBadgeClass[event.severity?.toLowerCase()] || 'border-gray-500 text-gray-400'}`}>
                          {event.severity}
                        </span>
                        <span className="text-xs text-[#f1f5f9] font-medium">{event.attackType}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-[#00d4ff]">{event.sourceIp}</span>
                        <span className="text-sm text-[#94a3b8]">{geo.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8]">{event.protocol?.toUpperCase()} PORT {event.sourcePort}</span>
                        <span className="text-xs text-[#64748b]">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  );
                })}
                {events.length === 0 && (
                  <div className="text-center text-[#64748b] mt-10">Waiting for incoming attacks...</div>
                )}
              </div>
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

          <div className="relative h-48 flex items-end gap-[2px] px-8">
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-[#64748b] font-mono">
              <span>{maxHourly}</span>
              <span>{Math.round(maxHourly / 2)}</span>
              <span>0</span>
            </div>
            {hourlyData.map((value, i) => {
              const heightPercent = (value / maxHourly) * 100;
              return (
                <div key={i} className="flex-1 relative group" style={{ height: `${heightPercent}%` }}>
                  <div className="w-full h-full rounded-t-sm transition-all duration-200 group-hover:opacity-80"
                    style={{ background: `linear-gradient(to top, #ff6b35, rgba(255, 107, 53, 0.1))` }} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#242424] text-[#f1f5f9] text-xs px-2 py-1 rounded border border-[#2a2a2a] whitespace-nowrap z-10">
                    {String(i).padStart(2, '0')}:00 - {value} attacks
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between translate-y-5 text-[10px] text-[#64748b] font-mono">
              <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
