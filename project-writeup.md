# team-metrics
### Developer Productivity & Happiness Scorecard
**Version:** 1.0.0 | **Framework:** LinkedIn DPH | **Stack:** React + Recharts

---

## Overview

`team-metrics` is an internal engineering scorecard dashboard built for a new software development team adopting AI tooling at scale. It tracks developer productivity, AI token economics, delivery health, and technical hygiene — structured around the **LinkedIn Developer Productivity & Happiness (DPH) Framework**.

The core thesis: *you can't improve what you don't measure, but measuring the wrong things destroys teams.* This dashboard is deliberately structured so every number traces back to a human-legible Goal and a behavioral Signal before arriving at a Metric.

---

## Why This Framework

LinkedIn's DPH Framework was chosen because it:

1. **Prevents Goodhart's Law traps** — Metrics that become targets cease to be good metrics. The GSM structure forces you to ask "what behavior does this incentivize?" before shipping any number to a dashboard.
2. **Balances quantitative and qualitative signals** — A team with 100% on-time delivery and a happiness score of 2.1/5 is not a healthy team. Both layers are required.
3. **Is audience-aware** — The framework distinguishes between data for team self-improvement vs. data for leadership visibility. These are not the same dashboards.
4. **Scales with team maturity** — Start with 3–4 metrics, add more as instrumentation improves.

---

## Dashboard Structure

### Tab 1: Overview
- **Team Health Radar** — 6-dimension composite view: Delivery, Quality, Tech Health, AI Efficiency, Velocity, Happiness
- **Qualitative Survey Bar Chart** — Pulse survey scores across 5 developer experience dimensions
- **GSM At-a-Glance Table** — Every metric with Goal, Signal, current value, trend, and status

### Tab 2: AI & Tokens
Addresses the central question for AI-native teams: *Is our AI investment paying off, and are we spending wisely?*

- **AI vs. Non-AI PR Defect Rate** — The core quality signal. If AI-assisted PRs have higher defect rates, the team needs training or better prompt discipline, not more tokens.
- **Weekly Token Consumption vs. Budget** — Token spend is real money. This chart surfaces overage early.
- **Developer AI Confidence Survey** — Quantitative metrics tell you *what* happened. This survey tells you *why*. Three questions probing speed, quality judgment, and workflow impact.

### Tab 3: Delivery
- **P1 Priority Delivery Rate** — Are the most important things actually shipping? Tracked per sprint.
- **Delivery Funnel Health** — DORA-inspired: cycle time, build success, deploy frequency, change failure rate, MTTR.
- **Qualitative Delivery Signals** — Priority clarity and perceived autonomy scores.

### Tab 4: Tech Health
- **Tech Update Cadence** — How often are dependencies, frameworks, and patterns being modernized? Below-target cadence is a leading indicator of future incidents.
- **Tech Debt Composition** — A breakdown of debt by category: critical deps, test coverage, deprecated APIs, refactor backlog.
- **Tech Debt Awareness Survey** — Do developers even know where the debt lives? Awareness is a prerequisite to action.

### Tab 5: GSM Table
Full filterable Goals → Signals → Metrics reference table. Filterable by section (AI, Delivery, Tech Health) and by measurement type (Qualitative vs. Quantitative). This is the canonical source of truth for what the team is measuring and why.

---

## Metric Design Decisions

### Why track AI vs. non-AI defects separately?
This is the most important leading indicator for AI-native teams. It answers: "Is our AI usage improving output quality or introducing new failure modes?" If non-AI PRs have fewer defects, that's a training problem. If AI PRs have fewer defects, that's a case for expanding AI adoption.

### Why token budgets?
On Claude Pro/Max plans, tokens are a shared resource with a rolling window. On API plans, tokens are direct cost. Either way, unmanaged token consumption creates two failure modes: (1) hitting rate limits mid-sprint, disrupting developer flow; (2) cost overruns that put AI tooling at risk of being cut. The budget metric keeps this visible before it becomes a crisis.

### Why track tech update cadence?
The mean time between framework/dependency updates is a proxy for future incident risk and onboarding friction. Teams that don't modernize accumulate invisible debt — the kind that shows up as a 3-day incident when a CVE is published against a 2-year-old package.

### Why include qualitative signals at all?
Per the LinkedIn DPH Framework: quantitative metrics measure outputs; qualitative signals measure developer experience. A team can hit all numeric targets while developers are burning out, confused about priorities, or losing confidence in their tools. The survey layer is the early warning system for those conditions.

### What about velocity (story points)?
Deliberately excluded from the primary view. Story point velocity is the most commonly gamed metric in software. Velocity increases when teams inflate estimates — it tells you almost nothing about real throughput. Cycle time and P1 delivery rate are better proxies for the same underlying goal.

---

## File Structure

```
team-metrics/
├── README.md                   ← this file
├── INTEGRATIONS.md             ← checklist for hooking up live data
├── dashboard.jsx               ← main React dashboard component
├── data/
│   └── sample/
│       └── metrics.json        ← sample data shape (replace with live sources)
├── scripts/
│   └── fetch-metrics.sh        ← automation script for data refresh
└── .env.example                ← required environment variables
```

---

## Recommended Rollout Sequence

1. **Week 1:** Deploy with sample data. Run the dashboard in a team standup. Get buy-in on which metrics matter.
2. **Week 2:** Hook up GitHub (PRs, cycle time, build stats). These are the easiest integrations.
3. **Week 3:** Hook up Anthropic Console for token data. Set your first budget threshold.
4. **Week 4:** Launch first pulse survey. Baseline the qualitative scores.
5. **Month 2:** Hook up Jira/Linear for P1 delivery tracking and Dependabot for tech health.
6. **Month 3:** Add SonarQube or CodeClimate for code quality depth. Review all metrics for relevance — drop any that aren't driving decisions.

---

## Important Caveats (per DPH Framework)

- **Do not use this data in performance reviews.** The DPH Framework is explicit: metrics collected for team self-improvement must never be repurposed for individual evaluation. Doing so destroys psychological safety and incentivizes gaming.
- **Trends matter more than snapshots.** A single sprint's P1 delivery rate is noise. Three sprints is a signal.
- **Metrics decay.** A metric that drove great decisions in Month 1 may be irrelevant by Month 6. Review the GSM table quarterly and remove metrics that no longer drive action.
- **Survey fatigue is real.** Keep the pulse survey under 6 questions. Bi-weekly is the maximum sustainable cadence for most teams.

---

## License
Internal use. Framework based on LinkedIn DPH Framework (CC BY 4.0) — https://linkedin.github.io/dph-framework/
