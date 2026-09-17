# Tool Catalog

What each MCP tool is for in this kit. Names are suffixes; your install prefixes them with the server name (e.g. `mcp__dataforseo__`).

## DataForSEO: audit & keyword engine

| Tool | Used in | Purpose |
|---|---|---|
| `on_page_instant_pages` | Audit A1 | Crawl a page: canonicals, meta, headings, schema, weight, links |
| `on_page_lighthouse` | Audit A2 | Lighthouse scores + Core Web Vitals |
| `dataforseo_labs_google_ranked_keywords` | Audit A3, B4 | Every keyword a domain ranks for, with positions + ETV |
| `dataforseo_labs_google_domain_rank_overview` | Audit A4 | Domain authority + traffic estimate |
| `business_data_business_listings_search` | Audit A5, prospecting | GBP state: rating, reviews, claimed, NAP |
| `domain_analytics_technologies_domain_technologies` | Audit A6 | CMS + tech stack detection |
| `serp_organic_live_advanced` | Audit B1, C3 | Live SERPs: who ranks, PAA questions, related searches |
| `dataforseo_labs_google_competitors_domain` | Audit B1 | Confirm the competitor set |
| `dataforseo_labs_google_keyword_ideas` / `_suggestions` | Audit C1 | Keyword expansion from seeds |
| `kw_data_google_ads_search_volume` | Audit C2 | Volume + CPC, batched up to 1,000 keywords |
| `dataforseo_labs_bulk_keyword_difficulty` | Audit C2 | KD scores in bulk |
| `dataforseo_labs_search_intent` | Audit C3 | Commercial vs informational split |
| `kw_data_google_trends_explore` | Audit C4 | 12-month seasonality curve |

**Not available without extra subscription:** `backlinks_*` (use ranked-keyword footprint as authority proxy).

## Tavily: competitor crawling

| Tool | Used in | Purpose |
|---|---|---|
| `tavily_map` | Audit B2 | Full site structure: page counts by section |
| `tavily_extract` | Audit B3 | Page content for depth scoring (words, FAQs, structure) |

## Google Search Console (optional, existing clients only)

Capabilities used generically: search analytics (queries, impressions, CTR), URL inspection (indexing state), sitemap status/submission. Only relevant once the client has invited you as manager.

## Cost guide (DataForSEO, approximate)

- Live SERP call: ~$0.002-0.01 each
- Search volume: ~$0.05 per 1,000 keywords (batch!)
- Labs calls (ranked keywords, ideas): ~$0.01-0.10 each
- On-page crawl + Lighthouse: ~$0.01-0.10 per page
- Full single-client audit: typically **$2-5 total**
