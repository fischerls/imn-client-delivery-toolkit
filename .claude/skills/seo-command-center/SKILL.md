---
name: seo-command-center
description: "Run the bundled SEO agency workflow for prospecting, audits, proposals, client launches, content, and monthly reports. Routes work to the 14 specialized skills and SOPs in seo-command-center/."
---

# SEO operations routing

Read [the SEO module README](../../../seo-command-center/README.md) and [its operating instructions](../../../seo-command-center/CLAUDE.md). Treat `seo-command-center/` as the working root for its configuration, dashboard, SOPs, templates, client folders, and commands. When guiding a person starting Claude Code, have them open Claude from that directory.

Initialize absent local configuration/dashboard files from their tracked examples without overwriting existing state. The interactive installer registers integrations using the operator's authorized credentials. Never commit or include credentials in reports or email.

Choose the specialized skill under `seo-command-center/.claude/skills/` that matches the requested task. Respect the lifecycle sequence: audit before proposal, signed engagement before launch, and baseline before ongoing reports. Use current configured pricing and source/date every metric. If integrations or data are unavailable, disclose the gap; do not invent measurements or claim live tests ran.

Follow the relevant SOP and save outputs in the module's ignored client/prospect folders. Running an audit does not authorize contacting prospects or changing client systems. Keep those actions within the user's explicit authorization.
