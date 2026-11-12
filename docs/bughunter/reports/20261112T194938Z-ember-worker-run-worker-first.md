# Ember Worker `run_worker_first` vs subpath prefix rewrite

- **Scope:** Cloudflare static-assets invocation order (`run_worker_first` default) versus `src/worker.ts` `/connect/ember-example` prefix rewrite before `env.ASSETS.fetch`. Includes Vite `base` vs `dist` layout and `html_handling` applied on the binding. Excludes HTML body reconstruction / GTM replace (20261110T211438Z), Worker security headers (20261107T095138Z), prefix-branch coverage without invocation order (20261017T073239Z), embed hash routing, cookie consent.
- **Base:** `origin/main` at `7305926aa8a738a7880cddd0107c1d86e694c17a`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261112T194938Z-dfbd19430e084cecb0fd2c3040cd406b-ember`, `bughunter/20261112T194938Z-dfbd19430e084cecb0fd2c3040cd406b-ember-faq`.
- **Run:** `20261112T194938Z-dfbd19430e084cecb0fd2c3040cd406b`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to `src/worker.ts`; `assets.directory` is `./dist`, binding `ASSETS`. There is no `run_worker_first`, `not_found_handling`, or `html_handling` override.
2. Cloudflare Workers static assets ([Configuration and Bindings](https://developers.cloudflare.com/workers/static-assets/binding/)): `run_worker_first = false` (default) serves any static asset matching the incoming request; the Worker script runs only when no asset matches. `run_worker_first = true` would unconditionally invoke the script. `env.ASSETS.fetch()` still applies `html_handling` and `not_found_handling` to the rewritten request.
3. Vite (`vite.config.mjs`) `base: '/connect/ember-example/'` prefixes built *URLs*; it does not nest `dist` under `connect/ember-example/`. Asset keys remain `index.html`, `assets/*`, `robots.txt`, `qrati-logo-square.svg`, etc.
4. Browser requests the public pathname `/connect/ember-example`, `/connect/ember-example/`, or `/connect/ember-example/assets/…`. Those keys are not present in `dist`, so the default matcher does not short-circuit. The Worker runs.
5. Worker rewrite: exact prefix and prefix+`/` → `/`; descendants lose the prefix (`pathname.slice(prefix.length)`). `env.ASSETS.fetch(new Request(url, request))` then resolves `/` / `/assets/…` against `dist`.
6. `index.html` icon/canonical/OG URLs already use the `/connect/ember-example/…` public prefix (`tests/unit/index-html-head-test.ts`). Favicon files live at `public/` root, not under a nested connect path.

Authz/validation/persistence: none (public demo). Side effects: ASSETS fetch after rewrite. Errors: unmatched rewritten paths follow default `not_found_handling` (none).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Default `run_worker_first: false` serves `dist/index.html` for `/connect/ember-example` and skips the Worker, so prefix rewrite never runs:** contradicted by asset-key matching. Incoming pathname is `/connect/ember-example` (or a descendant). `dist` has `index.html` at `/`, not at `/connect/ember-example/index.html`. No match → Worker runs → rewrite to `/` → `ASSETS.fetch` applies HTML handling for the index.
- **Vite `base` writes files under `dist/connect/ember-example/`, so the matcher serves them without rewrite and the Worker is dead code:** Vite `base` is the public URL prefix, not the output directory layout. Source has no `outDir` override. Sibling examples use the same Worker-strip + Vite-base pattern.
- **Missing `not_found_handling: "single-page-application"` 404s the documented gallery URL:** the documented URL is the prefix root, which the Worker maps to `/`. Extra history paths (`/connect/ember-example/foo`) are not claimed routes (`Router.map` empty). Preact/Qwik set SPA fallback; that is sibling parity, not a violated Ember contract.
- **`run_worker_first: true` is required for GTM HTML rewrite:** current `index.html` has no `__GTM_ID__` token (20261110T211438Z). Client GTM is `VITE_GTM_ID` after consent. Invocation order does not drop analytics on this document.
- **Issue search** `run_worker_first OR worker first OR static asset prefix OR assets.fetch`: no matching issues (open or closed).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Cloudflare Workers static assets — Configuration and Bindings (`run_worker_first`, `ASSETS.fetch`)](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Vite `base`](https://vite.dev/config/shared-options.html#base)
- `wrangler.jsonc` (no `run_worker_first`)
- `src/worker.ts` prefix rewrite
- `vite.config.mjs` `base: '/connect/ember-example/'`
- Prior: Worker routing (20261017T073239Z); HTML reconstruction (20261110T211438Z)

## Limitations

CodeGraph unindexed. No live request to `qrati.com/connect/ember-example` (historical deployment 404 out of scope). No `wrangler dev` / production asset-manifest capture. `run_worker_first` default taken from Cloudflare docs dated 2026-11-12.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.
