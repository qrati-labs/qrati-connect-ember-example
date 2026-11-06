# Ember cookie preferences category sections

- **UTC date:** 2026-11-06
- **Run ID:** `20261106T151238Z-e957e7805e714732b047a215066bbd4f`
- **Repository / base SHA:** `qrati-labs/qrati-connect-ember-example` `origin/main` `2928266520e872451a791958e93b49bf8f7c2763`
- **Workflow:** Host cookie-preferences modal (`Manage preferences` / footer `showCookiePreferences`) category sections and light-theme off-toggle contrast
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T151238Z-e957e7805e714732b047a215066bbd4f-qrati-connect-ember-example`
- **Branch:** `bughunter/20261106T151238Z-e957e7805e714732b047a215066bbd4f-ember`

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` checkout `REPO=main` path missing (`/home/hermes/Projects/main`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Cookie preferences modal has no category toggles** — **Evidence:** `app/lib/cookieConsent.ts` `CookieConsent.run` sets `categories.necessary` / `categories.analytics` but `language.en.preferencesModal.sections: []`. vanilla-cookieconsent v3.1.0 generates `.pm__section--toggle` only when a section has `linkedCategory` naming a configured category. Reachable from `QratiDemo` constructor → `initCookieConsent()`, then first-visit **Manage preferences** or footer **Cookie Preferences** (`showCookiePreferences`, issue #28). **Failure:** visitors cannot inspect or independently toggle Necessary vs Analytics; **Save preferences** has no category UI. Light `--cc-toggle-off-bg: #9ca3af` vs `--cc-cookie-category-block-bg: #fff7f1` is **2.397:1** (knob white vs track **2.539:1**), below WCAG 2.2 1.4.11 **3:1** once toggles exist. **Fix:** add Necessary/Analytics `linkedCategory` sections (Preact sibling) and restore vanilla light `--cc-toggle-off-bg: #667481` (**4.526:1** / **4.794:1**). **Test:** `tests/unit/consent-preferences-sections-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `application.gts` → `QratiDemo` constructor → `initCookieConsent()`.
2. Geo check fail-closed `required: true` → `mode: 'opt-in'`, `autoShow: true`.
3. Consent modal: Accept all / Reject analytics / Manage preferences.
4. Preferences HTML: library iterates `sections`; `linkedCategory` + `categories[name]` creates the toggle. Empty array → no rows.
5. Footer control (merged #29) calls `CookieConsent.showPreferences()` into the same empty modal.
6. Light `#cc-main` off-toggle tokens apply to `.toggle__icon` over `.pm__section--toggle` category blocks.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Accept all / Reject analytics are enough:** they are bulk actions. The host still labels **Manage preferences** / **Save preferences**; without sections those controls cannot choose analytics independently.
- **Intentional empty demo:** Preact sibling ships the two `linkedCategory` sections; CookieConsent docs require `linkedCategory` to generate toggles.
- **Library auto-builds UI from `categories`:** v3.1.0 render uses `e.linkedCategory` only; category map alone does not emit sections.
- **Toggle 1.4.11 was previously unreachable:** true until sections exist; shipping sections without restoring `#667481` would reintroduce Preact #80 on this host. Dark `--cc-toggle-off-bg: #6b7280` vs `#211a18` is **3.544:1** and was left unchanged.
- **Issue #28 overlap:** that fix only wired reopen. Empty sections were an explicit non-goal there.

## Impact / severity

P3 (low). Public example visitors cannot granularly grant/withdraw analytics from the advertised preferences UI. No authz bypass. GTM remains gated on `acceptedCategory('analytics')` via Accept all / Reject analytics.

## Root cause

Host never populated `preferencesModal.sections`. Category config does not generate the modal UI.

## Disposition

Confirmed defect. Issue https://github.com/qrati-labs/qrati-connect-ember-example/issues/30. Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for merge routing.

## Tests and verification

- Authored: `tests/unit/consent-preferences-sections-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used

## Citations

- [CookieConsent configuration — linkedCategory](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- vanilla-cookieconsent v3.1.0 types: `linkedCategory` converts a section into a togglable category
- [WCAG 2.2 SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- Preact sibling: `qrati-connect-preact-example` `src/lib/cookieConsent.ts` preference sections; PR #80 off-toggle token

## Limitations

No browser run of CookieConsent after a stored cookie. Structural wiring and sRGB token ratios asserted from source. Library HTML generation inspected from pinned `vanilla-cookieconsent@3.1.0` `cookieconsent.esm.js`.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PLACEHOLDER

## PR / checks

Filled after remote read-back.
