# SOP 05: Monthly Client Report

The report that justifies the retainer. Due by the report day in `config.md`. Output: `clients/{slug}/reports/{YYYY-MM}.md` from `templates/monthly-report.md`.

## Step 1: Current state

- `dataforseo_labs_google_ranked_keywords` for the client domain (same location settings as baseline: consistency matters more than precision).
- `business_data_business_listings_search` for GBP review count + rating.
- GSC/GA4 numbers if access exists (impressions, clicks, CTR, organic sessions). No access → omit the section entirely.

## Step 2: Compare

Three reference points, in priority order:
1. **vs last month's report** (the month-over-month story)
2. **vs baseline in launch.md** (the "since we started" story: the retention argument)
3. **vs the striking-distance list** (which targeted keywords moved into page 1)

Headline = the single best number, translated: "You now show up on page 1 for 9 more searches than when we started, including 'ac repair {city}' (480 searches/month)."

## Step 3: Work log

What shipped this month: GBP posts, blog posts, pages built, reviews gained, technical fixes. Pull from `status.md` or ask the user. Every item one line.

## Step 4: Flat-month honesty

Rankings flat or down → say so, with the why (seasonality from the audit's trends curve, algorithm update, new competitor) and the adjustment. Never pad a bad month with vanity metrics.

## Step 5: Next month

3 bullets max: the next content topics (from the 15-topic plan), the next technical item, the next GBP push. Update `DASHBOARD.md`: report delivered, date, next action.
