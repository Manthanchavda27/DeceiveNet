import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Chrome, Github, KeyRound } from "lucide-react";

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
      {/* Left side - Login form */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          {/* Logo */}
          <p className="text-xl font-bold text-teal-600">VibeForge</p>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-bold text-[#0F172A]">
            Welcome back
          </h1>
          <p className="mt-1 text-[#475569]">Sign in to your account</p>

          {/* Email input */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Password input */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 pr-11 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#475569]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#E2E8F0] accent-teal-600"
              />
              <span className="text-sm text-[#475569]">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In button */}
          <button
            onClick={handleSignIn}
            className="mt-6 w-full rounded-xl bg-teal-600 py-3 font-medium text-white transition-colors hover:bg-teal-700"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <span className="text-sm text-[#94A3B8]">or continue with</span>
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          {/* Social buttons */}
          <div className="mt-6 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]">
              <Chrome size={18} />
              Google
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]">
              <Github size={18} />
              GitHub
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]">
              <KeyRound size={18} />
              SSO
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-[#475569]">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-medium text-teal-600 hover:text-teal-700"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Decorative brand panel */}
      <div className="hidden min-h-screen w-1/2 items-center justify-center bg-gradient-to-br from-teal-400 to-cyan-600 lg:flex">
        <div className="text-center">
          <p className="text-lg text-white/90">
            The AI deployment platform trusted by
          </p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <span className="font-semibold text-white/70">Nvidia</span>
            <span className="font-semibold text-white/70">Spotify</span>
            <span className="font-semibold text-white/70">Microsoft</span>
          </div>
          <p className="mt-8 text-3xl font-bold text-white">
            1M+ agents deployed
          </p>
        </div>
      </div>
    </div>
  );
}
