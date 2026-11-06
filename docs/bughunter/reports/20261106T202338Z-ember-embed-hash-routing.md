# Ember embed hash routing on history host

- **Scope:** Live gallery embed `data-router="hash"` on the Ember host (`locationType: 'history'`), including theme remount, host fragment ids, and the qrati-connect hash contract.
- **Base:** `origin/main` at `20d1d640c41b3a4c2e21c40365aaa7eabd0ccb87`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T202338Z-ce041ec51b4a4165a138b3fe2dc45edd-ember`, `bughunter/20261106T202338Z-ce041ec51b4a4165a138b3fe2dc45edd-ember`.
- **Run:** `20261106T202338Z-ce041ec51b4a4165a138b3fe2dc45edd`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Admin chore PRs #121/#122 were not used as a source checkout. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. Host router: `config/environment.js` `locationType: 'history'`, `rootURL: '/'`. `app/router.ts` maps no extra routes. Ember consumes pathname, not `location.hash`.
3. Embed mount: `app/components/qrati-demo.gts` `mountEmbed` creates a classic `script` with `dataset.router = 'hash'`, `dataset.theme`, `dataset.organizationId`, `async = true`, appended into `.widget-embed-host` (sibling of the sr-only gallery heading; issue [#26](https://github.com/qrati-labs/qrati-connect-ember-example/issues/26)).
4. Loader contract (`qrati-connect-ts` `src/exports/embed.ts`): IIFE captures `document.currentScript`, maps `data-router` → `<qrati-connect router>`, mounts the element next to the script (or `document.body` only if the script has no `parentNode`). Empty organization id logs and returns without mounting.
5. Hash history (`qrati-connect-ts` `src/libs/router/history.ts`): location is `window.location.hash.replace(/^#/, '') || '/'`; `push`/`replace` write `pathname+search+'#'+path` where path is app-rooted (`#/`, `#/event/…`).
6. Host fragment ids in the demo (`feature-map-heading`, `features-heading`, `quickstart-heading`, `faq-heading`) have no leading `/`, so they do not collide with embed hashes of the form `#/…`.
7. Quickstart snippet also uses `data-router="hash"` (issue [#36](https://github.com/qrati-labs/qrati-connect-ember-example/issues/36)).
8. Theme toggle remounts the script via `innerHTML = ''` then a new tag; in-flight loader fallback to `document.body` was considered (see falsification).

Authz/validation/persistence: none on the host (public demo). Side effects: embed navigation writes the page hash; Ember history location does not consume it.

## Falsification

- **Hash vs Ember history collision:** Ember 6 `history` location does not route on `location.hash`. Single application template always renders `QratiDemo`. No evidence the host router strips or rewrites embed hashes.
- **Fragment-id scroll collision:** embed paths are `#/` + app path; host `id`s are kebab headings without a leading slash.
- **`document.currentScript` null on dynamic `createElement('script')`:** embed.js is an IIFE for classic tags; the documented snippet also uses `async`. Prior merged remount/quickstart work assumes this injection path mounts. Not confirmed broken without a browser session.
- **In-flight remount → `parentNode` null → `document.body`:** reachable only if a removed script still executes after `innerHTML = ''`. Spec/browser behavior is not established here; no issue filed.
- **Empty `VITE_ORGANIZATION_ID`:** loader refuses to mount; that is env/config, not a hash-routing invariant. Out of scope (prior embed-configuration audit).
- **Live `https://qrati.com/connect/ember-example`:** previously observed HTTP 404 is a deployment-availability gap, not a hash-routing source defect.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: none (no confirmed defect).
- Command: none.
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**.
- Patch hygiene: `git diff --check` on docs-only diff.

## Citations

- [Qrati Connect embed loader](https://www.npmjs.com/package/@qratilabs/qrati-connect) (script `data-router`)
- `qrati-connect-ts` `src/exports/embed.ts`, `src/libs/router/history.ts`, `src/routes/AppRoutes.tsx`
- Prior related: gallery heading remount [#26](https://github.com/qrati-labs/qrati-connect-ember-example/issues/26); quickstart embed script [#36](https://github.com/qrati-labs/qrati-connect-ember-example/issues/36)

## Limitations

CodeGraph unindexed. No browser session of the Ember host (public example URL historically 404). Hash/history interaction inferred from Ember config plus qrati-connect-ts source, not a running widget.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T20:23:38Z | 2026-11-06T20:24:01Z | 01:53:38 | 01:54:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T20:24:23Z | 2026-11-06T20:33:26Z | 01:54:23 | 02:03:26 | 00:09:04 (9.1 min) |
| **Total run (preflight start to finish)** | 2026-11-06T20:23:38Z | 2026-11-06T20:33:26Z | 01:53:38 | 02:03:26 | **00:09:48 (9.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:21 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T202338Z-ce041ec51b4a4165a138b3fe2dc45edd.json`.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/47
- Base `main` `20d1d640c41b3a4c2e21c40365aaa7eabd0ccb87` / head `bughunter/20261106T202338Z-ce041ec51b4a4165a138b3fe2dc45edd-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pass; CI Lint pending; CI Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
