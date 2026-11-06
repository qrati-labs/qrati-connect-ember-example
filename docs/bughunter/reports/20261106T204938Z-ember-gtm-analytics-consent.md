# Ember GTM load after analytics consent

- **Scope:** Host analytics startup after cookie consent (`initCookieConsent` → geo gate → `CookieConsent.run` → `syncGtm`), including GTM script injection, Consent Mode signals, and the Worker `__GTM_ID__` HTML rewrite.
- **Base:** `origin/main` at `e53ac975dcb49e1f7527b1c81513aa435e420e4f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T204938Z-213d8e3685084ec4ae083abdf80f7ddc-qrati-connect-ember-example`, `bughunter/20261106T204938Z-213d8e3685084ec4ae083abdf80f7ddc-ember`.
- **Run:** `20261106T204938Z-213d8e3685084ec4ae083abdf80f7ddc`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. `QratiDemo` constructor (`app/components/qrati-demo.gts`) calls `initCookieConsent()` after applying the host theme.
3. Geo gate (`app/lib/cookieConsent.ts` `checkConsentRequired`): `sessionStorage` cache `qrati_geo_consent_required`; hostname containing `qrati.com` uses `/api/cookie-consent-geo`, otherwise `https://qrati.com/api/cookie-consent-geo`; non-OK HTTP and non-boolean `required` fail closed (`return true`) without caching (issue [#42](https://github.com/qrati-labs/qrati-connect-ember-example/issues/42)); thrown errors fail closed.
4. `CookieConsent.run`: `mode` opt-in when required else opt-out; `autoShow: required`; `analytics.enabled: !required` (issue [#32](https://github.com/qrati-labs/qrati-connect-ember-example/issues/32)); `onFirstConsent` / `onConsent` / `onChange` → `syncGtm`; preferences sections link `necessary` and `analytics` (issue [#30](https://github.com/qrati-labs/qrati-connect-ember-example/issues/30)).
5. `syncGtm`: reads `CookieConsent.acceptedCategory('analytics')`; stubs `window.gtag` onto `dataLayer`; sends Consent Mode v2 `update` for `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` (`granted` iff analytics accepted); injects `gtm.js?id=` only when analytics is accepted, `VITE_GTM_ID` is truthy, and `#gtm-script` is absent. ID is `encodeURIComponent`'d.
6. After `CookieConsent.run`, `syncGtm()` runs once so opt-out / already-consented visits still sync.
7. Worker (`src/worker.ts`) rewrites HTML `__GTM_ID__` from `env.VITE_GTM_ID || env.GTM_ID`. `index.html` has no `__GTM_ID__` placeholder; client GTM uses build-time `import.meta.env.VITE_GTM_ID`. `.env.example` leaves `VITE_GTM_ID` empty.

Authz/validation: public demo; geo payload type-checked before cache. Persistence: sessionStorage geo cache; vanilla-cookieconsent cookie. Side effects: optional `gtm.js` inject and Consent Mode updates. Errors: geo `catch` → opt-in.

## Falsification

- **GTM loads before consent:** insertion requires `acceptedCategory('analytics')`. Reject path updates all four signals to `denied` and returns before `appendChild`.
- **Invalid geo fail-open:** non-OK and non-boolean `required` return `true` without `setItem` (covered by `tests/unit/consent-geo-response-test.ts`).
- **Duplicate GTM tags:** `#gtm-script` guard. Revoke after accept leaves the script in DOM but subsequent `syncGtm` sets Consent Mode denied.
- **Missing official `{event:'gtm.js','gtm.start'}` bootstrap (Preact sibling has it):** not confirmed to block Container Loaded; default example has empty `VITE_GTM_ID` so the inject path is not live. Recorded as a risk, not a defect.
- **Worker runtime GTM vs client build-time ID:** dead HTML rewrite, not a reachable user failure on this host.
- **`dataLayer.push(args)` vs `push(arguments)`:** same stub as other simple connect examples; not evidenced to drop Consent Mode updates.
- **No `autoClear` for `_ga` on reject:** no evidence cookies are set when GTM ID is unset; leftover cookies after withdrawal not shown on this example.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: none (no confirmed defect).
- Command: none.
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**.
- Patch hygiene: `git diff --check` on docs-only diff.

## Citations

- [Google Tag Manager install snippet](https://developers.google.com/tag-platform/tag-manager/web) (`gtm.js` / `gtm.start` dataLayer bootstrap)
- [CookieConsent configuration](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- Prior related: geo fail-closed [#42](https://github.com/qrati-labs/qrati-connect-ember-example/issues/42); opt-out analytics [#32](https://github.com/qrati-labs/qrati-connect-ember-example/issues/32); 2026-10-15 consent startup report-only

## Limitations

CodeGraph unindexed. No browser session and no configured `VITE_GTM_ID` in the example env template, so GTM script injection was traced from source only. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.

## PR / checks

Filled after remote read-back.
