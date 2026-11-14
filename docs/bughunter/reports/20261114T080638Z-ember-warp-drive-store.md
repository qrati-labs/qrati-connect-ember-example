# Ember WarpDrive legacy store vs unused gallery-host data plane

- **Scope:** Production boot of the Ember gallery host: `@warp-drive/ember/install` in `app/app.ts` and `tests/test-helper.ts`; `app/services/store.ts` `useLegacyStore({ linksMode: false, cache: JSONAPICache, handlers: [], schemas: [] })`; `ember-cli-build.js` `setConfig(..., { compatWith: '5.8' })`. Excludes Application.create / loadInitializers (20261114T074438Z), config-meta-loader (20261114T072338Z), cookie consent, embed mount.
- **Base:** `origin/main` at `4777d70cf85a5567701e6956a932369b5949acec`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T080638Z-f513a0761d0d498c96bbaa6f791596ae-ember`, `bughunter/20261114T080638Z-f513a0761d0d498c96bbaa6f791596ae-ember`.
- **Run:** `20261114T080638Z-f513a0761d0d498c96bbaa6f791596ae`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `index.html` `Application.create(environment.APP)` after `import Application from './app/app'`. `app/app.ts` first statement is `import '@warp-drive/ember/install'` (same side-effect import in `tests/test-helper.ts`).
2. `@warp-drive/ember@5.8.1` `dist/install.js` only calls `setupSignals(buildSignalConfig)` using Ember/Glimmer tags and the runloop. No RequestManager, adapter, or `fetch`. WarpDrive Ember setup docs require this import when `@warp-drive/ember` is present.
3. `app/services/store.ts` is byte-identical to `@ember/app-blueprint@6.11.1` `files/app/services/store.ts` (warpDrive-on template): `useLegacyStore({ linksMode: false, cache: JSONAPICache, handlers: [], schemas: [] })`. Empty `handlers`/`schemas` are the documented new-app placeholders. [useLegacyStore](https://warp-drive.io/api/@warp-drive/legacy/functions/useLegacyStore) plus the 5.x migration guide: Fetch, LegacyNetworkHandler, and CacheHandler are provided when a request runs; they are not issued at module evaluation.
4. `linksMode: false` with omitted `legacyRequests` is `LegacyModelAndNetworkStoreSetupOptions` (`legacyRequests` default false). No host adapter/serializer files exist. The gallery host never looks up `store`: `qrati-demo.gts` has no `@service store` / `owner.lookup('service:store')`. Ember services are created on first lookup ([Services](https://guides.emberjs.com/release/services/)).
5. `ember-cli-build.js` `setConfig(app, __dirname, { compatWith: '5.8', deprecations: {} })` matches lockstep `@warp-drive/*@5.8.1`. `config/ember-cli-update.json` records `--no-warp-drive` as a later blueprint *update* flag; current source still matches the warpDrive-on files (`store.ts`, install import, warp-drive deps). That is blueprint leftover, not a broken gallery data path.
6. Authz/validation: public demo; no JSON:API client contract. Persistence: none on this path. Side effects: Ember signal hooks at import; store class definition. Errors: a `store.request` / `findRecord` without schema would throw — unreachable without a lookup.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Empty `handlers`/`schemas` throw at boot:** rejected. Blueprint ships the same arrays. `useLegacyStore` configures a class; network handlers run on request, not import. `@warp-drive/ember/install` is signals only.
- **Boot instantiates `store` and fetches `/` as JSON:API:** rejected. No injection/lookup. Ember services are lazy. `QratiDemo` only starts cookie consent and the embed script.
- **`linksMode: false` without adapters is a production failure:** rejected. That option only matters if legacy adapter requests run. None do.
- **`--no-warp-drive` in ember-cli-update vs present packages is a user-facing defect:** rejected. It records update CLI options; it does not disable runtime. Removing WarpDrive would be cleanup, not a violated gallery invariant.
- **Missing install import in tests vs app:** both files import `@warp-drive/ember/install`, matching WarpDrive Ember setup.
- **Issue search** `warp-drive`, `useLegacyStore`, `store service`, `JSONAPICache`: no matching issue (open set empty). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WarpDrive Ember install](https://warp-drive.io/guides/configuration/legacy-package-setup/setup/ember)
- [useLegacyStore](https://warp-drive.io/api/@warp-drive/legacy/functions/useLegacyStore)
- [WarpDrive 5.x migration / useLegacyStore defaults](https://warp-drive.io/guides/migrating/)
- [Ember Guides: Services](https://guides.emberjs.com/release/services/)
- [@ember/app-blueprint@6.11.1 `files/app/services/store.ts`](https://cdn.jsdelivr.net/npm/@ember/app-blueprint@6.11.1/files/app/services/store.ts)
- `@warp-drive/ember@5.8.1` `dist/install.js`
- `app/app.ts`; `app/services/store.ts`; `ember-cli-build.js`; `tests/test-helper.ts`; `app/components/qrati-demo.gts`; `config/ember-cli-update.json`
- Prior: Application.create (20261114T074438Z)

## Limitations

CodeGraph unindexed. `vite build` / `pnpm test` **NOT RUN BY BUGHUNTER**. Live `https://qrati.com/connect/ember-example` not used as evidence. Claims about handler laziness rest on published WarpDrive 5.8.1 sources plus no host store lookup.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T08:06:38Z | 2026-11-14T08:07:04Z | 13:36:38 | 13:37:04 | 00:00:26 (0.4 min) |
| `audit` | 2026-11-14T08:07:29Z | 2026-11-14T08:09:34Z | 13:37:29 | 13:39:34 | 00:02:05 (2.1 min) |
| `delivery` | 2026-11-14T08:09:34Z | 2026-11-14T08:09:57Z | 13:39:34 | 13:39:57 | 00:00:23 (0.4 min) |
| **Total run (preflight start to finish)** | 2026-11-14T08:06:38Z | 2026-11-14T08:09:57Z | 13:36:38 | 13:39:57 | **00:03:19 (3.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:24 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T080638Z-f513a0761d0d498c96bbaa6f791596ae.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/195
- Base `main` `4777d70cf85a5567701e6956a932369b5949acec` / head `bughunter/20261114T080638Z-f513a0761d0d498c96bbaa6f791596ae-ember` `c65b3a9f2ce2056a8e6f5e1945b555e1a00f86bd`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at open: `statusCheckRollup` empty
