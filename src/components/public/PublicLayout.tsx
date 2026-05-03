import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "GitHub", href: "#github" },
];

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-brand font-bold text-xl tracking-tight">
              DeceiveNet
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#475569] hover:text-brand transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-[#475569] hover:text-brand transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="bg-brand text-white rounded-lg px-4 py-2 hover:bg-brand-hover transition-colors"
              >
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-[#475569]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0]">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-[#475569] hover:text-brand transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-[#E2E8F0]" />
              <Link
                to="/login"
                className="block text-[#475569] hover:text-brand transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="block bg-brand text-white text-center rounded-lg px-4 py-2 hover:bg-brand-hover transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
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
          Catch Every Intruder · Enterprise Deception & Threat Intelligence
        </p>
      </footer>
    </div>
  );
}
