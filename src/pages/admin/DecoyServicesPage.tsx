import { useState } from 'react';
import {
  Plus,
  Pencil,
  Eye,
  ToggleLeft,
  ToggleRight,
  X,
  Server,
  Network,
  Shield,
} from 'lucide-react';

const decoyServices = [
  { id: '1', name: 'SSH-2222', type: 'SSH', port: 2222, enabled: true, honeypot: 'SSH-Honeypot-01', sessions: 3, lastInteraction: '5m ago', banner: 'OpenSSH_8.9p1' },
  { id: '2', name: 'HTTP-8080', type: 'HTTP', port: 8080, enabled: true, honeypot: 'HTTP-Honeypot-02', sessions: 7, lastInteraction: '1m ago', banner: 'Apache/2.4.54' },
  { id: '3', name: 'MySQL-3307', type: 'MySQL', port: 3307, enabled: true, honeypot: 'MySQL-Honeypot-03', sessions: 1, lastInteraction: '30m ago', banner: 'MySQL 8.0.32' },
  { id: '4', name: 'FTP-2121', type: 'FTP', port: 2121, enabled: false, honeypot: 'Unassigned', sessions: 0, lastInteraction: 'Never', banner: 'vsFTPd 3.0.5' },
  { id: '5', name: 'DNS-5353', type: 'DNS', port: 5353, enabled: true, honeypot: 'DNS-Honeypot-05', sessions: 2, lastInteraction: '15m ago', banner: 'BIND 9.18.12' },
  { id: '6', name: 'SMB-4450', type: 'SMB', port: 4450, enabled: false, honeypot: 'Unassigned', sessions: 0, lastInteraction: 'Never', banner: 'Samba 4.17.5' },
  { id: '7', name: 'RDP-3390', type: 'RDP', port: 3390, enabled: true, honeypot: 'SSH-Honeypot-01', sessions: 1, lastInteraction: '2h ago', banner: 'Microsoft RDP 10.0' },
  { id: '8', name: 'Custom-TCP-9999', type: 'Custom TCP', port: 9999, enabled: true, honeypot: 'HTTP-Honeypot-02', sessions: 0, lastInteraction: '1d ago', banner: 'Custom Service v1.0' },
];

const SERVICE_TYPES = ['SSH', 'HTTP', 'MySQL', 'FTP', 'DNS', 'SMB', 'RDP', 'Custom TCP', 'Custom UDP'];

function getTypeIcon(type: string) {
  switch (type) {
    case 'SSH':
      return <Shield className="w-4 h-4" />;
    case 'HTTP':
      return <Network className="w-4 h-4" />;
    default:
      return <Server className="w-4 h-4" />;
  }
}

export function DecoyServicesPage() {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(
    Object.fromEntries(decoyServices.map((s) => [s.id, s.enabled]))
  );
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    type: 'SSH',
    port: '',
    name: '',
    banner: '',
    username: '',
    password: '',
    responseDelay: '0',
    packetCapture: true,
    maxSessions: '10',
  });

  const toggleEnabled = (id: string) => {
    setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = () => {
    setShowModal(false);
    setNewService({
      type: 'SSH',
      port: '',
      name: '',
      banner: '',
      username: '',
      password: '',
      responseDelay: '0',
      packetCapture: true,
      maxSessions: '10',
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
              Decoy Services
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              Simulated services to lure and deceive attackers
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-colors"
            style={{ backgroundColor: '#ff6b35' }}
          >
            <Plus className="w-4 h-4" />
            Add Decoy Service
          </button>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decoyServices.map((service) => {
            const isEnabled = enabledMap[service.id];
            const isUnassigned = service.honeypot === 'Unassigned';

            return (
              <div
                key={service.id}
                className="admin-card p-6 rounded-lg border transition-colors"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: isEnabled ? '#2a2a2a' : '#1f1f1f',
                  opacity: isEnabled ? 1 : 0.7,
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#ff6b35' }}>{getTypeIcon(service.type)}</span>
                    <h3 className="font-semibold" style={{ color: '#f1f5f9' }}>
                      {service.name}
                    </h3>
                    <span
                      className="rounded px-2 py-0.5 text-xs"
                      style={{ backgroundColor: '#242424', color: '#94a3b8' }}
                    >
                      {service.type}
                    </span>
                  </div>
                  <button onClick={() => toggleEnabled(service.id)} className="flex-shrink-0">
                    {isEnabled ? (
                      <ToggleRight className="w-6 h-6" style={{ color: '#ff6b35' }} />
                    ) : (
                      <ToggleLeft className="w-6 h-6" style={{ color: '#64748b' }} />
                    )}
                  </button>
                </div>

                {/* Card Body */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#64748b' }}>
                      Port:
                    </span>
                    <span className="font-mono text-sm" style={{ color: '#00d4ff' }}>
                      {service.port}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#64748b' }}>
                      Honeypot:
                    </span>
                    {isUnassigned ? (
                      <span className="text-sm italic" style={{ color: '#64748b' }}>
                        Unassigned
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: '#94a3b8' }}>
                        {service.honeypot}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#64748b' }}>
                      Sessions:
                    </span>
                    <span className="text-sm" style={{ color: '#f1f5f9' }}>
                      {service.sessions}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#64748b' }}>
                      Last Interaction:
                    </span>
                    <span className="text-sm" style={{ color: '#94a3b8' }}>
                      {service.lastInteraction}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="font-mono text-xs" style={{ color: '#64748b' }}>
                      {service.banner}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
                  <button
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors hover:bg-[#2a2a2a]"
                    style={{ color: '#94a3b8' }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleEnabled(service.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors hover:bg-[#2a2a2a]"
                    style={{ color: isEnabled ? '#ff6b35' : '#64748b' }}
                  >
                    {isEnabled ? (
                      <>
                        <ToggleRight className="w-3.5 h-3.5" />
                        Disable
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-3.5 h-3.5" />
                        Enable
                      </>
                    )}
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors hover:bg-[#2a2a2a]"
                    style={{ color: '#00d4ff' }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Sessions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Decoy Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setShowModal(false)}
          />
          <div
            className="relative w-full max-w-lg rounded-lg border p-6 overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: '#f1f5f9' }}>
                Add Decoy Service
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded transition-colors hover:bg-[#2a2a2a]"
                style={{ color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Service Type
                </label>
                <select
                  value={newService.type}
                  onChange={(e) => setNewService((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderColor: '#2a2a2a',
                    color: '#f1f5f9',
                  }}
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Port Number */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Port Number
                </label>
                <input
                  type="number"
                  value={newService.port}
                  onChange={(e) => setNewService((prev) => ({ ...prev, port: e.target.value }))}
                  placeholder="e.g. 2222"
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderColor: '#2a2a2a',
                    color: '#f1f5f9',
                  }}
                />
              </div>

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. SSH-2222"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderColor: '#2a2a2a',
                    color: '#f1f5f9',
                  }}
                />
              </div>

              {/* Banner / Version String */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Banner / Version String
                </label>
                <input
                  type="text"
                  value={newService.banner}
                  onChange={(e) => setNewService((prev) => ({ ...prev, banner: e.target.value }))}
                  placeholder="e.g. OpenSSH_8.9p1"
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderColor: '#2a2a2a',
                    color: '#f1f5f9',
                  }}
                />
              </div>

              {/* Credentials Section */}
              <div className="pt-2 border-t" style={{ borderColor: '#2a2a2a' }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: '#94a3b8' }}>
                  Credentials (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#64748b' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={newService.username}
                      onChange={(e) => setNewService((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="admin"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      style={{
                        backgroundColor: '#0d0d0d',
                        borderColor: '#2a2a2a',
                        color: '#f1f5f9',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#64748b' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={newService.password}
                      onChange={(e) => setNewService((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="password"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      style={{
                        backgroundColor: '#0d0d0d',
                        borderColor: '#2a2a2a',
                        color: '#f1f5f9',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Section */}
              <div className="pt-2 border-t" style={{ borderColor: '#2a2a2a' }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: '#94a3b8' }}>
                  Advanced
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#64748b' }}>
                      Response Delay (ms)
                    </label>
                    <input
                      type="number"
                      value={newService.responseDelay}
                      onChange={(e) =>
                        setNewService((prev) => ({ ...prev, responseDelay: e.target.value }))
                      }
                      placeholder="0"
                      className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      style={{
                        backgroundColor: '#0d0d0d',
                        borderColor: '#2a2a2a',
                        color: '#f1f5f9',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm" style={{ color: '#94a3b8' }}>
                      Packet Capture
                    </label>
                    <button
                      onClick={() =>
                        setNewService((prev) => ({ ...prev, packetCapture: !prev.packetCapture }))
                      }
                    >
                      {newService.packetCapture ? (
                        <ToggleRight className="w-6 h-6" style={{ color: '#ff6b35' }} />
                      ) : (
                        <ToggleLeft className="w-6 h-6" style={{ color: '#64748b' }} />
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#64748b' }}>
                      Max Session Limit
                    </label>
                    <input
                      type="number"
                      value={newService.maxSessions}
                      onChange={(e) =>
                        setNewService((prev) => ({ ...prev, maxSessions: e.target.value }))
                      }
                      placeholder="10"
                      className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      style={{
                        backgroundColor: '#0d0d0d',
                        borderColor: '#2a2a2a',
                        color: '#f1f5f9',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: '#2a2a2a' }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#2a2a2a]"
                style={{ color: '#94a3b8' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#ff6b35' }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
