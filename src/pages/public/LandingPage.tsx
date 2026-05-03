import { Link } from "react-router-dom";
import {
  Server,
  Eye,
  Shield,
  Network,
  Zap,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Decoy services",
    description:
      "Deploy realistic SSH, HTTP, database, and API honeypots that blend into your environment.",
  },
  {
    icon: Eye,
    title: "Full-session capture",
    description:
      "Record commands, payloads, credentials, and lateral movement paths as attackers engage decoys.",
  },
  {
    icon: Shield,
    title: "Enterprise-ready",
    description:
      "Encryption, RBAC, audit trails, and SIEM-ready exports built for security teams.",
  },
  {
    icon: Network,
    title: "Threat intelligence",
    description:
      "Normalize IOCs and TTPs into feeds your SOC and detection engineering teams can act on.",
  },
  {
    icon: Zap,
    title: "Fast deployment",
    description:
      "Spin up new decoys in minutes with templates, health checks, and auto-scaling options.",
  },
  {
    icon: Target,
    title: "Attacker focus",
    description:
      "Prioritize high-signal events with scoring, deduplication, and MITRE ATT&CK mapping.",
  },
];

const trustMetrics = [
  { value: "10K+", label: "Attacker sessions / mo" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "500+", label: "TTP patterns" },
  { value: "SOC 2", label: "Security posture" },
];

const companyNames = ["Nvidia", "Spotify", "Microsoft", "Stripe", "Notion"];

const testimonials = [
  {
    quote:
      "DeceiveNet cut our time-to-insight on intrusions from days to hours. The decoys pay for themselves in one avoided breach.",
    author: "Sarah Chen",
    role: "Director of Security at Spotify",
  },
  {
    quote:
      "We finally have high-fidelity attacker data without touching production. The threat intel exports plug straight into our SOAR playbooks.",
    author: "Marcus Williams",
    role: "Principal IR Lead at Nvidia",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative bg-gradient-to-b from-brand-soft via-white to-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(255, 107, 53, 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="animate-fadeIn inline-block bg-brand-soft text-brand-foreground border border-brand-border rounded-full px-4 py-1 text-sm mb-8"
            style={{ animationDelay: "0ms" }}
          >
            Enterprise Deception & Threat Intelligence Platform
          </div>

          <h1
            className="animate-fadeIn font-bold text-5xl md:text-6xl text-[#0F172A] leading-tight mb-6"
            style={{ animationDelay: "100ms" }}
          >
            Catch Every Intruder
          </h1>

          <p
            className="animate-fadeIn text-lg text-[#475569] max-w-2xl mx-auto mb-10"
            style={{ animationDelay: "200ms" }}
          >
            DeceiveNet is a self-hosted honeypot platform that deploys decoy
            services, captures attacker TTPs, and turns intrusion data into
            threat intelligence you can operationalize.
          </p>

          <div
            className="animate-fadeIn flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/dashboard"
              className="bg-brand hover:bg-brand-hover text-white px-8 py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              Start free
            </Link>
            <a
              href="#features"
              className="border border-[#E2E8F0] hover:border-accent text-[#0F172A] px-8 py-4 rounded-xl font-medium transition-all"
            >
              See features
            </a>
          </div>

          <div
            className="animate-fadeIn grid grid-cols-2 md:grid-cols-4 gap-8"
            style={{ animationDelay: "400ms" }}
          >
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl font-bold text-brand">
                  {metric.value}
                </div>
                <div className="text-sm text-[#475569]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="animate-fadeIn py-16 bg-white"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#94A3B8] mb-8">Trusted by security teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companyNames.map((name) => (
              <span key={name} className="font-bold text-[#94A3B8] text-xl">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        className="animate-fadeIn py-24 bg-white"
        id="features"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-4">
            Everything you need for deception ops
          </h2>
          <p className="text-center text-[#475569] max-w-2xl mx-auto mb-16">
            From deployment to intelligence — one platform for DeceiveNet Honeypot
            workloads across cloud and on-prem.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-brand-border transition-all"
                >
                  <div className="text-brand mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#475569] text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="animate-fadeIn py-24 bg-gradient-to-b from-white to-brand-soft"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-16">
            Loved by defenders worldwide
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

      <section
        className="animate-fadeIn py-24 bg-brand-soft"
        style={{ animationDelay: "100ms" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
            Ready to deceive?
          </h2>
          <p className="text-[#475569] mb-10">
            Spin up your first decoy in minutes. No credit card required for the
            starter tier.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-brand hover:bg-brand-hover text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            Deploy your first honeypot
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[#94A3B8]">
            <span>10-minute setup</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Self-hosted option</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Threat intel exports</span>
          </div>
        </div>
      </section>
    </div>
  );
}
