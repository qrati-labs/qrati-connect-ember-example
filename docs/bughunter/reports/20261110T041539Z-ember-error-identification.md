# Ember host WCAG 3.3.1 error identification

- **Scope:** WCAG 2.2 SC 3.3.1 Error Identification for host-authored data-entry UI: cookie-consent first layer and preferences category toggles in `cookieConsent.ts`, plus any host form controls. Excludes links, theme toggle, FAQ `<details>`, Contact CTA (not data entry), embed internals (`qrati-connect` / `embed.js`), 3.3.2 labels or instructions (20261110T035038Z), 2.4.6 headings and labels (20261109T200338Z), 4.1.2 name/role/value (20261110T000039Z).
- **Base:** `origin/main` at `0d0363f5bd850ce6ca8d8bd52ef563608fb81d15`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T041539Z-ea355ab22d2b406186ff81b18bb97ce1-qrati-connect-ember-example`, `bughunter/20261110T041539Z-ea355ab22d2b406186ff81b18bb97ce1-ember-workflow`.
- **Run:** `20261110T041539Z-ea355ab22d2b406186ff81b18bb97ce1`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. `QratiDemo` constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). Footer Cookie Preferences calls `showCookiePreferences()`. `app/router.ts` `Router.map` is empty (single history index).
2. Host source search for `<input>`, `<textarea>`, `<select>`, `contenteditable`, `novalidate`, `aria-invalid`, `aria-errormessage`, `role="alert"` in `*.gts`/`*.ts`/`*.html`/`*.js`/`*.css`: no host form controls and no host error-identification markup. Theme toggle, action pills, FAQ `<details>`, Contact CTA, and footer links are not data-entry controls.
3. [WCAG 2.2 SC 3.3.1 Error Identification](https://www.w3.org/TR/WCAG22/#error-identification) (Level A): if an **input error** is automatically detected, the item in error is identified and the error is described to the user in text. [Understanding 3.3.1](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html): an input error is information required by the page but omitted, or provided but outside the required format or allowed values.
4. Only host-authored data-entry UI is vanilla-cookieconsent v3.1.0, configured in `cookieConsent.ts`:
   - First layer: Accept all / Reject analytics / Manage preferences (discrete actions, not free-text).
   - Preferences: `necessary` (read-only) and `analytics` boolean category toggles with `linkedCategory` (issue #30). Allowed values are on/off; the library does not run format validation that can fail.
5. Geo gate (`checkConsentRequired`): non-OK, non-boolean `required`, or thrown fetch → fail-closed opt-in (`return true`) without a user-visible error string. That is a consent-mode decision (issue #42), not detection of user-supplied input that was rejected.
6. GTM inject and Worker `__GTM_ID__` rewrite do not add fields. `syncGtm` does not surface errors to the page.

Authz/validation: public demo. Persistence: `qrati_geo_consent_required` sessionStorage and the consent cookie — neither is a user-typed field that can be in an invalid format.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Host has unlabeled/unidentified field errors:** no host `<input>`/`<textarea>`/`<select>`. No `aria-invalid` is required when no input error can be detected.
- **Geo fail-closed without a message fails 3.3.1:** Understanding 3.3.1 applies only when user-provided information is not accepted. Network/geo policy is not an input error.
- **Cookie toggles can be “invalid”:** categories are booleans; necessary is `readOnly`. No omitted-required or format-check path exists in host config.
- **Embed upload/search errors:** out of scope (`qrati-connect` internals).
- **Issue search** `3.3.1 OR "error identification" OR "input error" OR validation`: closed #42 (geo fail-open) is related policy, not 3.3.1. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)
- [WCAG 2.2 SC 3.3.1](https://www.w3.org/TR/WCAG22/#error-identification)
- `app/lib/cookieConsent.ts`
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- Prior: 3.3.2 labels (20261110T035038Z); geo fail-closed (#42)

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 3.3.1 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

<!-- timing table inserted after finish -->

## PR / checks

- Issue: none (report-only)
- PR: pending
