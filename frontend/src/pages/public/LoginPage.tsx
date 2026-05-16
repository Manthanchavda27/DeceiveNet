import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Chrome, Eye, EyeOff, Github, KeyRound, Radar, Shield } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 18% 10%,rgba(17,138,126,0.1),transparent 26%),radial-gradient(circle at 85% 0%,rgba(217,152,47,0.12),transparent 24%),linear-gradient(180deg,#fbfcfb 0%,#f4f8f7 46%,#eef5f2 100%)',
      }}
    >
      {/* ── Left: auth card ── */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div
          className="w-full max-w-md p-8 animate-fadeIn"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 18px 55px rgba(31,52,62,0.09)',
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-6">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0"
              style={{ background: '#15262b' }}
            >
              <Radar size={20} />
            </span>
            <span>
              <strong className="block text-[17px] leading-none" style={{ color: 'var(--ink)' }}>
                DeceiveNet
              </strong>
              <small className="block text-[11px]" style={{ color: 'var(--muted)' }}>
                Catch Every Intruder
              </small>
            </span>
          </div>

          <span className="eyebrow mb-3 inline-flex">Access required</span>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--ink)' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            Sign in to your deception console
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Error banner */}
            {error && (
              <div
                className="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: '#ffe7e7', color: '#861f1f', border: '1px solid #ffc5c5' }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <label className="block mb-4">
              <span className="block text-sm font-bold mb-1.5" style={{ color: 'var(--ink)' }}>
                Email
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 outline-none transition-all duration-200"
                style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'white', color: 'var(--ink)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17,138,126,0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </label>

            {/* Password */}
            <label className="block mb-4">
              <span className="block text-sm font-bold mb-1.5" style={{ color: 'var(--ink)' }}>
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 outline-none transition-all duration-200"
                  style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'white', color: 'var(--ink)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17,138,126,0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: 'var(--teal)' }}
                />
                Remember me
              </label>
              <a href="#" className="text-sm font-bold hover:underline" style={{ color: 'var(--teal-dark)' }}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-teal btn-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
            <span className="text-sm" style={{ color: 'var(--muted)' }}>or continue with</span>
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>

          {/* OAuth stubs */}
          <div className="flex gap-3">
            {[{ icon: Chrome, label: 'Google' }, { icon: Github, label: 'GitHub' }, { icon: KeyRound, label: 'SSO' }].map(
              ({ icon: Icon, label }) => (
                <button key={label} type="button" className="btn-outline flex-1 text-sm py-2.5">
                  <Icon size={17} />
                  {label}
                </button>
              )
            )}
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: 'var(--teal-dark)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: decorative panel ── */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center"
        style={{ background: 'linear-gradient(145deg,var(--teal),#1b687c)' }}
      >
        <div className="text-center px-10">
          <div
            className="mx-auto mb-6 flex items-center justify-center"
            style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.12)' }}
          >
            <Shield size={40} color="white" />
          </div>
          <p className="text-xl font-extrabold text-white mb-2">DeceiveNet Honeypot</p>
          <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
            Enterprise deception &amp; threat intelligence — decoys that watch your perimeter while you sleep.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            {['Nvidia', 'Spotify', 'Microsoft'].map((n) => (
              <span key={n} className="font-bold text-white/60 text-sm">{n}</span>
            ))}
          </div>
          <p className="mt-8 text-3xl font-extrabold text-white">10K+ sessions captured</p>
        </div>
      </div>
    </div>
  );
}
