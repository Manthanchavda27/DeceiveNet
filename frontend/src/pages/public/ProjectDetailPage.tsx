import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Activity, Radar } from 'lucide-react';
import { fetchHoneypotById, createHoneypot, updateHoneypot, deleteHoneypot, startHoneypot, stopHoneypot, fetchEvents } from '../../lib/api';

type Tab = 'source' | 'telemetry' | 'settings';

const tabLabels: { key: Tab; label: string }[] = [
  { key: 'source', label: 'Integration' },
  { key: 'telemetry', label: 'Telemetry' },
  { key: 'settings', label: 'Settings' },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(id !== 'new');
  const [activeTab, setActiveTab] = useState<Tab>('source');
  const [events, setEvents] = useState<any[]>([]);

  // Form State for "New Project"
  const [name, setName] = useState('');
  const [type, setType] = useState('HTTP');
  const [port, setPort] = useState(8080);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (id === 'new') return;
    async function load() {
      try {
        const data = await fetchHoneypotById(id!);
        setProject(data);
        const evs = await fetchEvents();
        setEvents(evs.filter((e: any) => e.honeypot?.name === data.name || e.honeypotId === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();

    const token = localStorage.getItem('token');
    if (!token) return;

    let wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) {
      const apiOrigin = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = new URL(apiOrigin);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${url.host}/api/ws`;
    }
    const wsPath = wsUrl.endsWith('/api/ws') ? wsUrl : `${wsUrl}/api/ws`;
    const ws = new WebSocket(`${wsPath}?token=${token}`);
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.honeypotId === id && msg.severity) {
          setEvents(prev => [msg, ...prev]);
        }
      } catch (err) { /* ignore */ }
    };

    return () => { ws.close(); };
  }, [id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const payload = {
        name,
        type,
        port: type === 'SDK' ? null : Number(port)
      };
      const hp = await createHoneypot(payload);
      navigate(`/projects/${hp.id}`);
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      const msg = typeof errorData === 'string' ? errorData : errorData?.message || err.message || 'Failed to create';
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateHoneypot(id!, { name: project.name, metadata: project.metadata });
      alert('Settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setLoading(true);
      await deleteHoneypot(id!);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Delete failed');
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      if (project.status === 'running') {
        const res = await stopHoneypot(id!);
        setProject(res);
      } else {
        const res = await startHoneypot(id!);
        setProject(res);
      }
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (id === 'new') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto mt-12 animate-fadeIn">
        <Link to="/dashboard" className="text-sm text-[var(--teal)] hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Create New Decoy Project</h1>
          <p className="text-[#64748B] mb-6">Configure your honeypot settings. Once created, you will receive integration credentials.</p>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Project Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Production Login Service" className="w-full px-4 py-2.5 rounded-lg border border-[#E2E8F0] outline-none focus:border-[var(--teal)] transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Decoy Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[#E2E8F0] outline-none focus:border-[var(--teal)] bg-white">
                  <option value="HTTP">HTTP (Web Application)</option>
                  <option value="SDK">SDK Integration (Telemetry)</option>
                  <option value="SSH">SSH (Secure Shell)</option>
                  <option value="Redis">Redis (Database)</option>
                  <option value="Custom">Custom Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">{type === 'SDK' ? 'SDK Port (Optional)' : 'Listener Port'}</label>
                <input type="number" required={type !== 'SDK'} value={type === 'SDK' ? '' : port} disabled={type === 'SDK'} onChange={e => setPort(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-[#E2E8F0] outline-none" />
              </div>
            </div>
            <div className="pt-4 flex flex-col items-end gap-3">
              {createError && <div className="text-red-500 text-sm font-medium">Error: {createError}</div>}
              <button type="submit" disabled={creating} className="btn-teal disabled:opacity-50 flex items-center gap-2">
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {creating ? 'Deploying...' : 'Create & Deploy Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 text-[var(--teal)] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-[#64748B] mb-4">Project not found.</p>
        <Link to="/dashboard" className="btn-teal">Return to Dashboard</Link>
      </div>
    );
  }

  const statusColor = (project.status === 'running' || project.status === 'active' || project.status === 'Deployed')
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-amber-50 text-amber-700';

  return (
    <div className="space-y-6 max-w-5xl mx-auto mt-4 animate-fadeIn">
      {/* Top Section */}
      <div>
        <Link to="/dashboard" className="text-sm text-[var(--teal)] hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">{project.name}</h1>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColor}`}>
            {project.status}
          </span>
          <span className="text-sm text-[#64748B]">Deployed: {new Date(project.deployedAt).toLocaleDateString()}</span>
          <button onClick={handleToggleStatus} className="ml-auto text-sm px-3 py-1 rounded bg-[#E2E8F0] hover:bg-[#CBD5E1] transition-colors">
            {project.status === 'running' ? 'Stop Honeypot' : 'Start Honeypot'}
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-[#F8FAFC] rounded-xl p-1 inline-flex border border-[#E2E8F0]">
        {tabLabels.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key
                ? 'bg-white text-[var(--teal-dark)] rounded-lg shadow-sm border border-[#E2E8F0] px-4 py-2 font-bold'
                : 'text-[#64748B] hover:text-[#0F172A] px-4 py-2 font-medium rounded-lg cursor-pointer'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'source' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">SDK Integration</h2>
          <p className="text-[#64748B] mb-6">Secure your application by integrating the DeceiveNet SDK.</p>
          <div className="space-y-4">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <h3 className="font-bold text-[#0F172A] mb-2">Step 1: Install the SDK</h3>
              <pre className="bg-[#1E293B] text-emerald-400 p-3 rounded-lg mt-2 text-sm overflow-x-auto">npm install deceivenet-sdk</pre>
            </div>
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <h3 className="font-bold text-[#0F172A] mb-2">Step 2: Initialize Middleware</h3>
              <pre className="bg-[#1E293B] text-[#E2E8F0] p-4 rounded-lg mt-3 text-sm overflow-x-auto whitespace-pre-wrap">
{`const express = require('express');
const { DeceiveNet } = require('deceivenet-sdk');

const app = express();

app.use(DeceiveNet({
  projectId: '${project.id}',
  token: '${project.apiKey || 'YOUR_API_KEY'}',
  endpoint: '${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/sdk/events',
  interceptRoutes: ['/login', '/admin', '/wp-admin']
}));`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden" style={{ minHeight: '500px' }}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--teal-light)] rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-[var(--teal)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Project Intelligence</h3>
                  <p className="text-xs text-[#64748B]">Real-time attack telemetry and forensics</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold rounded-full uppercase tracking-widest border border-[#E2E8F0]">Live Feed</span>
            </div>
            
            {events.length === 0 ? (
              <div className="py-20 text-center bg-[#F8FAFC] rounded-3xl border-2 border-dashed border-[#E2E8F0]">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#E2E8F0]">
                  <Radar size={36} className="text-[#94A3B8] animate-pulse" />
                </div>
                <h4 className="text-[#0F172A] text-lg font-bold mb-2">No Threats Detected Yet</h4>
                <p className="text-[#64748B] text-sm max-w-sm mx-auto">Your honeypot is active and listening for traffic.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#F1F5F9] text-sm text-[#94A3B8]">
                      <th className="pb-4 px-4 font-bold uppercase tracking-widest text-[10px]">Timestamp</th>
                      <th className="pb-4 px-4 font-bold uppercase tracking-widest text-[10px]">Source IP</th>
                      <th className="pb-4 px-4 font-bold uppercase tracking-widest text-[10px]">Method/Type</th>
                      <th className="pb-4 px-4 font-bold uppercase tracking-widest text-[10px]">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {events.map((e, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors group">
                        <td className="py-4 px-4 text-sm text-[#475569]">{new Date(e.timestamp).toLocaleTimeString()}</td>
                        <td className="py-4 px-4 text-sm font-mono text-[#0F172A] font-medium">{e.sourceIp}</td>
                        <td className="py-4 px-4 text-sm"><span className="px-2 py-1 bg-[#F1F5F9] rounded text-[#475569] font-semibold text-xs border border-[#E2E8F0]">{e.attackType}</span></td>
                        <td className="py-4 px-4 text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            e.severity === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                            e.severity === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            e.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {(e.severity || 'low')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Project Name</label>
                <input type="text" value={project.name} onChange={e => setProject({ ...project, name: e.target.value })} className="w-full max-w-md px-4 py-2 rounded-lg border border-[#E2E8F0] outline-none" />
              </div>
              <button onClick={handleUpdate} className="btn-teal">Save Changes</button>
            </div>
          </div>
          <hr className="border-[#E2E8F0]" />
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h3>
            <div className="p-4 border border-red-200 bg-red-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-red-800">Delete Project</p>
                <p className="text-sm text-red-600">This will permanently delete the project.</p>
              </div>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
