---
name: seo-backlink-audit
description: "Audit a domain's backlink profile with DataForSEO: flag toxic patterns for review, list the links worth protecting, and rank outreach targets that link to competitors but not to this site. Use when the operator says \"backlink audit\", \"check our links\", \"toxic links\", \"link building targets\", \"who links to my competitors\", or during audit Track B. Never produces a disavow file."
---

# Backlink Audit

> [!important] Command Center routing
> - Working folder = `clients/{slug}/`
> - Data: `mcp__dataforseo__backlinks_*`. Needs the backlinks module on your DataForSEO account; confirm once with `backlinks_summary` on any domain.
> - No Ahrefs subscription needed. Do not recommend buying one.

## Cost guard

Backlink endpoints are the pricier DataForSEO calls. Summary + referring domains +
competitor intersection for one domain ≈ under $1. Do not pull the full backlink
export unless there is a reason. Check the `seo/` folder for a recent run first.

## Process

### Step 1: Profile shape

`backlinks_summary`: backlinks, referring domains, spam score, broken backlinks,
TLD and country mix, link types, first seen.

Read the mix, not just the totals. A profile that is 115 blogspot.com + 63 `.ru`
is a different animal from 252 clean local domains, at the same count.

### Step 2: FLAG (for review, never for auto-disavow)

`backlinks_bulk_spam_score`, `backlinks_anchors`, `backlinks_referring_networks`,
`backlinks_referring_domains`.

Flag: sitewide footer links from DR<5 domains, exact-match commercial anchor at an
unnatural rate, single-subnet/IP clusters (link networks), irrelevant
foreign-language directories, hacked-looking pages.

> [!warning] Disavow discipline
> Flagging is not disavowing. Google ignores most spam on its own, and a
> trigger-happy disavow file does more damage than the spam. **Never output a
> ready-to-upload disavow file.** Only recommend disavow when there is a manual
> action in GSC or the profile is genuinely radioactive, and say that out loud.

### Step 3: PROTECT

The 20 strongest links by rank × topical relevance. These are the ones to watch for
loss (`backlinks_bulk_new_lost_backlinks`) and the pattern outreach should
replicate. Broken backlinks (`broken_backlinks` in the summary) are free wins:
someone already linked, the target 404s. Fix the URL or 301 it.

### Step 4: PURSUE

`backlinks_domain_intersection` / `backlinks_competitors` against the competitors in
`site-brief.md` or the audit: domains linking to two or more competitors but not to
this site. Rank by domain rank × relevance. For local clients, weight local
relevance (chamber, supplier, association, local news, local blog) over raw rank -
a local supplier link beats a DR60 generic directory.

Give each target: domain, what it links to on the competitor, the realistic angle
(supplier page, sponsorship, association member list, local news hook).

## Output

`clients/{slug}/backlinks-{YYYY-MM-DD}.md`: three sections
FLAG / PROTECT / PURSUE, plus a two-line profile verdict in business language.
Frontmatter: `type: seo-analysis, date, project, department: Client Delivery,
status, tags`.

## Honesty rules

- Never list a link you did not receive from the API.
- Spam score is a vendor model, not a Google signal. Say so when it drives a flag.
- Do not promise a link-building outcome from a target list. It is a prospect list.

## Handing off

> PURSUE targets that are suppliers or local orgs → outreach in the client's
> project folder. FLAG list → review with the operator only; nothing gets disavowed
> without a manual action in GSC.
