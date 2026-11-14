# Ember Vite `scripts()` virtual vendor.js/css URL prefixing

- **Scope:** Production host boot of `@embroider/virtual/vendor.js`, `vendor.css`, and `app.css` from root `index.html` through `@embroider/vite@1.5.2` `classicEmberSupport()` `scripts()` (`transformIndexHtml` + `generateBundle`) and `embroider-resolver` `emitVirtualFile` at `buildEnd`, with Vite `base: '/connect/ember-example/'`. Excludes `{{content-for}}` token replacement (20261114T051338Z), history `rootURL` vs Vite base (20261107T040238Z), Worker prefix rewrite / `html_handling` / `not_found_handling`, Iconify CDN script, cookie consent, embed mount.
- **Base:** `origin/main` at `2c750f70a534e1543572dd1d66bffdbaef3f6046`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T061838Z-9ad8246c673042a6a8c82f9fa4dd4653-ember`, `bughunter/20261114T061838Z-9ad8246c673042a6a8c82f9fa4dd4653-ember`.
- **Run:** `20261114T061838Z-9ad8246c673042a6a8c82f9fa4dd4653`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. The host document is root `index.html`. Production `<head>` links `/@embroider/virtual/vendor.css` and `/@embroider/virtual/app.css` (empty `integrity=""`). `<body>` loads classic `/@embroider/virtual/vendor.js` then a `type="module"` boot that imports `./app/app`.
2. `vite.config.mjs` sets `base: '/connect/ember-example/'` and registers `classicEmberSupport()` then `ember()`. `@embroider/vite@1.5.2` `classicEmberSupport()` is `[hbs(), contentFor(), scripts(), compatPrebuild(), assets(), configTargets()]`. `scripts()` is `enforce: 'pre'`.
3. `scripts()` `transformIndexHtml` runs only in `vite build` (`if (!context.server)`). It JSDOM-parses the HTML (default URL `about:blank`), prefixes any `link.href` / non-module `script.src` that `startsWith('/@embroider/virtual')` with `config.base`, and serializes. With `about:blank`, IDL `href`/`src` stay origin-absolute paths, so the `startsWith` check matches. Simulated rewrite of this `index.html` yields `/connect/ember-example/@embroider/virtual/{vendor.css,app.css,vendor.js}`. The module boot script has no `src` and is left relative (`./app/app`) for Vite to bundle.
4. `scripts()` `generateBundle` minifies/fingerprints only configured names, default `['/assets/vendor.js', '/assets/test-support.js']`. This host does not reference those paths. Classic `vendor.js` is therefore not fingerprinted by this hook.
5. `ember()` `resolver()` `buildEnd` `emitVirtualFile`s `@embroider/virtual/vendor.js` and `@embroider/virtual/vendor.css` as Rollup assets (`fileName` without a leading slash → `dist/@embroider/virtual/vendor.{js,css}`). `app.css` is not in that emit list; Vite’s HTML pipeline treats `<link rel="stylesheet">` whose URL is a CSS request as `import` (not excluded: not `#` / external / data). After the `scripts()` prefix, that import is `/connect/ember-example/@embroider/virtual/app.css`; Vite strips `base` when resolving module URLs (`stripBase`).
6. Classic `<script src>` without `type="module"` is not bundled (Vite warns and leaves it). The prefixed `vendor.js` URL plus `emitVirtualFile` is the production AMD vendor payload. Worker prefix strip (out of scope) maps browser `/connect/ember-example/@embroider/virtual/vendor.js` to ASSETS `/@embroider/virtual/vendor.js`.
7. Empty `integrity=""` is the Ember/Embroider placeholder. HTML SRI with an empty integrity attribute does not enforce a digest.

Authz/validation/persistence: none (build-time HTML/asset emit). Side effects: JSDOM serialize + Rollup `emitFile` during `vite build`. Errors: missing on-disk `/assets/vendor.js` returns `[]` from `optimizedScript` (not this host’s virtual path).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`link.href` is a resolved `http://localhost/...` URL so `startsWith('/@embroider/virtual')` never fires:** JSDOM constructed as `new JSDOM(htmlIn)` (no `url`) uses `about:blank`. Measured with jsdom  in this environment: `link.href === '/@embroider/virtual/vendor.css'` and `startsWith` is true. A `url: 'http://localhost/'` option would break the check; this plugin does not pass one.
- **`app.css` is never emitted so production CSS 404s:** `buildEnd` only emits vendor js/css. Vite build HTML handling imports stylesheet `link` hrefs that `isCSSRequest` and are not public files, then injects hashed CSS. Base-prefixed virtual CSS is still a `.css` request and is not `isExcludedUrl`. Not a source-proven 404.
- **Vite does not prefix virtual files, so `scripts()` is required and missing in dev:** `transformIndexHtml` is intentionally build-only. Dev serves virtual modules through the embroider resolver and Vite `base` on the dev server (embroider#2189 / PR #2046). Dev vs build split is the documented fix, not a host bug.
- **Double-prefix (`/connect/ember-example/connect/ember-example/...`):** Vite prefixes *public* files; virtual embroider URLs are not public files. `scripts()` applies base once. Vite CSS import resolution strips `base` rather than appending it again.
- **Empty `integrity=""` fails SRI and blocks CSS:** HTML integrity with an empty value does not fail the fetch. Unrelated to Iconify SRI (20261107T021238Z).
- **Issue search** `vendor.js OR virtual vendor OR embroider virtual OR app.css`: no matching issue (contrast/theme closed issues only). Open issue list empty. No duplicate. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [@embroider/vite 1.5.2 `scripts()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/scripts.js)
- [@embroider/vite 1.5.2 `classicEmberSupport()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/classic-ember-support.js)
- [@embroider/vite 1.5.2 resolver `emitVirtualFile` / `buildEnd`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/resolver.js)
- [embroider#2189 — virtual vendor.js vs Vite asset handling](https://github.com/embroider-build/embroider/issues/2189)
- [embroider#2046 — vite custom base URL](https://github.com/embroider-build/embroider/pull/2046)
- [Vite public base path](https://vite.dev/guide/build)
- `index.html` (virtual CSS/JS tags); `vite.config.mjs` (`base`, `classicEmberSupport()`)
- Prior: content-for (20261114T051338Z); rootURL vs Vite base (20261107T040238Z)

## Limitations

CodeGraph unindexed. `vite build` **NOT RUN BY BUGHUNTER**; `dist/` not produced. Live `https://qrati.com/connect/ember-example/` returned HTTP 404 (deployment availability, out of scope). JSDOM `href` check measured with hermes-agent’s jsdom, not the worktree’s (no `node_modules`). Vite HTML `stripBase` / stylesheet-import behavior taken from installed Vite 8 sources and Vite 7-class HTML pipeline; this app depends on `vite@7.3.1`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T06:18:38Z | 2026-11-14T06:19:04Z | 11:48:38 | 11:49:04 | 00:00:26 (0.4 min) |
| `audit` | 2026-11-14T06:19:36Z | 2026-11-14T06:24:36Z | 11:49:36 | 11:54:36 | 00:05:00 (5.0 min) |
| `delivery` | 2026-11-14T06:24:36Z | 2026-11-14T06:25:44Z | 11:54:36 | 11:55:44 | 00:01:08 (1.1 min) |
| **Total run (preflight start to finish)** | 2026-11-14T06:18:38Z | 2026-11-14T06:25:44Z | 11:48:38 | 11:55:44 | **00:07:06 (7.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:32 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T061838Z-9ad8246c673042a6a8c82f9fa4dd4653.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/191
- Base `main` `2c750f70a534e1543572dd1d66bffdbaef3f6046` / head `bughunter/20261114T061838Z-9ad8246c673042a6a8c82f9fa4dd4653-ember`
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian SUCCESS; CI Lint/Test pending
- Local tests **NOT RUN BY BUGHUNTER**
