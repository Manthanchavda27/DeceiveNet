import { useState } from 'react';
import {
  Search,
  Download,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { auditLogs } from '../../lib/data';

type ActionType = 'All' | 'Create' | 'Read' | 'Update' | 'Delete' | 'Export' | 'Login' | 'Config Change';
type ResourceType = 'All' | 'Honeypot' | 'Service' | 'Alert Rule' | 'Webhook' | 'User' | 'Settings';
type DateRange = '24h' | '7d' | '30d';

const actionBadgeColors: Record<string, string> = {
  Create: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  Read: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
  Update: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  Delete: 'bg-red-500/10 text-red-400 border border-red-500/30',
  Export: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  Login: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
  'Config Change': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
};

const actors = [...new Set(auditLogs.map((l) => l.actor))];

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

function getActorColor(name: string): string {
  if (name === 'system') return 'bg-[#64748b]';
  if (name.includes('admin')) return 'bg-[#ff6b35]';
  if (name.includes('analyst')) return 'bg-[#00d4ff]';
  return 'bg-[#94a3b8]';
}

export function AuditLogsPage() {
  const [actorFilter, setActorFilter] = useState<string>('All');
  const [actionFilter, setActionFilter] = useState<ActionType>('All');
  const [resourceFilter, setResourceFilter] = useState<ResourceType>('All');
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (actorFilter !== 'All' && log.actor !== actorFilter) return false;
    if (actionFilter !== 'All' && log.action !== actionFilter) return false;
    if (resourceFilter !== 'All' && log.resourceType !== resourceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.resourceType.toLowerCase().includes(q) ||
        log.resourceName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Audit Logs</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Track all administrative actions within DeceiveNet
            </p>
          </div>
          <button className="admin-btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* Filter Bar */}
        <div className="admin-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Actor Filter */}
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="admin-input py-2 px-3 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
            >
              <option value="All">All Users</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>

            {/* Action Type Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as ActionType)}
              className="admin-input py-2 px-3 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
            >
              {(['All', 'Create', 'Read', 'Update', 'Delete', 'Export', 'Login', 'Config Change'] as ActionType[]).map(
                (action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                )
              )}
            </select>

            {/* Resource Type Filter */}
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value as ResourceType)}
              className="admin-input py-2 px-3 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
            >
              {(['All', 'Honeypot', 'Service', 'Alert Rule', 'Webhook', 'User', 'Settings'] as ResourceType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>

            {/* Date Range Buttons */}
            <div className="flex items-center gap-1 bg-[#242424] rounded-lg p-0.5 border border-[#2a2a2a]">
              {(['24h', '7d', '30d'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    dateRange === range
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input w-full pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#242424] text-xs uppercase tracking-wider text-[#64748b]">
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">Actor</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Resource Type</th>
                  <th className="px-4 py-3 text-left">Resource Name</th>
                  <th className="px-4 py-3 text-left">Details</th>
                  <th className="px-4 py-3 text-left">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <>
                    <tr
                      key={log.id}
                      onClick={() => toggleRow(log.id)}
                      className="hover:bg-[#242424] transition-colors border-b border-[#2a2a2a]/50 cursor-pointer"
                    >
                      {/* Expand Chevron */}
                      <td className="px-4 py-3">
                        {expandedRow === log.id ? (
                          <ChevronDown className="w-4 h-4 text-[#64748b]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#64748b]" />
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#f1f5f9] font-mono">{log.timestamp}</span>
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getActorColor(
                              log.actor
                            )}`}
                          >
                            {getInitials(log.actor)}
                          </span>
                          <span className="text-sm text-[#f1f5f9]">{log.actor}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            actionBadgeColors[log.action] || 'bg-[#242424] text-[#94a3b8]'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Resource Type */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#94a3b8]">{log.resourceType}</span>
                      </td>

                      {/* Resource Name */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#f1f5f9]">{log.resourceName}</span>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#64748b] truncate block max-w-[200px]">
                          {log.details}
                        </span>
                      </td>

                      {/* IP Address */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#64748b]">{log.ipAddress}</span>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {expandedRow === log.id && (
                      <tr key={`${log.id}-expanded`} className="bg-[#242424]/50">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                              Full Details
                            </h4>
                            <pre className="text-xs text-[#00d4ff] bg-[#0d0d0d] rounded-lg p-4 overflow-x-auto border border-[#2a2a2a]">
                              {JSON.stringify(
                                {
                                  id: log.id,
                                  timestamp: log.timestamp,
                                  actor: log.actor,
                                  action: log.action,
                                  resourceType: log.resourceType,
                                  resourceName: log.resourceName,
                                  details: log.details,
                                  ipAddress: log.ipAddress,
                                  diff: {
                                    before: { status: 'previous_value' },
                                    after: { status: 'new_value' },
                                  },
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
