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

All phase/total durations below are measured wall-clock intervals, not estimates. Preflight ran before the audit task and is recorded separately.

| Phase | UTC start–end | Duration |
|---|---|---:|
| Preflight (provided script) | 2026-10-19 00:28:38–00:29:01 | 00:00:23 |
| Candidate/PR verification and worktree isolation | 2026-10-19 00:29:11–00:29:40 | 00:00:29 |
| Route/source trace and live read-only verification | 2026-10-19 00:29:40–00:30:15 | 00:00:35 |
| Report, index, review, and delivery | 2026-10-19 00:30:15–00:31:00 | 00:00:45 |
| **Total, including preflight** | **2026-10-19 00:28:38–00:31:00** | **00:02:22** |

IST (UTC+05:30): total 2026-10-19 05:58:38–06:01:00.

## Delivery state

Report-only documentation PR; no issue link is applicable. PR URL, files, head/base SHAs, mergeability, and checks are recorded after GitHub readback.
