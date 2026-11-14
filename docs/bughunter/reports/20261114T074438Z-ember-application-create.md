# Ember Application.create vs loadInitializers / compat-modules resolver

- **Scope:** Production instance boot of the Ember gallery host: root `index.html` `Application.create(environment.APP)` after `import Application from './app/app'`; `app/app.ts` class (`modulePrefix`, `Resolver.withModules(compatModules)`, inspector) and `loadInitializers(App, config.modulePrefix, compatModules)`. Excludes config-meta-loader / `storeConfigInMeta` (20261114T072338Z), `{{content-for}}` (20261114T051338Z), virtual vendor URL prefixing (20261114T061838Z), `rootURL` vs Vite base (20261107T040238Z), cookie consent, embed mount.
- **Base:** `origin/main` at `aad13e6256a8eb2f1fc7c2024f819fd166496b8c`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T074438Z-40ff1c5ad5914233915646c112ddd8b7-ember`, `bughunter/20261114T074438Z-40ff1c5ad5914233915646c112ddd8b7-ember`.
- **Run:** `20261114T074438Z-40ff1c5ad5914233915646c112ddd8b7`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Production boot is root `index.html`: classic `/@embroider/virtual/vendor.js`, then a module that `import`s `Application` from `./app/app` and `environment` from `./app/config/environment`, then `Application.create(environment.APP)`.
2. `app/app.ts` matches the Ember Vite app blueprint (`@ember/app-blueprint` `files/app/app.ts`): `@warp-drive/ember/install`; `Application` subclass with `modulePrefix` / `podModulePrefix` from config; `Resolver = Resolver.withModules(compatModules)`; `inspector = setupInspector(this)`; `loadInitializers(App, config.modulePrefix, compatModules)` at module evaluation. Dev-only `deprecation-workflow` is behind `macroCondition(isDevelopingApp())`.
3. `ember-load-initializers@3.0.1` with an explicit module map registers only names starting `qrati-connect-ember-example/initializers/` or `…/instance-initializers/` (not `-test`). This repo has no app initializer files. Addon initializers are expected in the Embroider `compat-modules` map under the app prefix (blueprint contract). `ember-page-title@9.0.3` v2 `app-js` ships helper + service only, not an initializer.
4. `ember-resolver@13.1.1` `withModules(explicitModules)` stores the map on the subclass as `static explicitModules` and resolves from `Object.keys` of that map — the documented Embroider Vite path (addon AMD `requirejs` is not required).
5. `config/environment.js` `APP: {}`. Tests set `APP.autoboot = false` and `rootElement = '#ember-testing'`; production does not. Ember default is autoboot and append to `document.body` ([Embedding Applications](https://guides.emberjs.com/release/configuring-ember/embedding-applications/)). `config/optional-features.json` `application-template-wrapper: false` means the application template is the root; it unconditionally mounts `QratiDemo`.
6. `ember-welcome-page@8.0.5` is a leftover blueprint dependency. Its v2 `app-js` only registers `welcome-page`; `application.gts` does not invoke it.

Authz/validation: public demo. Persistence: none. Side effects: Ember instance boot, application template render, inspector hook in all builds. Errors: missing compat-modules / resolver miss would throw at boot; not evidenced in source.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`Application.create(environment.APP)` with empty `APP` fails to autoboot:** Ember accepts `{}`; autoboot is not disabled outside `environment === 'test'`. The Vite blueprint uses the same `Application.create(environment.APP)` in `index.html`.
- **`loadInitializers` without AMD throws:** the third argument is `compatModules`, so the 3.0.1 explicit-modules branch is used (no `requirejs._eak_seen`).
- **Addon initializers never run because prefix filter is app-only:** that is the embroider-compat contract (modules keyed under `modulePrefix`). `ember-page-title` 9 does not ship an initializer. No host feature in this workflow depends on a missing initializer.
- **`ember-welcome-page` overlays the gallery:** it is opt-in via `<WelcomePage />`; the application template does not render it.
- **`setupInspector` in production is a defect:** blueprint includes it unconditionally; it is Ember Inspector support, not a user-facing failure of the gallery host.
- **Issue search** `loadInitializers`, `compat-modules`, `Application.create`, `autoboot`, `welcome-page`: no matching open or duplicate issue (open set empty). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [ember-load-initializers 3.0.1](https://cdn.jsdelivr.net/npm/ember-load-initializers@3.0.1/dist/index.js)
- [ember-resolver 13.1.1 `withModules`](https://cdn.jsdelivr.net/npm/ember-resolver@13.1.1/addon/index.js)
- [Ember Vite app blueprint `app/app.ts`](https://cdn.jsdelivr.net/npm/@ember/app-blueprint@7.2.1/files/app/app.ts)
- [Ember Vite app blueprint `index.html`](https://cdn.jsdelivr.net/npm/@ember/app-blueprint@6.8.0/files/index.html)
- [Ember Guides: Embedding Applications](https://guides.emberjs.com/release/configuring-ember/embedding-applications/)
- `app/app.ts`; `index.html`; `config/environment.js`; `config/optional-features.json`; `app/templates/application.gts`; `tests/test-helper.ts`
- Prior: config-meta-loader (20261114T072338Z); content-for (20261114T051338Z)

## Limitations

CodeGraph unindexed. `vite build` **NOT RUN BY BUGHUNTER**; generated `@embroider/virtual/compat-modules` not inspected on disk. Live `https://qrati.com/connect/ember-example` not used as evidence (historical deployment 404 out of scope). Claims about the module map rest on published Embroider/Ember blueprint + resolver sources.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T07:44:38Z | 2026-11-14T07:45:04Z | 13:14:38 | 13:15:04 | 00:00:26 (0.4 min) |
| `audit` | 2026-11-14T07:45:53Z | 2026-11-14T07:50:13Z | 13:15:53 | 13:20:13 | 00:04:20 (4.3 min) |
| `delivery` | 2026-11-14T07:50:13Z | 2026-11-14T07:50:54Z | 13:20:13 | 13:20:54 | 00:00:42 (0.7 min) |
| **Total run (preflight start to finish)** | 2026-11-14T07:44:38Z | 2026-11-14T07:50:54Z | 13:14:38 | 13:20:54 | **00:06:16 (6.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:49 (0.8 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T074438Z-40ff1c5ad5914233915646c112ddd8b7.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/194
- Base `main` `aad13e6256a8eb2f1fc7c2024f819fd166496b8c` / head `bughunter/20261114T074438Z-40ff1c5ad5914233915646c112ddd8b7-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
