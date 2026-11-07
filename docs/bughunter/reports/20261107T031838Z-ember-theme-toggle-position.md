# Ember host theme-toggle CSS position cascade

- **Scope:** Host theme control visibility/stacking: `QratiDemo` `.theme-toggle` button versus `app/styles/app.css` (`position: fixed` then later `position: absolute` “Pilot design parity”), including containing block, `z-index`, and `page-shell` isolation. Excludes AccName (#34), first-paint boot script (#45), localStorage guard (#40), embed remount (#60), cookie-consent chrome.
- **Base:** `origin/main` at `b3f9dd640109662f1c35d7c0246223878b5d5fa6`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T031838Z-8f0032389cae4a229e23ec8714b97499-ember`, `bughunter/20261107T031838Z-8f0032389cae4a229e23ec8714b97499-ember`.
- **Run:** `20261107T031838Z-8f0032389cae4a229e23ec8714b97499`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. `QratiDemo` template (`app/components/qrati-demo.gts`) emits `<button class="theme-toggle">` as a **sibling** of `<div class="page-shell">`, not inside it. Click runs `toggleTheme` (document `data-theme` / `dark` class + `persistHostTheme`).
3. First `.theme-toggle` rule (`app/styles/app.css` ~83–87): `position: fixed; top: 1rem; right: 1rem; z-index: 100` plus hover/`focus-visible`.
4. Later “Pilot design parity” rule (line 359): `.theme-toggle { position: absolute; z-index: 1; }`. Same specificity, later source order **wins**. `top`/`right` from the first rule remain.
5. `.page-shell` is `position: relative; isolation: isolate; overflow: hidden`. That does **not** become the button’s containing block because the button is not a descendant.
6. MDN `position`: `absolute` is relative to the closest positioned ancestor or the **initial containing block**; `fixed` is relative to the ICB/viewport for visual media and stays put while scrolling.
7. Ember Glimmer allows the two-root fragment; the button’s parent is the application root (`body`). No positioned ancestor → ICB. The control stays at document top-right and **scrolls with the page**.
8. Sibling stacking: button `z-index: 1` vs `page-shell` `isolation: isolate` at auto z-index. The toggle still paints above the shell. Cookie-consent UI uses its own high z-index (out of scope).
9. Lit connect example uses the same button-then-`page-shell` markup and the same absolute override. Next.js instead sets `position: relative; top: auto; right: auto` (in-flow). Ember matches the Lit host, not a broken unique cascade.

Authz/validation/persistence: none for CSS. Side effects: none beyond paint/hit-testing. Errors: none; the button remains in the tree and handles click/keyboard.

## Falsification

- **Later rule is accidental and hides the control:** not evidenced. It is labeled “Pilot design parity” and matches the Lit sibling. The button remains the first tab stop with visible Light/Dark text.
- **`z-index: 1` puts the toggle under the gallery:** `page-shell` is a sibling stacking context at auto z-index; the toggle is higher. `overflow: hidden` on the shell cannot clip a sibling.
- **Must stay `position: fixed`:** no README or component contract requires a viewport-sticky FAB. Losing stickiness on scroll is a shared example-chrome choice, not a failed toggle.
- **Issue search** `theme toggle`: closed #34 (AccName), #45 (first paint), #60 (embed remount), #40 (storage). No open issue on CSS `position`.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [MDN CSS `position`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) (`absolute` vs `fixed` containing blocks)
- `app/components/qrati-demo.gts` theme-toggle button + `toggleTheme`
- `app/styles/app.css` first `.theme-toggle` block and line 359 override
- Prior related: #34 AccName; 2026-10-17 theme-toggle persistence report-only (did not evaluate CSS `position`)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. Public example URL has previously 404’d (deployment-availability, out of scope). Lit CSS compared only as sibling chrome, not as a second audit.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T03:18:38Z | 2026-11-07T03:19:00Z | 08:48:38 | 08:49:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-07T03:19:13Z | 2026-11-07T03:23:35Z | 08:49:13 | 08:53:35 | 00:04:22 (4.4 min) |
| `delivery` | 2026-11-07T03:23:35Z | 2026-11-07T03:24:53Z | 08:53:35 | 08:54:53 | 00:01:18 (1.3 min) |
| **Total run (preflight start to finish)** | 2026-11-07T03:18:38Z | 2026-11-07T03:24:53Z | 08:48:38 | 08:54:53 | **00:06:15 (6.2 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:13 (0.2 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T031838Z-8f0032389cae4a229e23ec8714b97499.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/65
- Base `main` `b3f9dd640109662f1c35d7c0246223878b5d5fa6` / head `bughunter/20261107T031838Z-8f0032389cae4a229e23ec8714b97499-ember`
- `closingIssuesReferences`: none
- Mergeable at first read-back: UNKNOWN; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian SUCCESS; other CI not yet in rollup
- Local tests **NOT RUN BY BUGHUNTER**
