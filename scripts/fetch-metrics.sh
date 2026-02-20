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
