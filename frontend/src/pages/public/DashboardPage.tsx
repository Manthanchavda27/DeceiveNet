import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHoneypots } from '../../lib/api';
import { Server, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [honeypots, setHoneypots] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchHoneypots();
        setHoneypots(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const filteredProjects = honeypots.filter((hp) =>
    hp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 18% 10%,rgba(17,138,126,0.07),transparent 26%),linear-gradient(180deg,#fbfcfb 0%,#f4f8f7 46%,#eef5f2 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow mb-2 inline-flex">Projects</span>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
              My Projects
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 w-56 outline-none transition-all duration-200"
              style={{
                border: "1px solid var(--line)",
                borderRadius: 999,
                background: "white",
                color: "var(--ink)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--teal)";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(17,138,126,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--line)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <Link to="/projects/new" className="btn-teal text-sm">
              + New Project
            </Link>
          </div>
        </div>

        {/* Project list */}
        <div className="animate-fadeIn flex flex-col gap-4">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block transition-all duration-200 hover:-translate-y-0.5"
              style={{
                border: "1px solid var(--line)",
                borderRadius: 22,
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 18px 55px rgba(31,52,62,0.07)",
                padding: "1.5rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--teal)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 18px 55px rgba(17,138,126,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 18px 55px rgba(31,52,62,0.07)";
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-[var(--teal)]"><Server size={28} /></span>
                  <div>
                    <h2 className="font-bold text-lg" style={{ color: "var(--ink)" }}>
                      {project.name}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                      Type: {project.type} Honeypot
                    </p>
                  </div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-extrabold capitalize"
                  style={
                    project.status === 'running' || project.status === 'active' || project.status === 'Deployed'
                      ? { background: "#e4f3f1", color: "var(--teal-dark)" }
                      : { background: "#fff6d9", color: "#805615" }
                  }
                >
                  {project.status}
                </span>
              </div>
              <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
                Deployed: {new Date(project.deployedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[var(--muted)] mb-4">No projects found. Deploy your first decoy!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
