# SEO Command Center

> Public copy of the kit Internet Media Now runs internally. Clone it, run the installer, `/setup`, and you are operating. No client data ships in this repo.

A complete SEO agency operation that installs into Claude Code. Prospecting, audits, proposals, client launches, monthly reporting, and a pipeline dashboard: built from a process proven on real HVAC and landscaping engagements.

## Install (5 minutes)

```bash
# 1. Unzip this folder wherever you keep your work
cd seo-command-center

# 2. Run the installer: it asks for your API keys and wires up the tools
./install.sh

# 3. Launch Claude Code and personalize
claude
> /setup
```

`/setup` interviews you (agency name, pricing, niches), verifies both APIs with live test calls, and you're operational. Full details and troubleshooting: `INSTALL.md`.

**You need two accounts** (~2 min each to create):
- DataForSEO: https://app.dataforseo.com/api-access (prepaid credits; a full client audit costs ~$2-5)
- Tavily: https://app.tavily.com (free tier works)

Your keys are stored in Claude Code's own config on your machine. They are never written into this folder, so the folder stays shareable.

**Optional, but the skills prefer it:** Google Search Console and GA4 access for each client. See INSTALL.md, section "Optional: first-party data". Free data beats paid estimates, and the client can verify it in their own account.

## Joining a team that already runs this

If a teammate already operates the center, they hand you three things: the DataForSEO API login and password, the Tavily key, and the values for `config.md` (agency name, contact email, pricing, product name). Run `./install.sh` with those keys, then `/setup` with those values. For first-party data, ask each client to invite **your** Google account (INSTALL.md, optional section). Nothing else to copy: client folders are rebuilt from the SOPs, not shared.

## What you can do once installed

| Say this | Get this |
|---|---|
| "find HVAC prospects in Tampa" | Scored lead list: businesses good at the work, bad at the internet |
| "audit Acme Plumbing, acmeplumbing.com, Denver" | Full audit: technical, competitors, keywords → P1/P2/P3 opportunity list |
| "proposal for Acme Plumbing" | Client-ready two-phase proposal at YOUR pricing |
| "Acme signed" | Launch checklist: access requests, baseline rank snapshot, invoice reminders |
| "monthly report for Acme" | Retainer-justifying report: movement vs baseline, plain language |
| "onboard Acme for the content engine" | `site-brief.md` + AI citation baseline (sop/06) |
| "keyword map for Acme: water heater repair" | Intent-clustered keyword map + fan-out questions, HTML dashboard |
| "write the Acme water heater page" | Citation-ready draft with answer capsules, sources, schema |
| "quick wins for Acme" | Striking-distance queries from Google Search Console, grouped by the fix (needs GSC access) |
| "tech debt for Acme" | Paste-ready dev tickets ranked by traffic at risk |
| "backlink audit for Acme" | FLAG / PROTECT / PURSUE list from the DataForSEO backlinks module |
| "AI visibility for Acme" | Where ChatGPT, AI Overviews and Perplexity cite the client vs competitors, plus the gap list |

Claude opens every session with your pipeline status and flags what's overdue.

## Folder map

| Path | Purpose |
|---|---|
| `install.sh` / `INSTALL.md` | Installer + manual instructions |
| `CLAUDE.md` | Operating brain (Claude reads this automatically) |
| `config.md` | Your agency identity + pricing (filled by `/setup`) |
| `DASHBOARD.md` | Live pipeline overview, maintained by Claude |
| `.claude/skills/` | 14 skills. Lifecycle: setup, seo-prospect, seo-audit, seo-proposal, seo-report. Content engine: site-brief-builder, keyword-fanout-map, seo-content-writer, onpage-optimizer, internal-link-architect, ai-visibility-checker. First-party data: seo-quick-wins, seo-tech-debt, seo-backlink-audit |
| `sop/` | The step-by-step playbooks the skills follow (01-05 lifecycle, 06 content engine) |
| `templates/` | Audit report, proposal, monthly report, credentials email |
| `reference/` | Tool catalog with per-call costs, P1/P2/P3 scoring rubric |
| `prospects/` | Generated lead lists |
| `clients/` | One folder per client: audit → proposal → launch → reports |

## The business model baked in

Two-phase engagements: a one-time **Foundation Fix** (default $3,500: site/technical overhaul, measurement install, baseline) and a monthly **Growth Program** (default $1,000/mo: GBP, reviews, content, reporting). Both prices are yours to set in `/setup`. The SOPs encode the full delivery logic, including the rule that makes clients trust you: access by invite, never passwords: they keep ownership of everything.

## Combined-toolkit state protection

The tracked defaults are `config.example.md` and `DASHBOARD.example.md`. The installer copies them to ignored local files on first use without replacing existing state. Personalize the local copies, never the tracked examples.
