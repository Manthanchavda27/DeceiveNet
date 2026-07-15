import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Fingerprint,
  Lock,
  LogOut,
  Mail,
  Network,
  Play,
  Radar,
  Search,
  Server,
  Shield,
  ShieldCheck,
  TerminalSquare,
  UserPlus,
  Webhook,
} from "lucide-react";

type Page = "home" | "login" | "register" | "dashboard" | "decoys" | "lab" | "events" | "report";
type Severity = "Critical" | "High" | "Medium" | "Low";
type AttackStatus = "New" | "Triaged" | "Escalated";

type User = {
  name: string;
  email: string;
};

type AttackEvent = {
  id: string;
  time: string;
  sourceIp: string;
  target: string;
  technique: string;
  payload: string;
  severity: Severity;
  status: AttackStatus;
  confidence: number;
};

type Decoy = {
  name: string;
  type: string;
  zone: string;
  status: "Online" | "Provisioning" | "Paused";
  events: number;
  lastSeen: string;
};

const protectedPages: Page[] = ["dashboard", "decoys", "lab", "events", "report"];

const initialDecoys: Decoy[] = [
  {
    name: "SSH Bastion Lure",
    type: "SSH",
    zone: "DMZ subnet",
    status: "Online",
    events: 847,
    lastSeen: "2m ago",
  },
  {
    name: "Customer Portal Decoy",
    type: "HTTP",
    zone: "Public edge",
    status: "Online",
    events: 2103,
    lastSeen: "5m ago",
  },
  {
    name: "Finance MySQL Trap",
    type: "Database",
    zone: "Internal VLAN",
    status: "Online",
    events: 412,
    lastSeen: "8m ago",
  },
  {
    name: "Kubernetes Token Lure",
    type: "API",
    zone: "Cluster east",
    status: "Paused",
    events: 133,
    lastSeen: "1h ago",
  },
];

const initialEvents: AttackEvent[] = [
  {
    id: "EVT-2401",
    time: "12:42:15",
    sourceIp: "45.33.32.156",
    target: "SSH Bastion Lure",
    technique: "Credential brute force",
    payload: "root:admin123",
    severity: "Critical",
    status: "New",
    confidence: 96,
  },
  {
    id: "EVT-2400",
    time: "12:39:02",
    sourceIp: "185.220.101.34",
    target: "Customer Portal Decoy",
    technique: "SQL injection probe",
    payload: "' OR 1=1 --",
    severity: "High",
    status: "Triaged",
    confidence: 91,
  },
  {
    id: "EVT-2399",
    time: "12:31:44",
    sourceIp: "103.235.46.39",
    target: "Finance MySQL Trap",
    technique: "Weak password attempt",
    payload: "admin:password",
    severity: "Medium",
    status: "Triaged",
    confidence: 81,
  },
];

const techniques = [
  "Credential brute force",
  "SQL injection probe",
  "Secret discovery attempt",
  "Path traversal probe",
  "Command execution attempt",
];

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function createDemoId(length: number) {
  return `EVT-${2401 + length}`;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("deceivenet-demo-user");
    return saved ? (JSON.parse(saved) as User) : null;
  });
  const [events, setEvents] = useState<AttackEvent[]>(() => {
    const saved = localStorage.getItem("deceivenet-demo-events");
    return saved ? (JSON.parse(saved) as AttackEvent[]) : initialEvents;
  });
  const [decoys, setDecoys] = useState<Decoy[]>(() => {
    const saved = localStorage.getItem("deceivenet-demo-decoys");
    return saved ? (JSON.parse(saved) as Decoy[]) : initialDecoys;
  });
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("Demo environment ready");

  useEffect(() => {
    localStorage.setItem("deceivenet-demo-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("deceivenet-demo-decoys", JSON.stringify(decoys));
  }, [decoys]);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? events[0];
  const isProtected = protectedPages.includes(page);
  const currentPage = isProtected && !user ? "login" : page;

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) =>
      [event.id, event.sourceIp, event.target, event.technique, event.payload]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [events, search]);

  const activeDecoys = decoys.filter((decoy) => decoy.status === "Online").length;
  const criticalEvents = events.filter((event) => event.severity === "Critical").length;
  const avgConfidence = Math.round(
    events.reduce((sum, event) => sum + event.confidence, 0) / events.length
  );

  function go(nextPage: Page) {
    if (protectedPages.includes(nextPage) && !user) {
      setNotice("Please sign in before opening the console");
      setPage("login");
      return;
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAuth(nextUser: User) {
    setUser(nextUser);
    localStorage.setItem("deceivenet-demo-user", JSON.stringify(nextUser));
    setNotice(`Welcome, ${nextUser.name}`);
    setPage("dashboard");
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("deceivenet-demo-user");
    setNotice("Signed out safely");
    setPage("home");
  }

  function deployDecoy() {
    const next: Decoy = {
      name: `API Credential Lure ${decoys.length + 1}`,
      type: "API",
      zone: "Demo lab",
      status: "Provisioning",
      events: 0,
      lastSeen: "just now",
    };
    setDecoys((current) => [next, ...current]);
    setNotice("A new demo decoy was added to the fleet");
    go("decoys");
  }

  function createAttack(input: {
    sourceIp: string;
    target: string;
    technique: string;
    payload: string;
    severity: Severity;
  }) {
    const next: AttackEvent = {
      id: createDemoId(events.length),
      time: nowTime(),
      sourceIp: input.sourceIp,
      target: input.target,
      technique: input.technique,
      payload: input.payload,
      severity: input.severity,
      status: "New",
      confidence: input.severity === "Critical" ? 97 : input.severity === "High" ? 90 : 78,
    };
    setEvents((current) => [next, ...current]);
    setSelectedEventId(next.id);
    setDecoys((current) =>
      current.map((decoy) =>
        decoy.name === input.target
          ? { ...decoy, events: decoy.events + 1, status: "Online", lastSeen: "just now" }
          : decoy
      )
    );
    setNotice(`${next.id} captured from ${next.sourceIp}`);
    go("events");
  }

  function triageSelected() {
    if (!selectedEvent) return;
    setEvents((current) =>
      current.map((event) =>
        event.id === selectedEvent.id ? { ...event, status: "Triaged" } : event
      )
    );
    setNotice(`${selectedEvent.id} marked as triaged`);
  }

  return (
    <div className="site-shell">
      <header className="top-nav">
        <button className="brand" onClick={() => go("home")} aria-label="Go home">
          <span className="brand-mark">
            <Radar size={21} />
          </span>
          <span>
            <strong>DeceiveNet</strong>
            <small>Honeypot intelligence</small>
          </span>
        </button>

        <nav aria-label="Primary navigation">
          <button className={currentPage === "home" ? "active" : ""} onClick={() => go("home")}>
            Home
          </button>
          <button className={currentPage === "dashboard" ? "active" : ""} onClick={() => go("dashboard")}>
            Console
          </button>
          <button className={currentPage === "lab" ? "active" : ""} onClick={() => go("lab")}>
            Attack Lab
          </button>
          <button className={currentPage === "report" ? "active" : ""} onClick={() => go("report")}>
            Report
          </button>
        </nav>

        <div className="auth-actions">
          {user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <button className="quiet-button" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="quiet-button" onClick={() => go("login")}>
                Login
              </button>
              <button className="solid-button" onClick={() => go("register")}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <StatusBar notice={notice} />
        {currentPage === "home" && (
          <HomePage go={go} deployDecoy={deployDecoy} />
        )}
        {currentPage === "login" && (
          <AuthPage mode="login" go={go} onAuth={handleAuth} />
        )}
        {currentPage === "register" && (
          <AuthPage mode="register" go={go} onAuth={handleAuth} />
        )}
        {currentPage === "dashboard" && (
          <DashboardPage
            activeDecoys={activeDecoys}
            totalEvents={events.length}
            criticalEvents={criticalEvents}
            avgConfidence={avgConfidence}
            events={events}
            decoys={decoys}
            go={go}
            deployDecoy={deployDecoy}
          />
        )}
        {currentPage === "decoys" && (
          <DecoysPage decoys={decoys} deployDecoy={deployDecoy} />
        )}
        {currentPage === "lab" && (
          <AttackLabPage decoys={decoys} createAttack={createAttack} />
        )}
        {currentPage === "events" && (
          <EventsPage
            events={filteredEvents}
            selectedEvent={selectedEvent}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            search={search}
            setSearch={setSearch}
            triageSelected={triageSelected}
          />
        )}
        {currentPage === "report" && <ReportPage />}
      </main>
    </div>
  );
}

function StatusBar({ notice }: { notice: string }) {
  return (
    <div className="status-bar">
      <span>
        <Bell size={16} />
        {notice}
      </span>
      <span>
        <ShieldCheck size={16} />
        Local demo only
      </span>
    </div>
  );
}

function HomePage({
  go,
  deployDecoy,
}: {
  go: (page: Page) => void;
  deployDecoy: () => void;
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Controlled deception for real security teams</span>
          <h1>Catch attackers before they reach production.</h1>
          <p>
            DeceiveNet places believable honeypots around your environment,
            records attacker behavior, and turns every interaction into evidence
            your team can review.
          </p>
          <div className="hero-actions">
            <button className="solid-button large" onClick={() => go("register")}>
              Start protected demo
              <ArrowRight size={18} />
            </button>
            <button className="outline-button large" onClick={() => go("login")}>
              Login to console
            </button>
          </div>
        </div>
        <div className="product-preview" aria-label="DeceiveNet dashboard preview">
          <div className="preview-top">
            <span />
            <span />
            <span />
            <strong>Attack Signal Monitor</strong>
          </div>
          <div className="preview-body">
            <div className="node-card left">
              <Server size={24} />
              SSH decoy
            </div>
            <div className="shield-core">
              <Shield size={54} />
            </div>
            <div className="node-card right">
              <Database size={24} />
              DB lure
            </div>
            <div className="signal-line one" />
            <div className="signal-line two" />
          </div>
        </div>
      </section>

      <section className="story-grid">
        <StoryCard icon={Network} title="Deploy decoys" text="Create fake SSH, HTTP, API, and database services that look valuable but are safe to touch." />
        <StoryCard icon={Fingerprint} title="Capture evidence" text="Store source IP, payload, commands, session behavior, target service, and confidence score." />
        <StoryCard icon={Webhook} title="Route response" text="Push events into alerts, webhooks, reports, and analyst review flows." />
      </section>

      <section className="flow-section">
        <div>
          <span className="section-label">How the demo works</span>
          <h2>Home to auth to console to attack lab to event details.</h2>
          <p>
            The demo blocks protected pages until login/register. After that,
            you can deploy a decoy, simulate a controlled attack, and watch the
            attacker details appear in the Events page.
          </p>
        </div>
        <div className="flow-buttons">
          <button className="outline-button" onClick={deployDecoy}>
            Deploy demo decoy
          </button>
          <button className="solid-button" onClick={() => go("lab")}>
            Open attack lab
          </button>
        </div>
      </section>
    </>
  );
}

function AuthPage({
  mode,
  go,
  onAuth,
}: {
  mode: "login" | "register";
  go: (page: Page) => void;
  onAuth: (user: User) => void;
}) {
  const [name, setName] = useState("Security Analyst");
  const [email, setEmail] = useState("admin@deceivenet.io");
  const [password, setPassword] = useState("Admin123!Secure");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 8) {
      setError("Use a valid email and password with at least 8 characters.");
      return;
    }
    if (mode === "register" && name.trim().length < 2) {
      setError("Please enter a display name.");
      return;
    }
    onAuth({ name: name.trim() || "Security Analyst", email });
  }

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <span className="section-label">Access required</span>
        <h1>{mode === "login" ? "Login to the deception console." : "Create your analyst account."}</h1>
        <p>
          Protected dashboards stay locked until a user signs in. This mirrors
          the real product flow without needing a production auth server for the
          demo.
        </p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <h2>{mode === "login" ? "Welcome back" : "Register account"}</h2>
        {mode === "register" && (
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="solid-button large" type="submit">
          {mode === "login" ? <Lock size={18} /> : <UserPlus size={18} />}
          {mode === "login" ? "Login" : "Create account"}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => go(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account? Register" : "Already registered? Login"}
        </button>
      </form>
    </section>
  );
}

function DashboardPage({
  activeDecoys,
  totalEvents,
  criticalEvents,
  avgConfidence,
  events,
  decoys,
  go,
  deployDecoy,
}: {
  activeDecoys: number;
  totalEvents: number;
  criticalEvents: number;
  avgConfidence: number;
  events: AttackEvent[];
  decoys: Decoy[];
  go: (page: Page) => void;
  deployDecoy: () => void;
}) {
  return (
    <section className="console-layout">
      <ConsoleHeader
        title="Security console"
        text="Monitor decoys, review attacker evidence, and run a safe local attack simulation."
        action={<button className="solid-button" onClick={() => go("lab")}>Run test attack</button>}
      />
      <div className="metric-grid">
        <Metric icon={Server} label="Online decoys" value={String(activeDecoys)} />
        <Metric icon={Activity} label="Captured events" value={String(totalEvents)} />
        <Metric icon={AlertTriangle} label="Critical" value={String(criticalEvents)} danger />
        <Metric icon={ShieldCheck} label="Confidence" value={`${avgConfidence}%`} />
      </div>
      <div className="dashboard-grid">
        <Panel title="Recent attacker activity">
          <div className="event-stack">
            {events.slice(0, 4).map((event) => (
              <button className="activity-row" key={event.id} onClick={() => go("events")}>
                <SeverityPill severity={event.severity} />
                <div>
                  <strong>{event.technique}</strong>
                  <span>{event.sourceIp} attacked {event.target}</span>
                </div>
                <small>{event.time}</small>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Decoy health">
          <div className="decoy-mini-list">
            {decoys.slice(0, 4).map((decoy) => (
              <div key={decoy.name}>
                <span className={`health-dot ${decoy.status.toLowerCase()}`} />
                <strong>{decoy.name}</strong>
                <small>{decoy.status} / {decoy.events} events</small>
              </div>
            ))}
          </div>
          <button className="outline-button full" onClick={deployDecoy}>
            Add decoy
          </button>
        </Panel>
      </div>
    </section>
  );
}

function DecoysPage({
  decoys,
  deployDecoy,
}: {
  decoys: Decoy[];
  deployDecoy: () => void;
}) {
  return (
    <section className="console-layout">
      <ConsoleHeader
        title="Decoy fleet"
        text="Believable systems that attract attackers while keeping production safe."
        action={<button className="solid-button" onClick={deployDecoy}>Deploy decoy</button>}
      />
      <Panel title="Configured honeypots">
        <div className="table-list">
          {decoys.map((decoy) => (
            <div className="table-row" key={decoy.name}>
              <div>
                <strong>{decoy.name}</strong>
                <span>{decoy.type} / {decoy.zone}</span>
              </div>
              <StatusPill status={decoy.status} />
              <span>{decoy.events.toLocaleString()} events</span>
              <span>{decoy.lastSeen}</span>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function AttackLabPage({
  decoys,
  createAttack,
}: {
  decoys: Decoy[];
  createAttack: (input: {
    sourceIp: string;
    target: string;
    technique: string;
    payload: string;
    severity: Severity;
  }) => void;
}) {
  const [sourceIp, setSourceIp] = useState("203.0.113.77");
  const [target, setTarget] = useState(decoys[0]?.name ?? "SSH Bastion Lure");
  const [technique, setTechnique] = useState(techniques[0]);
  const [payload, setPayload] = useState("root:admin123");
  const [severity, setSeverity] = useState<Severity>("High");

  function submit(event: FormEvent) {
    event.preventDefault();
    createAttack({ sourceIp, target, technique, payload, severity });
  }

  return (
    <section className="lab-layout">
      <div>
        <ConsoleHeader
          title="Controlled attack lab"
          text="Use this safe simulator to prove the honeypot flow. It creates demo evidence inside the frontend only."
        />
        <Panel title="How to test safely">
          <ol className="steps">
            <li>Login or register so the console unlocks.</li>
            <li>Choose a target decoy and attacker behavior below.</li>
            <li>Run the controlled simulation.</li>
            <li>Open Events to inspect source IP, payload, target, severity, and confidence.</li>
          </ol>
        </Panel>
      </div>
      <form className="lab-card" onSubmit={submit}>
        <label>
          Source IP
          <input value={sourceIp} onChange={(event) => setSourceIp(event.target.value)} />
        </label>
        <label>
          Target decoy
          <select value={target} onChange={(event) => setTarget(event.target.value)}>
            {decoys.map((decoy) => (
              <option key={decoy.name}>{decoy.name}</option>
            ))}
          </select>
        </label>
        <label>
          Technique
          <select value={technique} onChange={(event) => setTechnique(event.target.value)}>
            {techniques.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Payload
          <textarea value={payload} onChange={(event) => setPayload(event.target.value)} />
        </label>
        <label>
          Severity
          <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity)}>
            {(["Critical", "High", "Medium", "Low"] as Severity[]).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button className="solid-button large" type="submit">
          <Play size={18} />
          Run controlled test
        </button>
      </form>
    </section>
  );
}

function EventsPage({
  events,
  selectedEvent,
  selectedEventId,
  setSelectedEventId,
  search,
  setSearch,
  triageSelected,
}: {
  events: AttackEvent[];
  selectedEvent?: AttackEvent;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  search: string;
  setSearch: (value: string) => void;
  triageSelected: () => void;
}) {
  return (
    <section className="events-layout">
      <div>
        <ConsoleHeader
          title="Attacker details"
          text="Search captured sessions and inspect exactly what the decoy recorded."
        />
        <div className="search-panel">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search IP, payload, target, technique..."
          />
        </div>
        <div className="event-stack">
          {events.map((event) => (
            <button
              className={event.id === selectedEventId ? "activity-row selected" : "activity-row"}
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
            >
              <SeverityPill severity={event.severity} />
              <div>
                <strong>{event.id} / {event.technique}</strong>
                <span>{event.sourceIp} to {event.target}</span>
              </div>
              <small>{event.status}</small>
            </button>
          ))}
        </div>
      </div>
      <Panel title="Captured evidence">
        {selectedEvent ? (
          <div className="evidence-card">
            <div className="terminal">
              <div>
                <TerminalSquare size={18} />
                Payload
              </div>
              <code>{selectedEvent.payload}</code>
            </div>
            <dl className="detail-grid">
              <div>
                <dt>Event ID</dt>
                <dd>{selectedEvent.id}</dd>
              </div>
              <div>
                <dt>Source IP</dt>
                <dd>{selectedEvent.sourceIp}</dd>
              </div>
              <div>
                <dt>Target</dt>
                <dd>{selectedEvent.target}</dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd>{selectedEvent.confidence}%</dd>
              </div>
              <div>
                <dt>Severity</dt>
                <dd>{selectedEvent.severity}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedEvent.status}</dd>
              </div>
            </dl>
            <button className="solid-button full" onClick={triageSelected}>
              <CheckCircle2 size={18} />
              Mark triaged
            </button>
          </div>
        ) : (
          <p>No event selected.</p>
        )}
      </Panel>
    </section>
  );
}

function ReportPage() {
  const items = [
    "Connect this demo UI to the real Fastify auth and event APIs.",
    "Provision real isolated honeypot containers instead of static decoy records.",
    "Add event pipeline workers, alert rule execution, and webhook retry queues.",
    "Add CI checks for frontend, backend, Prisma schema, and API tests.",
    "Add deployment scripts, environment examples, health checks, and observability.",
  ];

  return (
    <section className="console-layout">
      <ConsoleHeader
        title="Deployment readiness report"
        text="The demo proves the user flow. These are the engineering items needed before calling it production-ready."
      />
      <Panel title="Main flaws to fix">
        <ul className="report-list">
          {items.map((item) => (
            <li key={item}>
              <FileText size={18} />
              {item}
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}

function ConsoleHeader({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="console-header">
      <div>
        <span className="section-label">DeceiveNet demo</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

function StoryCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Server;
  title: string;
  text: string;
}) {
  return (
    <article className="story-card">
      <Icon size={24} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  danger,
}: {
  icon: typeof Server;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <article className={danger ? "metric danger" : "metric"}>
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SeverityPill({ severity }: { severity: Severity }) {
  return <span className={`severity severity-${severity.toLowerCase()}`}>{severity}</span>;
}

function StatusPill({ status }: { status: Decoy["status"] }) {
  return <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>;
}
