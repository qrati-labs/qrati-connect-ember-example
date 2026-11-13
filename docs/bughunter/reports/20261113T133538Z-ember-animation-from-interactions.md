# Ember host WCAG 2.3.3 animation from interactions

- **Scope:** WCAG 2.2 SC 2.3.3 Animation from Interactions on host-authored motion in `QratiDemo`: hover `transform` on action pills, feature-map cards, and Contact CTA; CSS `transition` on theme-toggle, footer links, and Cookie Preferences. Excludes 2.2.2 auto-updating motion (20261107T061938Z), embed-internal PhotoSwipe/placeholder (`qrati-connect-ts`), cookie-consent library keyframes except where the host universal reduced-motion rule applies, Iconify size (#38).
- **Base:** `origin/main` at `840bbf66bd6d5a6899ee8ee82be97a214892b49c`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T133538Z-858bff1a66c04a6e8835de6532908255-ember`, `bughunter/20261113T133538Z-858bff1a66c04a6e8835de6532908255-ember`.
- **Run:** `20261113T133538Z-858bff1a66c04a6e8835de6532908255`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main'`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.3.3. Non-essential hover motion exists, and the host already supplies C39 (`prefers-reduced-motion: reduce` collapsing `transition-duration` / `animation-duration` to `0.01ms`). That matches the SC (motion animation can be disabled) and the WCAG definition that an instant style change is not motion animation.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single history index). No host JS `requestAnimationFrame`, Web Animations, or timers drive motion (`app/components/qrati-demo.gts` theme/consent/embed only).
2. Interaction-triggered motion in `app/styles/app.css` (no `@keyframes`):
   - `.action-pills a` — `transition` 160ms including `transform`; `:hover { transform: translateY(-1px) }`.
   - `.feature-map-card` — `transition: transform 180ms ease, border-color 180ms ease`; `:hover { transform: translateY(-3px) }`.
   - `.btn-cta-primary` — `transition: transform 180ms ease, box-shadow 180ms ease`; `:hover { transform: translateY(-3px) scale(1.02) }`.
   - `.theme-toggle` — background/border 160ms (color/opacity only; not motion animation).
   - `.footer a` / `.footer-cookie-btn` — color 160ms (not motion animation).
3. Guard (trailing rule): `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; } }`.
4. SC 2.3.3 (AAA): “Motion animation triggered by interaction can be disabled, unless the animation is essential.” [Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Sufficient technique [C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39). Motion animation = “addition of steps between conditions to create the illusion of movement”; “An element which appears instantly without transitioning is not using animation.” Color/opacity-only transitions are excluded.
5. Hover translate/scale is non-essential decoration. OS/UA reduced-motion is an allowed disable mechanism; the host does not need a separate in-page toggle. Under the media query, duration is 0.01ms (~10µs), so the transform is an instant style change, not a transition.
6. Opening Cookie Preferences (`showCookiePreferences`) is a user interaction. Host `*` reduced-motion rule also applies to `#cc-main` descendants. Embed internals remain out of scope.

Authz/validation/persistence: none (public demo). Side effects: visual hover chrome only. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Hover `translateY`/`scale` still animates when reduced-motion is on:** contradicted by the trailing universal `transition-duration: .01ms !important`. WCAG definition: instant change is not motion animation.
- **0.01ms is still animation, so C39 fails:** C39 tests that motion is suppressed under the OS setting. 0.01ms is not perceptible and is the common CSS disable pattern; not a demonstrated vestibular trigger.
- **Must provide an in-page “stop animation” control:** Understanding lists any one of: avoid animation, provide a control, or use UA/OS reduce-motion. C39 is sufficient.
- **Color transitions on footer/theme-toggle fail 2.3.3:** excluded from the motion-animation definition (no change of perceived size, shape, or position).
- **2.2.2 audit already covered this, so 2.3.3 cannot be this run’s workflow:** 20261107T061938Z scoped 2.2.2 (auto-updating). 2.3.3 is interaction-triggered; traced here against primary Understanding/C39 text.
- **Cookie-consent / PhotoSwipe motion is a host defect:** library-owned except where host `*` reduced-motion already collapses CSS transitions. Embed JS `Element.animate` is in `qrati-connect-ts`, not this repo.
- **Issue search** `2.3.3 OR animation OR reduced-motion OR hover transform`: no matching issue (open set empty). Closed a11y issues (#148 targets, #146 new-tab, #49 underline, #18/#22/#24 contrast) are different paths. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [WCAG 2.2 SC 2.3.3](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
- [C39 Using prefers-reduced-motion to prevent motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
- `app/styles/app.css` (hover transforms; reduced-motion rule)
- `app/components/qrati-demo.gts` (no JS animation)
- Prior: 2.2.2 reduced-motion (20261107T061938Z); 2.3.1 three flashes (20261110T095638Z)

## Limitations

CodeGraph unindexed. No OS-level reduced-motion session in a browser; suppression inferred from CSS cascade and WCAG definitions. Live `https://qrati.com/connect/ember-example` was not used as evidence.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

_Timing table inserted after `finish`._

## PR / checks

- Issue: none (report-only)
- PR: pending this run
- Base `main` `840bbf66bd6d5a6899ee8ee82be97a214892b49c` / head `bughunter/20261113T133538Z-858bff1a66c04a6e8835de6532908255-ember`
- `closingIssuesReferences`: none
