# Team Metrics Dashboard — Integration Checklist
> Replace all fake/sample data with live sources. Each item below maps to a specific metric in the dashboard.

---

## 🤖 AI & Token Use

### 1. Anthropic Console — Token Budget Tracking
**Metric:** Weekly token consumption vs. budget  
**Source:** [Anthropic Usage & Cost API](https://platform.claude.com/docs/en/build-with-claude/usage-cost-api)  
- [ ] Generate an **Admin API Key** (`sk-ant-admin...`) in the Anthropic Console
- [ ] Store key in environment variable: `ANTHROPIC_ADMIN_API_KEY`
- [ ] Call `GET /v1/organizations/usage_report/messages` with `bucket_width=1d`
- [ ] Filter by `model` and group by `workspace` for per-team breakdown
- [ ] Map `input_tokens + output_tokens` → weekly total → compare to your defined budget
- [ ] Set up a weekly cron job or GitHub Action to pull and store in your data store
- [ ] Wire the `tokenData` array in the dashboard to this live feed

**Endpoint example:**
```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2026-02-13T00:00:00Z&\
ending_at=2026-02-20T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_API_KEY"
```

---

### 2. GitHub — AI vs. Non-AI PR Defect Rate
**Metric:** Defect rate per PR (AI-assisted vs. not)  
**Source:** GitHub REST API + PR labels  
- [ ] Add a PR label convention: `ai-assisted` (applied manually or via a GitHub Action that detects Copilot/Claude commits)
- [ ] Track bugs linked to PRs — use a label like `defect` or `regression` on issues
- [ ] Call `GET /repos/{owner}/{repo}/pulls?state=closed&labels=ai-assisted` to get AI PRs
- [ ] Call `GET /repos/{owner}/{repo}/issues?labels=defect` and join to PR via linked issues or commit SHA
- [ ] Calculate: `defect_count / pr_count` for each group
- [ ] Wire `aiDefectData` array in dashboard to this calculation
- [ ] Automate weekly via GitHub Actions → write to a JSON file or database

**Required GitHub permissions:** `repo`, `read:org`

---

### 3. VS Code / Claude Code — Token Usage per Developer
**Metric:** Per-developer token consumption  
**Source:** Claude Code telemetry + Anthropic Console workspace grouping  
- [ ] Ensure each developer uses a named API key or workspace in Claude Code
- [ ] In Anthropic Console, create per-developer API keys under separate workspaces
- [ ] Use `group_by[]=api_key` in the usage report endpoint to get per-key breakdown
- [ ] Map API keys → developer names in a config file (do not store in repo — use secrets)
- [ ] Surface in dashboard as a leaderboard or per-person token spend

---

## 🚀 Delivery

### 4. Jira or Linear — P1 Priority Delivery Rate
**Metric:** P1 features delivered per sprint  
**Source:** Jira REST API or Linear GraphQL API  

**Jira:**
- [ ] Authenticate with a Jira API token (`JIRA_API_TOKEN`, `JIRA_BASE_URL`, `JIRA_EMAIL`)
- [ ] Query issues with `priority = Highest AND sprint in openSprints()` → count as "planned P1"
- [ ] Query `status = Done AND priority = Highest AND sprint in closedSprints()` → count as "delivered"
- [ ] Calculate: `delivered / planned` per sprint
- [ ] Wire `deliveryData` array in dashboard

**Jira JQL example:**
```
project = MYPROJECT AND priority = Highest AND sprint in closedSprints() ORDER BY sprint ASC
```

**Linear:**
- [ ] Use Linear GraphQL API with `LINEAR_API_KEY`
- [ ] Query `cycles` (sprints) and filter issues by `priority: URGENT` and `state.type: completed`

---

### 5. GitHub Actions — Cycle Time & Build Metrics
**Metric:** Median PR cycle time, build success rate, deployment frequency  
**Source:** GitHub REST API  
- [ ] `GET /repos/{owner}/{repo}/pulls?state=closed` → compute `merged_at - created_at` per PR
- [ ] Median of all values = cycle time metric
- [ ] `GET /repos/{owner}/{repo}/actions/runs` → count success vs. failure → build success rate
- [ ] Count deployments: `GET /repos/{owner}/{repo}/deployments` per time window
- [ ] Wire `deliveryFunnelData` in dashboard

---

## 🔧 Tech Health

### 6. GitHub Dependabot / Renovate — Dependency Freshness
**Metric:** Tech updates & modernizations per month  
**Source:** GitHub Dependabot alerts + merged Renovate/Dependabot PRs  
- [ ] Enable Dependabot on repos: add `.github/dependabot.yml`
- [ ] `GET /repos/{owner}/{repo}/dependabot/alerts?state=open` → count open critical alerts
- [ ] Count merged PRs with label `dependencies` per month → this is your "tech updates" metric
- [ ] Wire `techDebtData` array in dashboard
- [ ] Set alert threshold: if open critical alerts > X, flag "At Risk" in dashboard

---

### 7. SonarQube / CodeClimate — Tech Debt Composition
**Metric:** Test coverage gap, deprecated API usage, refactor flags  
**Source:** SonarQube API or CodeClimate API  
- [ ] Set up SonarQube Cloud (free for public repos) or self-hosted
- [ ] Call `GET /api/measures/component?metricKeys=coverage,sqale_index,code_smells`
- [ ] Map `coverage` → "Test Coverage Gap" metric
- [ ] Map `code_smells` → "Flagged for Refactor" metric
- [ ] Wire `techDebtComposition` data in dashboard

---

## 💬 Qualitative / Survey

### 8. Developer Pulse Survey — Qualitative Signals
**Metrics:** AI confidence, priority clarity, tech debt awareness, onboarding  
**Source:** Google Forms, Typeform, or Slack workflow  
- [ ] Create a recurring survey (bi-weekly recommended) with these exact questions:
  - "I can complete code faster using AI assistance" (1–5)
  - "I can tell when AI output needs correction" (1–5)
  - "Token limits have not impacted my workflow" (1–5)
  - "I understand which work matters most this sprint" (1–5)
  - "I know where the most significant tech debt lives" (1–5)
  - "I feel safe raising technical concerns with the team" (1–5)
- [ ] Export responses to a Google Sheet or CSV
- [ ] Use Google Sheets API or Typeform webhook → write to your data store
- [ ] Calculate mean per question per survey cycle
- [ ] Wire `qualData` and survey breakdown arrays in dashboard

---

## 🗄️ Data Store & Automation

### 9. Choose a Data Backend
Pick one approach to persist metrics across time:
- [ ] **Simple:** GitHub-hosted JSON files updated by Actions (good for small teams)
- [ ] **Mid-tier:** Supabase (Postgres, free tier, REST API, easy to self-host)
- [ ] **Full:** PostHog, Grafana + InfluxDB, or Datadog for time-series dashboards

### 10. Environment Variables / Secrets Needed
Store all of these in your CI secrets, `.env`, or a secrets manager:
```
ANTHROPIC_ADMIN_API_KEY=sk-ant-admin...
GITHUB_TOKEN=ghp_...
JIRA_API_TOKEN=...
JIRA_BASE_URL=https://yourorg.atlassian.net
JIRA_EMAIL=you@yourorg.com
LINEAR_API_KEY=lin_api_...
SONARQUBE_TOKEN=...
GOOGLE_SHEETS_API_KEY=...  # if using Sheets for survey data
```

### 11. Refresh Cadence
| Metric | Refresh |
|---|---|
| Token consumption | Daily (cron) |
| PR defect rate | On PR merge (webhook) |
| P1 delivery rate | End of sprint |
| Cycle time / build | Daily |
| Dependabot alerts | Daily |
| Tech debt (Sonar) | On main branch push |
| Survey scores | Bi-weekly (manual trigger) |

---

## ✅ Done When
- [ ] No hardcoded sample data remains in `dashboard.jsx`
- [ ] All metrics sourced from live APIs
- [ ] A GitHub Action or cron job runs daily and updates the data layer
- [ ] Survey cadence is on the team calendar
- [ ] Token budget threshold is agreed upon and documented
