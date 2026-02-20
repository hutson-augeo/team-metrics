#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# setup.sh — bootstrap ~/Development/team-metrics project
# Run: chmod +x setup.sh && ./setup.sh
# ─────────────────────────────────────────────────────────────

set -e

BASE="$HOME/Development/team-metrics"

echo "📁 Creating project structure at $BASE..."
mkdir -p "$BASE"/{data/sample,scripts,src}

# ── README ───────────────────────────────────────────────────
cat > "$BASE/README.md" << 'EOMD'
# team-metrics
Developer Productivity & Happiness Scorecard — LinkedIn DPH Framework

## Quick Start
1. Copy `.env.example` to `.env` and fill in your API keys
2. Run `npm install` then `npm run dev`
3. See INTEGRATIONS.md to replace sample data with live sources

## Stack
- React 18 + Vite
- Recharts for visualizations
- Anthropic Console API (tokens)
- GitHub REST API (PRs, cycle time, builds)
- Jira / Linear API (P1 delivery)

## Docs
- [Project Writeup](./WRITEUP.md)
- [Integration Checklist](./INTEGRATIONS.md)
- [LinkedIn DPH Framework](https://linkedin.github.io/dph-framework/)
EOMD

# ── .env.example ─────────────────────────────────────────────
cat > "$BASE/.env.example" << 'EOENV'
# Anthropic — Admin API key for token usage reporting
ANTHROPIC_ADMIN_API_KEY=sk-ant-admin...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_ORG=your-org
GITHUB_REPO=your-repo

# Jira
JIRA_BASE_URL=https://yourorg.atlassian.net
JIRA_EMAIL=you@yourorg.com
JIRA_API_TOKEN=...
JIRA_PROJECT_KEY=YOURPROJECT

# Linear (alternative to Jira)
LINEAR_API_KEY=lin_api_...

# SonarQube (tech debt)
SONARQUBE_TOKEN=...
SONARQUBE_URL=https://sonarcloud.io
SONARQUBE_PROJECT=your-project-key

# Survey data (Google Sheets)
GOOGLE_SHEETS_API_KEY=...
SURVEY_SHEET_ID=...
EOENV

# ── .gitignore ───────────────────────────────────────────────
cat > "$BASE/.gitignore" << 'EOGI'
.env
node_modules/
dist/
.DS_Store
data/live/
EOGI

# ── Sample data shape ────────────────────────────────────────
cat > "$BASE/data/sample/metrics.json" << 'EOJSON'
{
  "asOf": "2026-02-20",
  "tokens": {
    "weeklyBudget": 700000,
    "weeks": [
      { "week": "Wk 1", "input": 420000, "output": 185000 },
      { "week": "Wk 2", "input": 510000, "output": 210000 },
      { "week": "Wk 3", "input": 490000, "output": 230000 },
      { "week": "Wk 4", "input": 640000, "output": 290000 }
    ]
  },
  "prDefects": {
    "withAI":    { "prs": 148, "defects": 3.2 },
    "withoutAI": { "prs": 94,  "defects": 5.8 }
  },
  "delivery": {
    "sprints": [
      { "sprint": "S1", "delivered": 3, "total": 4 },
      { "sprint": "S2", "delivered": 4, "total": 4 },
      { "sprint": "S3", "delivered": 2, "total": 5 },
      { "sprint": "S4", "delivered": 5, "total": 5 },
      { "sprint": "S5", "delivered": 4, "total": 5 }
    ]
  },
  "techHealth": {
    "monthlyUpdates": [
      { "month": "Sep", "updates": 2, "target": 3 },
      { "month": "Oct", "updates": 3, "target": 3 },
      { "month": "Nov", "updates": 1, "target": 3 },
      { "month": "Dec", "updates": 3, "target": 3 },
      { "month": "Jan", "updates": 4, "target": 3 },
      { "month": "Feb", "updates": 2, "target": 3 }
    ]
  },
  "survey": {
    "aiConfidence": 4.1,
    "codeReviewQuality": 3.7,
    "onboarding": 4.3,
    "techDebtAwareness": 3.2,
    "priorityClarity": 3.9
  }
}
EOJSON

# ── fetch-metrics.sh ─────────────────────────────────────────
cat > "$BASE/scripts/fetch-metrics.sh" << 'EOSH'
#!/usr/bin/env bash
# Fetch live metrics from all integrations and write to data/live/metrics.json
# Requires: .env file with all API keys, jq, curl

set -e
source "$(dirname "$0")/../.env" 2>/dev/null || true
OUT="$(dirname "$0")/../data/live"
mkdir -p "$OUT"

TODAY=$(date -u +"%Y-%m-%dT00:00:00Z")
WEEK_AGO=$(date -u -v-7d +"%Y-%m-%dT00:00:00Z" 2>/dev/null || date -u -d "7 days ago" +"%Y-%m-%dT00:00:00Z")

echo "📡 Fetching Anthropic token usage..."
curl -s "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=${WEEK_AGO}&ending_at=${TODAY}&bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_API_KEY" \
  > "$OUT/tokens.json"

echo "📡 Fetching GitHub PR data..."
curl -s \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$GITHUB_ORG/$GITHUB_REPO/pulls?state=closed&per_page=100" \
  > "$OUT/prs.json"

echo "📡 Fetching GitHub Dependabot alerts..."
curl -s \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$GITHUB_ORG/$GITHUB_REPO/dependabot/alerts?state=open" \
  > "$OUT/dependabot.json"

echo "⏭️  Skipping Jira/Linear — not yet configured. Add JIRA_* vars to .env when ready."

echo ""
echo "✅ All available metrics written to $OUT/"
echo "⚠️  You still need to transform these raw API responses into the dashboard data shape."
echo "    See data/sample/metrics.json for the expected schema."
echo ""
echo "📌 Next integrations to add (per INTEGRATIONS.md):"
echo "   - Jira or Linear for P1 delivery tracking"
echo "   - SonarQube or CodeClimate for code quality depth"
EOSH

chmod +x "$BASE/scripts/fetch-metrics.sh"

# ── package.json ─────────────────────────────────────────────
cat > "$BASE/package.json" << 'EOPKG'
{
  "name": "team-metrics",
  "version": "1.0.0",
  "description": "Developer Productivity & Happiness Scorecard — DPH Framework",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "fetch-data": "bash scripts/fetch-metrics.sh"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0"
  }
}
EOPKG

# ── VS Code workspace settings ───────────────────────────────
mkdir -p "$BASE/.vscode"
cat > "$BASE/.vscode/settings.json" << 'EOVSCODE'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": { "javascript": "javascriptreact" },
  "files.exclude": { "node_modules": true, "dist": true, "data/live": true },
  "claude.apiKey": "${env:ANTHROPIC_API_KEY}"
}
EOVSCODE

cat > "$BASE/.vscode/extensions.json" << 'EOEXT'
{
  "recommendations": [
    "Wilendar.claude-usage-monitor",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "eamodio.gitlens"
  ]
}
EOEXT

echo "📌 VS Code workspace configured. Open with: code $BASE"
cat > "$BASE/vite.config.js" << 'EOVITE'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
EOVITE

# ── index.html ───────────────────────────────────────────────
cat > "$BASE/index.html" << 'EOHTML'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Team Metrics — DPH Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOHTML

# ── src/main.jsx ─────────────────────────────────────────────
cat > "$BASE/src/main.jsx" << 'EOMAIN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
EOMAIN

echo ""
echo "✅ Project created at $BASE"
echo ""
echo "Next steps:"
echo "  1. cd $BASE && npm install"
echo "  2. cp .env.example .env  →  fill in ANTHROPIC_ADMIN_API_KEY and GITHUB_TOKEN first"
echo "  3. npm run dev            →  opens on http://localhost:5173"
echo "  4. code $BASE             →  VS Code will prompt to install recommended extensions"
echo "  5. Work through INTEGRATIONS.md — start with items 1 and 2 (Anthropic + GitHub)"
echo ""
echo "📋 Files created:"
find "$BASE" -type f | sort
