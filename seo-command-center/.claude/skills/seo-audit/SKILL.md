---
name: seo-audit
description: "Run a full local-SEO audit for a target business: technical/on-page audit, competitor teardown, keyword research: producing a P1/P2/P3 scored opportunity list in the client's project folder. Use when the user asks for an SEO audit, site audit, SEO analysis, or competitor analysis for a business. Requires business name, website URL, and city/region."
---

# SEO Audit

Detailed tool sequences: `sop/02-audit-sop.md`. Delivery context: the SOPs in `sop/`. This skill is the short form; the SOP is the long form.

## Inputs (ask if missing)

Business name, website URL, city/region, industry.

## Output routing

All output to `clients/{slug}/`:
- `site-audit.md`: Track A
- `competitor-teardown.md`: Track B
- `keyword-research.md`: Track C
- `audit-{YYYY-MM-DD}.md`: the P1/P2/P3 synthesis (the gate artifact)

If the project folder doesn't exist, create `clients/{slug}/` with a README.md stub linking the audit files. Frontmatter on every file: `type, date, client, status, tags`.

## Execution

**Track 0 first, always: do we have first-party data?** Run `mcp__gsc__list_properties` and `mcp__google-analytics__get_account_summaries`. If the target's property is there (existing client, or a prospect who granted access), run `seo-quick-wins` and `seo-tech-debt` BEFORE spending a cent on DataForSEO. Real impressions and real sessions beat third-party estimates and cost $0. For a cold prospect with no access, skip to Tracks A-C: and make GSC + GA4 manager access a line item in the proposal.

Three parallel tracks (subagents where possible) per the command-center SOP:
- **Track A**: DataForSEO: `on_page_instant_pages`, `on_page_lighthouse`, `dataforseo_labs_google_ranked_keywords`, `dataforseo_labs_google_domain_rank_overview`, `business_data_business_listings_search`, `domain_analytics_technologies_domain_technologies`.
- **Track B**: competitors via `serp_organic_live_advanced` + `dataforseo_labs_google_competitors_domain`, then `tavily_map` / `tavily_extract` per competitor, schema via raw HTML. If your DataForSEO account includes the backlinks module (check once with `backlinks_summary`), run the `seo-backlink-audit` skill for profile shape, toxic flags and competitor-gap outreach targets. No Ahrefs subscription needed.
- **Track C**: `kw_data_google_ads_search_volume` (batch), `dataforseo_labs_google_keyword_ideas`/`_suggestions`, `dataforseo_labs_bulk_keyword_difficulty`, `dataforseo_labs_search_intent`, `kw_data_google_trends_explore`. Output includes the 15-topic content plan. (Track C is sale-stage, site-level. Per-topic delivery-stage research = the `keyword-fanout-map` skill, per `sop/06-content-engine-sop.md`.)

Synthesis scored per `reference/scoring-rubric.md`: P1 bleeding signal, P2 growth levers (striking-distance 11-30 first), P3 polish. Every finding: evidence (tool + number + date), plain-language impact, effort.

**Cannibalization pass** (cheap, high-value, easy to skip): map every keyword cluster to the page that ranks for it. Flag clusters where NO page exists (content gap) and clusters where two or more pages compete for the same intent (cannibalization, name both URLs and say which should win). This is what turns a keyword list into a page strategy, and it is what the proposal's page-matrix line item is built from.

**Receipts rule:** every P1/P2/P3 line names the query, the page, and the number behind it. A finding that cites "best practices" instead of data does not ship.

## Discipline

- Check `clients/{slug}/` for existing data before paid API calls; full audit should cost $2-5.
- Update `DASHBOARD.md`: stage = audit, date, next action.
