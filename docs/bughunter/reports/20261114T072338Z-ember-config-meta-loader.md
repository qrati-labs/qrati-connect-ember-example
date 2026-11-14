# Ember config-meta-loader vs content-for `head` environment config

- **Scope:** Production boot of the Ember gallery host: `index.html` module boot `import environment from './app/config/environment'` → `Application.create(environment.APP)`; `app/config/environment.ts` `loadConfigFromMeta('qrati-connect-ember-example')`; Ember CLI `contentFor('head')` config `<meta>` via `{{content-for "head"}}`. Excludes leftover `{{content-for}}` tokens (20261114T051338Z), `rootURL` vs Vite base (20261107T040238Z), virtual vendor URL prefixing (20261114T061838Z), `configTargets()` (20261114T070338Z), cookie consent, embed mount.
- **Base:** `origin/main` at `2dfe90854f4bae15ed7bd83fe2a4425f60b1d0ae`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T072338Z-594cb2cee1b74d799a05e36be5249d5d-qrati-connect-ember-example`, `bughunter/20261114T072338Z-594cb2cee1b74d799a05e36be5249d5d-ember`.
- **Run:** `20261114T072338Z-594cb2cee1b74d799a05e36be5249d5d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Production boot is root `index.html`: classic `/@embroider/virtual/vendor.js`, then `import Application from './app/app'` and `import environment from './app/config/environment'`, then `Application.create(environment.APP)`.
2. `app/config/environment.ts` calls `@embroider/config-meta-loader@1.0.0` `loadConfigFromMeta('qrati-connect-ember-example')` and `@ember/debug` `assert`s that the result is a non-null object with `modulePrefix`, `locationType`, `rootURL` (strings) and `APP` (object).
3. `loadConfigFromMeta` queries `document` for `meta[name="${prefix}/config/environment"]`, `JSON.parse`s `decodeURIComponent(content)`, and on any throw **returns a string** (`Could not read config from meta tag with name "…"`), not an object ([config-meta-loader 1.0.0](https://cdn.jsdelivr.net/npm/@embroider/config-meta-loader@1.0.0/dist/index.js)).
4. Source `index.html` has no static config meta. `{{content-for "head"}}` is the injection slot. Ember CLI 6.10.2 `contentFor('head')` emits `<meta name="${modulePrefix}/config/environment" content="${encodeURIComponent(JSON.stringify(config))}" />` when `storeConfigInMeta` is true ([ember-app-utils](https://cdn.jsdelivr.net/npm/ember-cli@6.10.2/lib/utilities/ember-app-utils.js)).
5. `ember-cli` `EmberApp` defaults `storeConfigInMeta: true`. This app’s `ember-cli-build.js` does not override it. `config/environment.js` sets `modulePrefix: 'qrati-connect-ember-example'` (matches the loader prefix) and `APP: {}`.
6. `@embroider/compat@4.1.13` `ContentForConfig.build()` writes every default type, including `head`, by calling `options.pattern.replacement` (ember-cli `contentFor`) per config JSON. `@embroider/vite@1.5.2` `contentFor().transformIndexHtml` replaces the first `{{content-for "head"}}` with that string (prior 20261114T051338Z).

Authz/validation: public demo. Persistence: none (config is build-time JSON in a meta tag). Side effects: `Application.create(environment.APP)` with `APP: {}`. Errors: missing meta → loader returns a string; debug `assert` fails; production `assert` is stripped so `environment.APP` would be `undefined` and boot would throw later — that path requires the Ember CLI/Embroider `head` slot to be empty, which the default `storeConfigInMeta` path is not.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **No config meta is written because `index.html` has no `<meta name="…/config/environment">`:** the documented Ember CLI slot is `contentFor('head')`, not a hand-written tag. Default `storeConfigInMeta: true` is the host contract.
- **`ember-cli-build.js` disables `storeConfigInMeta`:** it only constructs `EmberApp(defaults, {})` and `compatBuild`; no `storeConfigInMeta: false`.
- **Loader prefix mismatches `modulePrefix`:** both are `qrati-connect-ember-example`.
- **Empty `APP: {}` makes `Application.create` fail:** Ember accepts an empty APP options object; this repo does not pass required APP flags.
- **Production stripped `assert` plus string config is a present host defect:** only reachable if `head` content-for omits the meta. That would be an Ember CLI/Embroider pipeline failure, not a missing tag in this repo’s source. `vite build` was not run here; live `https://qrati.com/connect/ember-example/` returned HTTP 404 (empty body) from this runner, so served HTML is not used as evidence (prior deployment-route report 20261019T002838Z).
- **Issue search** `config-meta-loader`, `storeConfigInMeta`, `loadConfigFromMeta`, `"config/environment" meta`: no matching open or duplicate issue (search hit closed #51 is org-id, unrelated). Open issue list empty. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [@embroider/config-meta-loader 1.0.0](https://cdn.jsdelivr.net/npm/@embroider/config-meta-loader@1.0.0/dist/index.js)
- [ember-cli 6.10.2 `contentFor('head')` / `storeConfigInMeta`](https://cdn.jsdelivr.net/npm/ember-cli@6.10.2/lib/utilities/ember-app-utils.js)
- [ember-cli 6.10.2 `storeConfigInMeta` default true](https://cdn.jsdelivr.net/npm/ember-cli@6.10.2/lib/broccoli/ember-app.js)
- [@embroider/compat 4.1.13 `ContentForConfig`](https://cdn.jsdelivr.net/npm/@embroider/compat@4.1.13/dist/src/content-for-config.js)
- [@embroider/vite 1.5.2 `contentFor()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/content-for.js)
- `app/config/environment.ts`; `index.html`; `config/environment.js`; `ember-cli-build.js`; `app/app.ts`; `app/router.ts`
- Prior: content-for (20261114T051338Z); rootURL vs Vite base (20261107T040238Z)

## Limitations

CodeGraph unindexed. `vite build` **NOT RUN BY BUGHUNTER**; `dist/` / `content-for.json` not produced. Live host HTML not used (HTTP 404). Claims about injected meta rest on published Ember CLI / Embroider sources plus this repo not overriding `storeConfigInMeta`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T072338Z-594cb2cee1b74d799a05e36be5249d5d.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Base `main` `2dfe90854f4bae15ed7bd83fe2a4425f60b1d0ae` / head `bughunter/20261114T072338Z-594cb2cee1b74d799a05e36be5249d5d-ember`
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
