import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  LineChart, Line, ResponsiveContainer, Cell
} from "recharts";

const COLORS = {
  green: "#22c55e", yellow: "#eab308", red: "#ef4444",
  blue: "#3b82f6", purple: "#8b5cf6", teal: "#14b8a6",
  gray: "#6b7280", indigo: "#6366f1", orange: "#f97316"
};

const score = (v, t, dir = "higher") => {
  const r = v / t;
  if (dir === "higher") return r >= 0.9 ? "green" : r >= 0.7 ? "yellow" : "red";
  return r <= 1.1 ? "green" : r <= 1.4 ? "yellow" : "red";
};

const Badge = ({ color, label }) => (
  <span style={{
    background: color === "green" ? "#dcfce7" : color === "yellow" ? "#fef9c3" : "#fee2e2",
    color: color === "green" ? "#166534" : color === "yellow" ? "#854d0e" : "#991b1b",
    border: `1px solid ${color === "green" ? "#86efac" : color === "yellow" ? "#fde047" : "#fca5a5"}`,
    borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700
  }}>{label}</span>
);

const Trend = ({ v }) => (
  <span style={{ color: v > 0 ? COLORS.green : v < 0 ? COLORS.red : COLORS.gray, fontSize: 13 }}>
    {v > 0 ? `▲ ${v}%` : v < 0 ? `▼ ${Math.abs(v)}%` : "— flat"}
  </span>
);

// ── DATA ────────────────────────────────────────────────────────────────
const aiDefectData = [
  { pr: "With AI", defects: 3.2, prs: 148 },
  { pr: "Without AI", defects: 5.8, prs: 94 },
];
const tokenData = [
  { week: "Wk 1", input: 420, output: 185, budget: 700 },
  { week: "Wk 2", input: 510, output: 210, budget: 700 },
  { week: "Wk 3", input: 490, output: 230, budget: 700 },
  { week: "Wk 4", input: 640, output: 290, budget: 700 },
];
const deliveryData = [
  { sprint: "S1", delivered: 3, total: 4 },
  { sprint: "S2", delivered: 4, total: 4 },
  { sprint: "S3", delivered: 2, total: 5 },
  { sprint: "S4", delivered: 5, total: 5 },
  { sprint: "S5", delivered: 4, total: 5 },
];
const techDebtData = [
  { month: "Sep", updates: 2, target: 3 },
  { month: "Oct", updates: 3, target: 3 },
  { month: "Nov", updates: 1, target: 3 },
  { month: "Dec", updates: 3, target: 3 },
  { month: "Jan", updates: 4, target: 3 },
  { month: "Feb", updates: 2, target: 3 },
];
const radarData = [
  { dim: "Delivery", score: 78 },
  { dim: "Quality", score: 85 },
  { dim: "Tech Health", score: 62 },
  { dim: "AI Efficiency", score: 71 },
  { dim: "Velocity", score: 80 },
  { dim: "Happiness", score: 74 },
];
const qualData = [
  { area: "AI Assistance Confidence", score: 4.1, max: 5 },
  { area: "Code Review Quality", score: 3.7, max: 5 },
  { area: "Onboarding Experience", score: 4.3, max: 5 },
  { area: "Tech Debt Awareness", score: 3.2, max: 5 },
  { area: "Priority Clarity", score: 3.9, max: 5 },
];

const metrics = [
  { id: "ai_defects", goal: "Quality", signal: "AI-assisted PRs produce fewer defects", metric: "Defect rate per PR (AI vs. Non-AI)", value: "3.2 vs 5.8", target: "AI ≤4.0", trend: -12, color: "green", type: "Quantitative", section: "AI & Token Use" },
  { id: "token_budget", goal: "Efficiency", signal: "Teams operate within AI token budgets", metric: "Weekly tokens consumed vs. budget (K)", value: "930K / 700K", target: "≤700K/wk", trend: 18, color: "red", type: "Quantitative", section: "AI & Token Use" },
  { id: "ai_pr_ratio", goal: "Adoption", signal: "Growing AI-assisted PR share", metric: "% of PRs using AI assistance", value: "61%", target: "≥60%", trend: 8, color: "green", type: "Quantitative", section: "AI & Token Use" },
  { id: "priority_delivery", goal: "Impact", signal: "Top product priorities ship on time", metric: "P1 features delivered per sprint", value: "18/23", target: "≥80%", trend: 5, color: "green", type: "Quantitative", section: "Delivery" },
  { id: "cycle_time", goal: "Flow", signal: "PRs move quickly from open to merge", metric: "Median PR cycle time (hours)", value: "18h", target: "≤24h", trend: -9, color: "green", type: "Quantitative", section: "Delivery" },
  { id: "tech_updates", goal: "Tech Health", signal: "Dependencies & frameworks stay current", metric: "Tech updates / modernizations per month", value: "2.5 avg", target: "≥3/mo", trend: -15, color: "yellow", type: "Quantitative", section: "Tech Health" },
  { id: "debt_ratio", goal: "Tech Health", signal: "Tech debt doesn't accumulate uncontrolled", metric: "% sprints with debt reduction items shipped", value: "60%", target: "≥70%", trend: -5, color: "yellow", type: "Quantitative", section: "Tech Health" },
  { id: "ai_confidence", goal: "Happiness", signal: "Devs feel confident using AI tools", metric: "Survey: AI assistance confidence (1–5)", value: "4.1 / 5", target: "≥4.0", trend: 3, color: "green", type: "Qualitative", section: "AI & Token Use" },
  { id: "priority_clarity", goal: "Happiness", signal: "Team understands what matters most", metric: "Survey: Priority clarity score (1–5)", value: "3.9 / 5", target: "≥4.0", trend: 2, color: "yellow", type: "Qualitative", section: "Delivery" },
  { id: "tech_awareness", goal: "Tech Health", signal: "Devs know where tech debt lives", metric: "Survey: Tech debt awareness (1–5)", value: "3.2 / 5", target: "≥3.5", trend: -4, color: "red", type: "Qualitative", section: "Tech Health" },
];

const sections = ["All", "AI & Token Use", "Delivery", "Tech Health"];

// ── INTEGRATION CHECKLIST DATA ───────────────────────────────────────────
const checklistGroups = [
  {
    id: "ai", title: "🤖 AI & Token Use",
    items: [
      { id: "a1", group: "Anthropic Console", text: "Generate an Admin API Key (sk-ant-admin...) in the Anthropic Console" },
      { id: "a2", group: "Anthropic Console", text: "Store key as ANTHROPIC_ADMIN_API_KEY environment variable" },
      { id: "a3", group: "Anthropic Console", text: "Call GET /v1/organizations/usage_report/messages with bucket_width=1d", code: `curl "https://api.anthropic.com/v1/organizations/usage_report/messages?starting_at=2026-02-13T00:00:00Z&ending_at=2026-02-20T00:00:00Z&bucket_width=1d" \\
  --header "anthropic-version: 2023-06-01" \\
  --header "x-api-key: $ANTHROPIC_ADMIN_API_KEY"` },
      { id: "a4", group: "Anthropic Console", text: "Map input_tokens + output_tokens → weekly total → compare to budget" },
      { id: "a5", group: "Anthropic Console", text: "Set up weekly cron/GitHub Action and wire tokenData array in dashboard" },
      { id: "a6", group: "GitHub PR Defects", text: "Add PR label convention: ai-assisted (applied manually or via GitHub Action)" },
      { id: "a7", group: "GitHub PR Defects", text: "Track bugs linked to PRs using a defect or regression label on issues" },
      { id: "a8", group: "GitHub PR Defects", text: "Query AI PRs: GET /repos/{owner}/{repo}/pulls?state=closed&labels=ai-assisted" },
      { id: "a9", group: "GitHub PR Defects", text: "Calculate defect_count / pr_count for each group and wire aiDefectData" },
      { id: "a10", group: "Per-Developer Tokens", text: "Create per-developer API keys under separate workspaces in Anthropic Console" },
      { id: "a11", group: "Per-Developer Tokens", text: "Use group_by[]=api_key in usage report endpoint for per-key breakdown" },
      { id: "a12", group: "Per-Developer Tokens", text: "Map API keys → developer names in a config file (secrets only, not repo)" },
    ]
  },
  {
    id: "delivery", title: "🚀 Delivery",
    items: [
      { id: "d1", group: "Jira", text: "Authenticate with JIRA_API_TOKEN, JIRA_BASE_URL, JIRA_EMAIL" },
      { id: "d2", group: "Jira", text: "Query planned P1s and closed P1s per sprint", code: "project = MYPROJECT AND priority = Highest AND sprint in closedSprints() ORDER BY sprint ASC" },
      { id: "d3", group: "Jira", text: "Calculate delivered / planned per sprint and wire deliveryData" },
      { id: "d4", group: "Linear (alternative)", text: "Use LINEAR_API_KEY to query cycles, filter by priority: URGENT and state.type: completed" },
      { id: "d5", group: "GitHub Actions", text: "GET /repos/{owner}/{repo}/pulls?state=closed → compute merged_at - created_at per PR" },
      { id: "d6", group: "GitHub Actions", text: "GET /repos/{owner}/{repo}/actions/runs → count success vs. failure → build success rate" },
      { id: "d7", group: "GitHub Actions", text: "GET /repos/{owner}/{repo}/deployments → count deploys per time window" },
      { id: "d8", group: "GitHub Actions", text: "Wire deliveryFunnelData in dashboard" },
    ]
  },
  {
    id: "tech", title: "🔧 Tech Health",
    items: [
      { id: "t1", group: "Dependabot / Renovate", text: "Enable Dependabot on repos: add .github/dependabot.yml" },
      { id: "t2", group: "Dependabot / Renovate", text: "GET /repos/{owner}/{repo}/dependabot/alerts?state=open → count critical alerts" },
      { id: "t3", group: "Dependabot / Renovate", text: "Count merged PRs with label dependencies per month → wire techDebtData" },
      { id: "t4", group: "Dependabot / Renovate", text: "Set alert threshold: if open critical alerts > X, flag At Risk in dashboard" },
      { id: "t5", group: "SonarQube / CodeClimate", text: "Set up SonarQube Cloud (free for public repos) or self-hosted" },
      { id: "t6", group: "SonarQube / CodeClimate", text: "Call GET /api/measures/component?metricKeys=coverage,sqale_index,code_smells" },
      { id: "t7", group: "SonarQube / CodeClimate", text: "Map coverage → Test Coverage Gap, code_smells → Flagged for Refactor" },
      { id: "t8", group: "SonarQube / CodeClimate", text: "Wire techDebtComposition data in dashboard" },
    ]
  },
  {
    id: "survey", title: "💬 Developer Survey",
    items: [
      { id: "s1", group: "Setup", text: "Create a recurring bi-weekly survey (Google Forms, Typeform, or Slack workflow)" },
      { id: "s2", group: "Setup", text: "Add 6 standard questions: AI speed, correction judgment, token limits, priority clarity, tech debt awareness, safety to raise concerns" },
      { id: "s3", group: "Automation", text: "Export responses to a Google Sheet or CSV" },
      { id: "s4", group: "Automation", text: "Wire Google Sheets API or Typeform webhook → data store" },
      { id: "s5", group: "Automation", text: "Calculate mean per question per survey cycle and wire qualData" },
      { id: "s6", group: "Automation", text: "Put survey cadence on the team calendar" },
    ]
  },
  {
    id: "infra", title: "🗄️ Data Store & Automation",
    items: [
      { id: "i1", group: "Data Backend", text: "Simple: GitHub-hosted JSON files updated by Actions (good for small teams)" },
      { id: "i2", group: "Data Backend", text: "Mid-tier: Supabase (Postgres, free tier, REST API)" },
      { id: "i3", group: "Data Backend", text: "Full: PostHog, Grafana + InfluxDB, or Datadog for time-series" },
      { id: "i4", group: "Secrets", text: "Store all API keys in CI secrets or .env — never commit to repo", code: `ANTHROPIC_ADMIN_API_KEY=sk-ant-admin...
GITHUB_TOKEN=ghp_...
JIRA_API_TOKEN=...
JIRA_BASE_URL=https://yourorg.atlassian.net
JIRA_EMAIL=you@yourorg.com
LINEAR_API_KEY=lin_api_...
SONARQUBE_TOKEN=...
GOOGLE_SHEETS_API_KEY=...` },
      { id: "i5", group: "Done When", text: "No hardcoded sample data remains in App.jsx" },
      { id: "i6", group: "Done When", text: "A GitHub Action or cron job runs daily and updates the data layer" },
      { id: "i7", group: "Done When", text: "Token budget threshold is agreed upon and documented" },
    ]
  }
];

const refreshCadence = [
  { metric: "Token consumption", refresh: "Daily (cron)" },
  { metric: "PR defect rate", refresh: "On PR merge (webhook)" },
  { metric: "P1 delivery rate", refresh: "End of sprint" },
  { metric: "Cycle time / build", refresh: "Daily" },
  { metric: "Dependabot alerts", refresh: "Daily" },
  { metric: "Tech debt (Sonar)", refresh: "On main branch push" },
  { metric: "Survey scores", refresh: "Bi-weekly (manual trigger)" },
];

// ── WRITEUP DATA ─────────────────────────────────────────────────────────
const whyFramework = [
  { icon: "🎯", title: "Prevents Goodhart's Law Traps", text: "Metrics that become targets cease to be good metrics. The GSM structure forces you to ask 'what behavior does this incentivize?' before shipping any number to a dashboard." },
  { icon: "⚖️", title: "Balances Quant & Qual", text: "A team with 100% on-time delivery and a happiness score of 2.1/5 is not a healthy team. Both layers are required." },
  { icon: "👥", title: "Audience-Aware", text: "The framework distinguishes between data for team self-improvement vs. leadership visibility. These are not the same dashboards." },
  { icon: "📈", title: "Scales with Maturity", text: "Start with 3–4 metrics, add more as instrumentation improves. Don't instrument everything on day one." },
];

const designDecisions = [
  { q: "Why track AI vs. non-AI defects separately?", a: "This is the most important leading indicator for AI-native teams. It answers: 'Is our AI usage improving output quality or introducing new failure modes?' If non-AI PRs have fewer defects, that's a training problem. If AI PRs have fewer defects, that's a case for expanding AI adoption." },
  { q: "Why token budgets?", a: "On Claude Pro/Max plans, tokens are a shared resource. On API plans, tokens are direct cost. Either way, unmanaged token consumption creates two failure modes: (1) hitting rate limits mid-sprint, disrupting developer flow; (2) cost overruns that put AI tooling at risk of being cut. The budget metric keeps this visible before it becomes a crisis." },
  { q: "Why track tech update cadence?", a: "The mean time between framework/dependency updates is a proxy for future incident risk and onboarding friction. Teams that don't modernize accumulate invisible debt — the kind that shows up as a 3-day incident when a CVE is published against a 2-year-old package." },
  { q: "Why include qualitative signals at all?", a: "Quantitative metrics measure outputs; qualitative signals measure developer experience. A team can hit all numeric targets while developers are burning out, confused about priorities, or losing confidence in their tools. The survey layer is the early warning system for those conditions." },
  { q: "What about velocity (story points)?", a: "Deliberately excluded. Story point velocity is the most commonly gamed metric in software. Velocity increases when teams inflate estimates — it tells you almost nothing about real throughput. Cycle time and P1 delivery rate are better proxies for the same underlying goal." },
];

const initialRollout = [
  { week: "Week 1", title: "Deploy with sample data", desc: "Run the dashboard in a standup. Get buy-in on which metrics matter.", done: true },
  { week: "Week 2", title: "Hook up GitHub", desc: "PRs, cycle time, build stats. These are the easiest integrations.", done: false },
  { week: "Week 3", title: "Hook up Anthropic Console", desc: "Token data. Set your first budget threshold.", done: false },
  { week: "Week 4", title: "Launch first pulse survey", desc: "Baseline the qualitative scores.", done: false },
  { week: "Month 2", title: "Jira/Linear + Dependabot", desc: "P1 delivery tracking and tech health.", done: false },
  { week: "Month 3", title: "SonarQube + Review", desc: "Code quality depth. Review all metrics — drop any not driving decisions.", done: false },
];

const caveats = [
  { icon: "🚫", color: "red",    title: "Do not use in performance reviews", text: "The DPH Framework is explicit: metrics collected for team self-improvement must never be repurposed for individual evaluation. Doing so destroys psychological safety and incentivizes gaming." },
  { icon: "📈", color: "blue",   title: "Trends matter more than snapshots", text: "A single sprint's P1 delivery rate is noise. Three sprints is a signal. Don't over-react to individual data points." },
  { icon: "⏳", color: "yellow", title: "Metrics decay", text: "A metric that drove great decisions in Month 1 may be irrelevant by Month 6. Review the GSM table quarterly and remove metrics that no longer drive action." },
  { icon: "😴", color: "purple", title: "Survey fatigue is real", text: "Keep the pulse survey under 6 questions. Bi-weekly is the maximum sustainable cadence for most teams." },
];

// ── COMPONENTS ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 16 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, ...style }}>
    {children}
  </div>
);

const GSMRow = ({ m }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr auto auto auto", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.indigo, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.goal}</span>
    <span style={{ fontSize: 13, color: "#475569" }}>{m.signal}</span>
    <span style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{m.metric}</span>
    <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", textAlign: "right", minWidth: 60 }}>{m.value}</span>
    <Trend v={m.trend} />
    <Badge color={m.color} label={m.color === "green" ? "On Track" : m.color === "yellow" ? "Watch" : "At Risk"} />
  </div>
);

// ── MAIN ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("All");
  const [qTab, setQTab] = useState("quant");
  const [checks, setChecks] = useState(() => {
    const init = {};
    checklistGroups.forEach(s => s.items.forEach(i => { init[i.id] = false; }));
    return init;
  });
  const [expandedQ, setExpandedQ] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [rollout, setRollout] = useState(initialRollout);

  const toggleCheck = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleRollout = (i) => setRollout(prev => prev.map((s, idx) => idx === i ? { ...s, done: !s.done } : s));

  const totalItems = checklistGroups.reduce((acc, g) => acc + g.items.length, 0);
  const checkedItems = Object.values(checks).filter(Boolean).length;
  const overallPct = Math.round((checkedItems / totalItems) * 100);

  const filtered = filter === "All" ? metrics : metrics.filter(m => m.section === filter);

  const tabStyle = (t) => ({
    padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
    background: tab === t ? "#6366f1" : "#f1f5f9",
    color: tab === t ? "#fff" : "#475569",
    border: "none", transition: "all 0.15s"
  });
  const filterStyle = (f) => ({
    padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13,
    background: filter === f ? "#e0e7ff" : "#f8fafc",
    color: filter === f ? "#4338ca" : "#64748b",
    border: `1px solid ${filter === f ? "#c7d2fe" : "#e2e8f0"}`, fontWeight: filter === f ? 700 : 400
  });

  const tabLabels = {
    overview: "📊 Overview",
    ai_tokens: "🤖 AI & Tokens",
    delivery: "🚀 Delivery",
    tech_health: "🔧 Tech Health",
    gsm_table: "📋 GSM Table",
    integrations: `🔌 Integrations${overallPct > 0 ? ` (${overallPct}%)` : ""}`,
    about: "📖 About",
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "24px 28px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>Developer Productivity & Happiness</h1>
        </div>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Scorecard · New Engineering Team · Structured per the <strong>LinkedIn DPH Framework</strong> (Goals → Signals → Metrics)
        </p>
      </div>

      {/* Health Banners */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "AI Quality Lift", val: "44% fewer defects", sub: "AI vs. non-AI PRs", c: "green" },
          { label: "Token Budget", val: "133% of budget", sub: "↑ 18% WoW — At Risk", c: "red" },
          { label: "P1 Delivery Rate", val: "78%", sub: "Target ≥80% — Watch", c: "yellow" },
          { label: "Tech Update Cadence", val: "2.5/mo", sub: "Target ≥3 — Watch", c: "yellow" },
        ].map(b => (
          <Card key={b.label} style={{ borderTop: `4px solid ${COLORS[b.c]}` }}>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{b.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "4px 0 2px" }}>{b.val}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{b.sub}</div>
          </Card>
        ))}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.keys(tabLabels).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{tabLabels[t]}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <SectionHeader title="Team Health Radar" sub="Composite score across all 6 DPH dimensions (0–100)" />
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12, fill: "#475569" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="Qual vs. Quant: Developer Survey" sub="Pulse survey scores (out of 5) — qualitative signal layer" />
            <div style={{ marginTop: 8 }}>
              {qualData.map(q => {
                const pct = (q.score / q.max) * 100;
                const c = pct >= 80 ? COLORS.green : pct >= 70 ? COLORS.yellow : COLORS.red;
                return (
                  <div key={q.area} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "#334155" }}>{q.area}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{q.score} / {q.max}</span>
                    </div>
                    <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
                      <div style={{ width: `${pct}%`, background: c, height: 8, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionHeader title="Metric Status At-a-Glance" sub="All metrics by Goal → Signal → Status" />
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "4px 16px", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Goal</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Signal</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Value</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Status</span>
              {metrics.map(m => (
                <>
                  <span key={m.id+"g"} style={{ fontSize: 12, fontWeight: 600, color: COLORS.indigo }}>{m.goal}</span>
                  <span key={m.id+"s"} style={{ fontSize: 13, color: "#475569", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>{m.signal}</span>
                  <span key={m.id+"v"} style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}>{m.value}</span>
                  <span key={m.id+"b"} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
                    <Badge color={m.color} label={m.color === "green" ? "✓" : m.color === "yellow" ? "!" : "✗"} />
                  </span>
                </>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── AI & TOKENS ── */}
      {tab === "ai_tokens" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <SectionHeader title="Defect Rate: AI vs. Non-AI PRs" sub="Goal: AI-assisted PRs produce fewer defects (Quality)" />
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#166534" }}>
              🟢 <strong>Signal confirmed:</strong> AI PRs show 44% fewer defects than non-AI PRs this quarter.
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={aiDefectData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="pr" tick={{ fontSize: 13 }} />
                <YAxis label={{ value: "Defects / PR", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="defects" radius={[6,6,0,0]}>
                  <Cell fill={COLORS.teal} />
                  <Cell fill={COLORS.orange} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {aiDefectData.map(d => (
                <div key={d.pr} style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{d.pr}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{d.prs} PRs</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{d.defects} defects/PR</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Weekly Token Consumption" sub="Goal: Operate within AI token budgets (Efficiency)" />
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#991b1b" }}>
              🔴 <strong>At Risk:</strong> Week 4 consumed 930K tokens — 33% over the 700K weekly budget.
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: "Tokens (K)", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="input" name="Input" stackId="a" fill={COLORS.blue} />
                <Bar dataKey="output" name="Output" stackId="a" fill={COLORS.purple} radius={[4,4,0,0]} />
                <Line data={tokenData} dataKey="budget" name="Budget" stroke={COLORS.red} strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionHeader title="Qualitative: Developer AI Confidence" sub="Signal: Devs feel productive and confident using AI tools" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { q: "\"Using AI suggestions, I can complete code faster\"", agree: 78, neutral: 14, disagree: 8 },
                { q: "\"I can tell when AI output needs correction\"", agree: 65, neutral: 22, disagree: 13 },
                { q: "\"Token limits have not impacted my workflow\"", agree: 41, neutral: 25, disagree: 34 },
              ].map(s => (
                <div key={s.q} style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                  <p style={{ fontSize: 13, color: "#334155", fontStyle: "italic", marginTop: 0 }}>{s.q}</p>
                  {[["Agree", s.agree, COLORS.green], ["Neutral", s.neutral, COLORS.yellow], ["Disagree", s.disagree, COLORS.red]].map(([l, v, c]) => (
                    <div key={l} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#64748b" }}>{l}</span><span style={{ fontWeight: 700, color: c }}>{v}%</span>
                      </div>
                      <div style={{ background: "#e2e8f0", borderRadius: 99, height: 6 }}>
                        <div style={{ width: `${v}%`, background: c, height: 6, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── DELIVERY ── */}
      {tab === "delivery" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <SectionHeader title="P1 Priority Delivery per Sprint" sub="Goal: Top product priorities ship on time (Impact)" />
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#1e40af" }}>
              🔵 <strong>Target 80%:</strong> Team is averaging 78% on P1 delivery — one missed item per sprint on average.
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivered" name="Delivered" fill={COLORS.blue} radius={[4,4,0,0]} />
                <Bar dataKey="total" name="Planned" fill="#e2e8f0" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="Delivery Funnel Health" sub="Quantitative signals across the value stream" />
            {[
              { label: "Median PR Cycle Time", val: "18h", target: "≤24h", pct: 75, c: "green" },
              { label: "Build Success Rate", val: "94%", target: "≥95%", pct: 94, c: "yellow" },
              { label: "Deployment Frequency", val: "4.2/wk", target: "≥4/wk", pct: 100, c: "green" },
              { label: "Change Failure Rate", val: "6%", target: "≤5%", pct: 60, c: "yellow" },
              { label: "MTTR (Incidents)", val: "42min", target: "≤45min", pct: 90, c: "green" },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#334155" }}>{r.label}</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{r.val}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>tgt {r.target}</span>
                  </div>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
                  <div style={{ width: `${Math.min(r.pct,100)}%`, background: COLORS[r.c], height: 8, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionHeader title="Qualitative: Delivery & Priority Signals" sub="Signal: Team has clarity on what matters and can deliver it" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginTop: 0 }}>🟡 Priority Clarity Score — 3.9/5 (Watch)</h3>
                <p style={{ fontSize: 13, color: "#64748b" }}>Developer survey asking: "I understand which work matters most this sprint." Below the 4.0 target — suggesting backlog grooming or roadmap communication gaps.</p>
                <div style={{ background: "#fef9c3", borderRadius: 8, padding: 12, fontSize: 13, color: "#854d0e" }}>
                  <strong>Recommended action:</strong> Add a 5-min "Top 3 This Sprint" standup segment. Re-survey in 4 weeks.
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginTop: 0 }}>🟢 Perceived Autonomy Score — 4.1/5 (On Track)</h3>
                <p style={{ fontSize: 13, color: "#64748b" }}>Developers report they can make implementation decisions without constant approval cycles — a leading indicator of sustainable velocity.</p>
                <div style={{ background: "#dcfce7", borderRadius: 8, padding: 12, fontSize: 13, color: "#166534" }}>
                  <strong>Insight:</strong> Pair this with cycle time metrics. High autonomy + fast cycle time = healthy delivery culture.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TECH HEALTH ── */}
      {tab === "tech_health" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <SectionHeader title="Tech Updates & Modernizations per Month" sub="Goal: Dependencies & frameworks stay current (Tech Health)" />
            <div style={{ background: "#fefce8", border: "1px solid #fef08a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#854d0e" }}>
              🟡 <strong>Watch:</strong> 6-month avg is 2.5 updates/mo vs. target of 3. Nov and Feb were below target.
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={techDebtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="updates" name="Actual Updates" stroke={COLORS.indigo} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke={COLORS.red} strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="Tech Debt Composition" sub="Quantitative breakdown of debt categories" />
            {[
              { label: "Outdated Dependencies (critical)", val: 8, max: 20, c: "red" },
              { label: "Outdated Dependencies (minor)", val: 23, max: 60, c: "yellow" },
              { label: "Test Coverage Gap (<80%)", val: 14, max: 40, c: "yellow" },
              { label: "Deprecated API Usages", val: 5, max: 20, c: "orange" },
              { label: "Flagged for Refactor (tickets)", val: 31, max: 80, c: "gray" },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: "#334155" }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS[r.c] }}>{r.val}</span>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 99, height: 7 }}>
                  <div style={{ width: `${(r.val / r.max) * 100}%`, background: COLORS[r.c], height: 7, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <SectionHeader title="Qualitative: Tech Health Awareness" sub="Signal: Devs understand where debt lives and why it matters" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { score: "3.2/5", label: "Tech Debt Awareness", color: "red", note: "At Risk — developers don't know which areas have the most debt. Create a visible debt dashboard or wall chart." },
                { score: "3.6/5", label: "Confidence to Modernize", color: "yellow", note: "Watch — devs want to modernize but cite unclear scope and fear of breaking things." },
                { score: "4.0/5", label: "Safety to Raise Concerns", color: "green", note: "On Track — team feels safe flagging tech debt without judgment. This is a cultural asset to protect." },
              ].map(s => (
                <div key={s.label} style={{ background: "#f8fafc", borderRadius: 10, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: COLORS[s.color] }}>{s.score}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{s.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── GSM TABLE ── */}
      {tab === "gsm_table" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <SectionHeader title="Goals → Signals → Metrics (GSM) Table" sub="Every metric is grounded in a Goal and a measurable Signal — per LinkedIn DPH Framework" />
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {sections.map(f => <button key={f} style={filterStyle(f)} onClick={() => setFilter(f)}>{f}</button>)}
              <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button onClick={() => setQTab("quant")} style={{ ...filterStyle("q"), background: qTab === "quant" ? "#e0e7ff" : "#f8fafc", color: qTab === "quant" ? "#4338ca" : "#64748b", border: "1px solid #e2e8f0" }}>📊 Quantitative</button>
                <button onClick={() => setQTab("qual")} style={{ ...filterStyle("ql"), background: qTab === "qual" ? "#e0e7ff" : "#f8fafc", color: qTab === "qual" ? "#4338ca" : "#64748b", border: "1px solid #e2e8f0" }}>💬 Qualitative</button>
                <button onClick={() => setQTab("all")} style={{ ...filterStyle("al"), background: qTab === "all" ? "#e0e7ff" : "#f8fafc", color: qTab === "all" ? "#4338ca" : "#64748b", border: "1px solid #e2e8f0" }}>All</button>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1.5fr 80px 70px 60px 80px", gap: "4px 12px", alignItems: "center", background: "#f8fafc", padding: "8px 12px", borderRadius: 8, marginBottom: 8 }}>
              {["Goal", "Signal", "Metric", "Value", "Trend", "Type", "Status"].map(h =>
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{h}</span>
              )}
            </div>
            {filtered
              .filter(m => qTab === "all" || (qTab === "quant" && m.type === "Quantitative") || (qTab === "qual" && m.type === "Qualitative"))
              .map(m => (
                <div key={m.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1.5fr 80px 70px 60px 80px", gap: "4px 12px", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.indigo }}>{m.goal}</span>
                  <span style={{ fontSize: 13, color: "#475569" }}>{m.signal}</span>
                  <span style={{ fontSize: 13, color: "#334155" }}>{m.metric}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{m.value}</span>
                  <Trend v={m.trend} />
                  <span style={{ fontSize: 11, background: m.type === "Qualitative" ? "#f0f9ff" : "#f5f3ff", color: m.type === "Qualitative" ? "#0369a1" : "#6d28d9", border: `1px solid ${m.type === "Qualitative" ? "#bae6fd" : "#ddd6fe"}`, borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>{m.type === "Qualitative" ? "Qual" : "Quant"}</span>
                  <Badge color={m.color} label={m.color === "green" ? "On Track" : m.color === "yellow" ? "Watch" : "At Risk"} />
                </div>
              ))}
          </Card>

          <Card>
            <SectionHeader title="Framework Notes: Qual vs. Quant Balance" sub="Per LinkedIn DPH — neither alone is sufficient" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#f5f3ff", borderRadius: 10, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#5b21b6", margin: "0 0 8px" }}>📊 Quantitative Metrics</h3>
                <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>Objective, repeatable, comparable over time. Risk: they can be gamed or miss context. Always ask <em>"what behavior does this incentivize?"</em></p>
                <ul style={{ fontSize: 13, color: "#475569", paddingLeft: 18, marginBottom: 0 }}>
                  <li>PR defect rates (AI vs. non-AI)</li>
                  <li>Token consumption vs. budget</li>
                  <li>P1 features delivered per sprint</li>
                  <li>Tech updates per month</li>
                  <li>Cycle time, MTTR, deploy frequency</li>
                </ul>
              </div>
              <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0369a1", margin: "0 0 8px" }}>💬 Qualitative Signals</h3>
                <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>Capture developer experience, confidence, and perception. Risk: subjective, needs consistent framing. Complement numbers with <em>"why."</em></p>
                <ul style={{ fontSize: 13, color: "#475569", paddingLeft: 18, marginBottom: 0 }}>
                  <li>AI assistance confidence (survey)</li>
                  <li>Priority clarity (survey)</li>
                  <li>Tech debt awareness (survey)</li>
                  <li>Safety to raise concerns</li>
                  <li>Onboarding experience</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── INTEGRATIONS ── */}
      {tab === "integrations" && (
        <div>
          {/* Overall progress */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>Integration Checklist</h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Replace all sample data with live sources. Check off items as you complete them.</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: overallPct === 100 ? COLORS.green : overallPct > 50 ? COLORS.blue : "#0f172a" }}>{overallPct}%</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{checkedItems} / {totalItems} items done</div>
              </div>
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: 99, height: 10 }}>
              <div style={{ width: `${overallPct}%`, background: overallPct === 100 ? COLORS.green : COLORS.indigo, height: 10, borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>

          {/* Per-section checklists */}
          {checklistGroups.map(group => {
            const done = group.items.filter(i => checks[i.id]).length;
            const pct = Math.round((done / group.items.length) * 100);
            const byGroup = group.items.reduce((acc, item) => {
              if (!acc[item.group]) acc[item.group] = [];
              acc[item.group].push(item);
              return acc;
            }, {});
            return (
              <div key={group.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>{group.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: "#f1f5f9", borderRadius: 99, height: 6, width: 100 }}>
                      <div style={{ width: `${pct}%`, background: pct === 100 ? COLORS.green : COLORS.indigo, height: 6, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#64748b", minWidth: 40 }}>{done}/{group.items.length}</span>
                  </div>
                </div>
                {Object.entries(byGroup).map(([groupName, items]) => (
                  <div key={groupName} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{groupName}</div>
                    {items.map(item => (
                      <div key={item.id}>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 10px", borderRadius: 6, cursor: "pointer", background: checks[item.id] ? "#f0fdf4" : "transparent", marginBottom: 2 }}>
                          <input
                            type="checkbox"
                            checked={checks[item.id]}
                            onChange={() => toggleCheck(item.id)}
                            style={{ marginTop: 2, accentColor: COLORS.indigo, flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 13, color: checks[item.id] ? "#94a3b8" : "#334155", textDecoration: checks[item.id] ? "line-through" : "none", flex: 1 }}>
                            {item.text}
                          </span>
                          {item.code && (
                            <button
                              onClick={e => { e.preventDefault(); setExpandedCode(expandedCode === item.id ? null : item.id); }}
                              style={{ fontSize: 11, color: COLORS.indigo, background: "#e0e7ff", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", flexShrink: 0 }}
                            >
                              {expandedCode === item.id ? "▲ hide" : "▼ code"}
                            </button>
                          )}
                        </label>
                        {item.code && expandedCode === item.id && (
                          <pre style={{ background: "#1e293b", color: "#e2e8f0", borderRadius: 8, padding: "12px 16px", fontSize: 12, margin: "4px 0 8px 32px", overflowX: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {item.code}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Refresh cadence table */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>Refresh Cadence</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px" }}>How often each metric should be pulled from its source.</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>Metric</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>Refresh</th>
                </tr>
              </thead>
              <tbody>
                {refreshCadence.map((r, i) => (
                  <tr key={r.metric} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                    <td style={{ padding: "9px 12px", color: "#334155", borderBottom: "1px solid #f1f5f9" }}>{r.metric}</td>
                    <td style={{ padding: "9px 12px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ background: "#e0e7ff", color: "#4338ca", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{r.refresh}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ABOUT ── */}
      {tab === "about" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Why this framework */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, gridColumn: "1 / -1" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>Why the LinkedIn DPH Framework?</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>The core thesis: <em>you can't improve what you don't measure, but measuring the wrong things destroys teams.</em></p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {whyFramework.map(w => (
                <div key={w.title} style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{w.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{w.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rollout sequence — interactive timeline */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>Recommended Rollout</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>Click steps to mark them complete.</p>
            <div style={{ position: "relative", paddingLeft: 28 }}>
              <div style={{ position: "absolute", left: 9, top: 0, bottom: 0, width: 2, background: "#e2e8f0" }} />
              {rollout.map((step, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 20, cursor: "pointer" }} onClick={() => toggleRollout(i)}>
                  <div style={{
                    position: "absolute", left: -28, width: 18, height: 18, borderRadius: "50%",
                    background: step.done ? COLORS.green : "#fff",
                    border: `2px solid ${step.done ? COLORS.green : "#cbd5e1"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#fff", top: 2, transition: "all 0.2s"
                  }}>
                    {step.done ? "✓" : ""}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.done ? COLORS.green : COLORS.indigo, textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.week}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: step.done ? "#94a3b8" : "#1e293b", textDecoration: step.done ? "line-through" : "none" }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Design decisions accordion */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>Metric Design Decisions</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px" }}>Why each measurement was chosen — and what was deliberately excluded.</p>
            {designDecisions.map((d, i) => (
              <div key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <button
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{d.q}</span>
                  <span style={{ color: COLORS.indigo, fontSize: 14, flexShrink: 0, marginLeft: 8 }}>{expandedQ === i ? "▲" : "▼"}</span>
                </button>
                {expandedQ === i && (
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, paddingBottom: 14, paddingRight: 8 }}>{d.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* Caveats */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, gridColumn: "1 / -1" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>Important Caveats</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>Per the DPH Framework — these aren't optional guidelines, they're load-bearing constraints.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {caveats.map(c => {
                const bg      = c.color === "red" ? "#fef2f2" : c.color === "blue" ? "#eff6ff" : c.color === "yellow" ? "#fefce8" : "#f5f3ff";
                const border  = c.color === "red" ? "#fecaca" : c.color === "blue" ? "#bfdbfe" : c.color === "yellow" ? "#fef08a" : "#ddd6fe";
                const txtClr  = c.color === "red" ? "#991b1b" : c.color === "blue" ? "#1e40af" : c.color === "yellow" ? "#854d0e" : "#5b21b6";
                return (
                  <div key={c.title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: txtClr, marginBottom: 6 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{c.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      <div style={{ marginTop: 24, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
        Structured per the <a href="https://linkedin.github.io/dph-framework/" style={{ color: "#6366f1" }} target="_blank">LinkedIn Developer Productivity & Happiness Framework</a> · Data is sample/illustrative · Update with your live sources
      </div>
    </div>
  );
}