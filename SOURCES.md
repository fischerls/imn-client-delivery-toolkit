# Sources and validation

This toolkit brings together three existing workflows. It contains no client records or service credentials.

| Component | Source | Bundled version |
|---|---|---|
| SEO Command Center | https://github.com/fischerls/seo-command-center | Commit `59ed676e27087093a953285649b8f821606c9484`, 14 specialist skills plus SOPs/templates |
| Website Builder playbook | https://github.com/fischerls/high-end-website-playbook | Commit `7816602ec1d74623115073f0b170a9c15cb814a0`; website playbook retained, accessibility checklist refreshed |
| ADA Audit | Internet Media Now's corrected local `ada-audit` skill | Script package 2.0.0, September 16, 2026 |

The root `seo-command-center` and `website-builder` skills are routing instructions for their bundled modules. They do not install third-party services or specialist design skills.

## Packaging changes

- SEO paths remain inside their own module so the original skills and SOPs resolve correctly.
- Agency configuration and dashboard defaults now ship as example files. The installer creates ignored local copies and preserves existing local state. The Tavily credential prompt no longer echoes input.
- Website accessibility instructions use the corrected ADA workflow and distinguish automated screening, manual evaluation, and PDF checks.
- The repository includes a root guide, workflow routing, and example prompts. Existing credentials, client reports, installed dependencies, and private vault records are excluded.

## Verification boundaries

- ADA: eight regression tests, including a 15-page browser fixture sweep, test the actual scanner and evidence retention, discovery boundaries, and print geometry.
- SEO: installer syntax and Python renderer syntax checked. An isolated installer test with a stub CLI verifies initialization and preservation of local agency state. It does not register real MCP services or use real API credentials.
- Website Builder: the playbook and local links are included and checked. External design/media skills are not bundled or tested here; check their availability in your own environment before following that optional skill chain.
- All three workflows still need validation against the actual engagement. No client site was audited or built as part of packaging this toolkit.
