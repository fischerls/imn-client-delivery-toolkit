# SOP 01: SEO Audit

Three independent research tracks, then a synthesis pass. Run tracks in parallel (subagents) when possible. All outputs to `clients/{slug}/`.

Tool names below are DataForSEO/Tavily MCP tool suffixes; your install prefixes them with the registered server name.

---

## Track A: Site Audit → `site-audit.md`

### A1. On-page crawl
`on_page_instant_pages` on the homepage + 3-5 key pages (services, about, contact). Capture:
- Duplicate/parameterized URLs, redirect chains
- Canonical tags (correct? pointing at the served host? www vs non-www mismatch is a classic P1)
- Title/meta description presence + length
- H1 presence and hierarchy (H1 > H2 > H3, no skips)
- Schema markup present (LocalBusiness? Service? FAQPage? usually none: that's an opportunity)
- Page weight, internal link counts, image alt coverage

### A2. Lighthouse
`on_page_lighthouse` on the homepage (mobile). Record all four scores (SEO, Performance, Accessibility, Best Practices) plus LCP, CLS. LCP > 2.5s = P1.

### A3. Current rankings
`dataforseo_labs_google_ranked_keywords` for the domain (location-targeted). Capture:
- Total keywords ranked, average position
- The striking-distance pool: every keyword at position 11-30 (export the full list: this is the proposal's biggest growth lever)
- Estimated traffic value (ETV): translates to "$X/mo of free Google traffic equivalent"

### A4. Domain overview
`dataforseo_labs_google_domain_rank_overview`: domain rank, organic traffic estimate, movement.

### A5. Google Business Profile
`business_data_business_listings_search` for the business name + city. Capture: claimed status, rating, review count, category, NAP consistency vs the website footer.

### A6. Tech stack
`domain_analytics_technologies_domain_technologies`: CMS, hosting signals, exposed versions (WordPress version exposure = P3 security note).

---

## Track B: Competitor Teardown → `competitor-teardown.md`

### B1. Identify competitors
`serp_organic_live_advanced` for 3-5 head terms ("{service} {city}"). The 3 domains appearing most across SERPs = the competitor set. Confirm with `dataforseo_labs_google_competitors_domain`.

### B2. Map each competitor
`tavily_map` per competitor: total pages, nav structure, service-page count, location-page count, blog volume.

### B3. Depth analysis
`tavily_extract` on each competitor's top service page + one location page. Score: word count, H2 count, FAQ presence, image count, schema depth (fetch raw HTML for JSON-LD inspection).

### B4. Authority proxy
`dataforseo_labs_google_ranked_keywords` per competitor: organic keyword count x ETV as the authority proxy. (Backlinks API usually unsubscribed; note the limitation.)

### B5. Gap synthesis
Side-by-side matrix: pages, schema, content depth, locations, blog, authority proxy. Then list shared weaknesses: these become "what we'll do better" in the proposal. Patterns to check (found repeatedly in real audits):
- No Service or FAQPage schema on service pages
- Thin service pages (330-540 words, no FAQs)
- Weak or absent location pages
- No content-format diversity (no tables, calculators, video)
- Big Google review counts not surfaced on-site

---

## Track C: Keyword Research → `keyword-research.md`

### C1. Seed + expand
Build seed list: {service} x {city} combinations + the client's service menu. Expand with `dataforseo_labs_google_keyword_ideas` and `dataforseo_labs_google_keyword_suggestions`.

### C2. Metrics
`kw_data_google_ads_search_volume` (batch, location-targeted to the city/metro): volume, CPC, competition. `dataforseo_labs_bulk_keyword_difficulty` for KD.

### C3. Intent + PAA
`serp_organic_live_advanced` on top terms: capture People-Also-Ask questions and related searches: these seed informational content. `dataforseo_labs_search_intent` to split commercial vs informational.

### C4. Seasonality
`kw_data_google_trends_explore` on 3-5 head terms, 12 months: identify the demand curve (e.g. HVAC swings 10x trough-to-peak). Content calendar timing comes from this.

### C5. Content plan
15 topics mapped to: decision/commercial intent, locally-specific angles, seasonal ramps, troubleshooting queries (PAA-sourced). Each topic: target keyword, volume, intent, planned publish window.

---

## Synthesis → `opportunity-list.md`

Merge all three tracks using `templates/audit-report.md`. Score every finding P1/P2/P3 per `reference/scoring-rubric.md`. Each finding: evidence (tool, number, date), business impact in plain language, estimated effort. This document is the spine of the proposal.
