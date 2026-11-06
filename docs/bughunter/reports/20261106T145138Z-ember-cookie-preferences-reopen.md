# Ember footer cookie preferences reopen

- **UTC date:** 2026-11-06
- **Run ID:** `20261106T145138Z-77e5f1b7445b42c18c3f5ef77d5f0ed2`
- **Repository / base SHA:** `qrati-labs/qrati-connect-ember-example` `origin/main` `e3596e6dc3fbeddc8a2038e9c5745accdbd76253`
- **Workflow:** Host cookie-consent reopen after first Accept/Reject (footer → `showCookiePreferences` / `CookieConsent.showPreferences`)
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T145138Z-77e5f1b7445b42c18c3f5ef77d5f0ed2-ember`
- **Branch:** `bughunter/20261106T145138Z-77e5f1b7445b42c18c3f5ef77d5f0ed2-ember`

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` checkout `REPO=main` path missing (`fatal: cannot change to '/home/hermes/Projects/main'`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Footer never reopens cookie preferences after first consent** — **Evidence:** `app/lib/cookieConsent.ts` `showCookiePreferences()` → `CookieConsent.showPreferences()`; `app/components/qrati-demo.gts` constructor calls `initCookieConsent()` but never imports/calls `showCookiePreferences`. Footer nav has qrati.com / npm / GitHub / Pricing only; no `data-cc="show-preferencesModal"`. `autoShow: required` shows the banner once. vanilla-cookieconsent v3 has no persistent reopen widget unless the host binds the custom attribute or API. **Failure:** after Accept all / Reject analytics, analytics consent cannot be changed or withdrawn; `syncGtm` stays on the first decision. **Fix:** footer Cookie Preferences button calling `openCookiePreferences` → `showCookiePreferences()`, plus `data-cc="show-preferencesModal"`, matching the Preact sibling. **Test:** `tests/unit/footer-cookie-preferences-reopen-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `application.gts` → `QratiDemo` constructor → `initCookieConsent()`.
2. Geo check (`qrati_geo_consent_required` / `/api/cookie-consent-geo`); fail-closed `required: true` → `mode: 'opt-in'`, `autoShow: true`.
3. First-visit modal: Accept all / Reject analytics / Manage preferences.
4. CookieConsent stores choice; later visits do not auto-show.
5. No host control called `showPreferences`; export was dead.
6. Output: GTM consent frozen at first choice.

Open PRs at selection: none. No overlapping PR.

## Falsification

- **Library floating button:** CookieConsent v3 does not add a reopen control by default; `data-cc="show-preferencesModal"` is the documented host binding ([custom attribute](https://cookieconsent.orestbida.com/advanced/custom-attribute.html)).
- **Intentional demo omission:** helper is exported; Preact/React/Vue/Solid/Qwik examples wire a footer (or equivalent) control.
- **Manage preferences on first modal is enough:** that button is only on the first-visit consent modal, not after a stored choice.
- **Empty `preferencesModal.sections`:** pre-existing; Accept all / Reject analytics still change categories. Out of scope (non-goal of the issue).
- **Prior consent audits:** geo/GTM startup and primary-button contrast; they did not claim a reopen path.

## Impact / severity

P3 (low). Public example visitors cannot withdraw or grant analytics after the first decision. No authz bypass; GTM still gated on `acceptedCategory('analytics')` at the time of the first choice.

## Root cause

Host never bound a persistent UI to `CookieConsent.showPreferences()` after `initCookieConsent()`.

## Disposition

Confirmed defect. Issue https://github.com/qrati-labs/qrati-connect-ember-example/issues/28. Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for merge routing.

## Tests and verification

- Authored: `tests/unit/footer-cookie-preferences-reopen-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used

## Citations

- [CookieConsent custom attribute](https://cookieconsent.orestbida.com/advanced/custom-attribute.html) — `data-cc="show-preferencesModal"`
- Preact sibling: `qrati-connect-preact-example` `src/app.tsx` footer `Cookie Preferences` button

## Limitations

No browser run of CookieConsent after a stored cookie. Structural wiring asserted from source. `preferencesModal.sections: []` left unchanged.

## Timing

Timing table inserted from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PENDING

## PR / checks

Pending remote read-back.
