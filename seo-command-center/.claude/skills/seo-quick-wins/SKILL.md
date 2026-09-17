---
name: seo-quick-wins
description: "Find striking-distance queries (position 5-20) in Search Console and group them by the fix that unlocks them. Use for \"quick wins\", \"page 2 keywords\", \"striking distance\"."
---

# SEO Quick Wins (first-party)

## When to use

'Find the striking-distance queries a site already earns impressions for (position 5-20) and rank them by opportunity using real Search Console data, then group them by the fix that unlocks them (title/meta, content depth, internal links). Use when the operator says "quick wins", "page 2 keywords", "striking distance", "what''s the fastest SEO win for {client}", or before any monthly report or audit-to-proposal handoff. Free: uses GSC only, zero API spend.'

> [!important] Command Center routing
> - Working folder = `clients/{slug}/`
> - Data source = `mcp__gsc__*` (the operator's own Search Console). No DataForSEO spend.
> - Delivery context: the delivery playbook Phase 6. Cadence: `sop/06-content-engine-sop.md` Loop D.

Third-party rank trackers estimate. Search Console reports what Google actually
served. When both are available, **first-party wins**: this skill exists so the
striking-distance list comes from impressions the operator can prove, not from
`ranked_keywords` guesses.

## Before you start

Confirm the property is in the account: `mcp__gsc__list_properties`.

Property not in the list → say so and stop. Do **not** substitute
`dataforseo_labs_google_ranked_keywords` and call it quick wins: it is a different
dataset and the numbers will not match the client's own GSC when they look.

Read `site-brief.md` if present for money pages and service area.

## Process

### Step 1: Pull

`mcp__gsc__get_search_analytics` (or `get_advanced_search_analytics` for filters),
last 90 days, dimensions `query` + `page`, row limit high enough to cover the tail.

Filter to: average position **5-20**, impressions **≥ 100** (drop to ≥ 30 for small
local sites: say which floor you used).

### Step 2: Score

```
opportunity = impressions × (ctr_at_position_3 − current_ctr)
```

CTR curve (state it in the report so the math is auditable):
pos 1 ≈ 28%, 2 ≈ 15%, 3 ≈ 11%, 5 ≈ 6%, 8 ≈ 3%, 10 ≈ 2.5%, 12 ≈ 1.5%, 15 ≈ 1%, 20 ≈ 0.6%.

Report per row: query, page, position, impressions, current clicks, current CTR,
estimated clicks at position 3, delta.

### Step 3: Segment before ranking

Money pages first, per `site-brief.md`. A position-8 service-page query beats a
position-3 blog query for a local business, every time. If the brief is missing,
infer money pages from URL pattern (`/services/`, `/{city}-{service}/`, contact,
booking) and say you inferred.

Drop or bucket separately: branded queries (the business name and misspellings of
it). They inflate the list and cannot be "won": they are already won.

### Step 4: Group by the fix

Every row goes into exactly one bucket, because the bucket *is* the work order:

- **Title/meta mismatch**: the ranking page's title or H1 does not contain the
  query. Pull the live title (`mcp__dataforseo__on_page_instant_pages`, or fetch the
  page). Cheapest fix in SEO. Give the rewritten title, under 60 chars.
- **Content depth**: page matches intent but is thin or does not answer the query
  directly. Names the section to add. Hand to `seo-content-writer`.
- **Internal links**: page is under-linked for the topic. Hand to
  `internal-link-architect`; do not guess the anchors here.
- **Wrong page ranking**: a blog post ranks for a transactional query that a
  service page should own. Flag as cannibalization, name both URLs.

### Step 5: Diff against last run

If `quick-wins-*.md` exists in the client's `seo/` folder, compare: which queries
moved, which fixes shipped and worked, which did not. **A quick-wins report with no
diff on the second run is a wasted run**: the diff is what proves the work.

## Output

`clients/{slug}/quick-wins-{YYYY-MM-DD}.md`

Frontmatter: `type: seo-analysis, date, project, department: Client Delivery,
status, tags`.

Sections: top 20 table (scored), the four fix buckets with named actions, the diff
vs last run, and **exactly 3 priorities** for the week, each tied to a number.
Three, not ten. A list of ten ends in zero.

## Honesty rules

- Never write an impression or position number that did not come from the API. GSC
  down or property missing → say so, produce nothing.
- The position-3 estimate is a model, not a promise. Label it "estimated".
- If the list is short because the site is small, say so. A 6-row honest list beats
  a padded 20.
- Branded queries reported separately, never folded into the win count.

## Handing off

> Title/meta rows: fix them today, they are 10-minute edits.
> Content rows → `seo-content-writer`. Link rows → `internal-link-architect`.
> Cannibalization rows → `onpage-optimizer` on both URLs before touching either.

For a prospect (no GSC access yet), this skill cannot run. Use `seo-audit` Track C
instead, and make GSC + GA4 manager access a line item in the proposal.
