import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Chrome, Eye, EyeOff, Github, KeyRound } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center bg-white px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <p className="text-xl font-bold text-brand">DeceiveNet</p>
          <p className="mt-1 text-sm text-[#64748b]">
            Catch Every Intruder
          </p>

          <h1 className="mt-6 text-2xl font-bold text-[#0F172A]">
            Welcome back
          </h1>
          <p className="mt-1 text-[#475569]">Sign in to your account</p>

          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[#0F172A]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-[#0F172A]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 pr-11 outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#E2E8F0] accent-brand"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Sign In
            <ArrowRight size={18} />
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <span className="text-sm text-[#94A3B8]">or continue with</span>
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]">
              <Chrome size={18} />
              Google
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]">
              <Github size={18} />
              GitHub
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]">
              <KeyRound size={18} />
              SSO
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#475569]">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-brand hover:text-brand-hover">
              Sign up
            </a>
          </p>
        </div>
      </div>

      <div className="hidden min-h-screen w-1/2 items-center justify-center bg-gradient-to-br from-brand to-accent lg:flex">
        <div className="text-center px-8">
          <p className="text-lg text-white/95 font-medium">DeceiveNet Honeypot</p>
          <p className="mt-2 text-white/85 text-sm max-w-sm mx-auto">
            Enterprise deception & threat intelligence - decoys that watch your
            perimeter while you sleep.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <span className="font-semibold text-white/75">Nvidia</span>
            <span className="font-semibold text-white/75">Spotify</span>
            <span className="font-semibold text-white/75">Microsoft</span>
          </div>
          <p className="mt-8 text-3xl font-bold text-white">
            10K+ sessions captured
          </p>
        </div>
      </div>
    </div>
  );
}
