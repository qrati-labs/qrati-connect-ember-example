# Ember host prefers-reduced-motion

- **Scope:** Host-controlled motion on the Ember example: CSS transitions/transforms on theme-toggle, action pills, feature-map cards, Contact CTA, footer links/cookie button, plus the global `prefers-reduced-motion` rule. Excludes embed-internal PhotoSwipe/placeholder (qrati-connect-ts), cookie-consent modal chrome (vanilla-cookieconsent CSS), Iconify reserved size (#38), CTA contrast (#18), footer target size (20261107T053238Z).
- **Base:** `origin/main` at `3d82819593e60a7bf0da1b2b4f6d717565bd4f00`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T061938Z-b2c3b119f70d41e08ae812fcbc65601b-ember`, `bughunter/20261107T061938Z-b2c3b119f70d41e08ae812fcbc65601b-ember`.
- **Run:** `20261107T061938Z-b2c3b119f70d41e08ae812fcbc65601b`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / light-theme off-toggle in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `QratiDemo`. Motion is CSS-only on host chrome in `app/styles/app.css`; no host JS timers/rAF/Web Animations.
2. Motion sources (all `transition`, no `@keyframes`):
   - `.theme-toggle` — background/border 160ms.
   - `.action-pills a` — transform/background/color/border 160ms; `:hover { transform: translateY(-1px) }`.
   - `.footer a` / `.footer-cookie-btn` — color 160ms.
   - `.feature-map-card` — transform/border 180ms; `:hover { transform: translateY(-3px) }`.
   - `.btn-cta-primary` — transform/box-shadow 180ms; `:hover { transform: translateY(-3px) scale(1.02) }`.
3. Guard: last rule `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; } }`.
4. WCAG 2.2 SC 2.2.2 (AA) applies to auto-updating/moving content, not hover transitions. SC 2.3.3 Animation from Interactions is AAA; even against that bar, the universal `transition-duration: .01ms` collapses the listed hover transforms to an effectively instantaneous style change.
5. Cross-repo: `qrati-connect-ts` `embed.ts` `buildPlaceholder` already skips `Element.animate` when `prefers-reduced-motion: reduce` matches. Not host-owned; no host CSS is required for that path.

Authz/validation/persistence: none (public demo). Side effects: visual hover/theme chrome only. Errors: none on this path.

## Falsification

- **Hover `translateY`/`scale` still runs for reduced-motion users:** contradicted by the trailing universal `transition-duration: .01ms !important` covering those rules.
- **Missing `@keyframes` means the animation-* properties are dead and transitions are unguarded:** the same media query also sets `transition-duration`.
- **Cookie-consent / PhotoSwipe motion is a host defect:** those animations live in vanilla-cookieconsent and qrati-connect-ts; out of this host-chrome workflow. Cookieconsent `transitionend` still fires at 0.01ms if those styles inherit the universal rule.
- **Must author a regression test without a failing invariant:** no confirmed defect; no test.

Issue search `reduced-motion OR prefers-reduced-motion OR animation` on this repo: empty.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [WCAG 2.2 Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- `app/styles/app.css` (transitions; reduced-motion rule)
- `app/components/qrati-demo.gts` (theme-toggle, action pills, feature-map cards, Contact CTA)
- `qrati-connect-ts` `src/exports/embed.ts` `buildPlaceholder` (out of repo; contract only)

## Limitations

CodeGraph unindexed. No browser session; reduced-motion behavior inferred from CSS cascade, not a captured computed style. No claim about vanilla-cookieconsent or PhotoSwipe internals.

## Timing

Timing table inserted after `finish` from `bughunter-timing.py`.

## PR / checks

Filled after remote read-back.
