import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../lib/data';

export default function DashboardPage() {
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">My Projects</h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#E2E8F0] rounded-xl px-4 py-2.5 w-64 bg-white focus:border-teal-500 outline-none"
            />
            <Link
              to="/projects/new"
              className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors ml-3"
            >
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
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{project.icon}</span>
                  <div>
                    <h2 className="font-semibold text-lg text-[#0F172A]">
                      {project.name}
                    </h2>
                    <p className="text-sm text-[#475569] mt-1">
                      {project.description}
                    </p>
                  </div>
                </div>
                <span
                  className={
                    project.status === 'Deployed'
                      ? 'bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium'
                      : 'bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium'
                  }
                >
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-4">
                Updated {project.updatedAgo}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
