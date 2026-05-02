import { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Activity,
  Crosshair,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

type DateRange = 'Last 24 Hours' | 'Last 7 Days' | 'Last 30 Days' | 'Last Quarter' | 'Custom Range';
type VolumeView = 'By Severity' | 'By Honeypot' | 'By Attack Type';

const dateRanges: DateRange[] = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Custom Range'];
const volumeViews: VolumeView[] = ['By Severity', 'By Honeypot', 'By Attack Type'];

// Hourly attack data: 24 hours, low at night, peaks during day
const hourlyData = [
  { hour: '00', critical: 2, high: 5, medium: 8 },
  { hour: '01', critical: 1, high: 3, medium: 5 },
  { hour: '02', critical: 1, high: 2, medium: 4 },
  { hour: '03', critical: 1, high: 2, medium: 3 },
  { hour: '04', critical: 0, high: 1, medium: 3 },
  { hour: '05', critical: 1, high: 2, medium: 4 },
  { hour: '06', critical: 3, high: 8, medium: 12 },
  { hour: '07', critical: 5, high: 14, medium: 20 },
  { hour: '08', critical: 8, high: 22, medium: 30 },
  { hour: '09', critical: 12, high: 30, medium: 42 },
  { hour: '10', critical: 15, high: 35, medium: 48 },
  { hour: '11', critical: 18, high: 38, medium: 52 },
  { hour: '12', critical: 20, high: 40, medium: 55 },
  { hour: '13', critical: 17, high: 36, medium: 50 },
  { hour: '14', critical: 16, high: 34, medium: 47 },
  { hour: '15', critical: 14, high: 30, medium: 40 },
  { hour: '16', critical: 12, high: 26, medium: 36 },
  { hour: '17', critical: 9, high: 20, medium: 28 },
  { hour: '18', critical: 7, high: 15, medium: 22 },
  { hour: '19', critical: 5, high: 12, medium: 18 },
  { hour: '20', critical: 4, high: 10, medium: 15 },
  { hour: '21', critical: 3, high: 8, medium: 12 },
  { hour: '22', critical: 2, high: 6, medium: 10 },
  { hour: '23', critical: 2, high: 5, medium: 8 },
];

const maxTotal = Math.max(...hourlyData.map((d) => d.critical + d.high + d.medium));

// Top 10 countries
const topCountries = [
  { rank: 1, flag: '\u{1F1F7}\u{1F1FA}', country: 'Russia', attacks: 1247, pct: 29.5, trend: 'up' as const },
  { rank: 2, flag: '\u{1F1E8}\u{1F1F3}', country: 'China', attacks: 892, pct: 21.1, trend: 'up' as const },
  { rank: 3, flag: '\u{1F1FA}\u{1F1E6}', country: 'Ukraine', attacks: 634, pct: 15.0, trend: 'down' as const },
  { rank: 4, flag: '\u{1F1FA}\u{1F1F8}', country: 'United States', attacks: 423, pct: 10.0, trend: 'up' as const },
  { rank: 5, flag: '\u{1F1E9}\u{1F1EA}', country: 'Germany', attacks: 312, pct: 7.4, trend: 'down' as const },
  { rank: 6, flag: '\u{1F1EE}\u{1F1F3}', country: 'India', attacks: 256, pct: 6.1, trend: 'up' as const },
  { rank: 7, flag: '\u{1F1E7}\u{1F1F7}', country: 'Brazil', attacks: 198, pct: 4.7, trend: 'down' as const },
  { rank: 8, flag: '\u{1F1EE}\u{1F1F7}', country: 'Iran', attacks: 156, pct: 3.7, trend: 'up' as const },
  { rank: 9, flag: '\u{1F1FB}\u{1F1F3}', country: 'Vietnam', attacks: 112, pct: 2.6, trend: 'down' as const },
  { rank: 10, flag: '\u{1F30D}', country: 'Other', attacks: 200, pct: 4.8, trend: 'neutral' as const },
];

// Attack type distribution
const attackTypes = [
  { name: 'SSH Brute Force', pct: 35, count: 1480, color: '#ef4444' },
  { name: 'HTTP SQLi', pct: 20, count: 846, color: '#ff6b35' },
  { name: 'RCE Attempts', pct: 15, count: 635, color: '#f59e0b' },
  { name: 'DNS Attacks', pct: 12, count: 508, color: '#00d4ff' },
  { name: 'FTP Attacks', pct: 10, count: 423, color: '#22c55e' },
  { name: 'Other', pct: 8, count: 338, color: '#64748b' },
];

// Top 15 source IPs
const topIPs = [
  { ip: '45.33.32.156', count: 342 },
  { ip: '91.240.118.172', count: 287 },
  { ip: '185.220.101.34', count: 198 },
  { ip: '104.248.254.12', count: 176 },
  { ip: '159.89.4.97', count: 154 },
  { ip: '194.165.16.102', count: 132 },
  { ip: '167.172.12.85', count: 118 },
  { ip: '209.141.58.42', count: 105 },
  { ip: '62.210.88.201', count: 94 },
  { ip: '198.51.100.23', count: 87 },
  { ip: '203.0.113.45', count: 78 },
  { ip: '77.247.181.162', count: 65 },
  { ip: '5.188.206.15', count: 52 },
  { ip: '46.166.139.111', count: 41 },
  { ip: '178.128.92.33', count: 30 },
];

const maxIPCount = topIPs[0].count;

// Heatmap data: 7 days x 24 hours, higher during business hours on weekdays
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapData: number[][] = [
  // Mon - busy
  [2,1,1,1,0,1,3,8,15,22,28,32,30,27,25,20,16,10,7,5,4,3,3,2],
  // Tue - busiest
  [2,1,1,0,0,1,4,10,18,25,30,35,33,30,28,22,18,12,8,6,4,3,2,2],
  // Wed - busy
  [1,1,0,0,0,2,3,9,16,24,29,34,32,29,26,21,17,11,7,5,3,2,2,1],
  // Thu - moderate
  [1,0,0,0,1,1,3,7,14,20,25,30,28,25,23,18,14,9,6,4,3,2,1,1],
  // Fri - winding down
  [1,0,0,0,0,1,2,6,12,18,22,26,24,22,20,16,12,8,5,3,2,2,1,1],
  // Sat - quiet
  [0,0,0,0,0,0,1,3,6,10,12,14,13,12,11,9,7,5,3,2,2,1,1,0],
  // Sun - quietest
  [0,0,0,0,0,0,1,2,5,8,10,12,11,10,9,7,6,4,3,2,1,1,0,0],
];
const heatmapMax = 35;

// Map dots for geography
const geoMapDots = [
  { left: '15%', top: '32%', size: 10, color: '#ef4444' },
  { left: '20%', top: '28%', size: 8, color: '#ff6b35' },
  { left: '48%', top: '26%', size: 9, color: '#ff6b35' },
  { left: '50%', top: '30%', size: 7, color: '#ef4444' },
  { left: '52%', top: '33%', size: 8, color: '#f59e0b' },
  { left: '55%', top: '36%', size: 6, color: '#ff6b35' },
  { left: '76%', top: '35%', size: 5, color: '#f59e0b' },
  { left: '78%', top: '40%', size: 6, color: '#ff6b35' },
  { left: '75%', top: '38%', size: 4, color: '#f59e0b' },
  { left: '80%', top: '42%', size: 3, color: '#ff6b35' },
  { left: '13%', top: '62%', size: 3, color: '#f59e0b' },
  { left: '30%', top: '68%', size: 4, color: '#ff6b35' },
  { left: '65%', top: '58%', size: 4, color: '#ff6b35' },
  { left: '45%', top: '70%', size: 3, color: '#f59e0b' },
  { left: '22%', top: '30%', size: 7, color: '#ef4444' },
  { left: '58%', top: '38%', size: 3, color: '#00d4ff' },
  { left: '72%', top: '62%', size: 2, color: '#f59e0b' },
  { left: '35%', top: '42%', size: 5, color: '#ff6b35' },
  { left: '25%', top: '50%', size: 3, color: '#f59e0b' },
  { left: '82%', top: '55%', size: 2, color: '#ff6b35' },
];

function TrendArrow({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
  if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-[#64748b]" />;
}

function getHeatmapColor(value: number): string {
  if (value === 0) return '#0d0d0d';
  const intensity = value / heatmapMax;
  // interpolate from dark to orange
  const r = Math.round(13 + (255 - 13) * intensity);
  const g = Math.round(13 + (107 - 13) * intensity);
  const b = Math.round(13 + (53 - 13) * intensity);
  return `rgb(${r}, ${g}, ${b})`;
}

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('Last 24 Hours');
  const [volumeView, setVolumeView] = useState<VolumeView>('By Severity');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title + Date Range Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Analytics</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Trends, statistics, and insights from your deception network
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1">
            <Calendar className="w-4 h-4 text-[#64748b] ml-2" />
            {dateRanges.map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
                  dateRange === range
                    ? 'bg-[#ff6b35] text-white'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1 - Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Events */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#ff6b35]" />
              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">Total Events</span>
            </div>
            <div className="text-2xl font-bold text-[#f1f5f9]">4,230</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">+12% vs last period</span>
            </div>
          </div>

          {/* Unique Attackers */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">Unique Attackers</span>
            </div>
            <div className="text-2xl font-bold text-[#f1f5f9]">712</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">+6% vs last period</span>
            </div>
          </div>

          {/* Avg Attack Rate */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">Avg Attack Rate</span>
            </div>
            <div className="text-2xl font-bold text-[#f1f5f9]">176/hr</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">-3% vs last period</span>
            </div>
          </div>

          {/* Most Targeted */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-[#22c55e]" />
              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">Most Targeted</span>
            </div>
            <div className="text-2xl font-bold text-[#f1f5f9]">HTTP</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-[#94a3b8]">1,847 events</span>
            </div>
          </div>
        </div>

        {/* SECTION 2 - Attack Volume Over Time */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#f1f5f9]">Attack Volume Over Time</h2>
            <div className="flex items-center gap-1">
              {volumeViews.map((view) => (
                <button
                  key={view}
                  onClick={() => setVolumeView(view)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                    volumeView === view
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424]'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* CSS stacked bar chart */}
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-[10px] text-[#64748b] font-mono pr-2">
              <span>{maxTotal}</span>
              <span>{Math.round(maxTotal * 0.75)}</span>
              <span>{Math.round(maxTotal * 0.5)}</span>
              <span>{Math.round(maxTotal * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Horizontal grid lines */}
            <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-[#2a2a2a]/40 w-full" />
              ))}
            </div>

            {/* Bars container */}
            <div className="absolute left-10 right-0 top-0 bottom-6 flex items-end gap-[3px]">
              {hourlyData.map((data, i) => {
                const total = data.critical + data.high + data.medium;
                const criticalPct = (data.critical / maxTotal) * 100;
                const highPct = (data.high / maxTotal) * 100;
                const mediumPct = (data.medium / maxTotal) * 100;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end relative group cursor-pointer"
                    style={{ height: '100%' }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Medium segment (top) */}
                    <div
                      className="w-full rounded-t-sm transition-opacity group-hover:opacity-80"
                      style={{
                        height: `${mediumPct}%`,
                        backgroundColor: '#f59e0b',
                        opacity: 0.85,
                      }}
                    />
                    {/* High segment (middle) */}
                    <div
                      className="w-full transition-opacity group-hover:opacity-80"
                      style={{
                        height: `${highPct}%`,
                        backgroundColor: '#ff6b35',
                      }}
                    />
                    {/* Critical segment (bottom) */}
                    <div
                      className="w-full rounded-b-sm transition-opacity group-hover:opacity-80"
                      style={{
                        height: `${criticalPct}%`,
                        backgroundColor: '#ef4444',
                      }}
                    />

                    {/* Hover tooltip */}
                    {hoveredBar === i && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#242424] border border-[#2a2a2a] rounded-lg px-3 py-2 z-20 whitespace-nowrap shadow-xl">
                        <div className="text-xs font-semibold text-[#f1f5f9] mb-1">{String(i).padStart(2, '0')}:00</div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                          <span className="text-[#94a3b8]">Critical:</span>
                          <span className="text-[#f1f5f9]">{data.critical}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                          <span className="text-[#94a3b8]">High:</span>
                          <span className="text-[#f1f5f9]">{data.high}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                          <span className="text-[#94a3b8]">Medium:</span>
                          <span className="text-[#f1f5f9]">{data.medium}</span>
                        </div>
                        <div className="border-t border-[#2a2a2a] mt-1 pt-1 text-[10px]">
                          <span className="text-[#94a3b8]">Total:</span>
                          <span className="text-[#f1f5f9] font-semibold ml-1">{total}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] text-[#64748b] font-mono h-6 items-center">
              <span>00</span>
              <span>02</span>
              <span>04</span>
              <span>06</span>
              <span>08</span>
              <span>10</span>
              <span>12</span>
              <span>14</span>
              <span>16</span>
              <span>18</span>
              <span>20</span>
              <span>22</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
              <span className="text-xs text-[#94a3b8]">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#ff6b35]" />
              <span className="text-xs text-[#94a3b8]">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
              <span className="text-xs text-[#94a3b8]">Medium</span>
            </div>
          </div>
        </div>

        {/* SECTION 3 - Attacker Geography */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT - World Map */}
          <div className="lg:w-[60%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Attacker Geography</h2>

              <div
                className="relative bg-[#0d0d0d] rounded-lg h-72 overflow-hidden"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 29px, #1a1a1a 29px, #1a1a1a 30px),
                    repeating-linear-gradient(90deg, transparent, transparent 29px, #1a1a1a 29px, #1a1a1a 30px)
                  `,
                }}
              >
                {geoMapDots.map((dot, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: dot.left,
                      top: dot.top,
                      width: `${dot.size}px`,
                      height: `${dot.size}px`,
                      backgroundColor: dot.color,
                      boxShadow: `0 0 ${dot.size}px ${dot.color}60`,
                    }}
                  />
                ))}

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-[#0d0d0d]/80 px-3 py-2 rounded-md border border-[#2a2a2a]">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444]"></div>
                    <span className="text-[10px] text-[#94a3b8]">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b35] shadow-[0_0_4px_#ff6b3560]"></div>
                    <span className="text-[10px] text-[#94a3b8]">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div>
                    <span className="text-[10px] text-[#94a3b8]">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Top 10 Countries */}
          <div className="lg:w-[40%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Top 10 Countries</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      <th className="text-left text-[#64748b] font-medium pb-2 w-8">#</th>
                      <th className="text-left text-[#64748b] font-medium pb-2 w-8"></th>
                      <th className="text-left text-[#64748b] font-medium pb-2">Country</th>
                      <th className="text-right text-[#64748b] font-medium pb-2">Attacks</th>
                      <th className="text-right text-[#64748b] font-medium pb-2">% Total</th>
                      <th className="text-center text-[#64748b] font-medium pb-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCountries.map((c) => (
                      <tr
                        key={c.rank}
                        className="border-b border-[#2a2a2a]/30 hover:bg-[#242424] transition-colors"
                      >
                        <td className="py-2 text-[#64748b] text-xs">{c.rank}</td>
                        <td className="py-2 text-base leading-none">{c.flag}</td>
                        <td className="py-2 text-[#f1f5f9] font-medium">{c.country}</td>
                        <td className="py-2 text-right text-[#ff6b35] font-mono">{c.attacks.toLocaleString()}</td>
                        <td className="py-2 text-right text-[#94a3b8]">{c.pct}%</td>
                        <td className="py-2 flex justify-center">
                          <TrendArrow trend={c.trend} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 - Attack Type Distribution */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT - Donut Chart */}
          <div className="lg:w-[60%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Attack Type Distribution</h2>

              <div className="flex items-center justify-center py-6">
                <div className="relative w-64 h-64">
                  {/* Donut using conic-gradient */}
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
                        #ef4444 0% 35%,
                        #ff6b35 35% 55%,
                        #f59e0b 55% 70%,
                        #00d4ff 70% 82%,
                        #22c55e 82% 92%,
                        #64748b 92% 100%
                      )`,
                    }}
                  >
                    {/* Center cutout */}
                    <div className="absolute inset-[25%] rounded-full bg-[#1a1a1a] flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-[#f1f5f9]">4,230</span>
                      <span className="text-xs text-[#64748b] uppercase tracking-wider">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Legend + Details */}
          <div className="lg:w-[40%]">
            <div className="admin-card p-6">
              <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Breakdown</h2>
              <div className="space-y-4">
                {attackTypes.map((type) => (
                  <div key={type.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: type.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#f1f5f9] font-medium truncate">{type.name}</span>
                        <span className="text-xs text-[#64748b] ml-2">{type.pct}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <div className="w-full bg-[#242424] rounded-full h-1.5 mr-3">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${type.pct}%`,
                              backgroundColor: type.color,
                            }}
                          />
                        </div>
                        <span className="text-xs text-[#94a3b8] font-mono flex-shrink-0">
                          {type.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5 - Top Attackers */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4">Top 15 Source IPs</h2>

          <div className="space-y-2">
            {topIPs.map((entry) => {
              const widthPct = (entry.count / maxIPCount) * 100;
              return (
                <div key={entry.ip} className="flex items-center gap-3 group">
                  <span className="font-mono text-sm text-[#00d4ff] w-36 flex-shrink-0 truncate group-hover:text-[#f1f5f9] transition-colors">
                    {entry.ip}
                  </span>
                  <div className="flex-1 bg-[#242424] rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#ff6b35] transition-all duration-300 group-hover:opacity-80"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#94a3b8] font-mono w-12 text-right flex-shrink-0">
                    {entry.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6 - Time-of-Day Heatmap */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#f1f5f9]">Attack Concentration by Time of Day</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748b]">Less</span>
              <div className="flex gap-0.5">
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: getHeatmapColor(v * heatmapMax) }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#64748b]">More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Day labels column + grid */}
              <div className="flex">
                {/* Y-axis day labels */}
                <div className="flex flex-col gap-[2px] mr-2 pt-0">
                  {dayLabels.map((day) => (
                    <div
                      key={day}
                      className="h-[18px] flex items-center text-xs text-[#94a3b8] font-medium w-8"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex-1">
                  {/* Hour labels */}
                  <div className="flex gap-[2px] mb-1">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 text-center text-[9px] text-[#64748b] font-mono"
                      >
                        {i % 3 === 0 ? i : ''}
                      </div>
                    ))}
                  </div>

                  {/* Grid rows */}
                  {heatmapData.map((row, dayIdx) => (
                    <div key={dayIdx} className="flex gap-[2px] mb-[2px]">
                      {row.map((value, hourIdx) => (
                        <div
                          key={hourIdx}
                          className="flex-1 min-w-[14px] h-[18px] rounded-[2px] transition-colors hover:ring-1 hover:ring-[#ff6b35] hover:ring-offset-0 cursor-crosshair relative group"
                          style={{ backgroundColor: getHeatmapColor(value) }}
                          title={`${dayLabels[dayIdx]} ${String(hourIdx).padStart(2, '0')}:00 - ${value} attacks`}
                        >
                          {/* Hover tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#242424] text-[#f1f5f9] text-[10px] px-2 py-1 rounded border border-[#2a2a2a] whitespace-nowrap z-20 shadow-xl">
                            {dayLabels[dayIdx]} {String(hourIdx).padStart(2, '0')}:00 - {value} attacks
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
