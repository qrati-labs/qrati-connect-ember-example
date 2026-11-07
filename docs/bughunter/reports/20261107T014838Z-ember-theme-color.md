# Ember host browser chrome `theme-color` vs `data-theme`

- **Scope:** Browser chrome / address-bar color for the Ember example document (`index.html` head; host `data-theme` / `qc-theme` boot; CSS `color-scheme`). Excludes first-paint page background (#45), Open Graph/favicon (#16), apple-touch-icon, cookie-consent, embed theme remount (#60), webfonts.
- **Base:** `origin/main` at `14349393d97c4e6e47440c7c2f46bbfea45660e3`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T014838Z-70eee8c6c14c4d30b5750c638323a7ca-qrati-connect-ember-example`, `bughunter/20261107T014838Z-70eee8c6c14c4d30b5750c638323a7ca-ember`.
- **Run:** `20261107T014838Z-70eee8c6c14c4d30b5750c638323a7ca`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `src/index.css` of `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path missing (`/home/hermes/Projects/main`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` → `<QratiDemo />`. Document head is static `index.html` (Embroider/Vite), not Ember `{{pageTitle}}` beyond the visible title.
2. Blocking boot script (`index.html` lines 5–28) reads `localStorage['qc-theme']` (guarded) or `prefers-color-scheme`, then sets `document.documentElement` `data-theme` and class `dark`.
3. `QratiDemo` constructor repeats that read, keeps `data-theme` / `html.dark` in sync, and `toggleTheme` persists `qc-theme`. CSS `[data-theme='light'|'dark']` sets `color-scheme` plus page tokens (`app/styles/app.css`).
4. Head identity already includes `lang="en"`, canonical, subpath favicons, `apple-touch-icon`, OG/Twitter image tags (issue #16). There is **no** `<meta name="theme-color">`, no `media`-qualified pair, and no web app manifest.
5. `theme-color` is an optional HTML metadata name. UAs that honor it (notably Chrome on Android) tint the address bar / status bar from that color. Without it, chrome stays the browser default. It is not applied from CSS `color-scheme` or `data-theme`.
6. Dual host themes would need either two `theme-color` tags with `media="(prefers-color-scheme: …)"` (OS, not `qc-theme`) or a runtime `meta.content` update on `toggleTheme` to follow the host theme. Neither exists.

Authz/validation/persistence: `qc-theme` localStorage only (already guarded, #40). Side effects: none for chrome color. Errors: none — missing optional meta is ignored.

## Falsification

- **Missing `theme-color` fails WCAG or HTML conformance:** not established. [HTML `meta name=theme-color`](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color) is optional. No 1.4.x contrast rule applies to browser chrome.
- **Dark page + light UA chrome is a functional break:** address-bar mismatch is cosmetic. Page content, contrast, and `color-scheme` for form controls still follow `data-theme`.
- **Must add a single `#0f0f14` or brand `theme-color`:** a single static color would be wrong for the other theme. OS `media` tags would ignore stored `qc-theme`. Wiring JS to `toggleTheme` is a feature, not a violated invariant.
- **Overlap with #45 / #16:** #45 was unthemed first paint of the document background; #16 was OG image + document-relative favicon. Neither claimed chrome tint.
- **Issue search** `theme-color OR "browser chrome" OR "address bar" OR manifest`: only unrelated closed contrast/theme-storage issues (#45, #40, #24, #18, #22, #38). No duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [HTML — `meta name=theme-color`](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color)
- [MDN `theme-color`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color)
- `index.html` head (no `theme-color`; `apple-touch-icon` + OG present)
- `app/styles/app.css` `[data-theme] { color-scheme: … }`
- `app/components/qrati-demo.gts` `readHostTheme` / `toggleTheme`

## Limitations

CodeGraph unindexed. No browser session; public example URL has previously 404’d. UA chrome tint not live-checked.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.
