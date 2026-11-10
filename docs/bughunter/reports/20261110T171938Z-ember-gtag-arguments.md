# Ember cookie-consent gtag Arguments vs rest array

- **Scope:** Host `syncGtm` Google Consent Mode `gtag('consent','update')` queue shape (`dataLayer.push(arguments)` vs rest-parameter array). Excludes geo fail-closed (#42), opt-out analytics default (#32), GTM inject-after-accept (20261106T204938Z), Consent Mode `default`/`wait_for_update` (20261107T103738Z), analytics revoke vs `autoClear` (20261107T101539Z), GPC (20261107T121338Z), cookie record (20261107T092838Z).
- **Base:** `origin/main` at `1819f2e4e229b5d49a7b19c083748293146cf3c1`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T171938Z-484f438365ce4a5485e40ba7c90fc4df-qrati-connect-ember-example`, `bughunter/20261110T171938Z-484f438365ce4a5485e40ba7c90fc4df-ember-embed`.
- **Run:** `20261110T171938Z-484f438365ce4a5485e40ba7c90fc4df`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Admin chore PRs #121/#122 are not this repository. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P2] Consent Mode `gtag` helper pushed a rest array that gtag.js ignores** — **Evidence:** `app/lib/cookieConsent.ts` `syncGtm`; trigger is any `onFirstConsent` / `onConsent` / `onChange` / post-`run` `syncGtm` when a GTM ID is configured. **Failure:** gtag.js only processes `[object Arguments]` queue entries; `dataLayer.push(args)` is dropped with no error, so grant/revoke Consent Mode updates never apply. **Fix:** non-arrow `gtag` that `dataLayer.push(arguments)`. **Test:** `tests/unit/consent-gtag-arguments-test.ts` (`pnpm test`, **NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Constructor calls `initCookieConsent()` (`app/components/qrati-demo.gts`).
2. `CookieConsent.run` registers `onFirstConsent` / `onConsent` / `onChange` → `syncGtm`, then calls `syncGtm()` after `run` (`app/lib/cookieConsent.ts`).
3. Pre-fix `syncGtm`: `window.gtag || ((...args) => window.dataLayer?.push(args))`, then `gtag('consent','update',{ analytics_storage, ad_storage, ad_user_data, ad_personalization })`, then inject `gtm.js` only when analytics is accepted and `VITE_GTM_ID` is set.
4. Official snippet and CookieConsent GCM sample: `function gtag(){dataLayer.push(arguments);}`. gtag.js treats a queue item as a command only when it is an Arguments object; rest arrays are ignored ([nuxt/scripts#770](https://github.com/nuxt/scripts/issues/770)).
5. GTM’s install snippet does not replace `window.gtag`. This host’s stub remained the only consent sender. No `autoClear` GA cookie list (prior revoke audit). `.env.example` `VITE_GTM_ID` is empty (stock demo does not inject); Worker still accepts `GTM_ID` / `VITE_GTM_ID`.

Authz: none (public demo). Persistence: `cc_cookie`; optional GTM cookies if an ID is built in. Side effects: Consent Mode update + optional `gtm.js`. Errors: none thrown on the ignored array push.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Empty `VITE_GTM_ID` means this is hypothetical:** rejected. `.env.example` documents the ID; `syncGtm` and the Worker substitution exist specifically for a configured ID. The broken helper is the only Consent Mode path on that intended integration.
- **Calling `gtag('consent','update')` is enough (20261107T101539Z):** that audit assumed the call was observable to GTM. New evidence: array-shaped queue entries are not commands.
- **Must also set `consent default` / `wait_for_update`:** out of scope; inject-after-accept still needs a recognizable `update` on grant and revoke.
- **Issue search** `gtag OR dataLayer OR arguments OR Consent Mode`: no matching issue. Created #138.

## Disposition

Confirmed P2. Issue [#138](https://github.com/qrati-labs/qrati-connect-ember-example/issues/138). Narrow fix in `syncGtm`; no geo/category/inject-order change. Repo is an unmapped `*-example` (no owner guessed).

## Tests

`tests/unit/consent-gtag-arguments-test.ts` — source contract: `dataLayer.push(arguments)`, not `dataLayer?.push(args)`. `pnpm test` **NOT RUN BY BUGHUNTER**. `git diff --check` clean.

## Citations

- [Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent) (`function gtag(){dataLayer.push(arguments);}`)
- [CookieConsent Google consent mode](https://cookieconsent.orestbida.com/advanced/google-consent-mode.html)
- [nuxt/scripts#770](https://github.com/nuxt/scripts/issues/770) — GTM helper pushed Array; consent ignored
- `app/lib/cookieConsent.ts` `syncGtm`
- `.env.example` `VITE_GTM_ID=`

## Limitations

CodeGraph unindexed. No browser / Tag Assistant session against live `gtm.js`. Stock example ID is empty; impact is on builds that set `VITE_GTM_ID`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T17:19:38Z | 2026-11-10T17:20:01Z | 22:49:38 | 22:50:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-10T17:20:23Z | 2026-11-10T17:25:38Z | 22:50:23 | 22:55:38 | 00:05:14 (5.2 min) |
| `delivery` | 2026-11-10T17:25:38Z | 2026-11-10T17:26:09Z | 22:55:38 | 22:56:09 | 00:00:31 (0.5 min) |
| **Total run (preflight start to finish)** | 2026-11-10T17:19:38Z | 2026-11-10T17:26:09Z | 22:49:38 | 22:56:09 | **00:06:31 (6.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T171938Z-484f438365ce4a5485e40ba7c90fc4df.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: https://github.com/qrati-labs/qrati-connect-ember-example/issues/138
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/139
- Base `main` `1819f2e4e229b5d49a7b19c083748293146cf3c1` / head `bughunter/20261110T171938Z-484f438365ce4a5485e40ba7c90fc4df-ember-embed` `3289aa420ec93d87231b5ff890594ab0970f3716` (pre-timing-amend)
- `closingIssuesReferences` empty at first GraphQL read-back; body starts with `Fixes #138`
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; Workers Builds pending; CI Lint/Test not yet reported
- Local tests **NOT RUN BY BUGHUNTER**
