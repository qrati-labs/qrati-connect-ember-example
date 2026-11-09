# Ember host WCAG 2.2.2 pause, stop, hide

- **Scope:** WCAG 2.2 SC 2.2.2 Pause, Stop, Hide for host-authored moving, blinking, scrolling, or auto-updating information on the Ember example: `QratiDemo` chrome, `app/styles/app.css`, `index.html`, `app/lib/cookieConsent.ts`, imported vanilla-cookieconsent 3.1.0 CSS. Excludes embed internals (`qrati-connect` / `embed.js` live-gallery auto-update), cookie-consent modal JS chrome (library-owned beyond the imported stylesheet), prefers-reduced-motion (20261107T061938Z), keyboard (20261109T223538Z), no keyboard trap (20261109T225738Z).
- **Base:** `origin/main` at `5187c3680db4c3162a87e7ab345ce2907368b600`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T231938Z-f8338ed9ffa84ccb9db75f7e4d71c021-ember`, `bughunter/20261109T231938Z-ember-embed-workflow`.
- **Run:** `20261109T231938Z-f8338ed9ffa84ccb9db75f7e4d71c021`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Visual host chrome is in `app/components/qrati-demo.gts` and `app/styles/app.css`.
2. [WCAG 2.2 SC 2.2.2](https://www.w3.org/TR/WCAG22/#pause-stop-hide) (Level A): moving/blinking/scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content needs a pause/stop/hide mechanism unless essential. Auto-updating information that starts automatically and is parallel needs pause/stop/hide or frequency control unless essential. [Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html): “starts automatically” includes indirect interaction (hover/focus), but the five-second duration still applies to moving/blinking/scrolling.
3. Host CSS motion (all `transition`, **no `@keyframes`**):
   - `.theme-toggle` — background/border **160ms**.
   - `.action-pills a` — transform/background/color/border **160ms**; `:hover { transform: translateY(-1px) }`.
   - `.footer a` / `.footer-cookie-btn` — color **160ms**.
   - `.feature-map-card` — transform/border **180ms**; `:hover { transform: translateY(-3px) }`.
   - `.btn-cta-primary` — transform/box-shadow **180ms**; `:hover { transform: translateY(-3px) scale(1.02) }`.
   None last more than five seconds. Hover/focus motion is user-triggered style change, not continuous movement.
4. Host JS: no `setInterval`, `setTimeout`, `requestAnimationFrame`, Web Animations, `<marquee>`, `<blink>`, or `autoplay` in `app/`, `index.html`, or `src/worker.ts`. `year = new Date().getFullYear()` is computed once at class init. Cookie geo fetch is a one-shot `fetch`, not a repeating update. GTM script inject is one-shot after consent.
5. Cookie-consent stylesheet (`vanilla-cookieconsent@3.1.0` `dist/cookieconsent.css`, imported from `app.css`): **zero** `@keyframes` / `animation` rules. The only `blink` substring is `BlinkMacSystemFont`. Host config (`app/lib/cookieConsent.ts`) does not enable a looping banner animation.
6. `index.html` has no video/audio, no meta-refresh, no animated favicon. Worker (`src/worker.ts`) rewrites HTML/GTM placeholders only; it does not inject moving content.
7. Global `@media (prefers-reduced-motion: reduce)` zeros `animation-duration` / `transition-duration` (already audited 20261107T061938Z). Not required to pass 2.2.2 given the five-second prong, but it further collapses host transitions.

Authz/validation/persistence: none (public demo). Side effects: hover/theme chrome, one-shot consent/GTM. Errors: none on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Hover `translateY`/`scale` is auto-starting motion (Understanding “indirect interaction”) without a pause control:** duration is 160–180ms, not more than five seconds. 2.2.2 moving/blinking/scrolling does not apply. 2.3.3 Animation from Interactions is AAA and out of scope.
- **Live gallery auto-updates photos:** embed internals; out of this host workflow. Host mount is a static `script` inject into `.widget-embed-host`.
- **Cookie-consent CSS spinner/loop is page-level non-interference (CR5):** published 3.1.0 stylesheet has no animation/keyframes. Not claimed for unminified library JS chrome.
- **`overflow-x: auto` on `.seo-section pre` is scrolling information:** user-initiated overflow scroll, not auto-scrolling content.
- **Issue search** `pause`, `blink`, `animation`, `2.2.2`, `auto-update`, `marquee`: no matching issue. Open issues: none. Closed a11y issues are different paths. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [WCAG 2.2 SC 2.2.2](https://www.w3.org/TR/WCAG22/#pause-stop-hide)
- [vanilla-cookieconsent 3.1.0 stylesheet](https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.1.0/dist/cookieconsent.css)
- `app/styles/app.css`
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No browser session; absence of >5s moving/auto-updating host content is from source and the published cookieconsent CSS, not a captured computed-style or screen recording. Embed-internal auto-update not claimed.

## Timing

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Local tests **NOT RUN BY BUGHUNTER**
