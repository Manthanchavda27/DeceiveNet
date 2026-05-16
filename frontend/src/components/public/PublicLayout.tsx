import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Github, LogIn, LogOut, Menu, Radar, Rocket, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Workflow', href: '/#workflow' },
  { label: 'Proof', href: '/#proof' },
  {
    label: 'GitHub',
    href: 'https://github.com/Manthanchavda27/DeceiveNet',
    external: true,
  },
];

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const closeMenu = () => setMobileMenuOpen(false);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(180deg,#fbfcfb 0%,#f4f8f7 46%,#eef5f2 100%)',
      }}
    >
      {/* ── Top Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          background: 'rgba(251,252,251,0.88)',
          borderColor: 'rgba(220,229,227,0.76)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0"
                style={{ background: '#15262b' }}
              >
                <Radar size={20} />
              </span>
              <span>
                <strong
                  className="block text-[17px] leading-none"
                  style={{ color: 'var(--ink)' }}
                >
                  DeceiveNet
                </strong>
                <small className="block text-[11px]" style={{ color: 'var(--muted)' }}>
                  Honeypot intelligence
                </small>
              </span>
            </Link>

            {/* Desktop nav links — each link is a separate pill with its own padding */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-150 hover:text-[var(--teal-dark)] hover:bg-[#e6f3f1] whitespace-nowrap"
                  style={{ color: 'var(--muted)' }}
                >
                  {link.external && <Github size={15} />}
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {user ? (
                <>
                  {/* User pill */}
                  <span
                    className="px-3.5 py-2 rounded-full text-sm font-bold border"
                    style={{
                      color: 'var(--teal-dark)',
                      background: 'var(--surface)',
                      borderColor: 'var(--line)',
                      maxWidth: 160,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-150 hover:text-[var(--teal-dark)]"
                    style={{ color: 'var(--muted)' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-150 hover:text-[var(--teal-dark)] hover:bg-[#e6f3f1]"
                    style={{ color: 'var(--muted)' }}
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-teal text-sm">
                    <UserPlus size={15} />
                    Register
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-[#e6f3f1]"
              style={{ color: 'var(--muted)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t"
            style={{
              background: 'rgba(251,252,251,0.97)',
              borderColor: 'var(--line)',
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[#e6f3f1] hover:text-[var(--teal-dark)]"
                  style={{ color: 'var(--muted)' }}
                  onClick={closeMenu}
                >
                  {link.external && <Github size={15} />}
                  {link.label}
                </a>
              ))}

              <hr style={{ borderColor: 'var(--line)' }} />

              {user ? (
                <>
                  <div
                    className="px-4 py-2.5 text-sm font-bold"
                    style={{ color: 'var(--teal-dark)' }}
                  >
                    {user.username}
                  </div>
                  <button
                    onClick={() => { closeMenu(); handleLogout(); }}
                    className="flex w-full items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[#e6f3f1] hover:text-[var(--teal-dark)]"
                    style={{ color: 'var(--muted)' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                      pathname === '/login'
                        ? 'bg-[#e4f3f1] text-[var(--teal-dark)]'
                        : 'hover:bg-[#e6f3f1] hover:text-[var(--teal-dark)]'
                    }`}
                    style={{ color: pathname === '/login' ? undefined : 'var(--muted)' }}
                    onClick={closeMenu}
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-teal w-full justify-center text-sm"
                    onClick={closeMenu}
                  >
                    <Rocket size={15} />
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="text-center py-8 text-sm border-t"
        style={{
          borderColor: 'var(--line)',
          background: 'rgba(255,255,255,0.9)',
          color: 'var(--muted)',
        }}
      >
        <p className="font-bold" style={{ color: 'var(--ink)' }}>
          DeceiveNet
        </p>
        <p className="mt-1">
          Catch Every Intruder — Enterprise Deception &amp; Threat Intelligence
        </p>
      </footer>
    </div>
  );
}
