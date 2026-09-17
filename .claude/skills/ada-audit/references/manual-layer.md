# Manual evaluation and criterion coverage

The sweep screens initial page states. It does not complete a WCAG conformance evaluation. For each scoped page/component/journey, record the state, criterion, result, reproduction steps, observed behavior, and evidence. Use these outcomes:

- **PASS:** the applicable requirement was actually tested and met in the recorded scope.
- **FAIL:** a reproducible barrier violates the cited criterion after exceptions are considered.
- **NEEDS REVIEW:** evidence is inconclusive or a candidate requires confirmation.
- **NOT TESTED:** no adequate test was performed. State the missing access, tool, or work.
- **NOT APPLICABLE:** the relevant content/functionality is absent. State why.

Do not turn “axe found nothing” into a manual pass. Record browser, OS, viewport/zoom, assistive technology and version, date, and tested state. If a real screen reader is unavailable, leave those checks NOT TESTED; an accessibility-tree snapshot is useful but does not reproduce announcements or navigation behavior.

## Coverage matrix

Create rows for every applicable A/AA criterion below, splitting grouped rows where outcomes differ. These groups cover WCAG 2.2 A/AA; the normative text and exceptions remain authoritative. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/). SC 4.1.1 was removed in 2.2; account for it separately if an older target is requested.

| Criteria | What to evaluate beyond the initial-state scanner |
|---|---|
| 1.1.1 | Meaningful image/icon names; decorative images; complex graphics and equivalent information. Read alt text in context. |
| 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5 | Applicable audio/video alternatives, accurate synchronized captions, and audio description. Watch/listen to representative media, including live media where in scope. |
| 1.3.1, 1.3.2, 1.3.3 | Programmatic structure, tables, labels/groups, meaningful reading order, and instructions not dependent only on sensory characteristics. |
| 1.3.4, 1.3.5 | Orientation changes without unnecessary restriction; correct input-purpose identification for applicable personal-data fields. |
| 1.4.1, 1.4.2 | Information not conveyed by color alone; applicable automatic-audio controls. |
| 1.4.3, 1.4.5, 1.4.11 | Text and non-text contrast in normal/focus/hover/error/selected states, including photos/gradients; images of text and exceptions. Measure uncertain colors. |
| 1.4.4 | Resize text to 200% and inspect lost content/functionality. A viewport-meta probe alone is insufficient. |
| 1.4.10 | Inspect at 320 CSS pixels wide for vertical content (or 256 CSS pixels high for horizontal content), including browser zoom where appropriate. Check clipped content, fixed overlays, inner scrolling, and two-dimensional-content exceptions. |
| 1.4.12 | Apply line-height 1.5, paragraph spacing 2em, letter spacing .12em, word spacing .16em without changing other styles; inspect clipping, overlap, and lost controls. |
| 1.4.13 | Trigger hover/focus content; test dismissibility, hoverability, and persistence as applicable. |
| 2.1.1, 2.1.2, 2.1.4 | Complete key tasks with keyboard alone, including menus/dialogs and custom controls. Test traps, escape paths, and single-character shortcut controls. |
| 2.2.1, 2.2.2 | Applicable time limits, extension/adjustment, moving/blinking/scrolling/auto-updating content, and pause/stop/hide controls. |
| 2.3.1 | Flashing content and thresholds. If reliable measurement is unavailable, keep uncertain flashing content unresolved. |
| 2.4.1, 2.4.2, 2.4.3 | Repeated-block bypass, descriptive page titles, and logical focus order through complete tasks. Verify actual skip-link behavior if present. |
| 2.4.4, 2.4.5, 2.4.6 | Link purpose in context, multiple ways to locate pages where required, descriptive headings and labels. |
| 2.4.7, 2.4.11 | Visible keyboard focus and focused controls not entirely hidden by author-created content. Check sticky headers, banners, menus, footers, and dialogs. |
| 2.5.1, 2.5.2, 2.5.3, 2.5.4 | Alternatives for multipoint/path gestures, pointer cancellation, visible label included in accessible name, and motion-actuation alternatives. |
| 2.5.7 | Dragging tasks operable with a single pointer without dragging, unless an exception applies. Keyboard support alone does not satisfy this requirement. |
| 2.5.8 | Target dimensions and spacing; inline, equivalent, user-agent, and essential exceptions. Assess actual hit areas, not just visual size. |
| 3.1.1, 3.1.2 | Page language and changes in language; confirm actual content matches declarations. |
| 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.2.6 | Unexpected context changes, consistent navigation/identification, and help placement across the scoped pages. |
| 3.3.1, 3.3.2, 3.3.3, 3.3.4 | Labels/instructions, required state, identification and suggestion of corrections, preservation of input, and error prevention for applicable transactions/data. Trigger validation in a safe test flow. |
| 3.3.7, 3.3.8 | Avoid unnecessary repeated entry within a process; test applicable authentication without unsupported cognitive tests, including password-manager/paste support and exceptions. |
| 4.1.2, 4.1.3 | Accurate name/role/state/value for custom controls; announcements for applicable status changes. Exercise forms, filters, search, calculators, carts, and dialogs with assistive technology. |

## Essential interaction procedure

Choose representative complete journeys, not merely homepage/about/contact. Examples: navigate mobile menu to a service, request a quote through validation and success, filter/search results, book an appointment, authenticate, and complete checkout in a test environment. Record states omitted for lack of authorization or access. Include relevant embedded third-party widgets.

On desktop and mobile layouts, use Tab/Shift+Tab and expected widget keys (Enter, Space, arrows, Escape as appropriate). Check operation, focus order, focus visibility, focus containment in modal dialogs, and return focus after closing. Open accordions, menus, and dialogs before rerunning axe on those states. Retain the resulting full JSON with state labels.

For screen-reader tests, verify control names/state changes, reading order, validation messages, and result/status announcements in a declared browser/AT pairing. DOM presence of `aria-live` does not prove an announcement is useful. Do not prescribe one debounce delay or live-region implementation for every application.

## Interpreting the supplemental probes

**Skip/bypass:** A first-position visible-on-focus skip link is a useful IMN build convention. WCAG permits other supported bypass mechanisms. The script observes the first tab stop and attempts fragment activation only for identified skip links. Confirm destination, subsequent tab sequence, and visibility. A missing skip link alone is not an automatic 2.4.1 failure. [W3C bypass guidance](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html).

**Focus:** Inspect actual focused controls against surrounding colors and overlays. A zero CSS count cannot distinguish default focus, `:focus` styles, or inaccessible stylesheets. Browser defaults vary. Apply the 1.4.11 user-agent exception correctly; do not assume every unmodified default indicator must pass an author-styled contrast calculation.

**Targets:** `smallTargets` records dimensions only. It does not clear exceptions and must not be used as the defect count. A small isolated target may satisfy the spacing exception. A toolbar is not inline prose just because sibling text is long. Assess overlapping 24px circles and the other exceptions under [SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). The axe target-size rule provides separate automated evidence; review its incomplete queue.

**Reflow:** Overflow or clipping may indicate a defect, an off-canvas widget, or permitted two-dimensional content. Confirm visibility and loss of information/functionality. Do not “fix” a defect by hiding overflow. Responsive source changes can override inline styles with sufficient cascade priority, although shared styles usually maintain better.

**Reduced motion:** The per-page probe inventories low-opacity text in a reduced-motion context. Compare against the normal page and exercise interactions. Intentionally hidden content can be harmless. SC 2.3.3 is AAA and does not belong in an AA failure count; other motion criteria have their own A/AA requirements.

**Incomplete checks:** Preserve node selectors, check data, and review reasons. Investigate every relevant unresolved item. On confirmation, move it to PASS or FAIL with manual evidence; otherwise keep NEEDS REVIEW. These results can concern more than contrast.

**Accessibility statement:** Check that a visitor can report a barrier through an accessible channel, including a practical non-voice option. Record content/policy recommendations separately from technical WCAG findings unless a specific requirement and failure are established.
