# Ember host `color-scheme` meta vs CSS `[data-theme]`

- **Scope:** UA `color-scheme` for form controls / scrollbars on first paint: production `index.html` `<meta name="color-scheme">` (or `supported-color-schemes`) versus CSS `[data-theme] { color-scheme }` and the blocking `qc-theme` boot script. Excludes address-bar `theme-color` (20261107T014838Z), unthemed first-paint background (#45), live `prefers-color-scheme` after paint (20261107T064238Z), theme storage (#40), embed theme remount (#60).
- **Base:** `origin/main` at `4013fa83231f8f1e031d948c73164c7bf6190a73`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T014938Z-e0c08d36ab7c414c8b66ecf4db0f708e-qrati-connect-ember-example`, `bughunter/20261114T014938Z-e0c08d36ab7c414c8b66ecf4db0f708e-ember-embed`.
- **Run:** `20261114T014938Z-e0c08d36ab7c414c8b66ecf4db0f708e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Document head is static `index.html` (Embroider/Vite).
2. Blocking boot script (`index.html` lines 5–28) runs **before** stylesheet links (`tests/unit/index-html-theme-boot-test.ts`): reads `localStorage['qc-theme']` (guarded) or `prefers-color-scheme`, then sets `html` `data-theme` and class `dark`.
3. `QratiDemo` constructor repeats that write; `toggleTheme` keeps `data-theme` / `html.dark` in sync (`app/components/qrati-demo.gts`).
4. CSS (`app/styles/app.css`): `[data-theme='light'] { color-scheme: light; … }` and `[data-theme='dark'] { color-scheme: dark; … }`. `:root` does **not** set `color-scheme`. There is **no** `<meta name="color-scheme">` and no `supported-color-schemes` in `index.html`. Worker HTML rewrite does not inject either (`src/worker.ts`).
5. HTML `meta name=color-scheme` is optional metadata that can advertise supported schemes to the UA before author CSS. CSS `color-scheme` on the themed root is what actually opts form controls and scrollbars into the chosen scheme once `app.css` applies. The boot script does not write a `color-scheme` meta or inline style.
6. Sibling connect examples (Preact / Qwik / React / Vue `index.html` on `origin/main`) also omit `color-scheme` meta. Qwik/React/Vue ship a **static** `theme-color` `#ff4800` (already treated as non-invariant for Ember in 20261107T014838Z).

Authz/validation/persistence: `qc-theme` localStorage only (already guarded). Side effects: none for UA widgets beyond existing `data-theme`. Errors: missing optional meta is ignored.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `color-scheme` meta leaves dark-theme users on light UA chrome forever:** contradicted by CSS `color-scheme` on `[data-theme='light'|'dark']` after stylesheets load. Boot already sets `data-theme` before those links.
- **Gap between boot script and CSS is a functional break:** possible brief UA-widget mismatch until `app.css` applies. Page background/tokens still wait on the same CSS (first-paint background was #45; this is the same paint). Not a broken gallery, consent, or theme toggle.
- **Must add `<meta name="color-scheme" content="light dark">`:** that advertises *both* schemes; it does not follow stored `qc-theme`. A single static `dark` or `light` meta would be wrong for the other host theme. Wiring JS to update meta on `toggleTheme` is a feature, not a violated invariant.
- **Overlap with #45 / theme-color / OS-theme-live:** #45 was unthemed document background before boot; theme-color is address-bar tint; OS-theme-live is `matchMedia` after paint. None require this meta.
- **Issue search** `color-scheme OR "color scheme" meta`: closed #45 (first paint), #40 (storage), #18 (CTA contrast). No duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [HTML — `meta name=color-scheme`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme)
- [MDN `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- `index.html` (no `color-scheme` meta; boot script before CSS)
- `app/styles/app.css` `[data-theme] { color-scheme: … }`
- `tests/unit/index-html-theme-boot-test.ts`
- Prior: theme-color (20261107T014838Z); first-paint #45; OS theme live (20261107T064238Z)

## Limitations

CodeGraph unindexed. No browser session; public example URL historically 404 (deployment-availability, out of scope). UA widget chrome not live-checked.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T01:49:38Z | 2026-11-14T01:50:01Z | 07:19:38 | 07:20:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-14T01:50:25Z | 2026-11-14T01:55:57Z | 07:20:25 | 07:25:57 | 00:05:33 (5.5 min) |
| `delivery` | 2026-11-14T01:55:58Z | 2026-11-14T01:56:56Z | 07:25:58 | 07:26:56 | 00:00:58 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-14T01:49:38Z | 2026-11-14T01:56:56Z | 07:19:38 | 07:26:56 | **00:07:18 (7.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:24 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T014938Z-e0c08d36ab7c414c8b66ecf4db0f708e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/184
- Base `main` `4013fa83231f8f1e031d948c73164c7bf6190a73` / head `bughunter/20261114T014938Z-e0c08d36ab7c414c8b66ecf4db0f708e-ember-embed`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pending; CI Lint pending; CI Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
