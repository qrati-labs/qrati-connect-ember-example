# Ember host WCAG 3.3.3 error suggestion

- **Scope:** WCAG 2.2 SC 3.3.3 Error Suggestion for host-authored data-entry UI: cookie-consent first layer and preferences category toggles in `cookieConsent.ts`, plus any host form controls. Excludes links, theme toggle, FAQ `<details>`, Contact CTA (not data entry), embed internals (`qrati-connect` / `embed.js`), 3.3.1 error identification (20261110T041539Z), 3.3.2 labels or instructions (20261110T035038Z).
- **Base:** `origin/main` at `b201a924ec0846b83caba94c4d06986e9cc62f2d`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T043638Z-49d22bc1a3be4b79ac74030d5ee8c858-ember`, `bughunter/20261110T043638Z-49d22bc1a3be4b79ac74030d5ee8c858-ember`.
- **Run:** `20261110T043638Z-49d22bc1a3be4b79ac74030d5ee8c858`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap product source, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. `QratiDemo` constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). Footer Cookie Preferences calls `showCookiePreferences()`. `app/router.ts` `Router.map` is empty (single history index).
2. Host source search for `<input>`, `<textarea>`, `<select>`, `<form>` in `*.gts`/`*.ts`/`*.html`/`*.js`/`*.css`: no host form controls. Theme toggle, action pills, FAQ `<details>`, Contact CTA (`https://qrati.com/contact-us`), and footer links are not data-entry controls.
3. [WCAG 2.2 SC 3.3.3 Error Suggestion](https://www.w3.org/TR/WCAG22/#error-suggestion) (Level AA): if an **input error** is automatically detected **and** suggestions for correction are known, those suggestions are provided to the user (unless that would jeopardize security or purpose). [Understanding 3.3.3](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html): an input error is information provided by the user that is not accepted (required omitted, or provided outside the required format or allowed values). 3.3.1 covers identification; 3.3.3 adds known correction suggestions.
4. Only host-authored data-entry UI is vanilla-cookieconsent v3.1.0, configured in `cookieConsent.ts`:
   - First layer: Accept all / Reject analytics / Manage preferences (discrete actions, not free-text).
   - Preferences: `necessary` (read-only) and `analytics` boolean category toggles with `linkedCategory` (issue #30). Allowed values are on/off; the library does not run format validation that can fail, so no known correction text is required.
5. Geo gate (`checkConsentRequired`): non-OK, non-boolean `required`, or thrown fetch → fail-closed opt-in (`return true`) without a user-visible error string. That is a consent-mode decision (issue #42), not rejection of user-supplied input with a known fix.
6. GTM inject and Worker `__GTM_ID__` rewrite do not add fields. `syncGtm` does not surface errors to the page.

Authz/validation: public demo. Persistence: `qrati_geo_consent_required` sessionStorage and the consent cookie — neither is a user-typed field that can be in an invalid format with a known suggestion.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Host detects input errors without suggesting a correction:** no host `<input>`/`<textarea>`/`<select>`. 3.3.3 is not applicable until an input error can be detected.
- **Geo fail-closed without a suggestion fails 3.3.3:** Understanding 3.3.3 applies only when user-provided information is not accepted and a correction is known. Network/geo policy is not an input error.
- **Cookie toggles can be “invalid” with a known fix:** categories are booleans; necessary is `readOnly`. No omitted-required or format-check path exists in host config.
- **Embed upload/search validation suggestions:** out of scope (`qrati-connect` internals).
- **Issue search** `error suggestion OR 3.3.3 OR validation OR input error`: closed #42 (geo fail-open) is related policy, not 3.3.3. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)
- [WCAG 2.2 SC 3.3.3](https://www.w3.org/TR/WCAG22/#error-suggestion)
- `app/lib/cookieConsent.ts`
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- Prior: 3.3.1 error identification (20261110T041539Z); 3.3.2 labels (20261110T035038Z); geo fail-closed (#42)

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 3.3.3 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T04:36:38Z | 2026-11-10T04:37:00Z | 10:06:38 | 10:07:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T04:37:33Z | 2026-11-10T04:39:56Z | 10:07:33 | 10:09:56 | 00:02:24 (2.4 min) |
| `delivery` | 2026-11-10T04:39:56Z | 2026-11-10T04:40:37Z | 10:09:56 | 10:10:37 | 00:00:41 (0.7 min) |
| **Total run (preflight start to finish)** | 2026-11-10T04:36:38Z | 2026-11-10T04:40:37Z | 10:06:38 | 10:10:37 | **00:03:59 (4.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:33 (0.6 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T043638Z-49d22bc1a3be4b79ac74030d5ee8c858.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/110
- Base `main` `b201a924ec0846b83caba94c4d06986e9cc62f2d` / head `bughunter/20261110T043638Z-49d22bc1a3be4b79ac74030d5ee8c858-ember` `7561f0dd19ca49f713ec5d0c5cf3c8d094a79734` (timing-table commit follows)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian/Lint/Test/Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
