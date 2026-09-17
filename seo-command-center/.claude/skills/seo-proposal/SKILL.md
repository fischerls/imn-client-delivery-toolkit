---
name: seo-proposal
description: "Turn a completed SEO audit into a client-ready two-phase proposal (Foundation Fix + Growth Program). Use when the user asks for an SEO proposal, pitch, or engagement plan for a business with audit files in its project folder. If no audit exists, run the seo-audit skill first."
---

# SEO Proposal

Detailed steps: `sop/03-proposal-sop.md`. Delivery context: the delivery playbook (Phase 3).

## Preconditions

Audit files exist in `clients/{slug}/`. Missing → run `seo-audit` first. Never propose from assumptions; every claim cites an audit number.

## Pricing + branding (from `config.md`, never invented)

- Phase 1: Foundation Fix: the `PHASE1_PRICE` in `config.md`, one-time
- Phase 2: Growth Program: the `PHASE2_PRICE` in `config.md`, monthly, billing from month 2
- Recurring engine name: the `PRODUCT_NAME` in `config.md`. Never name the white-label vendors behind it in a client-facing document.
- Deviations from config prices: ask the user first.

## Structure (template: `templates/proposal.md`)

1. The situation: 3-5 audit findings translated to money/customers, competitors named.
2. Phase 1 itemized from P1 findings + structural work (page matrix, GA4/GSC, hosting if bottleneck).
3. Phase 2 itemized; content calendar seeded from the 15-topic plan with seasonality timing.
4. Access by invite, never passwords (GBP manager invite, GSC manager invite and GA4 viewer invite, all to the agency Google account tied to the contact email in `config.md`; wording in `templates/credentials-request-email.md`).
5. Measurement: baseline snapshot at kickoff, monthly before/after.

## Output routing

`clients/{slug}/proposal.md`. Frontmatter with `client`, `date`, `status: draft`. Offer an HTML render for sending.

## Discipline

Update `DASHBOARD.md` (stage = proposal-drafted or proposal-sent + date). Business-owner language throughout.
