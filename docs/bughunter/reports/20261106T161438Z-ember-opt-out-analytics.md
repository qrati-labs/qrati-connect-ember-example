# Ember opt-out geo analytics default

- **UTC date:** 2026-11-06
- **Run ID:** `20261106T161438Z-7d9bb9f6e1d7431dbe70afdb286e1a4e`
- **Repository / base SHA:** `qrati-labs/qrati-connect-ember-example` `origin/main` `733aab6c54381c6a453a2e76e4f88761b79aa224`
- **Workflow:** Geo cookie-consent mode → analytics category default → `syncGtm`
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T161438Z-7d9bb9f6e1d7431dbe70afdb286e1a4e-qrati-connect-ember-example`
- **Branch:** `bughunter/20261106T161438Z-7d9bb9f6e1d7431dbe70afdb286e1a4e-ember`

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). Skipped `qrati-admin` / `REPO=main` (open PRs #121/#122). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Opt-out geo path never enables analytics cookies** — **Evidence:** `app/lib/cookieConsent.ts` `CookieConsent.run` set `analytics: {}`. vanilla-cookieconsent v3.1.0 default `[category].enabled` is `false`; `retrieveState` auto-accepts enabled categories only in `opt-out`. Trigger: geo `{ required: false }` → `mode: 'opt-out'`, `autoShow: false`. **Failure:** `acceptedCategory('analytics')` stays false, so `syncGtm` never injects GTM and Consent Mode stays denied; no banner, so **Accept all** is unreachable. **Fix:** `analytics: { enabled: !required }` (Preact #47). **Test:** `tests/unit/consent-opt-out-analytics-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `application.gts` → `QratiDemo` constructor → `initCookieConsent()`.
2. Geo: session cache or `GET` `/api/cookie-consent-geo` / `https://qrati.com/api/cookie-consent-geo` (`qrati-web` returns `{ required: boolean }`). Fail-closed on thrown errors.
3. Authz: none; public example.
4. Categories: necessary readonly-on; analytics was `{}` (enabled default false).
5. Side effects: `syncGtm` on first consent / consent / change and after `run()`. GTM still requires `VITE_GTM_ID`.
6. Output after fix: opt-out defaults analytics on; opt-in leaves it off until accept.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Reachable:** yes. `required === false` is the documented non-opt-in geo result; `autoShow: false` hides the banner.
- **Intentional empty analytics object:** rejected. Geo opt-out exists specifically to default-enable analytics; sibling Preact uses `enabled: !required` after issue #47 (unconditional `enabled: true` pre-checks opt-in Save).
- **Empty `VITE_GTM_ID` means no impact:** Consent Mode flags still stay denied; GTM can be set at build time.
- **Library auto-enables all categories in opt-out:** rejected. Docs + Preact library trace: only `enabled` categories.
- Prior Ember consent audits (2026-10-15/16) predated the Preact `enabled: !required` contract and did not treat this as confirmed.

## Impact / severity

P3 (low). Public example analytics/GTM never start for non-opt-in regions. No authz bypass.

## Root cause

Host left `analytics: {}`, so the library default `enabled: false` blocked opt-out auto-accept.

## Disposition

Confirmed defect. Issue https://github.com/qrati-labs/qrati-connect-ember-example/issues/32. Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for merge routing.

## Tests and verification

- Authored: `tests/unit/consent-opt-out-analytics-test.ts`
- Updated: `tests/unit/consent-preferences-sections-test.ts` (same category object)
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used

## Citations

- [CookieConsent configuration — categories.enabled](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- Preact sibling: `qrati-connect-preact-example` `src/lib/cookieConsent.ts`; issue #47 / report `20261105T173938Z-preact-opt-in-analytics.md`
- Geo API: `qrati-web` `src/app/api/cookie-consent-geo/route.ts`

## Limitations

No browser run of CookieConsent after a stored cookie. Library `enabled`/opt-out behavior taken from published docs and the Preact v3.1.0 source trace. Live `https://qrati.com/connect/ember-example` returned HTTP 404 in this run (deployment, not treated as this source defect).

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T16:14:38Z | 2026-11-06T16:15:02Z | 21:44:38 | 21:45:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-06T16:15:13Z | 2026-11-06T16:20:37Z | 21:45:13 | 21:50:37 | 00:05:25 (5.4 min) |
| **Total run (preflight start to finish)** | 2026-11-06T16:14:38Z | 2026-11-06T16:20:37Z | 21:44:38 | 21:50:37 | **00:06:00 (6.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:11 (0.2 min) |
