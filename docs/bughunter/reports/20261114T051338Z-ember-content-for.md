# Ember Vite `{{content-for}}` host document assembly

- **Scope:** Production `index.html` Ember CLI `{{content-for}}` placeholders (`head`, `head-footer`, `body`, `body-footer`) through `@embroider/vite` `classicEmberSupport()` → `contentFor()` `transformIndexHtml`. Covers leftover mustache in the served document, JSDOM head-to-body moves, and `@embroider/compat` `content-for.json` default types. Excludes noscript (20261114T023538Z), Worker HTML reconstruction (20261110T211438Z), Iconify script, cookie consent, embed mount.
- **Base:** `origin/main` at `04b2eafad242e6cebe6e6a059f5251d2e81b280c`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T051338Z-e52e2501401045b0aa7c4b3173e8d22b-qrati-connect-ember-example`, `bughunter/20261114T051338Z-e52e2501401045b0aa7c4b3173e8d22b-ember`.
- **Run:** `20261114T051338Z-e52e2501401045b0aa7c4b3173e8d22b`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. The host document is root `index.html`, compiled by Vite (`vite.config.mjs` `base: '/connect/ember-example/'`) and served after Worker prefix rewrite (out of scope).
2. Production `index.html` contains one of each Ember CLI hook: `{{content-for "head"}}`, `{{content-for "head-footer"}}`, `{{content-for "body"}}`, `{{content-for "body-footer"}}`. No custom types. `tests/index.html` extra test hooks are the test document, not the public host.
3. `vite.config.mjs` registers `classicEmberSupport()` then `ember()`. `@embroider/vite@1.5.2` `classicEmberSupport()` is `[hbs(), contentFor(), scripts(), compatPrebuild(), assets(), configTargets()]`. `contentFor()` is `enforce: 'pre'`.
4. `contentFor().transformIndexHtml` reads `<embroider-working-dir>/content-for.json`, selects `config[path]`, and for each `[contentType, htmlContent]` replaces both `{{content-for "${contentType}"}}` and `{{content-for '${contentType}'}}` (first occurrence each). Replacement with an empty string still removes the token.
5. `@embroider/compat@4.1.13` `ContentForConfig` always writes `defaultContentForTypes`: `head`, `test-head`, `head-footer`, `test-head-footer`, `body`, `test-body`, `body-footer`, `test-body-footer`, `config-module`, `app-boot`, plus optional `availableContentForTypes`. `ember-cli-build.js` does not set `availableContentForTypes`; this host does not declare custom hooks.
6. Addons in this app that might inject via `contentFor` are classic v1 (ember-page-title, ember-load-initializers, etc. go through normal boot, not these HTML slots). Empty default values still occupy the JSON keys so the Vite plugin replaces the four production tokens.

Authz/validation/persistence: none (build-time HTML transform). Side effects: string replace on `index.html` during Vite HTML transform. Errors: `Object.entries(undefined)` if `content-for.json` lacked `config[path]` — that fails the Vite HTML pipeline, not a runtime host page.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Unused `{{content-for}}` remains visible in the browser:** [embroider#2447](https://github.com/embroider-build/embroider/issues/2447) applies to *custom* types missing from `content-for.json`. This host only uses default types that `ContentForConfig` always emits. Empty `htmlContent` still replaces the token.
- **JSDOM moves leftover head tokens into `body` (visible mustache):** `@embroider/vite@1.5.2` runs `contentFor()` with `enforce: 'pre'` *before* `scripts()` ([classic-ember-support](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/classic-ember-support.js)), matching the approach in [embroider#2466](https://github.com/embroider-build/embroider/pull/2466) discussion. Tokens are gone before HTML parse.
- **Non-global `String.replace` leaves a second copy:** production `index.html` has one occurrence of each of the four types.
- **Missing `availableContentForTypes` drops addon HTML:** no custom `{{content-for "…"}}` in `index.html`; `ember-cli-build.js` has no extra types. That option is only required for non-default hook names ([PR #1836](https://github.com/embroider-build/embroider/pull/1836)).
- **Single-quoted hooks are not replaced:** this `index.html` uses double quotes; the plugin also replaces single-quoted forms ([@embroider/vite 1.5.2](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/content-for.js)).
- **Issue search** `content-for OR contentFor OR "content for"`: no matching issue (hits #57 / #20 are unrelated). No duplicate. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [@embroider/vite 1.5.2 `contentFor()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/content-for.js)
- [@embroider/vite 1.5.2 `classicEmberSupport()`](https://cdn.jsdelivr.net/npm/@embroider/vite@1.5.2/dist/src/classic-ember-support.js)
- [@embroider/compat 4.1.13 `ContentForConfig` default types](https://cdn.jsdelivr.net/npm/@embroider/compat@4.1.13/dist/src/content-for-config.js)
- [embroider#1836 — Vite plugin replaces `{{content-for}}`](https://github.com/embroider-build/embroider/pull/1836)
- [embroider#2447 — leftover *custom* `{{content-for}}` under Vite](https://github.com/embroider-build/embroider/issues/2447)
- `index.html` (four default hooks); `vite.config.mjs` (`classicEmberSupport()`); `ember-cli-build.js` (no `availableContentForTypes`)
- Prior: noscript (20261114T023538Z)

## Limitations

CodeGraph unindexed. Vite/ember build **NOT RUN BY BUGHUNTER**; `content-for.json` path keys and produced HTML taken from published `@embroider/vite@1.5.2` / `@embroider/compat@4.1.13` sources, not a captured `dist/index.html`. No live request to `qrati.com/connect/ember-example`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `04b2eafad242e6cebe6e6a059f5251d2e81b280c` / head `bughunter/20261114T051338Z-e52e2501401045b0aa7c4b3173e8d22b-ember`
