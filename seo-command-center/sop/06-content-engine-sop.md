---
type: sop
date: 2026-07-31
department: client-delivery
status: active
tags: [seo, content-engine, ai-visibility, routines]
---

# SOP 06 · Content Engine & AI Visibility

The production engine that runs inside the delivery playbook Phase 6 (the Growth Program retainer). SOPs 01-05 cover the client lifecycle: prospect, audit, propose, launch, report. This SOP covers what actually gets built every week once the retainer is live.

Powered by six skills installed in `.claude/skills/` (source: AI Ranking School 5-skill system, adapted to vault conventions):

| # | Skill | Does | Output (in `clients/{slug}/`) |
|---|---|---|---|
| 0 | `site-brief-builder` | One-time client context file all others read | `site-brief.md` |
| 1 | `keyword-fanout-map` | Intent-clustered keyword map + AI fan-out questions | `01-keyword-map.csv` + HTML dashboard |
| 2 | `seo-content-writer` | Citation-ready page/post (answer capsules, sources, schema) | `draft.md` + content package |
| 3 | `onpage-optimizer` | Page-type-aware on-page audit + rewrites | on-page report |
| 4 | `internal-link-architect` | Exact internal links in/out with anchor text | internal-links report |
| 5 | `ai-visibility-checker` | LLM citation tracking (ChatGPT, AI Overviews, Perplexity), gap list | AI visibility report |

All six use the `mcp__dataforseo__*` connector (already wired, AI_OPTIMIZATION module included). AI citation data is US/English only for now; run it anyway and note the caveat for non-US clients.

Three more skills sit alongside them, added 2026-08-05 after benchmarking against the Claude SEO Playbook (SCALE AI / Mike). They cover the one thing the six were blind to: **the agency's own first-party data**.

| # | Skill | Does | Output |
|---|---|---|---|
| 6 | `seo-quick-wins` | GSC striking-distance queries scored by impressions × CTR gap, grouped by the fix that unlocks them | `quick-wins-{date}.md` |
| 7 | `seo-tech-debt` | Technical findings turned into paste-ready dev tickets ranked by traffic at risk | `tech-debt-{date}.md` |
| 8 | `seo-backlink-audit` | FLAG / PROTECT / PURSUE from the DataForSEO backlinks module | `backlinks-{date}.md` |

## Three operating rules (apply to every skill above)

1. **First-party before paid.** If the site is in `mcp__gsc__list_properties` or `mcp__google-analytics__get_account_summaries`, pull from there first. GSC reports what Google actually served; `ranked_keywords` estimates it. Free beats $2, and the client can verify it in their own account.
2. **Receipts or it doesn't ship.** Every recommendation names a query, a page, and a number. "Best practice" with no data attached gets cut.
3. **Output = the action.** A ticket, a rewritten title, a link with its anchor and host sentence, three priorities. If the operator still has to translate the output into work, the run is not finished.

Which properties are connected: run `mcp__gsc__list_properties` and `mcp__google-analytics__get_account_summaries` and see. Anything not listed is a cold prospect until they invite you.

## Where they plug into the existing system

- **`seo-audit` stays the sale-stage instrument.** Site-level, feeds the proposal. `keyword-fanout-map` is the delivery-stage instrument: per-topic, feeds each article. Do not swap one for the other.
- **`site-brief-builder` runs once at onboarding** (right after Phase 5 launch, or during audit if content work starts pre-launch). It reuses what the audit already found; do not re-interview the client for facts sitting in `audit-*.md`.
- **`ai-visibility-checker` becomes section 6 of the monthly `seo-report`.** Citations gained per month is the new headline metric alongside rank movement.
- **The gap list closes the loop:** queries the client should own but does not get fed back into `keyword-fanout-map` as next month's seeds.

## The engine, per client

### One-time: onboarding (Phase 5 → 6 handoff)

1. Run `site-brief-builder` on the client's live site. Feed it the existing `audit-*.md` and proposal so it interviews the user only on true gaps (voice, say/don't-say, named author, money pages).
2. Verify `site-brief.md` by hand once. Everything downstream inherits its errors.
3. Run `ai-visibility-checker` once and store as the **AI citation baseline**, same logic as the rank baseline in `sop/04-launch-checklist.md`.

### Weekly Loop A · Publish (one new page/post per week per retainer)

1. `keyword-fanout-map` on the next seed (from the audit's 15-topic plan, or last month's AI gap list).
2. `seo-content-writer` on the winning cluster. Answer the first-hand-experience question with real client material: job photos, numbers, a story from the owner. This is the anti-slop input; never skip it.
3. `onpage-optimizer` on the draft before it ships.
4. `internal-link-architect` on the draft; apply the anchor placements both directions.
5. Publish, then submit the URL in GSC (`mcp__gsc__*`).

### Weekly Loop D · Harvest (new, run this one first each week)

The highest-ROI hour in the retainer, and free. Google already thinks these pages are relevant; they just have not earned the click yet.

1. `seo-quick-wins` on the client's GSC property.
2. Ship every title/meta row the same session. They are 10-minute edits and they move impressions the client already has.
3. Content rows → next week's Loop A seed (they beat a cold keyword from the topic plan, because demand is proven).
4. Link rows → `internal-link-architect`. Cannibalization rows → `onpage-optimizer` on both URLs.
5. Second run onward, lead with the diff: which fixes moved which queries. That diff is the retainer's receipt.

### Weekly Loop B · Rescue (the crawled-not-indexed grind)

1. GSC → Pages → "Crawled, currently not indexed". Pick 1-2 pages.
2. `onpage-optimizer` on each, apply the fixes, `internal-link-architect` if the page is under-linked (orphan pages usually are).
3. Request re-indexing in GSC. Log which URLs were resubmitted in the client README so next week picks different ones.

### Monthly Loop C · Measure (feeds the seo-report)

1. `ai-visibility-checker` vs baseline: citations by engine, queries owned, gap list.
2. Fold into the monthly report per `sop/05-monthly-report-sop.md`.
3. Top 3 gap queries become Loop A seeds for next month. Write them in the client README under "next up".

## Routine prompts (copy-paste)

**Onboard a new SEO client:**
> Onboard {client} for the SEO content engine. Run site-brief-builder on {url}, pulling everything you can from clients/{slug}/ first, then run ai-visibility-checker and save it as the AI citation baseline. Follow sop/06-content-engine-sop.md.

**Weekly publish run:**
> Run the weekly SEO publish loop for {client} per sop/06-content-engine-sop.md Loop A. Seed: {keyword or "pick the next one from the topic plan / gap list"}. Ask me only the page type, angle, and first-hand-experience questions.

**Weekly harvest run (do this before the publish run):**
> Run seo-quick-wins for {client}. Ship the title/meta fixes now, hand me the content and link rows, and diff against the last quick-wins file.

**Weekly rescue run:**
> Run the weekly index-rescue loop for {client} per sop/06-content-engine-sop.md Loop B. Check GSC crawled-not-indexed, fix the top 2 pages, resubmit, log the URLs.

**Monthly measure run:**
> Run ai-visibility-checker for {client}, compare to baseline, and fold the results into the monthly seo-report. Add top 3 gap queries to next month's content seeds.

## Cadence at a glance

| When | What | Skills |
|---|---|---|
| Client onboarding, once | Brief + AI baseline + tech debt + backlink baseline | site-brief-builder, ai-visibility-checker, seo-tech-debt, seo-backlink-audit |
| Weekly (first) | Loop D harvest | seo-quick-wins → title/meta fixes shipped same session |
| Weekly | Loop A publish | keyword-fanout-map → seo-content-writer → onpage-optimizer → internal-link-architect |
| Weekly | Loop B rescue | onpage-optimizer, internal-link-architect, GSC |
| Monthly | Loop C measure + report | seo-quick-wins diff → ai-visibility-checker → seo-report |
| Quarterly | Strategy refresh + link + tech re-check | keyword-fanout-map on all money pages, seo-tech-debt, seo-backlink-audit |

%% Future: wrap Loops A-C into a per-client *-loop skill with write-run-log once 2+ retainer clients are live. Don't build it for zero clients. %%
