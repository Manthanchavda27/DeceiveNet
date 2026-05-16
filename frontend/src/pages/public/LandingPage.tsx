import { Link } from "react-router-dom";
import {
  ArrowRight,
  Database,
  Eye,
  Network,
  Server,
  Shield,
  Target,
  Zap,
  Fingerprint,
  Webhook,
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

const workflowSteps = [
  {
    title: "Deploy",
    description:
      "Place SSH, HTTP, API, or database honeypots where real attackers would look.",
  },
  {
    title: "Capture",
    description:
      "Record commands, credentials, payloads, source IPs, and session context.",
  },
  {
    title: "Analyze",
    description:
      "Map behavior to severity, TTPs, and threat intelligence indicators.",
  },
  {
    title: "Respond",
    description:
      "Push alerts to analysts, webhooks, SIEM tools, and audit trails.",
  },
];

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

const storyCards = [
  {
    icon: Network,
    title: "Deploy decoys",
    text: "Create fake SSH, HTTP, API, and database services that look valuable but are safe to touch.",
  },
  {
    icon: Fingerprint,
    title: "Capture evidence",
    text: "Store source IP, payload, commands, session behavior, target service, and confidence score.",
  },
  {
    icon: Webhook,
    title: "Route response",
    text: "Push events into alerts, webhooks, reports, and analyst review flows.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* ══════════════════════════════════════════
          HERO — demo-frontend two-column layout
      ══════════════════════════════════════════ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div
          className="max-w-6xl mx-auto animate-fadeIn"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,0.9fr) minmax(340px,1.1fr)",
            gap: "clamp(24px,5vw,70px)",
            alignItems: "center",
            minHeight: 520,
            padding: "clamp(28px,5vw,60px)",
            border: "1px solid var(--line)",
            borderRadius: 28,
            background: "linear-gradient(135deg,#ffffff 0%,#f1f8f6 100%)",
            boxShadow: "0 28px 80px rgba(31,52,62,0.12)",
          }}
        >
          {/* Left copy */}
          <div>
            <span className="eyebrow mb-4 inline-flex">
              Controlled deception for real security teams
            </span>

            <h1
              className="font-extrabold leading-[0.97] mt-3"
              style={{
                fontSize: "clamp(42px,6vw,72px)",
                color: "var(--ink)",
                maxWidth: 540,
              }}
            >
              Catch attackers before they reach production.
            </h1>

            <p
              className="mt-5 text-[17px] leading-relaxed"
              style={{ color: "var(--muted)", maxWidth: 480 }}
            >
              DeceiveNet places believable honeypots around your environment,
              records attacker behaviour, and turns every interaction into
              evidence your team can act on.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="btn-teal btn-lg">
                Start free
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-outline btn-lg">
                See features
              </a>
            </div>

            {/* Trust metrics */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
              {trustMetrics.map((m) => (
                <div key={m.label}>
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: "var(--teal)" }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product preview widget (demo style) */}
          <div
            className="overflow-hidden"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 22,
              background: "var(--surface)",
              boxShadow: "0 28px 80px rgba(31,52,62,0.15)",
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center gap-2 px-4"
              style={{
                minHeight: 42,
                borderBottom: "1px solid var(--line)",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#d1dbd8]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#d1dbd8]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#d1dbd8]" />
              <strong className="ml-2">Attack Signal Monitor</strong>
            </div>

            {/* Preview body */}
            <div
              className="relative flex items-center justify-center"
              style={{
                minHeight: 300,
                background:
                  "linear-gradient(30deg,rgba(17,138,126,0.08) 12%,transparent 12%),linear-gradient(150deg,rgba(47,111,186,0.07) 13%,transparent 13%),#f8fbfa",
              }}
            >
              {/* Left node */}
              <div
                className="absolute flex flex-col items-center justify-center gap-2 text-sm font-medium"
                style={{
                  left: "8%",
                  top: "28%",
                  width: 130,
                  minHeight: 90,
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                  background: "white",
                  boxShadow: "0 14px 38px rgba(31,52,62,0.1)",
                  color: "var(--ink)",
                }}
              >
                <Server size={22} style={{ color: "var(--teal)" }} />
                SSH decoy
              </div>

              {/* Shield core */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 30,
                  background: "linear-gradient(145deg,var(--teal),#1b687c)",
                  boxShadow: "0 22px 50px rgba(17,138,126,0.28)",
                  color: "white",
                  animation: "float 5s ease-in-out infinite",
                }}
              >
                <Shield size={52} />
              </div>

              {/* Right node */}
              <div
                className="absolute flex flex-col items-center justify-center gap-2 text-sm font-medium"
                style={{
                  right: "8%",
                  top: "28%",
                  width: 130,
                  minHeight: 90,
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                  background: "white",
                  boxShadow: "0 14px 38px rgba(31,52,62,0.1)",
                  color: "var(--ink)",
                }}
              >
                <Database size={22} style={{ color: "var(--teal)" }} />
                DB lure
              </div>

              {/* Signal lines */}
              <div
                style={{
                  position: "absolute",
                  height: 2,
                  width: "34%",
                  left: "20%",
                  top: "49%",
                  background:
                    "linear-gradient(90deg,transparent,var(--teal),transparent)",
                  animation: "scan 2.6s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  height: 2,
                  width: "34%",
                  right: "20%",
                  top: "49%",
                  background:
                    "linear-gradient(90deg,transparent,var(--teal),transparent)",
                  animation: "scan 2.6s linear 1.2s infinite",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3-card story strip (demo style)
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storyCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="demo-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon size={24} style={{ color: "var(--teal)" }} />
                <h3 className="mt-3 font-bold text-base" style={{ color: "var(--ink)" }}>
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {card.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Trusted by (demo muted style)
      ══════════════════════════════════════════ */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold mb-6" style={{ color: "var(--muted)" }}>
            Trusted by security teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companyNames.map((name) => (
              <span
                key={name}
                className="font-extrabold text-lg"
                style={{ color: "#b0bec5" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Features grid (demo card style)
      ══════════════════════════════════════════ */}
      <section
        className="py-20"
        id="features"
        style={{ background: "linear-gradient(180deg,#f4f8f7 0%,#ffffff 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="eyebrow mx-auto block w-max mb-4">Platform features</span>
          <h2
            className="text-3xl font-extrabold text-center mb-3"
            style={{ color: "var(--ink)" }}
          >
            Everything you need for deception ops
          </h2>
          <p
            className="text-center max-w-2xl mx-auto mb-14 leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            From deployment to intelligence — one platform for DeceiveNet
            honeypot workloads across cloud and on-prem.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="demo-card p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4" style={{ color: "var(--teal)" }}>
                    <Icon size={26} />
                  </div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "var(--ink)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Workflow steps (dark section, demo style)
      ══════════════════════════════════════════ */}
      <section
        className="py-20"
        id="workflow"
        style={{ background: "#15262b" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            className="mx-auto block w-max rounded-full px-3 py-1.5 text-xs font-extrabold mb-4"
            style={{ background: "rgba(17,138,126,0.25)", color: "#7ee8df" }}
          >
            How it works
          </span>
          <h2 className="text-3xl font-extrabold text-center text-white mb-3">
            Built for the defender workflow
          </h2>
          <p
            className="text-center max-w-2xl mx-auto mb-14 leading-relaxed"
            style={{ color: "#94a3b8" }}
          >
            Deploy decoys, watch attackers interact with them, score the event,
            and route the evidence to the team that can act.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[18px] p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <span
                  className="text-xs font-extrabold"
                  style={{ color: "var(--teal)" }}
                >
                  Step {index + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "#94a3b8" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Testimonials (demo card style)
      ══════════════════════════════════════════ */}
      <section
        className="py-20"
        id="proof"
        style={{ background: "linear-gradient(180deg,#ffffff 0%,#eef6f4 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-extrabold text-center mb-14"
            style={{ color: "var(--ink)" }}
          >
            Loved by defenders worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="demo-card p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <p
                  className="leading-relaxed mb-6 text-[15px]"
                  style={{ color: "var(--ink)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>
                    {t.author}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA (demo flow-section style)
      ══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "#eef6f4" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow mx-auto block w-max mb-4">Get started today</span>
          <h2
            className="text-3xl font-extrabold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Ready to deceive?
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: "var(--muted)" }}>
            Spin up your first decoy in minutes. No credit card required for the
            starter tier.
          </p>
          <Link to="/dashboard" className="btn-teal btn-lg inline-flex">
            <Server size={18} />
            Deploy your first honeypot
            <ArrowRight size={16} />
          </Link>
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm"
            style={{ color: "var(--muted)" }}
          >
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
