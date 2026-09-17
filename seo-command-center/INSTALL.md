# Install Guide

## Prerequisites

- **Claude Code**: https://claude.com/claude-code (`npm i -g @anthropic-ai/claude-code` or the desktop app)
- **Node.js 18+**: https://nodejs.org (the MCP servers run via `npx`)
- **DataForSEO account**: https://app.dataforseo.com/api-access → copy your API **login** and **password** (these are API credentials, separate from your dashboard login). Add $20-50 of credits to start; a full client audit costs ~$2-5.
- **Tavily API key**: https://app.tavily.com → free tier is fine to start.

## Option A: Installer script (recommended)

```bash
cd seo-command-center
./install.sh          # if blocked: chmod +x install.sh && ./install.sh
```

The script checks prerequisites, asks for your keys, registers both MCP servers, and creates the working directories. Then:

```bash
claude
> /setup
```

## Option B: Manual install

```bash
cd seo-command-center

claude mcp add dataforseo \
  --env DATAFORSEO_USERNAME=your_api_login \
  --env DATAFORSEO_PASSWORD=your_api_password \
  -- npx -y dataforseo-mcp-server@2

claude mcp add tavily \
  --env TAVILY_API_KEY=tvly-your-key \
  -- npx -y tavily-mcp

mkdir -p clients prospects
claude
> /setup
```

## Where your keys live

`claude mcp add` stores credentials in Claude Code's per-user config (`~/.claude.json`) on your machine. Nothing secret is ever written inside this folder: you can re-zip and share it without leaking anything.

## Optional: first-party data (Google Search Console + GA4)

Three skills (`seo-quick-wins`, `seo-tech-debt`, the Track 0 step of `seo-audit`) read the client's own Search Console and GA4 before spending DataForSEO credits. Audits, proposals and content still work without them; those sections are simply skipped until connected.

1. Ask each client to add your Google account as a **manager** on their Search Console property and as a **viewer** on their GA4 property (`templates/credentials-request-email.md` has the wording). Never ask for their password.
2. Google Search Console MCP: https://github.com/AminForou/mcp-gsc (open source, Python). Follow its README to create the OAuth client and register it with `claude mcp add gsc ...`. Tools appear as `mcp__gsc__*`.
3. GA4 MCP: Google's own `analytics-mcp` (`pipx install analytics-mcp`, then `gcloud auth application-default login` with the same Google account). Register with `claude mcp add google-analytics -- google-analytics-mcp`. Tools appear as `mcp__google-analytics__*`.

Both use your Google login, so the only thing the client ever grants is an invite they can revoke.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `claude: command not found` | Install Claude Code first; restart your terminal |
| `npx: command not found` | Install Node.js 18+ |
| MCP server fails to start | The npm package name may have changed. Search npm for "dataforseo mcp" / "tavily mcp" and substitute the current package in the `claude mcp add` command. Both vendors maintain official MCP servers. |
| DataForSEO calls return 401 | You used your dashboard password. Use the **API** login/password from app.dataforseo.com/api-access |
| DataForSEO `40204` on backlinks | Backlinks requires a separate subscription. The SOPs already work around this (organic-keyword footprint proxy). |
| Tools registered but Claude can't see them | Restart the Claude Code session; run `claude mcp list` to confirm both servers show |

## Updating

This folder is self-contained. To update to a newer version of the command center, replace everything EXCEPT `config.md`, `clients/`, `prospects/`, and `DASHBOARD.md` (your data).
