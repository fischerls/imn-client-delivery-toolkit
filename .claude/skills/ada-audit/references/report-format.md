# Scoped accessibility report

Lead with what was found, what was tested, and what remains unresolved. Do not equate WCAG findings with a legal ADA determination. A sampled audit does not establish whole-site conformance. See [W3C evaluation methodology](https://www.w3.org/TR/WCAG-EM/#conformance).

## Note structure

Use vault frontmatter with `type: research`, date, project, department, status, and at least two specific tags. Link the note from the project or active profile. Keep the scan, full raw evidence, discovery coverage, and manual records alongside the report.

1. **Conclusion:** Confirmed barriers on tested pages/states, their user impact, and unresolved coverage. Example: “The tested quote-request flow has two confirmed accessibility barriers. The booking widget and screen-reader checks remain untested. Whole-site conformance has not been determined.” If no barriers were confirmed, say exactly that and retain the scope limitations.
2. **Scope and method:** Requested target/version/level; exact URLs and states; selection rationale; complete journeys; dates; tools/browser/OS/AT versions; viewports/zoom; authentication; third-party/documents scope; discovery caps/exclusions; failed or blocked pages. State what was not tested.
3. **Confirmed findings:** Stable finding ID, criterion and level, user consequence, priority, affected URLs/states, exact selector/frame/shadow path, steps to reproduce, observed and expected behavior, evidence, and source-level fix. Group repeated root causes without discarding individual locations. Distinguish unique elements from observations repeated across viewports.
4. **Manual criterion coverage:** PASS, FAIL, NEEDS REVIEW, NOT TESTED, or NOT APPLICABLE for each criterion in `manual-layer.md`, with evidence/rationale and scope. Never manufacture a pass to fill a table.
5. **Unresolved items and limitations:** Incomplete axe checks, heuristic candidates, blocked pages, untested components/states, and missing assistive-technology coverage. Give the next verification step. Do not silently clear or count these as confirmed violations.
6. **Recommendations outside A/AA:** Best practices, AAA checks, policy/content improvements, and print-layout observations, clearly separate from the confirmed A/AA count.
7. **Remediation and retest:** Prioritize barriers blocking key user tasks, then broader shared defects. Identify the responsible shared component or content source. Estimate only with enough implementation context; state assumptions. Record before/after evidence and closure status per finding.

## Evidence rules

- Preserve both summary JSON and `.raw.json`. Raw results include complete node/check data, target arrays, engine/environment metadata, and incomplete results. Keep evidence for manually exercised states too.
- Confirm automated findings and evaluate exceptions before presenting them as final client findings. The script's A/AA verdict describes automated evidence; it is not a legal opinion.
- Preserve nested selector arrays for frame/shadow-root locations. Do not flatten them into CSS selectors.
- Credit tested strengths specifically, with the same evidence standard as failures.
- Do not infer failure from missing `tel:` links, an absent skip link, a small target, a CSS-rule count, or a document's lack of an accessibility statement alone.
- An incomplete result may become a confirmed failure after manual investigation. Unresolved items remain unresolved.
- Sampled clean results do not justify “ADA compliant,” “WCAG certified,” “lawsuit-proof,” or “every page passes.” A formal conformance claim requires meeting the applicable conformance requirements across its complete scope.
- Only include litigation context when requested, sourced, current, and relevant. Do not attribute another vendor's enforcement history to the audited site or vendor.

## Client-facing delivery

Use plain language and consequences, with a technical appendix containing criterion references and reproducible evidence. Keep the distinction between confirmed barriers, recommended improvements, and unfinished testing visible. An inaccessible audit report defeats its purpose: audit any HTML deliverable and evaluate any final PDF separately.
