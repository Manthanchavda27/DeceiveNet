import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ShieldPlus,
  Eye,
  Download,
  MoreHorizontal,
  Copy,
  Search,
  Terminal,
  Globe,
  Database,
  Code,
  Wifi,
  FolderOpen,
  FileCode,
  KeyRound,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { attackEvents, honeypots } from '../../lib/data';
import type { AttackEvent } from '../../types';

type TimeRange = '15m' | '1h' | '24h' | '7d' | '30d' | 'Custom';
type AttackTypeOption =
  | 'All Types'
  | 'SSH Brute Force'
  | 'HTTP SQLi Probe'
  | 'MySQL Auth Attempt'
  | 'RCE Attempt'
  | 'DNS Zone Transfer'
  | 'FTP Credential Stuffing'
  | 'HTTP Path Traversal'
  | 'SSH Key Brute Force';

const timeRanges: TimeRange[] = ['15m', '1h', '24h', '7d', '30d', 'Custom'];
const severityLevels: AttackEvent['severity'][] = ['Critical', 'High', 'Medium', 'Low', 'Info'];
const attackTypeOptions: AttackTypeOption[] = [
  'All Types',
  'SSH Brute Force',
  'HTTP SQLi Probe',
  'MySQL Auth Attempt',
  'RCE Attempt',
  'DNS Zone Transfer',
  'FTP Credential Stuffing',
  'HTTP Path Traversal',
  'SSH Key Brute Force',
];

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
  Info: 'severity-info',
};

const attackTypeIcons: Record<string, React.ReactNode> = {
  'SSH Brute Force': <Terminal className="w-4 h-4" />,
  'HTTP SQLi Probe': <Globe className="w-4 h-4" />,
  'MySQL Auth Attempt': <Database className="w-4 h-4" />,
  'RCE Attempt': <Code className="w-4 h-4" />,
  'DNS Zone Transfer': <Wifi className="w-4 h-4" />,
  'FTP Credential Stuffing': <FolderOpen className="w-4 h-4" />,
  'HTTP Path Traversal': <FileCode className="w-4 h-4" />,
  'SSH Key Brute Force': <KeyRound className="w-4 h-4" />,
};

function StatusPill({ status }: { status: AttackEvent['status'] }) {
  const classes: Record<AttackEvent['status'], string> = {
    New: 'bg-cyan-500/10 text-cyan-400',
    'In Progress': 'bg-yellow-500/10 text-yellow-400',
    Reviewed: 'bg-slate-500/10 text-slate-400',
    'False Positive': 'bg-slate-500/10 text-slate-500',
    Escalated: 'bg-red-500/10 text-red-400',
  };

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
      {status}
    </span>
  );
}

export function AttackEventsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [selectedSeverities, setSelectedSeverities] = useState<Set<AttackEvent['severity']>>(
    new Set(severityLevels)
  );
  const [attackType, setAttackType] = useState<AttackTypeOption>('All Types');
  const [honeypotFilter, setHoneypotFilter] = useState('All Honeypots');
  const [sourceIPSearch, setSourceIPSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(25);

  const toggleSeverity = (sev: AttackEvent['severity']) => {
    const next = new Set(selectedSeverities);
    if (next.has(sev)) {
      next.delete(sev);
    } else {
      next.add(sev);
    }
    setSelectedSeverities(next);
  };

  const clearFilters = () => {
    setTimeRange('24h');
    setSelectedSeverities(new Set(severityLevels));
    setAttackType('All Types');
    setHoneypotFilter('All Honeypots');
    setSourceIPSearch('');
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllRows = (ids: string[]) => {
    if (ids.every((id) => selectedRows.has(id))) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(ids));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredEvents = attackEvents.filter((event) => {
    if (!selectedSeverities.has(event.severity)) return false;
    if (attackType !== 'All Types' && event.attackType !== attackType) return false;
    if (honeypotFilter !== 'All Honeypots' && event.targetHoneypot !== honeypotFilter) return false;
    if (sourceIPSearch && !event.sourceIP.toLowerCase().includes(sourceIPSearch.toLowerCase())) return false;
    return true;
  });

  const honeypotNames = honeypots.map((hp) => hp.name);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Attack Events</h1>
          <p className="text-sm text-[#94a3b8] mt-1">
            All captured attacker activity across your network
          </p>
        </div>

        {/* Quick Filters Bar */}
        <div className="admin-card p-4 space-y-4">
          {/* Time Range */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                    timeRange === range
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Checkboxes */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">Severity:</span>
            {severityLevels.map((sev) => (
              <label key={sev} className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSeverities.has(sev)}
                  onChange={() => toggleSeverity(sev)}
                  className="rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 focus:ring-offset-[#1a1a1a]"
                />
                <span
                  className={`text-xs font-medium transition-colors ${
                    selectedSeverities.has(sev) ? 'text-[#f1f5f9]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                  }`}
                >
                  {sev}
                </span>
              </label>
            ))}
          </div>

          {/* Dropdowns and Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Attack Type Dropdown */}
            <select
              value={attackType}
              onChange={(e) => setAttackType(e.target.value as AttackTypeOption)}
              className="admin-input py-2 px-3 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
            >
              {attackTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Honeypot Filter Dropdown */}
            <select
              value={honeypotFilter}
              onChange={(e) => setHoneypotFilter(e.target.value)}
              className="admin-input py-2 px-3 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
            >
              <option value="All Honeypots">All Honeypots</option>
              {honeypotNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Source IP Search Input */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search source IP..."
                value={sourceIPSearch}
                onChange={(e) => setSourceIPSearch(e.target.value)}
                className="admin-input w-full pl-9 pr-3 py-2 text-sm"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-[#00d4ff] text-sm hover:underline ml-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
            <ChevronDown className="w-3 h-3" />
          </button>

          <button className="admin-btn-secondary flex items-center gap-2">
            Bulk Actions
            <ChevronDown className="w-3 h-3" />
          </button>

          <button className="admin-btn-secondary flex items-center gap-2">
            <ShieldPlus className="w-4 h-4" />
            Create Alert Rule
          </button>
        </div>

        {/* Events Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#242424] text-xs uppercase tracking-wider text-[#64748b]">
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={filteredEvents.length > 0 && filteredEvents.every((e) => selectedRows.has(e.id))}
                      onChange={() => toggleAllRows(filteredEvents.map((e) => e.id))}
                      className="rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 focus:ring-offset-[#1a1a1a]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Attack Type</th>
                  <th className="px-4 py-3 text-left">Source IP</th>
                  <th className="px-4 py-3 text-left">Target Honeypot</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <Fragment key={event.id}>
                    <tr
                      onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                      className="hover:bg-[#242424] transition-colors cursor-pointer border-b border-[#2a2a2a]/50"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(event.id)}
                          onChange={() => toggleRow(event.id)}
                          className="rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 focus:ring-offset-[#1a1a1a]"
                        />
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#f1f5f9]">{event.timestamp}</span>
                      </td>

                      {/* Severity */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium border ${severityBadgeClass[event.severity]}`}
                        >
                          {event.severity}
                        </span>
                      </td>

                      {/* Attack Type */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#94a3b8]">
                            {attackTypeIcons[event.attackType] || <Terminal className="w-4 h-4" />}
                          </span>
                          <span className="text-sm text-[#f1f5f9]">{event.attackType}</span>
                        </div>
                      </td>

                      {/* Source IP */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-[#00d4ff]">{event.sourceIP}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(event.sourceIP);
                            }}
                            className="text-[#64748b] hover:text-[#94a3b8] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm">
                            {countryFlags[event.countryCode || ''] || ''}
                          </span>
                        </div>
                      </td>

                      {/* Target Honeypot */}
                      <td className="px-4 py-3">
                        <Link
                          to="/admin/honeypots"
                          className="text-sm text-[#94a3b8] hover:text-[#00d4ff] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {event.targetHoneypot}
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusPill status={event.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#94a3b8] hover:bg-[#242424] transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row Content */}
                    {expandedRow === event.id && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <div className="bg-[#1a1a1a] p-4 border-t border-[#2a2a2a]">
                            {/* Full Payload */}
                            <div className="mb-3">
                              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                                Payload
                              </span>
                              <div className="mt-1.5 font-mono text-sm text-[#f1f5f9] bg-[#0d0d0d] rounded p-3">
                                {event.payload}
                              </div>
                            </div>

                            {/* Tags Row */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium mr-1">
                                Tags:
                              </span>
                              <span className="bg-[#242424] text-[#94a3b8] rounded-full px-2 py-0.5 text-xs">
                                {event.attackType.toLowerCase().replace(/\s+/g, '-')}
                              </span>
                              <span className="bg-[#242424] text-[#94a3b8] rounded-full px-2 py-0.5 text-xs">
                                {event.severity.toLowerCase()}
                              </span>
                              <span className="bg-[#242424] text-[#94a3b8] rounded-full px-2 py-0.5 text-xs">
                                {event.targetService.toLowerCase()}
                              </span>
                              <span className="bg-[#242424] text-[#94a3b8] rounded-full px-2 py-0.5 text-xs">
                                {event.country?.toLowerCase() || 'unknown'}
                              </span>
                            </div>

                            {/* View Full Details Link */}
                            <Link
                              to={`/admin/attack-events/${event.id}`}
                              className="text-[#00d4ff] text-sm hover:underline"
                            >
                              View Full Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}

                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <p className="text-sm text-[#64748b]">No events match your current filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
            <span className="text-sm text-[#94a3b8]">
              Showing 1-{filteredEvents.length} of {filteredEvents.length}
            </span>

            <div className="flex items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b]">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="admin-input py-1 px-2 text-xs bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="p-1.5 rounded-md text-[#64748b] hover:bg-[#242424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled
                  className="p-1.5 rounded-md text-[#64748b] hover:bg-[#242424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
