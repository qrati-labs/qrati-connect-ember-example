# BugHunter audit: Ember cookie-consent workflow recheck

- **UTC:** 2026-10-16 12:21:38–12:23:00
- **Repository/base:** `qrati-connect-ember-example`, `origin/main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`
- **Run ID:** `20261016T122138Z-84793b32a99649c4a43dff5f6f9a879e`
- **Scope:** Geo consent decision → CookieConsent initialization → GTM consent synchronization and script insertion.
- **Disposition:** Report-only recheck; no confirmed new defect, source edits, or tests authored.

## Evidence and conclusion

`app/components/qrati-demo.gts:39-44` initializes consent during the demo component constructor. `app/lib/cookieConsent.ts:32-46` checks a per-tab geo cache, requests the geo endpoint on a miss, caches its `required` value, and treats thrown failures as requiring consent. Lines 51-69 select opt-in/opt-out mode, configure the necessary category, register consent callbacks, and synchronize state after initialization. `syncGtm` at lines 13-30 sets all four consent signals to denied unless analytics was accepted, and only injects GTM when analytics is accepted, a GTM ID exists, and no GTM script is already present.

No reachable violation of the consent-before-tracking invariant was established in the inspected path. The possibility of an invalid/missing `required` field being treated as false remains a contract-dependent hardening question, not a confirmed defect; the geo endpoint contract was not independently verified. No issue or code fix was warranted.

## Existing work / overlap

GitHub PR #1 (`https://github.com/qrati-labs/qrati-connect-ember-example/pull/1`) changes only `docs/bughunter/INDEX.md` and its prior consent audit report. Its paths do not overlap source behavior; this recheck adds a new report-only audit document. PR body states the previous audit found no confirmed defect.

## Verification and limits

- Isolated worktree created from recorded `origin/main`; clean status and HEAD verified equal to base SHA.
- CodeGraph was attempted first but this checkout is not indexed; focused source reads were used instead.
- No test, build, lint, type-check, install, or package-manager command was run (BugHunter execution boundary).
- No regression test authored; no test command applies.
- Prior audit documented that the external geo contract was not verified; that remains a limitation.

## Timing

- Preflight (injected): 00:00:21, 12:21:38Z–12:21:59Z.
- Audit/worktree/source/PR overlap examination: approximately 12:21:59Z–12:23:00Z; phase timing is bounded by tool timestamps, not a continuous stopwatch.
- Total measured from injected start through this report: 00:01:22 (12:21:38Z–12:23:00Z).

## PR state

Report-only PR to be opened. No issue link/closing reference applies. Checks will be read once after PR creation.