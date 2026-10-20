# Ember example theme and cookie-consent initialization audit

- **Scope:** `qrati-connect-ember-example`, fetched base `main` at `5f305b6`; theme initialization/toggle and cookie-consent startup.
- **Disposition:** No confirmed defect. Report-only.
- **Evidence reviewed:** `app/components/qrati-demo.gts` reads `qc-theme`, defaults to system preference, applies the theme to the root, and persists user toggles. `mountEmbed` recreates the embed script with the current theme. `app/lib/cookieConsent.ts` memoizes initialization, defaults geo lookup failures to opt-in, and synchronizes GTM consent before conditional GTM script insertion.
- **Falsification:** Repeated initialization returns the same promise; GTM insertion is gated on analytics consent and deduplicated by script ID. The theme read is valid in this browser-only component constructor. No reachable failure contradicting the apparent contract was established from the inspected code.
- **Limitations:** CodeGraph reported this checkout unindexed. Focused source inspection was used. No runtime or tests were run. This audit is limited to this connected workflow; external embed/GTM behavior was not independently verified.
- **Tests:** None authored; no confirmed defect.
- **Issue:** None required for a report-only finding.
- **Measured review time (UTC):** preflight 2026-10-20T12:08:39Z–12:09:05Z, 00:00:27; audit 12:09:14Z–12:09:57Z, 00:00:42; total 12:08:39Z–12:09:57Z, 00:01:18. Unclassified interval: 00:00:09.
- **PR/check state:** Not delivered / not checked.
