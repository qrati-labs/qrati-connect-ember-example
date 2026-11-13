# Ember Worker prefix rewrite vs Cloudflare `assets.base_path`

- **Scope:** Public subpath `/connect/ember-example` as implemented by `src/worker.ts` prefix rewrite + Vite `base`, versus Cloudflare’s 2026-11-11 `assets.base_path` (Wrangler ≥ 4.148.0) that serves `dist` from a URL prefix without nesting files. Includes `env.ASSETS.fetch` pathname contract when `base_path` is unset. Excludes `run_worker_first` invocation order (20261112T194938Z), HTML body reconstruction / GTM replace (20261110T211438Z), Worker security headers (20261107T095138Z), prefix-branch coverage (20261017T073239Z), embed hash routing, cookie consent.
- **Base:** `origin/main` at `b5af7d5dc1283fd8be55e920823ed5ebc25c8c24`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T160738Z-74c573778d4f499f9e9204756913d54d-ember`, `bughunter/20261113T160738Z-74c573778d4f499f9e9204756913d54d-ember`.
- **Run:** `20261113T160738Z-74c573778d4f499f9e9204756913d54d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to `src/worker.ts`; `assets.directory` is `./dist`, binding `ASSETS`. There is no `assets.base_path`, `run_worker_first`, `not_found_handling`, or `html_handling` override.
2. Cloudflare changelog [2026-11-11](https://developers.cloudflare.com/changelog/post/2026-11-11-static-assets-base-path/) and [Serving a subdirectory](https://developers.cloudflare.com/workers/static-assets/routing/advanced/serving-a-subdirectory/): `assets.base_path` (Wrangler 4.148.0+) mounts the asset directory at a public URL prefix while files stay at the root of `assets.directory`. Requests through the binding then use that mounted public path; constructed fetches must include the prefix. This option is **opt-in**. Unset, the binding matches pathnames against `dist` as uploaded (root `index.html`, `assets/*`, `public/` copies).
3. Vite (`vite.config.mjs`) `base: '/connect/ember-example/'` prefixes built *URLs*; it does not nest `dist` under `connect/ember-example/`. No `outDir` override.
4. Worker (`src/worker.ts`): exact prefix and prefix+`/` → `/`; descendants `pathname.slice(prefix.length)`. `env.ASSETS.fetch(new Request(url, request))` then looks up `/`, `/assets/…`, `/qrati-logo-square.svg`, etc. against `dist`.
5. Because `base_path` is unset, stripping the public prefix before `ASSETS.fetch` is the matching contract. Setting `base_path: '/connect/ember-example'` *and* still stripping would look up `/` on a binding that expects `/connect/ember-example/` — that combination is not present.
6. Sibling connect Workers (Qwik, Preact) use the same Worker-strip + Vite-base pattern and also omit `base_path`. Qwik/Preact add `not_found_handling: "single-page-application"`; Ember’s empty `Router.map` does not claim extra history paths.

Authz/validation/persistence: none (public demo). Side effects: ASSETS fetch after rewrite. Errors: unmatched rewritten paths follow default `not_found_handling` (none).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `assets.base_path` 404s `/connect/ember-example` now that Cloudflare shipped the option:** contradicted by the changelog. The feature is an alternative to nesting files or rewriting in a Worker. This Worker still rewrites. No source evidence Wrangler infers `base_path` from Vite `base` without the Cloudflare Vite plugin (this app uses `@embroider/vite`).
- **`ASSETS.fetch` after strip is wrong under the new binding docs (“include `/blog` in its pathname”):** that sentence applies when `base_path` *is* set. Unset, only the URL pathname is used to match uploaded keys ([Configuration and Bindings](https://developers.cloudflare.com/workers/static-assets/binding/)).
- **Must adopt `base_path` for parity with the 2026-11-11 recommendation:** product/hardening, not a violated invariant. README documents the Worker + embed script, not Wrangler 4.148.
- **Issue search** `base_path OR "base path" OR subdirectory assets`: no matching issues (open set empty). Closed #16 is social OG. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Cloudflare changelog — Serve static assets from a URL path (2026-11-11)](https://developers.cloudflare.com/changelog/post/2026-11-11-static-assets-base-path/)
- [Serving a subdirectory (`assets.base_path`)](https://developers.cloudflare.com/workers/static-assets/routing/advanced/serving-a-subdirectory/)
- [Configuration and Bindings (`ASSETS.fetch`, pathname match)](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Vite `base`](https://vite.dev/config/shared-options.html#base)
- `wrangler.jsonc` (no `base_path`)
- `src/worker.ts` prefix rewrite
- `vite.config.mjs` `base: '/connect/ember-example/'`
- Prior: `run_worker_first` (20261112T194938Z); Worker routing (20261017T073239Z)

## Limitations

CodeGraph unindexed. No live request to `qrati.com/connect/ember-example` (historical deployment 404 out of scope). No `wrangler dev`. `assets.base_path` behavior taken from Cloudflare docs dated 2026-11-11/13, not from a Wrangler 4.148 runtime in this worktree.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T16:07:38Z | 2026-11-13T16:08:02Z | 21:37:38 | 21:38:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-13T16:08:34Z | 2026-11-13T16:13:12Z | 21:38:34 | 21:43:12 | 00:04:38 (4.6 min) |
| `delivery` | 2026-11-13T16:13:12Z | 2026-11-13T16:13:44Z | 21:43:12 | 21:43:44 | 00:00:32 (0.5 min) |
| **Total run (preflight start to finish)** | 2026-11-13T16:07:38Z | 2026-11-13T16:13:44Z | 21:37:38 | 21:43:44 | **00:06:06 (6.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:33 (0.6 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T160738Z-74c573778d4f499f9e9204756913d54d.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/161
- Base `main` `b5af7d5dc1283fd8be55e920823ed5ebc25c8c24` / head `bughunter/20261113T160738Z-74c573778d4f499f9e9204756913d54d-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint in progress; CI Test in progress
- Local tests **NOT RUN BY BUGHUNTER**
