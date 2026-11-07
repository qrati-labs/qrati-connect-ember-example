# Ember host live prefers-color-scheme after first paint

- **Scope:** Host theme vs OS `prefers-color-scheme` **after** first paint: whether `matchMedia` `change` updates `data-theme`, `html.dark`, persisted `qc-theme`, and the embed `theme` attribute. Excludes first-paint boot (#45), storage guard (#40), AccName (#34), CSS position cascade (20261107T031838Z), embed remount (#60), cookie-consent chrome.
- **Base:** `origin/main` at `e69ea1033008bd0d3962604935d8144d20c628e3`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T064238Z-4b09889897d240c7a4ed87d120476e6a-ember`, `bughunter/20261107T064238Z-4b09889897d240c7a4ed87d120476e6a-ember`.
- **Run:** `20261107T064238Z-4b09889897d240c7a4ed87d120476e6a`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. Blocking boot script (`index.html` lines 5–28) reads `localStorage['qc-theme']` when it is `'light'|'dark'`, else `window.matchMedia('(prefers-color-scheme: dark)').matches`, then sets `document.documentElement` `data-theme` and class `dark`. Storage and `matchMedia` throws fall back to `'light'`. There is **no** `addEventListener('change')` (or `addListener`) on that MediaQueryList.
3. `QratiDemo` (`app/components/qrati-demo.gts`) initializes `@tracked theme` via `readHostTheme()`: same stored-value gate, same one-shot `matchMedia(...).matches`, same throw → `'light'`. Constructor writes `data-theme` / `dark` again. `toggleTheme` flips the tracked value, writes those attributes, and `persistHostTheme` (`localStorage.setItem('qc-theme', …)` guarded).
4. Embed path: `mountEmbed` modifier depends on `this.theme`. After the first script inject (`data-theme`), later theme changes set `theme` on an existing `<qrati-connect>` or `dataset.theme` on an in-flight script. OS theme is not an input to that modifier except through the initial tracked state.
5. `README.md` documents a **host-controlled** light/dark theme via the toggle and in-place widget update. It does not claim live OS-scheme tracking.
6. After a successful toggle, `qc-theme` is set; subsequent loads ignore OS until storage is cleared. That is the intended override, not a stuck OS theme.

Authz/validation: none (public demo). Persistence: `qc-theme` only on explicit toggle. Side effects: document theme attributes and embed `theme`. Errors: storage/`matchMedia` throws are caught.

## Falsification

- **Missing `change` listener fails a host contract:** contradicted by README (“host-controlled”) and by first-paint / storage audits, which snapshot OS only when no valid `qc-theme` exists. MDN `prefers-color-scheme` describes the media feature; it does not require applications to subscribe to live changes.
- **OS change after load with no stored theme leaves chrome wrong until reload:** true as a snapshot, not a violated invariant. Tokens still match the boot-time scheme; the user can toggle. Sibling Preact host recorded the same class as report-only (`20261106T001938Z-preact-os-theme-live.md`).
- **Listener would fight `qc-theme`:** if added naively, an OS flip would overwrite an explicit host choice. Absence of a listener avoids that race.
- **Issue search** `prefers-color-scheme OR matchMedia OR "OS theme" OR "live theme"`: closed #45 (first paint), #40 (storage), #34 (AccName), #60 (embed remount). No open issue on live OS sync.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [MDN: `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: `MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) (`change` event is opt-in)
- `index.html` blocking theme script
- `app/components/qrati-demo.gts` `readHostTheme` / `toggleTheme` / `mountEmbed`
- `README.md` host-controlled theme
- Prior related: #45 first paint; #40 storage guard; Preact live OS theme report-only

## Limitations

CodeGraph unindexed. No browser session flipping OS scheme while the Ember host is open. Public example URL has previously 404’d (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T06:42:38Z | 2026-11-07T06:42:59Z | 12:12:38 | 12:12:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-07T06:43:17Z | 2026-11-07T06:47:10Z | 12:13:17 | 12:17:10 | 00:03:54 (3.9 min) |
| `delivery` | 2026-11-07T06:47:10Z | 2026-11-07T06:47:40Z | 12:17:10 | 12:17:40 | 00:00:30 (0.5 min) |
| **Total run (preflight start to finish)** | 2026-11-07T06:42:38Z | 2026-11-07T06:47:40Z | 12:12:38 | 12:17:40 | **00:05:02 (5.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:18 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T064238Z-4b09889897d240c7a4ed87d120476e6a.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/72
- Base `main` `e69ea1033008bd0d3962604935d8144d20c628e3` / head `bughunter/20261107T064238Z-4b09889897d240c7a4ed87d120476e6a-ember` `cc7998935b0e18ef72bb910e674c78e6955214c3` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
