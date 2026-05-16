import { useState } from 'react';
import {
  Plus,
  Pencil,
  Play,
  Trash2,
  Copy,
  ScrollText,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { webhooks } from '../../lib/data';

const eventBadgeColors: Record<string, string> = {
  'attack.captured': 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  'attack.escalated': 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  'alert.triggered': 'bg-red-500/10 text-red-400 border border-red-500/30',
  'alert.acknowledged': 'bg-red-500/10 text-red-400 border border-red-500/30',
  'honeypot.created': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  'honeypot.deleted': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  'honeypot.status_changed': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  'system.health_changed': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
};

const eventCategories: { label: string; events: string[] }[] = [
  {
    label: 'Attack Events',
    events: ['attack.captured', 'attack.escalated'],
  },
  {
    label: 'Honeypot Events',
    events: ['honeypot.created', 'honeypot.deleted', 'honeypot.status_changed'],
  },
  {
    label: 'Alert Events',
    events: ['alert.triggered', 'alert.acknowledged'],
  },
  {
    label: 'System Events',
    events: ['system.health_changed'],
  },
];

function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'whsec_';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function WebhooksPage() {
  const [webhookStates, setWebhookStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(webhooks.map((w) => [w.id, w.enabled]))
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSecret, setNewSecret] = useState(generateSecret);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setWebhookStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleEventToggle = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleSave = () => {
    setShowCreateModal(false);
    setNewName('');
    setNewUrl('');
    setNewSecret(generateSecret());
    setSecretRevealed(false);
    setSelectedEvents([]);
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setNewName('');
    setNewUrl('');
    setNewSecret(generateSecret());
    setSecretRevealed(false);
    setSelectedEvents([]);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Webhooks</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Integrate DeceiveNet with your security stack
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Webhook
          </button>
        </div>

        {/* Webhook List */}
        <div className="space-y-4">
          {webhooks.map((wh) => (
            <div key={wh.id} className="admin-card p-6">
              <div className="flex flex-col gap-4">
                {/* Header: Name + Toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#f1f5f9]">{wh.name}</h3>
                  </div>
                  <button
                    onClick={() => handleToggle(wh.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
                      webhookStates[wh.id] ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                        webhookStates[wh.id] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* URL */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[#64748b] truncate flex-1">
                    {wh.url}
                  </span>
                  <button
                    onClick={() => handleCopy(wh.url)}
                    className="text-[#64748b] hover:text-[#94a3b8] transition-colors shrink-0"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Event Badges */}
                <div className="flex flex-wrap gap-2">
                  {wh.events.map((event) => (
                    <span
                      key={event}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        eventBadgeColors[event] || 'bg-[#242424] text-[#94a3b8]'
                      }`}
                    >
                      {event}
                    </span>
                  ))}
                </div>

                {/* Last Delivery */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748b]">Last Delivery:</span>
                  <span className="text-xs text-[#94a3b8]">{wh.lastDelivery}</span>
                  {wh.lastStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 pt-2 border-t border-[#2a2a2a]/50">
                  <button
                    className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                    title="Test"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-[#64748b] hover:text-[#00d4ff] hover:bg-[#242424] transition-colors"
                    title="View Logs"
                  >
                    <ScrollText className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-lg font-semibold text-[#f1f5f9]">Create Webhook</h2>
              <button
                onClick={handleCancel}
                className="text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Slack - Security Alerts"
                  className="admin-input w-full px-3 py-2 text-sm"
                />
              </div>

              {/* Endpoint URL */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/webhooks/deceivenet"
                  className="admin-input w-full px-3 py-2 text-sm"
                />
              </div>

              {/* Secret Token */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                  Secret Token
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={secretRevealed ? 'text' : 'password'}
                      value={newSecret}
                      readOnly
                      className="admin-input w-full px-3 py-2 text-sm font-mono pr-10"
                    />
                    <button
                      onClick={() => setSecretRevealed(!secretRevealed)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors"
                    >
                      {secretRevealed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleCopy(newSecret)}
                    className="p-2 rounded-md bg-[#242424] text-[#64748b] hover:text-[#94a3b8] hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
                    title="Copy secret"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Event Subscriptions */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-3">
                  Event Subscriptions
                </label>
                <div className="space-y-4">
                  {eventCategories.map((category) => (
                    <div key={category.label}>
                      <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                        {category.label}
                      </h4>
                      <div className="space-y-2">
                        {category.events.map((event) => (
                          <label
                            key={event}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event)}
                              onChange={() => handleEventToggle(event)}
                              className="w-4 h-4 rounded border-[#2a2a2a] bg-[#242424] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0"
                            />
                            <span
                              className={`text-sm transition-colors ${
                                selectedEvents.includes(event)
                                  ? 'text-[#f1f5f9]'
                                  : 'text-[#94a3b8] group-hover:text-[#f1f5f9]'
                              }`}
                            >
                              {event}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2a2a2a]">
              <button
                onClick={handleCancel}
                className="admin-btn-secondary px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="admin-btn-primary px-4 py-2 text-sm"
              >
                Save Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
