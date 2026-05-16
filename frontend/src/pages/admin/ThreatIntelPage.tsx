import { useState } from 'react';
import {
  Plus,
  Upload,
  Search,
  Copy,
  Eye,
  Download,
  Trash2,
  Globe,
  Shield,
  MapPin,
  Server,
  Link2,
  GitMerge,
  Pen,
  ArrowUpRight,
} from 'lucide-react';
import { threatIndicators } from '../../lib/data';

type Tab = 'Indicators' | 'Threat Actors' | 'Enrichment';

const typeBadgeClass: Record<string, string> = {
  IP: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  Domain: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  SHA256: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
  Email: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  URL: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
  MD5: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
};

interface ThreatActor {
  id: string;
  name: string;
  attackCount: number;
  firstSeen: string;
  lastSeen: string;
  primaryAttackTypes: string[];
  topIPs: string[];
  targetPreferences: string[];
  confidence: 'Low' | 'Medium' | 'High';
}

const threatActors: ThreatActor[] = [
  {
    id: 'TA-2024-0042',
    name: 'TA-2024-0042',
    attackCount: 847,
    firstSeen: '2w ago',
    lastSeen: '2m ago',
    primaryAttackTypes: ['SSH Brute Force', 'RCE Attempt'],
    topIPs: ['45.33.32.156', '91.240.118.172', '185.220.101.34', '103.235.46.39', '198.51.100.23'],
    targetPreferences: ['SSH Services', 'Web Applications'],
    confidence: 'High',
  },
  {
    id: 'TA-2024-0117',
    name: 'TA-2024-0117',
    attackCount: 312,
    firstSeen: '1w ago',
    lastSeen: '1d ago',
    primaryAttackTypes: ['SQL Injection', 'HTTP Path Traversal'],
    topIPs: ['185.220.101.34', '203.0.113.50'],
    targetPreferences: ['HTTP Services', 'Databases'],
    confidence: 'Medium',
  },
  {
    id: 'TA-2024-0289',
    name: 'TA-2024-0289',
    attackCount: 89,
    firstSeen: '5d ago',
    lastSeen: '5d ago',
    primaryAttackTypes: ['FTP Credential Stuffing', 'DNS Zone Transfer'],
    topIPs: ['45.33.32.156', '198.51.100.23'],
    targetPreferences: ['FTP Services', 'DNS Infrastructure'],
    confidence: 'Low',
  },
];

const confidenceBadgeClass: Record<string, string> = {
  High: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-red-500/10 text-red-400 border border-red-500/30',
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value <= 33 ? 'bg-red-500' : value <= 66 ? 'bg-yellow-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#242424] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm text-[#f1f5f9] font-mono">{value}</span>
    </div>
  );
}

function ReputationBar({ score }: { score: number }) {
  const color = score <= 33 ? 'bg-red-500' : score <= 66 ? 'bg-yellow-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[#242424] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm text-[#f1f5f9] font-semibold font-mono">{score}/100</span>
    </div>
  );
}

export function ThreatIntelPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Indicators');
  const [indicatorSearch, setIndicatorSearch] = useState('');

  const tabs: Tab[] = ['Indicators', 'Threat Actors', 'Enrichment'];

  const [enrichmentQuery, setEnrichmentQuery] = useState('');
  const [enrichmentSearched, setEnrichmentSearched] = useState(false);

  const filteredIndicators = threatIndicators.filter((ind) => {
    if (!indicatorSearch) return true;
    const q = indicatorSearch.toLowerCase();
    return (
      ind.value.toLowerCase().includes(q) ||
      ind.type.toLowerCase().includes(q) ||
      ind.tags.some((t) => t.toLowerCase().includes(q)) ||
      ind.source.toLowerCase().includes(q)
    );
  });

  const handleEnrichmentSearch = () => {
    if (enrichmentQuery.trim()) {
      setEnrichmentSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Threat Intelligence</h1>
          <p className="text-sm text-[#94a3b8] mt-1">
            IOCs, threat actor profiles, and enrichment data
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

        {/* TAB 1: Indicators */}
        {activeTab === 'Indicators' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="admin-btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Indicator
              </button>
              <button className="admin-btn-secondary flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import STIX/TAXII
              </button>
              <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Search indicators..."
                  value={indicatorSearch}
                  onChange={(e) => setIndicatorSearch(e.target.value)}
                  className="admin-input w-full pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Indicators Table */}
            <div className="admin-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#242424] text-xs uppercase tracking-wider text-[#64748b]">
                      <th className="px-4 py-3 text-left">Value</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Confidence</th>
                      <th className="px-4 py-3 text-left">First Seen</th>
                      <th className="px-4 py-3 text-left">Last Seen</th>
                      <th className="px-4 py-3 text-left">Tags</th>
                      <th className="px-4 py-3 text-left">Source</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIndicators.map((ind) => (
                      <tr
                        key={ind.id}
                        className="hover:bg-[#242424] transition-colors border-b border-[#2a2a2a]/50"
                      >
                        {/* Value */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-[#00d4ff]">{ind.value}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(ind.value)}
                              className="text-[#64748b] hover:text-[#94a3b8] transition-colors"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeClass[ind.type] || 'bg-slate-500/10 text-slate-400 border border-slate-500/30'}`}
                          >
                            {ind.type}
                          </span>
                        </td>

                        {/* Confidence */}
                        <td className="px-4 py-3">
                          <ConfidenceBar value={ind.confidence} />
                        </td>

                        {/* First Seen */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#94a3b8]">{ind.firstSeen}</span>
                        </td>

                        {/* Last Seen */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#94a3b8]">{ind.lastSeen}</span>
                        </td>

                        {/* Tags */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {ind.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#242424] text-[#94a3b8] rounded-full px-2 py-0.5 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#94a3b8]">{ind.source}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredIndicators.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center">
                          <p className="text-sm text-[#64748b]">No indicators match your search.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Threat Actors */}
        {activeTab === 'Threat Actors' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {threatActors.map((actor) => (
                <div key={actor.id} className="admin-card p-6">
                  <div className="flex flex-col gap-4">
                    {/* Actor Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#242424] rounded-lg">
                          <Shield className="w-5 h-5 text-[#ff6b35]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#f1f5f9]">{actor.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#64748b]">
                            <span>{actor.attackCount} attacks</span>
                            <span>First seen {actor.firstSeen}</span>
                            <span>Last seen {actor.lastSeen}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceBadgeClass[actor.confidence]}`}
                      >
                        {actor.confidence}
                      </span>
                    </div>

                    {/* Primary Attack Types */}
                    <div>
                      <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                        Primary Attack Types
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {actor.primaryAttackTypes.map((type) => (
                          <span
                            key={type}
                            className="bg-[#242424] text-[#00d4ff] rounded-full px-2 py-0.5 text-xs"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top IPs */}
                    <div>
                      <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                        Top IPs Used
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {actor.topIPs.map((ip) => (
                          <span
                            key={ip}
                            className="font-mono text-xs text-[#94a3b8] bg-[#242424] rounded px-2 py-0.5"
                          >
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Target Preferences */}
                    <div>
                      <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                        Target Preferences
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {actor.targetPreferences.map((target) => (
                          <span
                            key={target}
                            className="bg-[#242424] text-[#ff6b35] rounded-full px-2 py-0.5 text-xs"
                          >
                            {target}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 pt-2 border-t border-[#2a2a2a]/50">
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Merge">
                        <GitMerge className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Rename">
                        <Pen className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors" title="Export">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Enrichment */}
        {activeTab === 'Enrichment' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Enter an IP, domain, hash, or URL"
                value={enrichmentQuery}
                onChange={(e) => {
                  setEnrichmentQuery(e.target.value);
                  if (enrichmentSearched) setEnrichmentSearched(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEnrichmentSearch();
                }}
                className="admin-input w-full pl-9 pr-4 py-3 text-sm"
              />
              <button
                onClick={handleEnrichmentSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 admin-btn-primary px-3 py-1.5 text-sm"
              >
                Search
              </button>
            </div>

            {/* Results Panel */}
            {!enrichmentSearched ? (
              <div className="admin-card p-12 text-center">
                <Globe className="w-10 h-10 text-[#2a2a2a] mx-auto mb-4" />
                <p className="text-[#64748b] text-sm">Search for threat intelligence data</p>
                <p className="text-[#2a2a2a] text-xs mt-1">
                  Enter an IP address, domain, file hash, or URL to enrich
                </p>
              </div>
            ) : (
              <div className="admin-card p-6 space-y-6">
                {/* Query Value */}
                <div className="flex items-center gap-2 pb-4 border-b border-[#2a2a2a]">
                  <span className="text-sm text-[#64748b]">Results for:</span>
                  <span className="font-mono text-sm text-[#00d4ff]">{enrichmentQuery}</span>
                </div>

                {/* Reputation Score */}
                <div>
                  <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                    Reputation Score
                  </span>
                  <div className="mt-2">
                    <ReputationBar score={23} />
                  </div>
                </div>

                {/* Geolocation */}
                <div>
                  <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                    Geolocation
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ff6b35]" />
                    <span className="text-sm text-[#f1f5f9]">Moscow, Russia (RU)</span>
                    <span className="text-xs text-[#64748b] ml-2">55.7558 N, 37.6173 E</span>
                  </div>
                </div>

                {/* ASN Info */}
                <div>
                  <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                    ASN Info
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#00d4ff]" />
                    <span className="text-sm text-[#f1f5f9]">AS20485 - JSC Transtelecom</span>
                  </div>
                  <div className="mt-1 ml-6 text-xs text-[#64748b]">
                    ISP: Transtelecom | NetRange: 45.33.32.0 - 45.33.32.255
                  </div>
                </div>

                {/* Associated Domains */}
                <div>
                  <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
                    Associated Domains
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {['malware-c2.evil.com', 'cdn.payload.net', 'auth.steal-creds.ru'].map(
                      (domain) => (
                        <div key={domain} className="flex items-center gap-2">
                          <Link2 className="w-3.5 h-3.5 text-[#64748b]" />
                          <span className="font-mono text-xs text-[#94a3b8]">{domain}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(domain)}
                            className="text-[#2a2a2a] hover:text-[#64748b] transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Add as Indicator button */}
                <div className="pt-4 border-t border-[#2a2a2a]">
                  <button className="admin-btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add as Indicator
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
