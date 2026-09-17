---
name: ada-audit
description: "Audit website accessibility against WCAG 2.2 A/AA using axe-core, browser probes, and documented manual checks. Use for an ADA accessibility review, WCAG audit, launch accessibility check, or remediation retest. Reports confirmed findings, unresolved checks, and tested scope; does not determine legal ADA compliance."
---

# Website accessibility audit

Find reproducible barriers, retain evidence, and give the owner an actionable fix list. Automated checks are one part of the audit. Do not infer legal ADA violations, whole-site conformance, or lawsuit immunity from scanner output.

## Establish scope

Record the target URL, WCAG version/level, pages and user journeys, public/authenticated access, included third-party content and documents, and available browser/assistive-technology combinations. Use WCAG 2.2 AA as the engineering target unless another target is requested. Distinguish that target from any applicable legal standard; verify current authoritative guidance if legal context is requested.

Include representative content and components, complete forms/checkout/booking journeys, and opened/closed/error/success states. URL shape alone does not identify a template. Discovery excludes non-HTML documents from the web sweep and records them for separate scope decisions.

An audit authorizes inspection. Do not send real forms, purchase, change records, or trigger other external actions without task authorization. Use a test environment or stop before submission and mark the resulting coverage gap.

## Setup

```bash
cd <skill>/scripts
npm ci
npx playwright install chromium
```

Run scripts with explicit output paths under the project audit directory. In this vault use `Projects/{bucket}/{slug}/audit/`; standalone use `./audit/`. Create the output directory first. Do not save scan outputs in the skill folder or vault root.

## Workflow

1. **Discover and select scope.**

   ```bash
   node discover.mjs https://example.com --limit 40 --out <audit>/sitemap-urls.txt
   node discover.mjs https://example.com --crawl --limit 40 --out <audit>/crawl-urls.txt
   ```

   Compare and merge the URL lists, then add critical journeys and distinct content manually. No automatic template grouping occurs. Each command writes a `.coverage.json` sidecar with limits, omitted/pending URLs, exclusions, and errors. A sitemap/crawl discrepancy requires investigation; it does not automatically establish an SEO defect.

   `--all` removes the default 40-page cap, but an explicit `--limit` still applies. `--max-requests` defaults to 300. Read truncation and error data before claiming coverage. Discovery exit codes are 0 for an exhausted discovery pass, 2 for blocked/error or empty results, and 3 for truncation; 2 takes precedence. Read the coverage sidecar even on a nonzero exit. Even exhausted discovery is not proof of a complete site inventory. Redirects stay on the exact selected origin; use the canonical URL or explicitly audit a separately authorized origin when needed.

2. **Run the automated screen.**

   ```bash
   node sweep.mjs --urls <audit>/urls.txt --out <audit>/results.json
   ```

   Runs axe on initial page state at 1440px and a freshly loaded 390px viewport, reflow candidates at 320px, a fresh first-tab observation, and a desktop reduced-motion inventory on each page. `--settle` defaults to 2500ms; increase it for content that loads slowly. Observe transient states separately if they affect access. Waiting does not make every animation-related finding invalid.

   The summary has schema version 2. Full axe evidence, including node details, incomplete checks, target arrays, passes, engine metadata, and browser information, is retained in `results.json.raw.json`. Preserve both files and discovery coverage.

   Exit codes: **0** no automated findings or unresolved automated candidates; **1** axe A/AA findings; **2** blocked pages or execution errors; **3** unresolved review candidates without confirmed findings. Code 2 takes precedence over 1, then 3. Every code still requires the manual layer. `verdict.fail` is `true` for detected A/AA failures, `null` when unresolved without confirmed failures, and `false` only for a completed screen with no automated findings. Consult status and coverage as well as the boolean.

3. **Complete the manual layer.** Read `references/manual-layer.md`. Build its criterion coverage matrix and test applicable interactions. Use PASS, FAIL, NEEDS REVIEW, NOT TESTED, or NOT APPLICABLE with evidence and reasons. If screen-reader testing or another required check cannot be performed, record it as outstanding. Never invent a manual pass.

4. **Write the scoped report.** Follow `references/report-format.md`. Confirm scanner findings and exceptions, distinguish A/AA failures from best practices and AAA checks, prioritize barriers to key tasks, and retain evidence. Report failed/blocked tests separately from accessibility violations.

5. **Retest fixes.** Repeat affected pages/states and shared-component instances. Connect each original finding to its retest evidence. A new clean scan alone does not close manual findings.

## Interpreting probes

- Accessible-name and iframe failures come from axe. The first-tab accessibility snapshot is supporting evidence; text content is not an accessible-name algorithm.
- Reflow/clipping observations are review candidates. Check lost content/functionality and exceptions for content requiring two-dimensional layout. `ok: null` means unresolved, not a pass.
- `smallTargets` is a dimensional inventory, not a violation count or exception decision. Axe's target-size rule and manual review handle the actual criterion.
- Focus CSS counts, including nested rules, cannot establish visibility or reliance on browser defaults. Inspect actual focused states on light/dark surfaces and behind sticky content.
- A skip-link-looking anchor is not a verified bypass mechanism. Check its destination, focus, next tab stop, and visibility; other conforming bypass mechanisms are possible.
- Reduced-motion candidates are not a complete interaction-animation test. SC 2.3.3 is AAA and stays separate from A/AA findings.
- Incomplete axe results require review. They may become confirmed failures or passes after investigation; never count unresolved ones as confirmed violations.
- HTTP errors and suspected challenge/login pages remain blocked. Detection is heuristic, so inspect title, final URL, and actual content identity for every target.

## PDF deliverables

`node printcheck.mjs <report-url> --width 720` screens print-media layout at Letter content width with half-inch margins. Derive width from the actual paper size/margins if different. Render and inspect the final PDF for pagination/clipping, and separately assess tags, reading order, headings, links, tables, and alternative text. A print-layout screen is not a PDF accessibility audit.

## Reporting and remediation boundaries

Do not recommend an overlay as a substitute for fixing source defects. Do not attribute one vendor's legal history to another. Do not bill unconfirmed heuristic findings as established violations. Fix shared defects in shared templates, components, or styles; fix content-specific defects in their source content. Preserve dated evidence and scope limitations.

## Regression validation

Run `npm test` from `<skill>/scripts` after changes. The suite uses local fixtures and checks real browser results, raw evidence, sitemap parsing/coverage, redirect boundaries, and print geometry. It does not certify any client website.
