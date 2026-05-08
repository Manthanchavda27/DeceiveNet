import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowRight, Github, LogIn, Menu, Rocket, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Proof", href: "#proof" },
  {
    label: "GitHub",
    href: "https://github.com/Manthanchavda27/DeceiveNet",
    external: true,
  },
];

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-[#E2E8F0] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#0F172A] font-bold text-xl tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] text-sm text-white">
                DN
              </span>
              <span>DeceiveNet</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#475569] hover:text-brand transition-colors"
                >
                  {link.external && <Github size={16} />}
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-brand transition-colors"
              >
                <LogIn size={17} />
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-brand text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm hover:bg-brand-hover hover:shadow-md transition-all"
              >
                <Rocket size={17} />
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F8FAFC] hover:text-brand transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0] shadow-sm">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#475569] hover:bg-[#F8FAFC] hover:text-brand transition-colors"
                  onClick={closeMenu}
                >
                  {link.external && <Github size={17} />}
                  {link.label}
                </a>
              ))}
              <hr className="border-[#E2E8F0]" />
              <Link
                to="/login"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  pathname === "/login"
                    ? "bg-brand-soft text-brand"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-brand"
                }`}
                onClick={closeMenu}
              >
                <LogIn size={17} />
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 bg-brand text-white text-center rounded-lg px-4 py-2 font-semibold hover:bg-brand-hover transition-colors"
                onClick={closeMenu}
              >
                <Rocket size={17} />
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="text-center py-8 text-sm border-t border-[#E2E8F0] bg-[#fafafa] text-[#64748b]">
        <p className="font-medium text-[#0F172A]">DeceiveNet</p>
        <p className="mt-1 text-[#64748b]">
          Catch Every Intruder - Enterprise Deception & Threat Intelligence
        </p>
      </footer>
    </div>
  );
}
