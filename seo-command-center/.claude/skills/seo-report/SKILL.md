---
name: seo-report
description: "Produce the monthly client SEO report for an active client: rank movement vs baseline, GBP, traffic, work completed. Use when the user asks for a monthly report, client report, or SEO progress report for a client in clients/. Requires a baseline snapshot (or creates one, clearly dated)."
---

# Monthly SEO Report

Detailed steps: `sop/05-monthly-report-sop.md`. Delivery context: the delivery playbook (Phase 6). Template: `templates/monthly-report.md`.

## Preconditions

Baseline snapshot in `clients/{slug}/` (launch.md or the earliest audit file). None → take one now, label it baseline with today's date, tell the user results before this date are unprovable.

## Flow

1. **Current ranks**: `dataforseo_labs_google_ranked_keywords` (same location settings as baseline; consistency beats precision).
2. **Compare**: vs last month's report, vs baseline, vs the striking-distance list. Headline = single best number, translated to plain language.
3. **GBP pulse**: `business_data_business_listings_search`: reviews + rating delta.
4. **GSC/GA4**: if the GSC and GA4 MCPs are installed (INSTALL.md, optional section) and the client property is connected, use them: `get_performance_overview` / `compare_search_periods` (GSC), `run_report` (GA4). Property not connected → omit the section, never fake it. Include:
   - **Branded vs non-branded clicks**, this month vs last. Non-branded growth is the number that proves SEO is working; branded growth usually proves the ads or the truck wrap is working. Say which one moved.
   - **Quick-wins diff**: run `seo-quick-wins` and compare to last month's file: which striking-distance queries we worked on actually moved. This is the section that makes the report feel like proof instead of a dashboard screenshot.
   - **Tech debt shipped**: P1 tickets closed from `tech-debt-*.md`, with the traffic they protected.
5. **Work log**: from `clients/{slug}/status.md`, or ask.
6. **AI visibility**: run the `ai-visibility-checker` skill vs the client's AI citation baseline: citations per engine (ChatGPT, AI Overviews, Perplexity), queries owned, gap list. Citations gained is a co-headline metric with rank movement. Top 3 gap queries → next month's content seeds (log in `clients/{slug}/status.md`). US/English data only for now; note the caveat for non-US clients.

## Honesty rule

Flat/down month: say so, with the why (seasonality curve from the audit, algo update, new competitor) and the adjustment. No vanity-metric padding. This report justifies the monthly retainer.

## Output routing

`clients/{slug}/reports/{YYYY-MM}.md`, frontmatter with `client` and `date`. Update `DASHBOARD.md` (report delivered + next action).
