# Ember cookie-consent Google Consent Mode default

- **Scope:** Whether the host sets Google Consent Mode `gtag('consent','default',…)` (and optional `wait_for_update`) **before** `CookieConsent.run` / GTM inject. Excludes GTM first load (20261106T204938Z), analytics revoke vs autoClear (20261107T101539Z), first-layer modal (20261107T072738Z), cookie record (20261107T092838Z), geo fail-closed (#42), opt-out default (#32).
- **Base:** `origin/main` at `8dd411067c9b79c6ca412dcf22af07ee10caba6a`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T103738Z-187c5db10b7447658dd477e4c852c94d-qrati-connect-ember-example`, `bughunter/20261107T103738Z-187c5db10b7447658dd477e4c852c94d-ember`.
- **Run:** `20261107T103738Z-187c5db10b7447658dd477e4c852c94d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Constructor (`app/components/qrati-demo.gts`) calls `initCookieConsent()` (`app/lib/cookieConsent.ts`).
2. `index.html` has no `gtag` / `dataLayer` / Consent Mode snippet. Worker HTML rewrite of `__GTM_ID__` is a no-op on this document (GTM is client-injected).
3. `initCookieConsent` is async: geo `checkConsentRequired` (sessionStorage cache / `/api/cookie-consent-geo` or `https://qrati.com/api/cookie-consent-geo`, fail-closed) then `CookieConsent.run`. No `gtag('consent','default',…)` and no `wait_for_update` exist in this module or `index.html`.
4. `syncGtm` (registered as `onFirstConsent` / `onConsent` / `onChange`, and called once after `run`): stubs `window.gtag` onto `dataLayer`; sends **only** `gtag('consent','update', { analytics_storage, ad_storage, ad_user_data, ad_personalization })` from `acceptedCategory('analytics')`; injects `gtm.js?id=` only when analytics is accepted, `VITE_GTM_ID` is truthy, and `#gtm-script` is absent. `.env.example` leaves `VITE_GTM_ID` empty.
5. Order on accept / opt-out enable: Consent Mode **update** first, then `appendChild` of `gtm.js`. Reject / no ID: update to `denied` (or skip inject) and return.
6. Google Consent Mode website guide: set a default **before a user grants consent**; “By default, no consent mode values are set.” `wait_for_update` is for an **asynchronous CMP when Google tags might already be on the page**. Basic vs advanced: basic withholds Google tags until grant; advanced loads tags under a denied default. CookieConsent’s GCM sample sets default `denied` and splits ads vs analytics **services** — that sample assumes tags can run with the CMP.

Authz: none (public demo). Persistence: `cc_cookie` + optional GTM cookies if an ID is built in. Side effects: optional `gtm.js` inject. Errors: geo catch → opt-in; storage throws fail closed.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `consent default` leaks measurement before the banner:** contradicted by inject-after-accept. No Google tag is in `index.html`. `syncGtm` will not `appendChild` until `acceptedCategory('analytics')` is true.
- **Must match CookieConsent’s full GCM sample (ads category + default denied + `arguments` push):** that sample is for a multi-category CMP with tags present. This host documents only essential vs optional analytics; empty `VITE_GTM_ID` makes GTM unreachable on the stock example.
- **`wait_for_update` is required because geo is async:** Google’s wait applies when tags may fire before the CMP. Here tags are not loaded during the geo fetch.
- **`update` without `default` makes GTM treat storage as granted on inject:** inject is after `update` to `granted` on the accept path. On reject, GTM is not injected. Google states unset Consent Mode values are the default — not an evidenced grant on this tag-gated path.
- **Coupling `ad_*` to the analytics category is a silent ads grant:** no ads category or ads copy exists; GTM is still gated on analytics. Mapping the four v2 keys together on a single category is a policy/hardening choice, not a demonstrated ads-tag fire on this example (ID unset).
- **Issue search** `consent default OR gtag default OR wait_for_update OR Consent Mode default`: no matching issue. Closed #32 (opt-out default), #42 (geo), #28/#30 (preferences). Open issues: none.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent) (default vs update; `wait_for_update`; basic vs advanced)
- [CookieConsent Google consent mode](https://cookieconsent.orestbida.com/advanced/google-consent-mode.html) (sample default-denied + ads services; `acceptedCategory` false until `run`)
- `app/lib/cookieConsent.ts` `syncGtm` / `initCookieConsent`
- `index.html` (no gtag/GTM)
- `.env.example` `VITE_GTM_ID=`

## Limitations

CodeGraph unindexed. No browser / Tag Assistant session. No live GET to `qrati.com/connect/ember-example` (prior deployment 404 is out of scope). Whether production wrangler sets `VITE_GTM_ID` was not observed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T10:37:38Z | 2026-11-07T10:37:59Z | 16:07:38 | 16:07:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-07T10:38:21Z | 2026-11-07T10:43:38Z | 16:08:21 | 16:13:38 | 00:05:17 (5.3 min) |
| `delivery` | 2026-11-07T10:43:38Z | 2026-11-07T10:44:32Z | 16:13:38 | 16:14:32 | 00:00:54 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-07T10:37:38Z | 2026-11-07T10:44:32Z | 16:07:38 | 16:14:32 | **00:06:54 (6.9 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T103738Z-187c5db10b7447658dd477e4c852c94d.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/81
- Base `main` `8dd411067c9b79c6ca412dcf22af07ee10caba6a` / head `bughunter/20261107T103738Z-187c5db10b7447658dd477e4c852c94d-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
