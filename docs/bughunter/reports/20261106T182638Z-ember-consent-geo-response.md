# Ember cookie-consent geo response validation

- **Scope:** Geo cookie-consent lookup in `checkConsentRequired` → `CookieConsent.run` mode / `autoShow` / `analytics.enabled`.
- **Base:** `origin/main` at `d3c10c22edbbecb1904a337ad84ad8bb1553786c`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T182638Z-f72754499d4247309de9985f1ba094bd-ember`, `bughunter/20261106T182638Z-f72754499d4247309de9985f1ba094bd-ember`.
- **Run:** `20261106T182638Z-f72754499d4247309de9985f1ba094bd`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` worktree add failed (`/home/hermes/Projects/main` missing). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 were not used. CodeGraph unindexed; focused source reads used.

## Finding

**[P2] Invalid cookie-consent geo responses fail open to opt-out** — **Evidence:** `app/lib/cookieConsent.ts` `checkConsentRequired` fetched `/api/cookie-consent-geo` (or `https://qrati.com/api/cookie-consent-geo`), destructured `required` from JSON without `response.ok` or a boolean check, cached `String(required)`, and returned it. `CookieConsent.run` uses `mode: required ? 'opt-in' : 'opt-out'`, `autoShow: required`, `analytics: { enabled: !required }`. **Failure:** HTTP 503 + `{"required":false}` or 200 + `{}` / `{"required":"false"}` hides the banner and enables analytics, violating the fail-closed `catch`. **Fix:** `!response.ok` and `typeof payload.required !== 'boolean'` return `true` without caching; persist only a validated boolean (Preact issue #6). **Test:** `tests/unit/consent-geo-response-test.ts` via `pnpm exec ember test --filter="cookie-consent geo response validation"` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `application.gts` → `QratiDemo` constructor → `initCookieConsent()`.
2. Input: session cache, else `GET` geo JSON `{ required: boolean }`.
3. Validation (before): none beyond `JSON.parse`; type assertion is compile-time only.
4. State: `qrati_geo_consent_required` in `sessionStorage`.
5. Side effects: CookieConsent mode and GTM via `syncGtm` after `run()`.
6. Errors: `catch` returns `true`; non-OK JSON did not throw.
7. Output: opt-in banner vs silent opt-out + analytics enabled.

Sibling: `qrati-connect-preact-example` `src/lib/cookieConsent.ts` already guards `!response.ok` and boolean `required`. `qrati-web` `GET /api/cookie-consent-geo` returns `{ required }` only on success.

## Falsification

- Reachable: yes. Degraded JSON from the geo URL is consumed on every uncached load.
- Not intentional: `catch` is fail-closed; Preact treated the same hole as P2 (#6).
- No other guard: TypeScript `as { required: boolean }` does not run at runtime.
- Healthy 200 `{ required: true|false }` still caches and returns unchanged.
- Empty `VITE_GTM_ID` does not remove the consent-mode / banner failure.

## Disposition

Confirmed P2. Issue [#42](https://github.com/qrati-labs/qrati-connect-ember-example/issues/42). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/consent-geo-response-test.ts`
- Command: `pnpm exec ember test --filter="cookie-consent geo response validation"` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- Patch hygiene: `git diff --check` — no whitespace errors

## Citations

- Preact: issue [#6](https://github.com/qrati-labs/qrati-connect-preact-example/issues/6), report `docs/bughunter/reports/20261016T172638Z-preact-geo-response.md`
- Geo API: `qrati-web` `src/app/api/cookie-consent-geo/route.ts`
- [CookieConsent configuration](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- `app/lib/cookieConsent.ts`, `app/components/qrati-demo.gts`

## Limitations

CodeGraph unindexed for this worktree; source reads used. No live geo 503 injected. Local unit tests not executed per BugHunter boundary.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T18:26:38Z | 2026-11-06T18:27:01Z | 23:56:38 | 23:57:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T18:27:15Z | 2026-11-06T18:34:05Z | 23:57:15 | 00:04:05 | 00:06:51 (6.8 min) |
| **Total run (preflight start to finish)** | 2026-11-06T18:26:38Z | 2026-11-06T18:34:05Z | 23:56:38 | 00:04:05 | **00:07:27 (7.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:14 (0.2 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T182638Z-f72754499d4247309de9985f1ba094bd.json`.
