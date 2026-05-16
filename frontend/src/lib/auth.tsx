import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';
import api from './api';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  verifying: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: load<AuthUser>('dn_user'),
    accessToken: localStorage.getItem('token'),
    loading: false,
    verifying: true, // Start in verifying state
  });

  // Startup verification
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('dn_refresh');

    const verifyAuth = async () => {
      if (token) {
        try {
          // Verify by pinging /me endpoint using Axios interceptor
          const res = await api.get('/users/me');
          if (res.data?.data) {
            setState((s) => ({ ...s, user: res.data.data, accessToken: token, verifying: false }));
            return;
          }
        } catch (err) {
          console.error("Startup verification failed:", err);
          // Interceptor will handle token removal if 401
        }
      }

      // If no token or token ping failed, try silent refresh
      if (refresh) {
        try {
          const res = await fetch(`${API}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refresh }),
          });
          if (!res.ok) throw new Error('refresh_failed');
          const json = await res.json();
          localStorage.setItem('token', json.data.token);
          localStorage.setItem('dn_refresh', json.data.refreshToken);
          setState((s) => ({ ...s, accessToken: json.data.token, verifying: false }));
          return;
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('dn_refresh');
          localStorage.removeItem('dn_user');
          setState({ user: null, accessToken: null, loading: false, verifying: false });
          return;
        }
      }

      // No tokens at all
      setState((s) => ({ ...s, verifying: false }));
    };

    verifyAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setState((s) => ({ ...s, loading: false }));
      throw new Error(json?.error?.message ?? 'Login failed');
    }
    const { token, refreshToken, user } = json.data;
    localStorage.setItem('token', token);
    localStorage.setItem('dn_refresh', refreshToken);
    localStorage.setItem('dn_user', JSON.stringify(user));
    setState({ user, accessToken: token, loading: false, verifying: false });
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setState((s) => ({ ...s, loading: true }));
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setState((s) => ({ ...s, loading: false }));
        throw new Error(json?.error?.message ?? 'Registration failed');
      }
      // Auto-login after register
      setState((s) => ({ ...s, loading: false }));
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('dn_refresh');
    if (refresh) {
      fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      }).catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('dn_refresh');
    localStorage.removeItem('dn_user');
    setState({ user: null, accessToken: null, loading: false, verifying: false });
    window.location.href = '/login';
  }, []);

  if (state.verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-[var(--teal)] animate-spin mb-4" />
        <p className="text-[#64748B] font-medium animate-pulse">Verifying secure session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
