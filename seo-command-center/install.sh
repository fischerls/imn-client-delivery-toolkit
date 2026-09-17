#!/usr/bin/env bash
# SEO Command Center: installer
# Registers the required MCP servers with YOUR keys (stored in your
# ~/.claude.json, never in this folder) and prepares the workspace.
set -euo pipefail

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; exit 1; }

bold "SEO Command Center installer"
echo

# --- preflight ---------------------------------------------------------
bold "1/4 Checking prerequisites"
command -v claude >/dev/null 2>&1 && ok "Claude Code CLI found ($(claude --version 2>/dev/null | head -1))" \
  || fail "Claude Code not found. Install it first: https://claude.com/claude-code"
command -v npx >/dev/null 2>&1 && ok "Node/npx found" \
  || fail "Node.js not found. Install Node 18+ first: https://nodejs.org"
cd "$(dirname "$0")"
ok "Installing into: $(pwd)"
echo

# --- credentials -------------------------------------------------------
bold "2/4 API credentials"
echo "  You need two accounts (both take ~2 minutes to create):"
echo "   - DataForSEO (prepaid credits, ~\$2-5 per full audit): https://app.dataforseo.com/api-access"
echo "   - Tavily (free tier is fine to start):                 https://app.tavily.com"
echo
read -r -p "  DataForSEO API login (email): " DFS_USER
read -r -s -p "  DataForSEO API password: " DFS_PASS; echo
read -r -s -p "  Tavily API key (tvly-...): " TAVILY_KEY; echo
[ -n "$DFS_USER" ] && [ -n "$DFS_PASS" ] || fail "DataForSEO credentials are required."
[ -n "$TAVILY_KEY" ] || fail "Tavily API key is required."
echo

# --- MCP registration --------------------------------------------------
bold "3/4 Registering MCP servers (local scope: keys live in your ~/.claude.json, not in this folder)"
claude mcp remove dataforseo >/dev/null 2>&1 || true
claude mcp remove tavily >/dev/null 2>&1 || true
claude mcp add dataforseo \
  --env DATAFORSEO_USERNAME="$DFS_USER" \
  --env DATAFORSEO_PASSWORD="$DFS_PASS" \
  -- npx -y dataforseo-mcp-server@2 \
  && ok "dataforseo registered" || fail "dataforseo registration failed: see INSTALL.md troubleshooting"
claude mcp add tavily \
  --env TAVILY_API_KEY="$TAVILY_KEY" \
  -- npx -y tavily-mcp \
  && ok "tavily registered" || fail "tavily registration failed: see INSTALL.md troubleshooting"
echo

# --- workspace ---------------------------------------------------------
bold "4/4 Preparing workspace"
mkdir -p clients prospects
[ -f config.md ] || cp config.example.md config.md
[ -f DASHBOARD.md ] || cp DASHBOARD.example.md DASHBOARD.md
ok "clients/ and prospects/ ready"
chmod -R u+w .
echo

bold "Done. Final step: personalize it:"
echo
echo "  cd $(pwd)"
echo "  claude"
echo "  > /setup"
echo
echo "  /setup interviews you (agency name, pricing, niches), fills config.md,"
echo "  and runs a live test call against both APIs to confirm everything works."
