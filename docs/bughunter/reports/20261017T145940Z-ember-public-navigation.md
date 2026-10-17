# Ember example public navigation audit

- **Run:** `20261017T145940Z-d033e93369c14f0e95466e16e33a0e29`
- **Scope:** Static public-facing navigation and conversion links in `app/components/qrati-demo.gts` (hero links, code/repository links, CTA, footer navigation). Excludes embed mounting/theme behavior, cookie consent, and worker routing.
- **Base:** `origin/main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- **Finding:** No confirmed defect. Links are present for the observed destinations, dynamic repository/editor URLs derive from the component's `qrati-labs/qrati-connect-ember-example` constants, and links opened in new tabs declare `rel="noopener noreferrer"`. The primary conversion CTA has a direct HTTPS destination. No code/test change warranted.
- **Limits:** Static source inspection only. Destination availability, browser navigation, and analytics attribution were not externally exercised.
- **Tests:** None authored; no regression case was indicated by the evidence. Tests/builds/lint/type-check were not run (BugHunter boundary). `git diff --check` permitted for patch hygiene.
- **Issue/PR:** No issue required for this report-only result. [PR #5](https://github.com/qrati-labs/qrati-connect-ember-example/pull/5).
- **Timing (measured):** Start `2026-10-17T14:59:41Z` / `20:29:41 IST`; end `2026-10-17T15:01:01Z` / `20:31:01 IST`; total `1m 20s`. Phases: preflight `22s` (scheduler record); workflow/PR selection and isolation `34s` (`14:59:41–15:00:15Z`); source trace `46s` (`15:00:15–15:01:01Z`).
- **PR/check state at readback:** Open and mergeable, base `main`, head `73d92a63287ae43ae3be4fbbf8208f066fc06d48`; report and index are the only changed files. Lint and Test were queued; GitGuardian Security Checks pending.
