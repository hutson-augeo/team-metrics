# team-metrics
Developer Productivity & Happiness Scorecard — LinkedIn DPH Framework

## Quick Start
1. Copy `.env.example` to `.env` and fill in your API keys
2. Run `npm install` then `npm run dev`
3. See [integration-checklist.md](./integration-checklist.md) to replace sample data with live sources

## Stack
- React 18 + Vite
- Recharts for visualizations
- Anthropic Console API (tokens)
- GitHub REST API (PRs, cycle time, builds)
- Jira / Linear API (P1 delivery)

## Docs
- [Project Writeup](./project-writeup.md)
- [Integration Checklist](./integration-checklist.md)
- [LinkedIn DPH Framework](https://linkedin.github.io/dph-framework/)

---

## Dashboard Views

| Tab | What it shows |
|---|---|
| 📊 Overview | Team Health Radar · Developer Survey · GSM At-a-Glance |
| 🤖 AI & Tokens | AI vs. non-AI defect rate · Token budget · AI confidence survey |
| 🚀 Delivery | P1 delivery per sprint · DORA funnel · Priority clarity signals |
| 🔧 Tech Health | Update cadence · Debt composition · Awareness survey |
| 📋 GSM Table | Full Goals → Signals → Metrics table, filterable by section and type |
| 🔌 Integrations | Interactive setup checklist with progress tracking and inline code snippets |
| 📖 About | DPH framework rationale · Rollout timeline · Design decisions · Caveats |

---

### 📊 Overview
![Overview](./docs/screenshots/overview.png)
4 KPI banners · 6-axis Team Health Radar · qualitative survey bars · all-metrics status table

---

### 🤖 AI & Tokens
![AI & Tokens](./docs/screenshots/ai-tokens.png)
AI vs. non-AI defect rate bar chart · weekly token spend vs. budget line · 3-question AI confidence survey

---

### 🚀 Delivery
![Delivery](./docs/screenshots/delivery.png)
P1 delivery per sprint · 5 DORA metrics (cycle time, build rate, deploy freq, CFR, MTTR) · qualitative delivery signals

---

### 🔧 Tech Health
![Tech Health](./docs/screenshots/tech-health.png)
Dependency update cadence line chart · tech debt by category · 3 tech health survey scores

---

### 📋 GSM Table
![GSM Table](./docs/screenshots/gsm-table.png)
All 10 metrics with Goal, Signal, Value, Trend, Type, and Status — filterable by section and Quant/Qual

---

### 🔌 Integrations
![Integrations](./docs/screenshots/integrations.png)
39-item checklist across 5 sections · per-section progress bars · expandable API code snippets · refresh cadence table

---

### 📖 About
![About](./docs/screenshots/about.png)
Why DPH framework · interactive rollout timeline · metric design decisions accordion · framework caveats
