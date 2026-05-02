import { Link } from "react-router-dom";
import { Brain, Plug, BarChart3, Shield, Zap, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Agent Framework",
    description: "Build custom AI agents with our intuitive SDK",
  },
  {
    icon: Plug,
    title: "API Integrations",
    description: "Connect to 500+ tools and data sources",
  },
  {
    icon: BarChart3,
    title: "Real-time Monitoring",
    description: "Watch your agents think in real-time",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2, encryption at rest, audit logs",
  },
  {
    icon: Zap,
    title: "One-click Deploy",
    description: "Ship to production with a single command",
  },
  {
    icon: Target,
    title: "Prompt Management",
    description: "Version control for your prompts",
  },
];

const trustMetrics = [
  { value: "1M+", label: "Agents Deployed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "500+", label: "Integrations" },
  { value: "SOC 2", label: "Compliant" },
];

const companyNames = ["Nvidia", "Spotify", "Microsoft", "Stripe", "Notion"];

const testimonials = [
  {
    quote:
      "VibeForge cut our deployment time from weeks to hours. It's revolutionized how we ship AI features.",
    author: "Sarah Chen",
    role: "Staff Engineer at Spotify",
  },
  {
    quote:
      "The best platform we've found for deploying AI agents at scale. Absolutely indispensable.",
    author: "Marcus Williams",
    role: "AI Lead at Nvidia",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* SECTION 1 - HERO */}
      <section className="relative bg-gradient-to-b from-[#F0FDFA] via-white to-white py-24 overflow-hidden">
        {/* Subtle radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(13, 148, 136, 0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div
            className="animate-fadeIn inline-block bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-4 py-1 text-sm mb-8"
            style={{ animationDelay: "0ms" }}
          >
            Now in Public Beta
          </div>

          {/* Headline */}
          <h1
            className="animate-fadeIn font-bold text-5xl md:text-6xl text-[#0F172A] leading-tight mb-6"
            style={{ animationDelay: "100ms" }}
          >
            Ship AI Agents.
            <br />
            Not Infrastructure.
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fadeIn text-lg text-[#475569] max-w-2xl mx-auto mb-10"
            style={{ animationDelay: "200ms" }}
          >
            The fastest way to build, deploy, and scale AI-powered products.
            From prototype to production in minutes.
          </p>

          {/* CTAs */}
          <div
            className="animate-fadeIn flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/dashboard"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              Start Building Free
            </Link>
            <a
              href="#demo"
              className="border border-[#E2E8F0] hover:border-teal-300 text-[#0F172A] px-8 py-4 rounded-xl font-medium transition-all"
            >
              Watch Demo
            </a>
          </div>

          {/* Trust Bar */}
          <div
            className="animate-fadeIn grid grid-cols-2 md:grid-cols-4 gap-8"
            style={{ animationDelay: "400ms" }}
          >
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl font-bold text-teal-600">
                  {metric.value}
                </div>
                <div className="text-sm text-[#475569]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 - SOCIAL PROOF */}
      <section
        className="animate-fadeIn py-16 bg-white"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#94A3B8] mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companyNames.map((name) => (
              <span
                key={name}
                className="font-bold text-[#94A3B8] text-xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - FEATURES GRID */}
      <section
        className="animate-fadeIn py-24 bg-white"
        id="features"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-16">
            Everything you need to ship AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-teal-600 mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#475569] text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 - TESTIMONIALS */}
      <section
        className="animate-fadeIn py-24 bg-gradient-to-b from-white to-[#F0FDFA]"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-16">
            Loved by AI teams worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm"
              >
                <p className="text-[#0F172A] mb-6 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-[#0F172A]">{t.author}</p>
                  <p className="text-sm text-[#475569]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - FINAL CTA */}
      <section
        className="animate-fadeIn py-24 bg-[#F0FDFA]"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
            Ready to ship?
          </h2>
          <p className="text-[#475569] mb-10">
            Start building for free. No credit card required.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            Deploy Your First Agent
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[#94A3B8]">
            <span>10-minute setup</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Free tier included</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>No credit card</span>
          </div>
        </div>
      </section>
    </div>
  );
}
