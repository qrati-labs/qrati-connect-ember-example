# Ember example crawler discovery audit

- **Run:** `20261018T174138Z-b393ced7f0404f7d9e3fdb858e6175df`
- **Scope:** Public crawler discovery for the Ember demo at `https://qrati.com/connect/ember-example`.
- **Base:** `origin/main` `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- **Disposition:** Report-only; no confirmed defect.

## Trace and evidence

- `public/robots.txt` allows crawling and advertises `https://qrati.com/connect/ember-example/sitemap.xml`.
- `wrangler.jsonc` routes the Ember subpath to this worker. `src/worker.ts` rewrites `/connect/ember-example/sitemap.xml` to `/sitemap.xml` before passing it to `ASSETS.fetch`; this is consistent with the deployed asset path rather than requiring a nested static file.
- `public/sitemap.xml` contains the canonical public URL `https://qrati.com/connect/ember-example`.
- The route normalization maps both the exact prefix and its trailing-slash form to `/`; other subpaths have the prefix removed. Thus the advertised sitemap path is handled by the same routing rule and reaches the static root sitemap.

## Finding

No defect confirmed in this bounded path. The apparent difference between the sitemap URL in `robots.txt` and the static asset path is resolved by the worker rewrite. No live production request was made; deployment configuration and static sources were traced, so real edge routing/cache behavior remains unverified.

## Tests

No tests authored. Tests/build/lint/type-check/install were not run by BugHunter. No test command is applicable to this report-only audit.

## Timing

- **Preflight (provided):** 17:41:38–17:42:00 UTC (23:11:38–23:12:00 IST), 22s.
- Audit and report/index/PR delivery: 17:42:00–17:43:33 UTC (23:12:00–23:13:33 IST), 93s.
- Total: 17:41:38–17:43:33 UTC (23:11:38–23:13:33 IST), 115s.

## PR state

PR #7: https://github.com/qrati-labs/qrati-connect-ember-example/pull/7. Created from base `5f305b6c82156561862112bfa50d11d0bf8748d8`; head `073be4b19be7e1605fce02bc0feb66ad7e51f831`. Readback confirms both report/index files, mergeable state, and no issue reference. Lint and Test checks were queued at readback.
