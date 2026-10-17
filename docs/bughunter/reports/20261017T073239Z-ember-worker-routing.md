# BugHunter report: Ember subpath asset routing

- **Scope:** Ember example's Cloudflare Worker URL rewriting and static asset response flow (`src/worker.ts`, `wrangler.jsonc`), checked from entry request through asset fetch and HTML response handling.
- **Base:** `origin/main` at `5f305b6c82156561862112bfa50d11d0bf572346`.
- **Disposition:** Report-only; no confirmed defect. No source change, regression test, or issue created.
- **Finding:** None confirmed.

## Trace and evidence

`wrangler.jsonc` binds `src/worker.ts` as the Worker entry point, serves `./dist` through `ASSETS`, and routes the `qrati.com/connect/ember-example` subpath to the Worker. `fetch` derives a URL from the incoming request, maps the exact prefix and its trailing-slash root to `/`, and strips the prefix only from descendant paths (`${prefix}/`). It constructs a new `Request` from the rewritten URL and original request, then delegates to `env.ASSETS.fetch`. Non-HTML responses are returned as received. HTML responses are read, optionally have the configured GTM placeholder replaced, and are returned with the original response status, status text, and headers.

Boundary review: the exact route root, root with trailing slash, nested descendants, and paths that merely share a textual prefix without the required slash take distinct and consistent branches. The worker leaves unrelated paths unchanged. `URL.pathname` rewriting preserves the request URL's other components; using the original request as the `Request` initializer retains its request properties. The asset binding behavior is determined by Cloudflare's static-assets binding; no live deployment or external request was made. `wrangler.jsonc`'s route is intentionally broad at the configured URL prefix, while the worker only rewrites exact-prefix and descendant paths.

## Assessment

No reachable failure or violated invariant was established in this bounded route-rewrite/asset-forwarding path. The audit did not exercise deployed Cloudflare routing, asset-manifest behavior, or malformed upstream asset responses. Those remain outside this source-level review, not claimed defects.

## PR, checks, and tests

- Issue: none (no confirmed defect).
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/3 (base `main` at `5f305b6c82156561862112bfa50d11d0bf572346`). Readback confirmed the report and index files, no closing-issue references, and `MERGEABLE` status. On the prior head, CI Lint and Test failed before execution because `actions/setup-node` was configured for npm caching but the repository has `pnpm-lock.yaml` and no supported npm/yarn lockfile (`gh run view 39014239164 --log-failed`). On the current head, Lint/Test were queued and GitGuardian was in progress at last readback; result pending.
- Tests authored: none; no confirmed defect warranted a regression test.
- Tests/build/lint/type-check: **NOT RUN BY BUGHUNTER** (execution boundary); the observed CI failures occurred at dependency setup, before tests or lint.
- Patch hygiene: `git diff --check` checked; no whitespace errors were reported.

## Timing

- Audit started: `2026-10-17T07:33:08Z` (`12:03:08 IST`).
- End of verified PR readback: `2026-10-17T07:36:26Z` (`12:06:26 IST`); elapsed **3m 18s**.
- Phase breakdown: phase-boundary timestamps were not captured, so no phase durations are asserted.
