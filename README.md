# Internet Media Now Client Delivery Toolkit

One repository for three workflows: **SEO Command Center**, **Website Builder**, and **ADA Audit**. Built for Laura's handoff, with reusable source code and instructions. Credentials and client reports stay on your computer.

## Pick your starting point

| Work | Open | What is included |
|---|---|---|
| Find prospects, audit SEO, create proposals, run ongoing SEO | [SEO Command Center](seo-command-center/README.md) | 14 skills, 6 SOPs, templates, installer, and an empty agency configuration |
| Plan and build a website | [Website Builder](website-builder/README.md) | The High-End Website Playbook previously shared with Laura, plus the corrected accessibility checklist |
| Check website accessibility | [ADA Audit](.claude/skills/ada-audit/SKILL.md) | Browser scanner, full evidence export, manual A/AA checklist, reporting instructions, and regression tests |

The Website Builder is the existing playbook, not the Higgsfield-specific builder. Its specialist design/media skills are separate dependencies, and your assistant should identify which are installed before promising that full workflow.

## Get it onto your computer

Install Git, Claude Code, and Node.js 22 or a compatible newer version with npm. Then:

```bash
git clone https://github.com/fischerls/imn-client-delivery-toolkit.git
cd imn-client-delivery-toolkit
claude
```

Or use GitHub's **Code > Download ZIP**, extract it, and open the extracted folder in Claude Code. On macOS/Linux, the SEO shell installer works in a terminal; on Windows use WSL or the manual steps in its INSTALL.md.

This toolkit needs an assistant that can read local files and run terminal/browser tools. Ordinary chat alone cannot execute its local scanner.

## 1. Start the SEO Command Center

Run SEO work from its own folder so its paths, skills, and agency configuration resolve correctly:

```bash
cd seo-command-center
./install.sh
claude
```

In Claude, enter `/setup`. The installer asks for DataForSEO API credentials and a Tavily key. Get those privately from Larry or use your own authorized accounts. Do not paste them into email, GitHub, or repository files. DataForSEO usage can incur charges. Google Search Console and GA4 are optional and need their own authorized access.

`/setup` creates your local agency configuration from `config.example.md` and prepares your pipeline dashboard. Use the current agency pricing Larry provides; examples in the kit are not approval to quote a price.

Try:

> Audit example.com for a plumbing company in Gainesville. Use available first-party data, identify missing access, cite the source and date for every number, and save a prioritized fix list. Do not contact the business or change its website.

The full commands, content engine, monthly reports, and onboarding steps are in [SEO Command Center](seo-command-center/README.md).

## 2. Start a website build

Read the [seven-slot website prompt](website-builder/README.md#the-seven-slot-prompt). Fill in the audience, goal, visual direction, real assets, typography, things to avoid, and constraints. Give your assistant the actual client brand and accurate business facts.

Try:

> Read website-builder/README.md. Help me fill in the seven-slot brief for a website for [business]. List which specialist skills are available and which would need installation. Use my approved brand and real content. Build a local preview, run the bundled accessibility workflow, and show me the result before publishing anything.

The playbook names optional specialist tools and skills. Do not invent successful tool execution when a dependency is missing. A design plan or placeholder site is not a completed build.

## 3. Set up and run ADA Audit

From the repository root, run:

```bash
cd .claude/skills/ada-audit/scripts
npm ci
npx playwright install chromium
npm test
```

All eight tests should pass. They include an actual 15-page fixture sweep and discovery/print checks. This verifies the tool, not a client's site.

Open Claude Code from the repository root and paste:

> Use the ada-audit skill to audit https://example.com against WCAG 2.2 AA. Save everything under audit/example/YYYY-MM-DD/. Start with up to 40 public pages, compare sitemap discovery with a link crawl, and include important pages and user journeys. Do not submit real forms, book appointments, purchase, or change the website. Complete manual checks you can actually perform and mark the rest NOT TESTED. Separate confirmed findings, uncertain candidates, recommendations, and pages blocked from testing. Keep the full evidence and produce a plain-English summary and prioritized fix list.

Replace the URL and output folder. Inspect the proposed scope before a large audit.

### Interpret the results

- **Findings:** automated A/AA failures to verify before final client reporting.
- **Needs review:** an uncertain candidate or incomplete check.
- **Blocked/error:** the page or check could not be properly audited.
- **No automated findings:** nothing detected in the scanned states. Manual evaluation remains required.

The sweep saves `results.json` and full evidence in `results.json.raw.json`. Discovery saves URL lists and `.coverage.json` showing omissions and limits. Preserve these with the manual records and report.

Sweep exit codes: 0 for no automated findings, 1 for A/AA findings, 2 for blocked/error, and 3 for unresolved candidates. Nonzero exits can describe an expected audit outcome; inspect the saved results before assuming setup failed.

Ask the assistant to walk through the [manual checklist](.claude/skills/ada-audit/references/manual-layer.md). Send the first report to Larry for review before sharing it with a client. Do not describe a website as ADA compliant, certified, or lawsuit-proof based on an automated scan.

## Update and retain your work

Use `git pull` in the repository root to receive toolkit updates. The SEO module creates ignored `config.md` and `DASHBOARD.md` from tracked example files. Client folders, prospects, audit output, credentials, and installed dependencies are ignored. Keep a separate backup of your local business records; Git is not backing those up here.

If you already use the standalone SEO Command Center, keep its configuration and client records backed up. Copy your local `config.md`, `DASHBOARD.md`, `clients/`, and `prospects/` into this toolkit's SEO folder only on your own computer. Run the installer from the new folder to register its project-local integrations. Do not copy or commit credentials from another machine.

## Sources and validation

See [SOURCES.md](SOURCES.md) for the original repositories, bundled components, changes, and verification boundaries. No live paid SEO/API calls were made to validate this combined handoff.
