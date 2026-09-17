# SOP 01: Prospecting

Find local businesses worth pitching. The ideal client profile: **good at the work, bad at the internet**: strong review count proves demand and quality; weak website/rankings proves the gap you'll close.

## Step 1: Pull the market

`business_data_business_listings_search`: niche keyword x city. Pull wide (50-100 raw). Capture per business: name, website URL, rating, review count, claimed status, address, category.

## Step 2: Qualify

| Signal | Keep | Drop |
|---|---|---|
| Ownership | Owner-operated local SMB | National chain, franchise, PE rollup |
| Reviews | 25+ at 4.0+ (proof they're good) | < 10 reviews (too early) |
| Website | Dated, thin, slow, or none | Modern site already ranking #1-3 |
| Agency | No agency fingerprints | Active agency (fresh blog, schema, clean structure) |

Agency fingerprints check: look at the site footer (agency credit), blog freshness, schema presence.

## Step 3: Snapshot keepers

One `dataforseo_labs_google_domain_rank_overview` per keeper: organic keyword count + traffic estimate. A business with 300 reviews and 12 ranked keywords is the perfect prospect.

## Step 4: Score and write up

- **A:** strong reviews + weak organic + no agency. Call first.
- **B:** one factor off (mid reviews, or some organic presence).
- **C:** long shot (keep for a slow week).

Output `prospects/{YYYY-MM-DD}-{market}-{niche}.md`: scored table + one-line pitch angle per prospect ("400 reviews but invisible on Google outside the map pack"). Update `DASHBOARD.md`.

## Cost guard

Snapshots only for qualified keepers. 20-prospect batch ≈ under $2.
