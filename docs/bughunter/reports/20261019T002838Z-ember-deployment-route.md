# Ember example deployment route audit

- **Run:** `20261019T002838Z-8865a73e8a7a4ce189ff0578f7cbfdce`
- **Scope:** User-facing Ember example at `https://qrati.com/connect/ember-example`, including worker prefix handling and static asset paths.
- **Base:** `origin/main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261019T002838Z-8865a73e8a7a4ce189ff0578f7cbfdce-ember-route`, `bughunter/20261019T002838Z-8865a73e8a7a4ce189ff0578f7cbfdce-ember-route`.
- **Disposition:** Report-only. No source defect was confirmed; the live route is unavailable, and available evidence does not establish why.

## Finding / evidence

**[Unconfirmed deployment availability] Ember example returns HTTP 404 at the public route.** On 2026-10-19 at 00:30 UTC, unauthenticated GET requests to both `https://qrati.com/connect/ember-example` and its trailing-slash variant returned HTTP 404 with an empty response body. Requests for the advertised subpath sitemap and an expected logo path also returned HTTP 404. This prevents a visitor from reaching the example at those URLs at the time checked. The production observation is read-only and was not used to infer or mutate deployment configuration.

This is an observed availability issue, not a confirmed code defect: the same responses do not show whether the route is undeployed, routed incorrectly by Cloudflare, or affected by another deployment/configuration condition. No production mutation or external test was attempted. No issue was filed because the source-level cause is unconfirmed.

## Trace and falsification

- `wrangler.jsonc:6-8` binds a Worker route matching `*qrati.com/connect/ember-example*` and static assets from `./dist`.
- `src/worker.ts:8-18` takes the request URL, strips `/connect/ember-example` from the path (or maps the exact root to `/`), and delegates the rewritten request to `ASSETS.fetch`.
- `vite.config.mjs:5-6` sets the Vite base to `/connect/ember-example/`; `config/environment.js:7-8` configures Ember with `rootURL: '/'` and history location.
- `index.html:8-9` advertises a canonical URL and relative favicon. The source tree also contains `public/robots.txt` and `public/sitemap.xml`; the public robots response belongs to the site's root handler, not demonstrably this Worker.
- Current remote default-branch files were inspected. Relevant open PRs in the Ember repository were compared by changed paths; PR #8 changes only BugHunter docs/index, so it does not overlap this deployment/asset path. Other listed Ember open PRs were also docs-only and do not establish an implementation change to the route path.
- CodeGraph reported the checkout is not indexed. Focused source reads/searches were used instead.

The static mapping appears internally consistent when considered as source, but no built artifact or deployed Worker behavior was tested. The public 404 may result from deployment/routing state rather than this source. Accordingly, this audit makes no claim that the checked-in Worker is defective, nor that a build would produce the intended assets.

## Tests and limits

- No regression test authored: no safe source-level cause was established.
- No test/build/lint/type-check/install/package-manager command was run, per BugHunter boundary.
- Live checks were read-only HTTP GETs only; observed statuses are time-specific and do not establish current state after this audit.
- No issue required; no confirmed code defect.

## Timing

- Preflight (provided script): measured 00:00:23, 2026-10-19 00:28:38–00:29:01 UTC.
- Audit elapsed time through final PR readback: 00:02:12, 2026-10-19 00:28:38–00:30:50 UTC. The script's start timestamp is used as the run start; 00:30:50 is the observed PR-readback timestamp. No finer phase breakdown is claimed because phase boundary timestamps were not captured.
- IST (UTC+05:30): 2026-10-19 05:58:38–06:00:50.

## Delivery state

Report-only documentation PR: [#9](https://github.com/qrati-labs/qrati-connect-ember-example/pull/9). Readback confirmed OPEN, MERGEABLE, merge state UNSTABLE; base `main` at `5f305b6c82156561862112bfa50d11d0bf8748d8`, head `bughunter/20261019T002838Z-8865a73e8a7a4ce189ff0578f7cbfdce-ember-route` at `145793ae3f44ce332f6c9686ac4e0a6b71c44316`; the PR contains this report and the index update and has no closing issue references. At readback, CI Lint and Test were QUEUED, GitGuardian and Cloudflare Workers Builds were IN_PROGRESS. No checks had completed.
