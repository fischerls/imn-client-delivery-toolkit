# SOP 04: Launch Checklist

Runs when a proposal is signed. Goal: measurement wired in from day one, access secured properly, baseline locked. Output: `clients/{slug}/launch.md` with each item checked + dated.

## 1. Access requests (invite-based, never passwords)

Send the credentials-request email (`templates/credentials-request-email.md`). Track each grant:

- [ ] Domain/DNS: delegated access at the registrar
- [ ] Hosting: admin access
- [ ] CMS (WordPress etc.): admin login + DB access if migrating
- [ ] Email host: confirm DNS changes won't break mail
- [ ] Google Business Profile: manager invite (not ownership transfer)
- [ ] Google Search Console: manager invite to the config.md contact email
- [ ] Google Analytics 4: manager invite (same Google login as GSC)

The client keeps ownership of everything. If they don't have GA4/GSC yet, installing them is part of Phase 1.

## 2. Baseline snapshot (do this before touching anything)

- [ ] `dataforseo_labs_google_ranked_keywords` full export → save in `launch.md` (date-stamped)
- [ ] Striking-distance list (positions 11-30) extracted and saved
- [ ] Lighthouse scores + LCP recorded
- [ ] GBP review count + rating recorded
- [ ] Screenshot-equivalent of GSC performance (if access granted)

This baseline is the "before" in every future monthly report. Skipping it makes results unprovable.

## 3. Administrative

- [ ] Invoice sent: Phase 1 one-time (Phase 2 billing starts month 2)
- [ ] `clients/{slug}/status.md` updated: stage = launched, access matrix, key contact
- [ ] `DASHBOARD.md` updated
- [ ] First-month content plan pulled from the audit's 15-topic list (first 3 topics scheduled)
