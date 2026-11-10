# Ember host WCAG 2.3.1 three flashes or below threshold

- **Scope:** WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold for host-authored UI in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init, theme boot script, Cloudflare Worker HTML path, host CSS (including `#cc-main` tokens). Includes vanilla-cookieconsent **3.1.0** as configured by this host (`app/lib/cookieConsent.ts`). Excludes embed internals (`qrati-connect` / `embed.js` gallery video), 2.2.2 pause/stop/hide (20261109T231938Z), 2.2.1 timing adjustable (20261110T093638Z).
- **Base:** `origin/main` at `34cdbed1e447e3888fe2a8631311b535583fcc28`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T095638Z-7c8cd325ca6d4845a4a425a3b29321ae-ember`, `bughunter/20261110T095638Z-7c8cd325ca6d4845a4a425a3b29321ae-ember`.
- **Run:** `20261110T095638Z-7c8cd325ca6d4845a4a425a3b29321ae`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / light-theme off-toggle in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `index.html` inline theme boot only reads `qc-theme` / `prefers-color-scheme` and sets `data-theme` once. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject animation or media.
2. Host `app/styles/app.css` has **no** `@keyframes`, **no** `animation:` properties, **no** `blink`, and **no** looping GIF/video/`<canvas>`/`<marquee>`. `app/`, `index.html`, and `src/` have no timer-driven visual toggle.
3. Host motion is hover/click CSS `transition` only: 160ms color/background on theme toggle and footer links; 160ms transform on action pills (`translateY(-1px)`); 180ms transform on feature-map cards and Contact CTA. These are user-initiated, single-shot, and far below three opposing luminance changes per second.
4. Theme switch is one `click` → `data-theme` / `.dark` class swap. That is at most one pair of opposing transitions per activation, not a ≥3 Hz flash.
5. `CookieConsent.run` does not configure a pulsing/auto-animating banner. vanilla-cookieconsent **3.1.0** show/hide uses a short CSS transition (library ~100ms), not a strobe. Host `#cc-main` tokens only recolor the modal.
6. `prefers-reduced-motion: reduce` forces `animation-duration` / `transition-duration` to `.01ms` and `animation-iteration-count: 1`.
7. [WCAG 2.2 SC 2.3.1](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold) (Level A): pages must not flash more than three times in any one second, or the flash must stay below the general/red flash thresholds. [Understanding 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html): flashing is seizure-risk content (video, strobing GIFs, rapid opposing luminance); “blinking” that is slower than 3 Hz is a 2.2.2 concern, not 2.3.1. With no host-authored flash, the SC is satisfied.

Authz/validation: public demo. Persistence: `qc-theme` localStorage; geo `sessionStorage`; consent cookie after preference click. Side effects: optional GTM inject after analytics consent. Errors: geo fetch fail-closed.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme toggle or CTA hover is a flash:** one 160–180ms transition per user event; cannot reach 3 flashes/s without the user clicking ≥3 times in one second, which is not content-driven flashing (Understanding: author-controlled flicker, not input rate).
- **Cookie-consent modal show/hide strobes:** 3.1.0 hide path is click; show animation is a single short transition, not ≥3 Hz.
- **Iconify or Google Fonts inject flashing assets:** `index.html` loads `iconify-icon.min.js` (deferred) and CSS `@import` of Inter/Sora; host CSS reserves a 1em static box; no animated icon class.
- **Embed gallery video can strobe:** out of scope; not claimed. Conformance Requirement 5 would apply to in-page embed media; this audit does not assert embed internals.
- **Issue search** `flash OR 2.3.1 OR seizure OR blink OR strobe`: no matching open issue (search hit on closed #45 is first-paint theme, not photosensitivity). Open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
- [WCAG 2.2 SC 2.3.1](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold)
- `app/components/qrati-demo.gts` (click-only host handlers; no visual timers)
- `app/styles/app.css` (no `@keyframes` / `animation:`; 160–180ms hover transitions; reduced-motion override)
- `app/lib/cookieConsent.ts` / `index.html` / `src/worker.ts` (no flash media)
- Prior: 2.2.2 (20261109T231938Z), 2.2.1 (20261110T093638Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS/JS and WCAG 2.3.1 Understanding. Embed widget video/lightbox not claimed. `node_modules` absent in the worktree (library show-animation duration from prior 3.1.0 UMD reads).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T09:56:38Z | 2026-11-10T09:57:00Z | 15:26:38 | 15:27:00 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-10T09:57:16Z | 2026-11-10T10:01:20Z | 15:27:16 | 15:31:20 | 00:04:04 (4.1 min) |
| `delivery` | 2026-11-10T10:01:20Z | 2026-11-10T10:01:20Z | 15:31:20 | 15:31:20 | 00:00:00 (0.0 min) |
| **Total run (preflight start to finish)** | 2026-11-10T09:56:38Z | 2026-11-10T10:01:20Z | 15:26:38 | 15:31:20 | **00:04:42 (4.7 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:16 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T095638Z-7c8cd325ca6d4845a4a425a3b29321ae.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/121
- Base `main` `34cdbed1e447e3888fe2a8631311b535583fcc28` / head `bughunter/20261110T095638Z-7c8cd325ca6d4845a4a425a3b29321ae-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
