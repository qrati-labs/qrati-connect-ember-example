# Ember live gallery embed loader mount

- **Scope:** Host `mountEmbed` injecting the classic Qrati Connect `embed.js` loader into `.widget-embed-host` (script `async`, `data-organization-id` / `data-router` / `data-theme`, in-place theme updates). Cross-repo contract: `@qratilabs/qrati-connect` embed loader (`document.currentScript`, `data-target`, placeholder, `document.body` fallback). Excludes theme remount wiping `innerHTML` (#60), empty `organizationId` (#51), gallery heading sibling (#26), hash vs host history (20261106T202338Z), lightbox vs `overflow` (20261107T012438Z), quickstart snippet (#36/#57).
- **Base:** `origin/main` at `e1ab64d5250dc17e9c6db2e2212a83d5f06e7245`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T075138Z-b047783a99b744e094522204a58a0bd7-qrati-connect-ember-example`, `bughunter/20261107T075138Z-ember-embed-workflow`.
- **Run:** `20261107T075138Z-b047783a99b744e094522204a58a0bd7`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Live gallery is `<section class="widget-frame" aria-label="Interactive Ember Event Gallery">` → sr-only `h2` sibling → `<div class="widget-embed-host" {{mountEmbed this.theme}}>` (`app/components/qrati-demo.gts`).
2. `mountEmbed` (ember-modifier): if a child `qrati-connect` exists, set `theme` and return (in-place, #60). Else if a child `script` exists, set `dataset.theme` and return. Else create a **classic** `script` (`async = true`, no `type="module"`), `src = VITE_CDN_URL || jsdelivr embed.js`, `dataset.organizationId = VITE_ORGANIZATION_ID || DEFAULT_EXAMPLE_ORG_ID`, `dataset.router = 'hash'`, `dataset.theme = theme`, append into the host.
3. Embed contract (`qrati-connect-ts` `src/exports/embed.ts`, same snippet as this README): IIFE captures `document.currentScript` at top-level; reads `data-*` via `ATTR_MAP` (`organization-id`, `router`, `theme`, …); requires `organization-id`; inserts `<qrati-connect>` next to the script (`data-target` optional; this host does not set it); appends a 6-tile placeholder (`height:288px` cells, `aria-hidden`) until the element bundle upgrades; if `script.parentNode` is null, falls back to `document.body`.
4. Host CSS: `.widget-frame` has padding/border; `.widget-embed-host` has no extra min-height. After `embed.js` runs, the placeholder supplies layout. `.page-shell` / `.widget-frame` `overflow: hidden` already audited for lightbox.
5. Authz/validation: public demo; org id is build-time env or documented demo fallback (#51). Persistence: none on this path. Errors: missing `currentScript` / org id / element import log to console inside the loader; host does not add a user-visible error surface.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`script.async = true` makes `document.currentScript` null, so the gallery never mounts:** rejected. The loader documents classic (not `type="module"`) scripts; `currentScript` is null for modules and JS callbacks, not for the `async` attribute. README’s own snippet sets `async`. Dynamically inserted classic scripts still execute as classic scripts.
- **Missing `data-target` mounts on `document.body`:** rejected. Default is `parent = script.parentNode` (the widget host). Body fallback is only when the script has been detached; that was the old `innerHTML = ''` remount (#60), which this `mountEmbed` no longer does. Single-route `QratiDemo` does not unmount in production.
- **No host min-height → CLS until the widget paints:** the loader’s placeholder reserves a multi-tile grid once `embed.js` runs. Pre-download gap is network, not a missing host invariant; Iconify’s 1em rule (#38) does not apply to this embed.
- **Unpinned jsdelivr URL is a supply-chain break of this example:** same unpinned snippet as README / connect-ts docs. Hardening, not a violated host contract.
- **Issue search** `embed loader OR currentScript OR mountEmbed OR data-target OR placeholder`: closed #60 (body remount), #51 (org id), #26 (heading), #36/#57 (quickstart). No open duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Qrati Connect embed script (README)](https://github.com/qrati-labs/qrati-connect-ts/blob/main/README.md) — classic `async` tag, `document.currentScript`
- `qrati-connect-ts` `src/exports/embed.ts` (`SELF_SCRIPT`, `resolveMount`, `buildPlaceholder`)
- `app/components/qrati-demo.gts` `mountEmbed`
- `app/templates/application.gts`
- Prior: #60, #51, #26; hash-routing and lightbox report-only

## Limitations

CodeGraph unindexed. No browser run of the live gallery (public `https://qrati.com/connect/ember-example` historically 404; deployment availability out of scope). Embed contract read from the local `qrati-connect-ts` tree, not the jsdelivr bytes at runtime.

## Timing

TIMING_PLACEHOLDER

## PR / checks

PR_PLACEHOLDER
