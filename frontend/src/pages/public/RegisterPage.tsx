import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Radar, Shield, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Password length check (6-8 chars)
  const checks = {
    length: password.length >= 6 && password.length <= 8,
    minLength: password.length >= 6,
  };
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length <= 8 ? 5 : 3;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6 || password.length > 8) {
      setError('Password must be between 6 and 8 characters.');
      return;
    }
    try {
      await register(username, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  }

  const strengthColor = password.length === 0 ? '#dce5e3' : password.length < 6 ? '#ef4444' : password.length <= 8 ? '#118a7e' : '#f59e0b';
  const strengthLabel = password.length === 0 ? '' : password.length < 6 ? 'Too short' : password.length <= 8 ? 'Good' : 'Too long';

  return (
    <div
      className="flex min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 18% 10%,rgba(17,138,126,0.1),transparent 26%),radial-gradient(circle at 85% 0%,rgba(217,152,47,0.12),transparent 24%),linear-gradient(180deg,#fbfcfb 0%,#f4f8f7 46%,#eef5f2 100%)',
      }}
    >
      {/* ── Left: register card ── */}
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

          <span className="eyebrow mb-3 inline-flex">Create account</span>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--ink)' }}>
            Join DeceiveNet
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            Set up your analyst account to access the console
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

            {/* Username */}
            <label className="block mb-4">
              <span className="block text-sm font-bold mb-1.5" style={{ color: 'var(--ink)' }}>
                Username
              </span>
              <input
                type="text"
                autoComplete="username"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. security_analyst"
                className="w-full px-4 py-3 outline-none transition-all duration-200"
                style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'white', color: 'var(--ink)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17,138,126,0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </label>

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
                placeholder="you@company.com"
                className="w-full px-4 py-3 outline-none transition-all duration-200"
                style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'white', color: 'var(--ink)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17,138,126,0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </label>

            {/* Password */}
            <label className="block mb-2">
              <span className="block text-sm font-bold mb-1.5" style={{ color: 'var(--ink)' }}>
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 to 8 characters"
                  className="w-full px-4 py-3 pr-11 outline-none transition-all duration-200"
                  style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'white', color: 'var(--ink)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17,138,126,0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-1 mb-1">
                  {[2, 4, 6, 8].map((threshold) => (
                    <div
                      key={threshold}
                      className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{ background: password.length >= threshold ? strengthColor : 'var(--line)' }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
                  <span>
                    {password.length < 6 && `${6 - password.length} more char${6 - password.length !== 1 ? 's' : ''} needed`}
                    {password.length > 8 && `${password.length - 8} char${password.length - 8 !== 1 ? 's' : ''} too long`}
                    {password.length >= 6 && password.length <= 8 && `${password.length}/8 chars`}
                  </span>
                  <span style={{ color: strengthColor, fontWeight: 700 }}>{strengthLabel}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-teal btn-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus size={18} />
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: 'var(--teal-dark)' }}>
              Sign in
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
          <p className="text-xl font-extrabold text-white mb-2">Start protecting today</p>
          <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
            Deploy your first honeypot in minutes. Every attacker interaction becomes intelligence.
          </p>
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {[
              'Deploy SSH, HTTP, DB decoys instantly',
              'Capture attacker TTPs in real time',
              'Export threat intel to your SIEM',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shrink-0"
                  style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  ✓
                </span>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
