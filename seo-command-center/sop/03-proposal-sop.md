# SOP 02: Proposal

Converts audit outputs into a signed engagement. Inputs: everything in `clients/{slug}/`. Output: `clients/{slug}/proposal.md` (offer HTML render after).

## Step 1: Pull config

Read `config.md`: agency identity, Phase 1 price, Phase 2 price, recurring product name. These are the only sources for pricing and branding. Placeholders present → stop, ask user.

## Step 2: Select the story

From `opportunity-list.md`, pick the 3-5 findings with the clearest money impact. Translate each:

| Audit finding | Proposal language |
|---|---|
| 76 keywords at position 11-30 | "76 searches where you're on page 2: one push from being seen" |
| LCP 3.1s, 4.6 MB page | "Your site takes 12 seconds to fully load; visitors leave at 3" |
| Canonical points to www, serves non-www | "Google sees two copies of your site and splits your credit between them" |
| Competitor has 40 location pages, client has 3 | "{Competitor} shows up in 40 nearby towns; you show up in 3" |

## Step 3: Scope Phase 1 (Foundation Fix, one-time)

From P1 findings + structural gaps. Standard inclusions (cut what doesn't apply):
- Site rebuild or technical overhaul (kill duplicate URLs, clean structure)
- Heading hierarchy + per-page meta
- Service x location page architecture (the matrix: every service x every target town)
- JSON-LD schema on every page (LocalBusiness + Service + FAQPage + AggregateRating + BreadcrumbList)
- Hosting migration if current host is the speed bottleneck
- GA4 + Google Search Console install and verification
- Baseline rank snapshot (so month-one results are measurable)

## Step 4: Scope Phase 2 (Growth Program, monthly)

The recurring engine, named per config:
- Google Business Profile management (fresh posts, Q&A)
- Review campaign (keyword-rich requests, replies, negative-review handling)
- Content calendar: first 90 days seeded from the 15-topic plan, timed to the seasonality curve
- Funnels + lead magnets on high-intent pages
- Monthly report: rank movement vs baseline, GA4/GSC traffic, GBP metrics

## Step 5: Access request section

Invite-based only, never passwords: domain/DNS (delegated), hosting admin, CMS admin, Google Business Profile (manager invite), Google Search Console (manager), GA4 (manager). One line of reassurance: the client keeps ownership of everything.

## Step 6: Assemble

Fill `templates/proposal.md`. Rules:
- Every claim cites an audit number.
- Both phases together, with one sentence on why the fix alone underdelivers.
- Investment table: Phase 1 one-time, Phase 2 monthly starting month 2.
- Close with the next step (one sentence, one action).
