# Ember cookie-consent geo host URL selection

- **Scope:** `checkConsentRequired` host detection (`window.location.hostname.includes('qrati.com')`) choosing same-origin `/api/cookie-consent-geo` vs absolute `https://qrati.com/api/cookie-consent-geo`, including CORS/fail-closed and sessionStorage cache. Excludes geo JSON fail-closed (#42), opt-out analytics default (#32), first-layer modal (20261107T072738Z), GTM after consent (20261106T204938Z), Worker routing.
- **Base:** `origin/main` at `7492b4c8776d742a512c2b141983d1ede18e33c1`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261112T201238Z-18b3a9ac48cd473497408080f26b520e-ember`, `bughunter/20261112T201238Z-18b3a9ac48cd473497408080f26b520e-ember`.
- **Run:** `20261112T201238Z-18b3a9ac48cd473497408080f26b520e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Constructor (`app/components/qrati-demo.gts`) calls `initCookieConsent()` (`app/lib/cookieConsent.ts`).
2. `initCookieConsent` awaits `checkConsentRequired()` before `CookieConsent.run`. Cached `sessionStorage['qrati_geo_consent_required']` (`'true'`/`'false'`) short-circuits the network.
3. Host selection: if `window.location.hostname.includes('qrati.com')`, `geoUrl` is `/api/cookie-consent-geo` (origin-absolute path). Otherwise `https://qrati.com/api/cookie-consent-geo`. Fetch uses `{ cache: 'no-store' }`.
4. Deployed example is `https://qrati.com/connect/ember-example` (`wrangler.jsonc` zone `qrati.com`). Hostname `qrati.com` matches; the browser requests `https://qrati.com/api/cookie-consent-geo`, which is **outside** the Worker route `*qrati.com/connect/ember-example*` and is not rewritten by `src/worker.ts`.
5. Fail-closed (#42): non-OK response, non-boolean `payload.required`, or thrown errors (including CORS / blocked storage) return `true` without writing the session cache. Only a boolean `required` is stored.
6. Result drives `mode: required ? 'opt-in' : 'opt-out'` and `autoShow: required`. Analytics enablement remains `enabled: !required` (#32).

Authz: none (public demo). Persistence: sessionStorage geo flag only on a valid boolean. Side effects: one geo GET per session. Errors: catch → opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`includes('qrati.com')` treats `notqrati.com` as first-party and silently fail-opens:** a substring match on a foreign host would use *that origin's* `/api/cookie-consent-geo`. A missing/invalid response still returns `true` (opt-in) and does not cache. The documented production host is `qrati.com`. Not a reachable fail-open on this deployment.
- **Relative `/api/...` is resolved under `/connect/ember-example/` and 404s through the Ember Worker:** contradicted by URL resolution. A path starting with `/` is origin-root (`https://qrati.com/api/cookie-consent-geo`), not a subpath of the example. Worker prefix rewrite does not apply.
- **Localhost / Workers preview always fail-open because CORS blocks the absolute qrati.com API:** CORS/network failure is `catch → true` (opt-in / banner). Fail-closed, not opt-out.
- **`hostname.includes` is a product invariant requiring `endsWith('.qrati.com')`:** not stated in README, tests, or sibling geo issues. Tightening the matcher would be hardening.
- **Issue search** `geo hostname OR cookie-consent-geo OR includes qrati.com`: closed #42 (payload fail-open), #32 (opt-out default). No open duplicate. Open issues: none.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [CookieConsent configuration](https://cookieconsent.orestbida.com/reference/configuration-reference.html) (`mode` / `autoShow`)
- `app/lib/cookieConsent.ts` `checkConsentRequired`
- `wrangler.jsonc` route `*qrati.com/connect/ember-example*`
- Prior: geo response (#42); opt-out analytics (#32); first-layer (20261107T072738Z)

## Limitations

CodeGraph unindexed. No live GET to `qrati.com/api/cookie-consent-geo` or `qrati.com/connect/ember-example` (historical deployment 404 out of scope). CORS behavior inferred from the fail-closed `catch`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-12T20:12:38Z | 2026-11-12T20:13:02Z | 01:42:38 | 01:43:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-12T20:13:31Z | 2026-11-12T20:19:18Z | 01:43:31 | 01:49:18 | 00:05:47 (5.8 min) |
| `delivery` | 2026-11-12T20:19:18Z | 2026-11-12T20:20:04Z | 01:49:18 | 01:50:04 | 00:00:46 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-12T20:12:38Z | 2026-11-12T20:20:04Z | 01:42:38 | 01:50:04 | **00:07:26 (7.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:30 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261112T201238Z-18b3a9ac48cd473497408080f26b520e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/153
- Base `main` `7492b4c8776d742a512c2b141983d1ede18e33c1` / head `bughunter/20261112T201238Z-18b3a9ac48cd473497408080f26b520e-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: Workers Builds in progress
- Local tests **NOT RUN BY BUGHUNTER**
