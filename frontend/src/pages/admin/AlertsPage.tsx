import { useState } from 'react';
import {
  Plus,
  Pencil,
  Play,
  Copy,
  Trash2,
  MessageSquare,
  Mail,
  Smartphone,
  Webhook,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { alertRules } from '../../lib/data';
import type { AlertRule } from '../../types';

type Tab = 'Alert Rules' | 'Alert History';

const severityBadgeClass: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-400 border border-red-500/30',
  High: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
};

interface AlertHistoryEntry {
  id: string;
  timestamp: string;
  ruleName: string;
  severity: AlertRule['severity'];
  eventCount: number;
  status: 'Acknowledged' | 'Unacknowledged';
  acknowledgedBy: string;
}

const alertHistory: AlertHistoryEntry[] = [
  { id: 'AH-001', timestamp: '2024-12-15 14:32:01', ruleName: 'Critical SSH Attack', severity: 'Critical', eventCount: 12, status: 'Acknowledged', acknowledgedBy: 'admin@deceivenet.io' },
  { id: 'AH-002', timestamp: '2024-12-15 14:28:45', ruleName: 'SQL Injection Detected', severity: 'High', eventCount: 3, status: 'Unacknowledged', acknowledgedBy: '' },
  { id: 'AH-003', timestamp: '2024-12-15 14:15:22', ruleName: 'Repeated Attacker IP', severity: 'High', eventCount: 7, status: 'Acknowledged', acknowledgedBy: 'analyst@deceivenet.io' },
  { id: 'AH-004', timestamp: '2024-12-15 13:55:10', ruleName: 'Critical SSH Attack', severity: 'Critical', eventCount: 24, status: 'Unacknowledged', acknowledgedBy: '' },
  { id: 'AH-005', timestamp: '2024-12-15 13:42:33', ruleName: 'Data Exfiltration Alert', severity: 'Critical', eventCount: 1, status: 'Acknowledged', acknowledgedBy: 'admin@deceivenet.io' },
];

const channelIcons: Record<string, React.ReactNode> = {
  Slack: <MessageSquare className="w-4 h-4" />,
  Email: <Mail className="w-4 h-4" />,
  Webhook: <Webhook className="w-4 h-4" />,
  SMS: <Smartphone className="w-4 h-4" />,
};

export function AlertsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Alert Rules');
  const [ruleStates, setRuleStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(alertRules.map((r) => [r.id, r.enabled]))
  );
  const [historyStatuses, setHistoryStatuses] = useState<Record<string, AlertHistoryEntry['status']>>(
    () => Object.fromEntries(alertHistory.map((h) => [h.id, h.status]))
  );
  const [allEnabled, setAllEnabled] = useState(true);

  const handleToggleRule = (id: string) => {
    setRuleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    const newState = !allEnabled;
    setAllEnabled(newState);
    setRuleStates((prev) => {
      const next = { ...prev };
      alertRules.forEach((r) => {
        next[r.id] = newState;
      });
      return next;
    });
  };

  const handleAcknowledgeAll = () => {
    setHistoryStatuses((prev) => {
      const next = { ...prev };
      alertHistory.forEach((h) => {
        if (next[h.id] === 'Unacknowledged') {
          next[h.id] = 'Acknowledged';
        }
      });
      return next;
    });
  };

  const unreadCount = Object.values(historyStatuses).filter((s) => s === 'Unacknowledged').length;

  const tabs: Tab[] = ['Alert Rules', 'Alert History'];

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Alerts</h1>
          <p className="text-sm text-[#94a3b8] mt-1">
            Configured alert rules and notification history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#2a2a2a]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-[#ff6b35] border-[#ff6b35]'
                  : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: Alert Rules */}
        {activeTab === 'Alert Rules' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="admin-btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Alert Rule
              </button>
              <button
                onClick={handleToggleAll}
                className="admin-btn-secondary flex items-center gap-2"
              >
                {allEnabled ? 'Disable All' : 'Enable All'}
              </button>
            </div>

            {/* Rules List */}
            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div key={rule.id} className="admin-card p-6">
                  <div className="flex flex-col gap-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-[#f1f5f9]">
                          {rule.name}
                        </h3>
                        <p className="text-sm text-[#94a3b8] mt-1">
                          {rule.description}
                        </p>
                      </div>

                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
                          ruleStates[rule.id] ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                            ruleStates[rule.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Condition summary */}
                    <div className="font-mono text-xs text-[#64748b] bg-[#242424] rounded p-2">
                      {rule.condition}
                    </div>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Severity badge */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadgeClass[rule.severity]}`}
                      >
                        {rule.severity}
                      </span>

                      {/* Notification channels */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                          Channels:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {rule.channels.map((ch) => (
                            <span
                              key={ch}
                              className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                              title={ch}
                            >
                              {channelIcons[ch] || <Mail className="w-4 h-4" />}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Last triggered */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-xs text-[#64748b]">
                          {rule.lastTriggered === 'Never'
                            ? 'Never triggered'
                            : `Last triggered ${rule.lastTriggered}`}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 pt-2 border-t border-[#2a2a2a]/50">
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Test">
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                        title="Copy"
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(rule, null, 2))}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Alert History */}
        {activeTab === 'Alert History' && (
          <div className="space-y-4">
            {/* Acknowledge All button */}
            {unreadCount > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAcknowledgeAll}
                  className="admin-btn-secondary flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Acknowledge All
                </button>
                <span className="text-xs text-[#64748b]">
                  {unreadCount} unacknowledged alert{unreadCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* History Table */}
            <div className="admin-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#242424] text-xs uppercase tracking-wider text-[#64748b]">
                      <th className="px-4 py-3 text-left">Timestamp</th>
                      <th className="px-4 py-3 text-left">Rule Name</th>
                      <th className="px-4 py-3 text-left">Severity</th>
                      <th className="px-4 py-3 text-left">Event Count</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Acknowledged By</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertHistory.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-[#242424] transition-colors border-b border-[#2a2a2a]/50"
                      >
                        {/* Timestamp */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#f1f5f9] font-mono">{entry.timestamp}</span>
                        </td>

                        {/* Rule Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#64748b]" />
                            <span className="text-sm text-[#f1f5f9]">{entry.ruleName}</span>
                          </div>
                        </td>

                        {/* Severity */}
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadgeClass[entry.severity]}`}
                          >
                            {entry.severity}
                          </span>
                        </td>

                        {/* Event Count */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#f1f5f9] font-mono">{entry.eventCount}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {historyStatuses[entry.id] === 'Acknowledged' ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                              Acknowledged
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                              Unacknowledged
                            </span>
                          )}
                        </td>

                        {/* Acknowledged By */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#94a3b8]">
                            {entry.acknowledgedBy || '---'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setHistoryStatuses((prev) => ({
                                  ...prev,
                                  [entry.id]: 'Acknowledged',
                                }));
                              }}
                              disabled={historyStatuses[entry.id] === 'Acknowledged'}
                              className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Acknowledge"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="View Details">
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
