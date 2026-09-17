---
name: setup
description: "First-run onboarding for the SEO Command Center. Interviews the agency owner, fills config.md, verifies the MCP tools with live test calls, and initializes the dashboard. Use when the user runs /setup, when config.md still contains {{PLACEHOLDER}} values, or when the user says \"set up the command center\" or \"get me started\"."
---

# Command Center Setup

Guided onboarding. Three parts, in order. Keep it conversational: one question at a time, suggest sensible defaults.

## Part 1: Verify the tools

Before any questions, confirm the engine works:

1. Run a cheap DataForSEO test: search volume for one keyword (e.g. "plumber denver").
2. Run a cheap Tavily test: `tavily_extract` on the agency's own website if known, else any public page.

If either fails: stop, diagnose. Most common causes: installer not run (`./install.sh`), wrong credentials, or the MCP server name differs. Show the user the exact error and point to `INSTALL.md` troubleshooting. Do not proceed to Part 2 until both tools answer.

## Part 2: Interview and fill config.md

Ask, one at a time (offer the default in the question where one exists):

1. Agency name
2. Your name (goes on proposals)
3. Contact email (clients invite this address to Search Console / Analytics)
4. Agency website
5. Primary niches (what verticals do you sell into?)
6. Primary market(s) (metro areas)
7. Phase 1 price: one-time foundation fix. Default $3,500 (proven in real engagements).
8. Phase 2 price: monthly growth program. Default $1,000/mo, billing from month 2.
9. Your branded name for the monthly program (this is YOUR product label, e.g. "{Agency} Local Engine")
10. Monthly report due day. Default: 5th.

Replace every `{{PLACEHOLDER}}` in `config.md` with the answers. Read the finished file back to the user in a 5-line summary for confirmation.

## Part 3: Initialize

1. Confirm `clients/` and `prospects/` directories exist (create if missing).
2. Stamp `DASHBOARD.md`: replace the placeholder row's date with today, note "installed and verified".
3. Close with the three commands they'll use most:
   - "find prospects in {their market}"
   - "audit {business name}, {url}, {city}"
   - "proposal for {business}"

Total cost of setup test calls: under $0.05.
