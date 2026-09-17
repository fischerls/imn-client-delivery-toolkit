# Scoring Rubric: P1 / P2 / P3

Every audit finding gets exactly one score. When in doubt between two tiers, ask: "does this bleed signal today?" Yes → P1. "Does fixing it directly grow traffic?" Yes → P2. Otherwise P3.

## P1: Fix now (bleeding signal)

The site is actively losing credit it has already earned.

- Canonical misconfiguration (points to a host that isn't served, www/non-www split)
- Duplicate or parameterized URLs indexed
- Indexing failures (key pages not in Google)
- LCP > 2.5s mobile, or page weight > 3 MB
- Missing/broken sitemap or robots.txt blocking real pages
- Unclaimed or duplicate Google Business Profile

## P2: High value (growth levers)

Direct, provable growth if acted on.

- Striking-distance keywords: anything ranked 11-30 (page 2). The single biggest lever in most audits: refresh content + internal links moves these.
- Core cluster at positions 2-5 that could take #1 (high-volume head terms)
- Thin or missing location pages where competitors have them
- Missing service pages for services the business actually sells
- Schema absent where competitors also lack it (open lane: FAQPage, Service, AggregateRating)
- Review count materially below market leader

## P3: Polish

Worth doing, doesn't move rankings alone.

- Heading markup cleanup (literal tabs/newlines in H1s, duplicate H1s)
- Image alt-text coverage
- CMS version exposure (security hygiene)
- Backlink audit (when subscription allows)
- On-site review display (schema + widgets)
