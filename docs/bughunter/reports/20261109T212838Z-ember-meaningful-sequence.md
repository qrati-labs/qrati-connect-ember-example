# Ember host WCAG 1.3.2 meaningful sequence

- **Scope:** WCAG 2.2 SC 1.3.2 Meaningful Sequence for host-authored reading order in `QratiDemo`: DOM order of theme-toggle / `header` / `main` / `footer`, CSS that can reorder (`order`, `flex-direction`, grid placement, `float`, `position`), `.answer-section` two-column grid, footer row layout, visually hidden gallery heading. Excludes 1.3.1 structure (20261109T210738Z), 2.4.3 focus order (20261109T191838Z), 2.4.1 bypass (20261107T044738Z), cookie-consent modal internals, embed-shadow order.
- **Base:** `origin/main` at `c28894af88efd167816b9558f1c5d4dc606b7360`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T212838Z-3aa18f632ae4496fa501cd8c866d38de-ember`, `bughunter/20261109T212838Z-3aa18f632ae4496fa501cd8c866d38de-ember`.
- **Run:** `20261109T212838Z-3aa18f632ae4496fa501cd8c866d38de`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single application index). Linear host content is only `QratiDemo`.
2. Source DOM order in `app/components/qrati-demo.gts`:
   1. `.theme-toggle` button (sibling of `.page-shell`)
   2. `<header class="hero">` (kicker → `h1` → copy → action pills)
   3. `<main class="content-shell">`: gallery → short-answer → feature-map → SEO features → quickstart → FAQ → CTA
   4. `<footer class="footer">`: brand (logo + title) → `footer-meta` (`nav` then copyright)
3. CSS reorder search in `app/styles/app.css`: no `flex-direction: *-reverse`, no `float`, no `direction: rtl`, no `grid-area` / `grid-column` / `grid-row` placement, no CSS `order`. Grids are auto-flow (`repeat(auto-fit, minmax(...))`).
4. Layouts that change *axis*, not sequence:
   - `.answer-section`: `grid-template-columns: 1.2fr .8fr` (copy column then `.answer-points`). DOM is the same two children in that order. `@media (max-width: 640px)` stacks to `1fr` (copy then points).
   - `.footer`: default `flex-direction: column` (brand then meta). `@media (min-width: 640px)` `flex-direction: row` (brand left, meta right). DOM remains brand then meta.
   - Feature/SEO cards: source order of `<article>`s matches visual auto-flow.
5. Positioned chrome: `.theme-toggle` ends as `position: absolute; top: 1rem; right: 1rem; z-index: 1` (later “Pilot design parity” override). Button is **not** inside `.page-shell`, so the containing block is the initial containing block. Visual: control at document top-right; programmatic: first node. Theme vs main content are independent sequences; 1.3.2 does not require a unique order between them ([Understanding 1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)).
6. `.sr-only` gallery `h2` sits in DOM immediately before `.widget-embed-host`. It is clipped from the visual sequence (C7/C27) but remains in the programmatic sequence before the embed — meaning-preserving, not a visual/DOM swap.
7. SC 1.3.2 (A): when the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined. Host meaningful sequences (hero → gallery → explanations → FAQ → CTA → footer; answer copy before bullets; footer brand before nav) match source order.

Authz/validation/persistence: none (public demo). Side effects: none from reading order. Errors: none thrown by layout CSS.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Absolute theme-toggle is a 1.3.2 failure because it is visually overlayed:** contradicted by Understanding 1.3.2 independent-sequence note (navigation/chrome vs main). Focus order of that control was already report-only (20261109T191838Z).
- **Footer `flex-direction: row` reverses meaning:** row (not `row-reverse`) keeps brand then meta, matching LTR visual left-to-right.
- **`.answer-section` grid puts bullets first visually:** first grid item is the copy `div`; second is `.answer-points`. No `order` / placement.
- **`page-shell { overflow: hidden }` or `widget-frame { overflow: hidden }` reorders:** clipping/stacking, not sequence. Lightbox overflow already audited (20261107T012438Z).
- **Cookie-consent portal at end of `body`:** closed modal is not in the host linear meaning; open dialog is a separate WCAG overlay path (first-layer 20261107T072738Z). Not a host source-order defect.
- **Issue search** `meaningful sequence OR 1.3.2 OR reading order OR DOM order OR flex-direction`: no matching issue. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)
- [WCAG 2.2 SC 1.3.2](https://www.w3.org/TR/WCAG22/#meaningful-sequence)
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- `app/styles/app.css`
- `app/router.ts`

## Limitations

CodeGraph unindexed. No browser/AT session; sequence is from source DOM + CSS. Live `https://qrati.com/connect/ember-example` was not used as evidence this run.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Local tests **NOT RUN BY BUGHUNTER**
