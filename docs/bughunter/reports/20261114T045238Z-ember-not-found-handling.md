# Ember Worker prefix rewrite vs ASSETS `not_found_handling`

- **Scope:** Cloudflare default `assets.not_found_handling` after `src/worker.ts` rewrites `/connect/ember-example*` and calls `env.ASSETS.fetch`. Covers unmatched rewritten paths, Ember history `Router.map`, and whether missing `single-page-application` 404s the documented gallery URL. Excludes `html_handling` trailing-slash redirects (20261114T034438Z), `run_worker_first` invocation order (20261112T194938Z), `assets.base_path` (20261113T160738Z), HTML body reconstruction / GTM replace (20261110T211438Z), embed hash routing, cookie consent.
- **Base:** `origin/main` at `8c6d055fe1a37d01b3983ea04dda5f7ec777e4a7`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T045238Z-bb4674f0c99d482e89f34b4711358ce8-ember`, `bughunter/20261114T045238Z-bb4674f0c99d482e89f34b4711358ce8-ember`.
- **Run:** `20261114T045238Z-bb4674f0c99d482e89f34b4711358ce8`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to `src/worker.ts`; `assets.directory` is `./dist`, binding `ASSETS`. There is no `not_found_handling`, `html_handling`, `run_worker_first`, or `base_path` override.
2. Default asset-first routing ([static assets](https://developers.cloudflare.com/workers/static-assets/)): a matching file in `dist` is served without invoking the Worker. Incoming `/connect/ember-example` does not match `dist/index.html` (Vite `base` prefixes hrefs; `dist` keys remain `/index.html`, `/assets/…`, `public/` copies). No match → Worker `fetch`.
3. Worker (`src/worker.ts`): exact prefix and prefix+`/` → pathname `/`; descendants `pathname.slice(prefix.length)`. Then `env.ASSETS.fetch(new Request(url, request))`. Non-HTML responses return unchanged; HTML may GTM-substitute (no `__GTM_ID__` on current `index.html`).
4. `env.ASSETS.fetch` applies `not_found_handling` to the **rewritten** request ([bindings](https://developers.cloudflare.com/workers/static-assets/binding/), [version skew / missing assets](https://developers.cloudflare.com/workers/versions-and-deployments/version-skew/)). Unset `not_found_handling` does not rewrite misses to `/index.html`. SPA mode is opt-in: `not_found_handling: "single-page-application"` serves `/index.html` with 200 for navigation misses ([SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)).
5. Documented public URLs (README, canonical, `og:url`, sitemap `loc`) are `https://qrati.com/connect/ember-example` (optional trailing slash). Worker maps both to `/`. Cloudflare `html_handling` (out of scope) serves folder-index `dist/index.html` as 200 at `/`.
6. Host router (`config/environment.js`): `locationType: 'history'`, `rootURL: '/'`. `app/router.ts` `Router.map` is empty. Application template always renders `<QratiDemo />`. Embed navigation is `data-router="hash"`, not extra history paths. Unknown `/connect/ember-example/foo` is not a claimed host route.

Authz/validation/persistence: none (public demo). Side effects: ASSETS fetch after rewrite. Errors: unmatched rewritten paths are ASSETS misses (404 unless SPA mode is set).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing SPA fallback 404s the documented gallery URL:** contradicted by the rewrite: the published URL and slash variant become `/`, which is the folder-index 200 path, not a miss.
- **Ember history location requires SPA fallback:** empty `Router.map` never client-navigates to `/foo`. Hash routing stays in `location.hash` and is not sent to the Worker. Refresh of the documented URL is the prefix root.
- **Sibling Preact/Qwik `not_found_handling: "single-page-application"` proves Ember is broken:** sibling parity, not an Ember contract. Those hosts may claim extra history paths; this host does not.
- **Asset-first 404s `/connect/ember-example` before the Worker rewrites:** `dist` has no file at that public prefix. No asset match invokes the Worker, which then fetches `/`.
- **Issue search** `not_found_handling OR SPA OR single-page-application OR 404 fallback`: no matching open or closed issue. Open issue list empty. No duplicate. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers static assets — SPA `not_found_handling`](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Cloudflare Workers static assets — configuration / bindings](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Cloudflare Workers — version skew / missing assets](https://developers.cloudflare.com/workers/versions-and-deployments/version-skew/)
- `src/worker.ts` prefix rewrite + `env.ASSETS.fetch`
- `wrangler.jsonc` (`assets.directory` / binding; no `not_found_handling`)
- `config/environment.js` `locationType: 'history'`; `app/router.ts` empty map
- Prior: html_handling (20261114T034438Z); run_worker_first (20261112T194938Z); assets.base_path (20261113T160738Z)

## Limitations

CodeGraph unindexed. No live request to `qrati.com/connect/ember-example` (historical deployment 404 out of scope). No `wrangler dev` / production asset-manifest capture. Default miss behavior taken from Cloudflare docs dated 2026-11-14, not a captured ASSETS 404.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T04:52:38Z | 2026-11-14T04:53:01Z | 10:22:38 | 10:23:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-14T04:53:23Z | 2026-11-14T04:56:30Z | 10:23:23 | 10:26:30 | 00:03:07 (3.1 min) |
| `delivery` | 2026-11-14T04:56:30Z | 2026-11-14T04:57:21Z | 10:26:30 | 10:27:21 | 00:00:51 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-14T04:52:38Z | 2026-11-14T04:57:21Z | 10:22:38 | 10:27:21 | **00:04:43 (4.7 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T045238Z-bb4674f0c99d482e89f34b4711358ce8.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/189
- Base `main` `8c6d055fe1a37d01b3983ea04dda5f7ec777e4a7` / head `bughunter/20261114T045238Z-bb4674f0c99d482e89f34b4711358ce8-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pending; Lint pending; Test pending
- Local tests **NOT RUN BY BUGHUNTER**
