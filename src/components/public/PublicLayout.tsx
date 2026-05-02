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
      {/* Fixed Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/" className="text-teal-600 font-bold text-xl">
              VibeForge
            </Link>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#475569] hover:text-teal-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right: Auth buttons (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-[#475569] hover:text-teal-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile: Hamburger */}
            <button
              className="md:hidden p-2 text-[#475569]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0]">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-[#475569] hover:text-teal-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-[#E2E8F0]" />
              <Link
                to="/login"
                className="block text-[#475569] hover:text-teal-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="block bg-teal-600 text-white text-center rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-[#94A3B8] text-sm">
        Built with care by VibeForge Labs
      </footer>
    </div>
  );
}
