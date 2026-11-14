# Ember Vite `configTargets()` vs `config/targets.js`

- **Scope:** Production JS downlevel for the Ember gallery host: `config/targets.js` browserslist through `@embroider/vite@1.5.2` `classicEmberSupport()` → `configTargets()` into Vite 7 `build.target`. Excludes `scripts()` virtual vendor URL prefixing (20261114T061838Z), `contentFor()` (20261114T051338Z), Worker prefix rewrite, embed mount, cookie consent.
- **Base:** `origin/main` at `9fc19e7742ccd72840f199324e13557ad1df8d5a`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T070338Z-c9de8429bc204ab2b7d8c6ac8d062eb0-ember`, `bughunter/20261114T070338Z-c9de8429bc204ab2b7d8c6ac8d062eb0-ember-workflow`.
- **Run:** `20261114T070338Z-c9de8429bc204ab2b7d8c6ac8d062eb0`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Production boot is root `index.html` (`Application.create(environment.APP)` after virtual `vendor.js`). Host JS is the Vite production bundle (`vite.config.mjs` `base: '/connect/ember-example/'`).
2. `classicEmberSupport()` is `[hbs(), contentFor(), scripts(), compatPrebuild(), assets(), configTargets()]`. `configTargets()` is Vite plugin `vite-plugin-ember-browser-targets`.
3. On `config()`, the plugin `existsSync`s `config/targets.js`, then `import()`s it as a file URL. If `targets.default.browsers` is truthy, it returns `{ build: { target: browserslistToEsbuild(targets.browsers) } }`.
4. This app’s `config/targets.js` is CJS `module.exports = { browsers }` with Ember blueprint queries: `last 1 Chrome versions`, `last 1 Firefox versions`, `last 1 Safari versions`. Node ESM import of that file synthesizes both `default.browsers` and named export `browsers` (measured: same three-string array). The `targets.browsers` argument therefore matches the guard.
5. `vite.config.mjs` does not set `build.target`. Vite 7.3.1 default is `'baseline-widely-available'` (`['chrome107', 'edge107', 'firefox104', 'safari16']` per Vite 7.3.1 docs). The plugin overrides that with esbuild targets derived from `config/targets.js`, which is the documented Ember/Embroider path ([embroider#2195](https://github.com/embroider-build/embroider/pull/2195)).
6. `babel.config.mjs` has no `@babel/preset-env` / browserslist. Downlevel of the production bundle is Vite’s esbuild `build.target`, not Babel. `package.json` has no `browserslist` key and there is no `.browserslistrc`; the plugin does not fall through to those.

Authz/validation/persistence: none (build-time Vite config). Side effects: Vite `build.target` merge during `vite build`. Errors: missing `config/targets.js` skips the plugin (Vite default remains); a throw inside `browserslistToEsbuild` would fail the Vite config load, not serve a half-built page.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`targets.browsers` is undefined so `browserslistToEsbuild(undefined)` ignores `config/targets.js`:** Node ESM import of this CJS file exposes named `browsers` equal to `default.browsers` (measured in this environment against the worktree file). The plugin therefore passes the three queries, not `undefined`.
- **Plugin never runs because `config/targets.js` is CJS and `import()` fails:** `existsSync` plus `pathToFileURL` is the published 1.5.2 implementation; CJS default export loaded successfully in the same Node import.
- **Override is a defect vs Vite Baseline:** Ember blueprint `config/targets.js` is the intended support contract for this app. Narrower “last 1” queries than Baseline is a product choice, not a violated host invariant. No repo support matrix claims Safari 16 / Chrome 107.
- **Babel still transpiles to a different list:** no preset-env in `babel.config.mjs`; `generatorOpts.compact: false` only. Not a second, conflicting target.
- **Issue search** `config/targets.js`, `browserslist`, `configTargets`, `build.target`: no matching issue. Open issue list empty. No duplicate. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [@embroider/vite 1.5.2 `configTargets()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/config-targets.js)
- [@embroider/vite 1.5.2 `classicEmberSupport()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/classic-ember-support.js)
- [embroider#2195 — read browser targets from config/targets.js](https://github.com/embroider-build/embroider/pull/2195)
- [Vite 7.3.1 `build.target`](https://github.com/vitejs/vite/blob/v7.3.1/docs/config/build-options.md)
- [browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild/)
- `config/targets.js`; `vite.config.mjs`; `babel.config.mjs`; `package.json`
- Prior: virtual vendor URLs (20261114T061838Z); content-for (20261114T051338Z)

## Limitations

CodeGraph unindexed. `vite build` **NOT RUN BY BUGHUNTER**; `dist/` not produced; esbuild target strings from `browserslist-to-esbuild` were not executed (package not present in this worktree). Live `https://qrati.com/connect/ember-example/` was not used as evidence. CJS named-export interop was measured with this environment’s Node against the worktree file.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T07:03:38Z | 2026-11-14T07:04:05Z | 12:33:38 | 12:34:05 | 00:00:27 (0.5 min) |
| `audit` | 2026-11-14T07:04:19Z | 2026-11-14T07:07:04Z | 12:34:19 | 12:37:04 | 00:02:46 (2.8 min) |
| `delivery` | 2026-11-14T07:07:04Z | 2026-11-14T07:07:24Z | 12:37:04 | 12:37:24 | 00:00:19 (0.3 min) |
| **Total run (preflight start to finish)** | 2026-11-14T07:03:38Z | 2026-11-14T07:07:24Z | 12:33:38 | 12:37:24 | **00:03:46 (3.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:13 (0.2 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T070338Z-c9de8429bc204ab2b7d8c6ac8d062eb0.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/192
- Base `main` `9fc19e7742ccd72840f199324e13557ad1df8d5a` / head `bughunter/20261114T070338Z-c9de8429bc204ab2b7d8c6ac8d062eb0-ember-workflow`
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian SUCCESS; CI Lint/Test queued; Workers Builds in progress
- Local tests **NOT RUN BY BUGHUNTER**
