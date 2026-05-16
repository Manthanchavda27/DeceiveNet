import { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  LayoutDashboard,
  Server,
  Puzzle,
  Swords,
  Binary,
  BarChart3,
  Bell,
  Shield,
  Webhook,
  ScrollText,
  Settings,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Honeypots', icon: Server, path: '/admin/honeypots' },
  { label: 'Attack Events', icon: Swords, path: '/admin/attack-events' },
];

function getPageName(pathname: string): string {
  const exact = navItems.find((item) => item.path === pathname);
  if (exact) return exact.label;
  const segment = pathname.split('/').filter(Boolean).pop() || 'Dashboard';
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pageName = getPageName(location.pathname);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'DN';

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setCollapsed(true);
      setMobileMenuOpen(false);
    } else if (width < 1024) {
      setCollapsed(true);
      setMobileMenuOpen(false);
    } else {
      setCollapsed(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* ========== SIDEBAR (desktop + tablet) ========== */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen bg-[#0d0d0d] border-r border-[#2a2a2a] z-30 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        {/* Brand + Toggle */}
        <div className="flex items-center justify-between h-[56px] px-3 border-b border-[#2a2a2a] shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#00d4ff] flex items-center justify-center text-white font-bold text-sm shrink-0">
              DN
            </div>
            {!collapsed && (
              <span className="text-[#f1f5f9] font-bold text-base whitespace-nowrap">
                DeceiveNet
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 rounded-md text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1a1a1a] transition-colors shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto dark-scrollbar py-2">
          <ul className="flex flex-col gap-0.5 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#1a1a1a] text-[#f1f5f9] border-l-[3px] border-[#ff6b35]'
                        : 'text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-[#f1f5f9] border-l-[3px] border-transparent'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  <item.icon size={24} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-[#ff6b35]/20 text-[#ff6b35] text-xs font-semibold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-xs text-[#f1f5f9] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                      {item.label}
                      {item.badge && (
                        <span className="ml-1.5 text-[#ff6b35]">({item.badge})</span>
                      )}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + System Status */}
        <div className="shrink-0 border-t border-[#2a2a2a] p-3">
          {!collapsed ? (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#ff6b35] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs text-[#f1f5f9] truncate">{user?.email ?? user?.username}</p>
                <span className="inline-block text-[10px] bg-[#1a1a1a] text-[#94a3b8] border border-[#2a2a2a] px-1.5 py-0.5 rounded mt-0.5">
                  {user?.role ?? 'viewer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 rounded text-[#64748b] hover:text-red-400 transition-colors shrink-0"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 rounded-full bg-[#ff6b35] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
            </div>
          )}
          <div
            className={`flex items-center gap-1.5 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {!collapsed && (
              <span className="text-emerald-400 text-xs">System Online</span>
            )}
          </div>
        </div>
      </aside>

      {/* ========== MOBILE SIDEBAR OVERLAY ========== */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-[260px] bg-[#0d0d0d] border-r border-[#2a2a2a] z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-[56px] px-3 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#00d4ff] flex items-center justify-center text-white font-bold text-sm">
              DN
            </div>
            <span className="text-[#f1f5f9] font-bold text-base">DeceiveNet</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-md text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1a1a1a] transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto dark-scrollbar py-2">
          <ul className="flex flex-col gap-0.5 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                      ? 'bg-[#1a1a1a] text-[#f1f5f9] border-l-[3px] border-[#ff6b35]'
                      : 'text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-[#f1f5f9] border-l-[3px] border-transparent'
                    }`
                  }
                >
                  <item.icon size={24} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-[#ff6b35]/20 text-[#ff6b35] text-xs font-semibold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ========== CONTENT AREA ========== */}
      <div
        className="transition-[margin-left] duration-300 md:block"
        style={{ marginLeft: 0 }}
      >
        {/* Inner wrapper that handles the sidebar margin offset on md+ */}
        <div
          className="transition-[margin-left] duration-300"
          style={{
            marginLeft: 0,
          }}
        >
          {/* We use a CSS approach: on md+ the margin-left comes from the
              sidebar width. We achieve this by applying the margin only
              when not on mobile via a media-query-aware conditional. */}
          <style>{`
            @media (min-width: 768px) {
              .admin-content-offset {
                margin-left: ${sidebarWidth}px !important;
              }
            }
          `}</style>

          {/* ===== TOP BAR ===== */}
          <header className="admin-content-offset fixed top-0 right-0 z-20 h-[56px] bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-4 gap-4">
            {/* Hamburger (mobile only) */}
            <button
              className="md:hidden p-1.5 rounded-md text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <span className="text-sm font-medium text-[#f1f5f9]">{pageName}</span>

            {/* Search bar */}
            <div className="flex-1 flex justify-center max-w-md mx-auto">
              <div className="w-full flex items-center gap-2 bg-[#242424] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[#64748b] text-sm cursor-default select-none">
                <Search size={16} />
                <span>Search...</span>
                <span className="ml-auto text-[10px] bg-[#1a1a1a] border border-[#2a2a2a] rounded px-1.5 py-0.5 font-mono">
                  Cmd+K
                </span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-400 text-sm">Live</span>
              </div>

              {/* Notification bell */}
              <button
                className="relative p-1.5 rounded-md text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#242424] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {/* User avatar + logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 p-1 rounded-md hover:bg-[#242424] transition-colors"
                title="Logout"
              >
                <div className="w-7 h-7 rounded-full bg-[#ff6b35] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <ChevronDown size={14} className="text-[#64748b] hidden sm:block" />
              </button>
            </div>
          </header>

          {/* ===== MAIN CONTENT ===== */}
          <main className="admin-content-offset pt-[56px] min-h-screen bg-[#0d0d0d] pb-20 md:pb-0">
            <div className="p-8 animate-fadeIn">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* ========== MOBILE BOTTOM NAV ========== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1a1a1a] border-t border-[#2a2a2a]">
        <ul className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#ff6b35]'
                      : 'text-[#64748b] hover:text-[#94a3b8]'
                  }`
                }
              >
                <item.icon size={22} />
                <span className="text-[10px]">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
