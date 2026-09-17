# Website accessibility release checklist

Target WCAG 2.2 AA. Use the [bundled ADA audit](../.claude/skills/ada-audit/SKILL.md) and its [manual criterion matrix](../.claude/skills/ada-audit/references/manual-layer.md) for the maintained procedure.

1. Define pages, components, interaction states, user journeys, third-party widgets, and documents in scope. Record everything left untested.
2. Run axe at desktop and mobile widths, retain full raw evidence, and inspect incomplete results.
3. Check 320px reflow, 200% text resizing, and text spacing. Inspect clipped content and overlays, not just horizontal scrollbars. Evaluate applicable exceptions.
4. Test keyboard operation, bypass mechanisms, focus order/visibility, opened menus/dialogs, form errors, media alternatives, dragging alternatives, authentication, and status announcements.
5. Complete applicable screen-reader checks in a recorded browser/assistive-technology pairing. If that testing is unavailable, mark it NOT TESTED.
6. Report PASS, FAIL, NEEDS REVIEW, NOT TESTED, or NOT APPLICABLE with evidence. Confirm heuristic findings and exceptions before counting violations.
7. Fix shared defects in shared source, retest affected pages/states, and retain before-and-after evidence.

A target smaller than 24px is not automatically a failure: spacing and other exceptions matter. A zero focus-rule count does not establish invisible focus. A missing skip link alone does not prove that no supported bypass mechanism exists. Reduced-motion interaction animation criterion 2.3.3 is AAA and stays outside AA failure counts.

For PDF output, use 720px as Letter content width with half-inch margins. Render and inspect the final PDF. Check PDF tags, reading order, headings, links, tables, and alternative text separately; passing print geometry does not establish PDF accessibility.

A clean automated screen is not a legal ADA determination or a whole-site WCAG conformance claim. Use the [scoped report guidance](../.claude/skills/ada-audit/references/report-format.md).
