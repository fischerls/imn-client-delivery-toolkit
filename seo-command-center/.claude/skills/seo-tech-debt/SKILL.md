---
name: seo-tech-debt
description: "Turn a site's technical SEO problems into paste-ready work tickets ranked by traffic at risk: redirect chains, broken canonicals, noindex on pages that earn impressions, 4xx from internal links, failing Core Web Vitals, crawled-not-indexed. Use when the operator says \"tech debt\", \"technical SEO fixes\", \"what's broken on {site}\", \"dev tickets for {client}\", or during Phase 1 Foundation Fix scoping."
---

# SEO Tech Debt → Tickets

> [!important] Command Center routing
> - Working folder = `clients/{slug}/`
> - Data: `mcp__gsc__*` (index state), `mcp__google-analytics__*` (traffic at risk), `mcp__dataforseo__on_page_*` (crawl + Lighthouse)
> - Feeds Phase 1 Foundation Fix pricing in `seo-proposal`, and Loop B in `sop/06-content-engine-sop.md`

"Fix your redirect chains" gets ignored. "This chain sits on the page that earned
8,400 sessions last quarter" gets shipped. **Traffic at risk is the whole point of
this skill**: it converts a technical finding into a business decision.

## Before you start

Best case: GSC + GA4 access (client is live and onboarded). Without them the skill
still runs on crawl data alone, but every ticket loses its priority number: say so
up front rather than ranking by gut and presenting it as data.

## Process

### Step 1: Crawl

`mcp__dataforseo__on_page_instant_pages` for spot checks;
`on_page_content_parsing` for body content. Cap at 200 URLs from `/sitemap.xml`.
Sitemap returns HTML instead of XML → that is finding #1, then fall back to a crawl.

**Say what you capped.** A silent cap reads as full coverage.

Check each URL for:
- redirect chains (2+ hops) and redirect loops
- canonical pointing at a 404, a redirect, or a different-language page
- `noindex` / `nofollow` on pages that earn GSC impressions (the expensive one)
- 4xx and 5xx reached from internal links
- missing/duplicate title, missing H1, duplicate meta description
- mixed content, missing hreflang where relevant

### Step 2: Index state (GSC)

`mcp__gsc__check_indexing_issues` and `mcp__gsc__batch_url_inspection` on the money
pages plus anything flagged above. Pull the "crawled, currently not indexed" and
"discovered, not indexed" sets: these are Loop B's queue.

### Step 3: Core Web Vitals

Top 20 pages by GA4 sessions (`mcp__google-analytics__run_report`, dimension
`pagePath`, metric `sessions`, last 90 days) → `mcp__dataforseo__on_page_lighthouse`
on each. Flag failing LCP / CLS / INP with the actual numbers.

### Step 4: Rank by traffic at risk

```
traffic_at_risk = 90-day GA4 sessions on the affected page
                  (+ GSC impressions where the page has impressions but no sessions)
```

No GA4 → use GSC clicks and label the column honestly.

### Step 5: Write tickets, not findings

One ticket per finding, paste-ready into ClickUp/Linear without editing:

```
[P1] Redirect chain on /services/ac-repair/
Problem: /ac-repair → /services/ac-repair/ → /services/ac-repair (3 hops, 2 of them 302)
Fix: point the first hop straight at the final URL, make both 301
Traffic at risk: 8,412 sessions / 90 days (GA4), 41,900 impressions (GSC)
Where: .htaccess line 22, and the nav link in header.php
Verify: curl -I the original URL, expect one 301 to the final
```

P1 = losing traffic or blocking indexation now. P2 = capping growth. P3 = polish.
Same rubric as `reference/scoring-rubric.md`.

## Output

`clients/{slug}/tech-debt-{YYYY-MM-DD}.md`: tickets grouped
P1/P2/P3, plus a one-line total ("11 tickets, 3 P1, 14,900 sessions/quarter at
risk") that goes straight into the proposal or the monthly report.

Frontmatter: `type: seo-analysis, date, project, department: Client Delivery,
status, tags`.

## Honesty rules

- Never assert a page is noindexed, chained or broken without the response you saw.
  Quote the header or the tag.
- Lighthouse is lab data, not field data. Say so when CWV is the finding.
- Do not pad the ticket count. Three real P1s beat thirty cosmetic P3s, and the
  padded version is what gets the whole report ignored.

## Handing off

> P1 tickets → into Phase 1 Foundation Fix scope (`seo-proposal`) if pre-sale, or
> straight to the dev queue if the retainer is live.
> Crawled-not-indexed set → Loop B in sop/06, two pages a week.
