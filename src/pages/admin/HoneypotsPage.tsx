import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Search, RefreshCw, Eye, Play, Pause, Pencil, Trash2, Server, Copy } from 'lucide-react';
import { honeypots } from '../../lib/data';
import type { Honeypot } from '../../types';

type StatusTab = 'All' | 'Active' | 'Inactive' | 'Error';
type TypeFilter = 'All Types' | 'SSH' | 'HTTP' | 'MySQL' | 'FTP' | 'DNS' | 'Custom';

function StatusBadge({ status }: { status: Honeypot['status'] }) {
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
  }
}

export function HoneypotsPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: StatusTab[] = ['All', 'Active', 'Inactive', 'Error'];
  const typeOptions: TypeFilter[] = ['All Types', 'SSH', 'HTTP', 'MySQL', 'FTP', 'DNS', 'Custom'];

  const filteredHoneypots = honeypots.filter((hp) => {
    if (activeTab !== 'All' && hp.status !== activeTab) return false;
    if (typeFilter !== 'All Types' && hp.type !== typeFilter) return false;
    if (searchQuery && !hp.name.toLowerCase().includes(searchQuery.toLowerCase()) && !hp.ip.includes(searchQuery)) return false;
    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Honeypots</h1>
          <p className="text-sm text-[#94a3b8] mt-1">Manage and monitor your deception hosts</p>
        </div>

        {/* Subnavigation Tabs */}
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
              {tab === 'All' ? 'All Honeypots' : tab}
              <span className="ml-2 text-xs text-[#64748b]">
                ({tab === 'All' ? honeypots.length : honeypots.filter((h) => h.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Deploy Honeypot
          </button>

          <button className="admin-btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Configuration
          </button>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="admin-input py-2 px-3 text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#ff6b35]"
          >
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search honeypots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input w-full pl-9 pr-3 py-2 text-sm"
            />
          </div>

          <button className="admin-btn-ghost flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Honeypot Grid */}
        {filteredHoneypots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHoneypots.map((hp) => (
              <div key={hp.id} className="admin-card p-6 card-hover cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-[#f1f5f9] text-sm leading-tight">{hp.name}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <StatusBadge status={hp.status} />
                    <span className="bg-[#242424] text-[#94a3b8] rounded px-2 py-0.5 text-xs">
                      {hp.type}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-3 mb-4">
                  {/* IP:Port */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[#00d4ff]">
                      {hp.ip}:{hp.port}
                    </span>
                    <button
                      onClick={() => handleCopy(`${hp.ip}:${hp.port}`)}
                      className="text-[#64748b] hover:text-[#94a3b8] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Deployed */}
                  <div className="text-xs text-[#64748b]">Deployed: {hp.deployed}</div>

                  {/* Attacks Captured */}
                  <div>
                    <span className="text-xs text-[#64748b]">Attacks Captured: </span>
                    <span className="text-[#f1f5f9] font-semibold text-sm">
                      {hp.attacksCaptured.toLocaleString()}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {hp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#242424] text-[#94a3b8] rounded-full px-2 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer - Quick Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#2a2a2a]">
                  <Link
                    to={`/admin/honeypots/${hp.id}`}
                    className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  {hp.status === 'Active' ? (
                    <button
                      className="p-1.5 rounded-md text-[#64748b] hover:text-[#f59e0b] hover:bg-[#242424] transition-colors"
                      title="Pause"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      className="p-1.5 rounded-md text-[#64748b] hover:text-emerald-400 hover:bg-[#242424] transition-colors"
                      title="Start"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-[#242424] transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <Server className="w-16 h-16 text-[#2a2a2a] mb-4" />
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">No honeypots found</h3>
            <p className="text-sm text-[#64748b] mb-6">
              No honeypots match your current filters. Try adjusting your search or deploy a new one.
            </p>
            <button className="admin-btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Deploy Your First Honeypot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
