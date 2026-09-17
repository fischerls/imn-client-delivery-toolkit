---
name: seo-prospect
description: "Pull and qualify local-business prospects for SEO outreach in a given market and niche. Use when the user asks to find prospects, build a lead list, or scan a market (e.g. \"find HVAC prospects in Tampa\"). Outputs a qualified, scored prospect list."
---

# Prospecting

Follow `sop/01-prospecting-sop.md`. Summary:

## Inputs (ask if missing)

- Niche (or default from `config.md` primary niches)
- Market/city (or default from config)
- Batch size target (default: 15-25 qualified)

## Flow

1. **Pull**: `business_data_business_listings_search` for the niche x market. Capture: name, website, rating, review count, claimed status, address.
2. **Qualify** (the filter that matters):
   - KEEP: owner-operated local SMBs, established (visible tenure), with a real service business
   - KEEP especially: decent review count (they're good at the work) + weak website (they're bad at the internet): that's the ideal client
   - DROP: national chains, franchises, businesses already ranking #1-3 organically for their head terms, agencies
3. **Snapshot each keeper**: one cheap `dataforseo_labs_google_domain_rank_overview` per qualified prospect: do they rank at all? Estimated organic traffic?
4. **Score**: A (weak site + strong reviews + no agency), B (one factor off), C (long shot).

## Output

`prospects/{YYYY-MM-DD}-{market}-{niche}.md`: table of qualified prospects with score, review count, organic footprint, and a one-line "the pitch angle" per prospect. Update `DASHBOARD.md` prospect-batch table.

## Cost guard

Domain-rank snapshots only for qualified keepers, not the raw pull. A 20-prospect batch should cost under $2.
