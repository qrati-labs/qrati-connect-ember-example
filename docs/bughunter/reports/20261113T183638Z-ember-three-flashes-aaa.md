# Ember host WCAG 2.3.2 three flashes (AAA)

- **Scope:** WCAG 2.2 SC 2.3.2 Three Flashes (AAA) for host-authored UI in `QratiDemo`: theme toggle, FAQ `<details>`, hero/action-pill/Contact/footer links, Cookie Preferences, cookie-consent init (`app/lib/cookieConsent.ts`, vanilla-cookieconsent **3.1.0**), theme boot script, Worker HTML, host CSS (including `#cc-main` tokens). Excludes embed internals (`qrati-connect` / `embed.js` gallery video), 2.3.1 three flashes or below threshold (20261110T095638Z), 2.3.3 animation from interactions (20261113T133538Z), 2.2.2 pause/stop/hide (20261109T231938Z).
- **Base:** `origin/main` at `79f2b366034c2d64dcb9073f67a6d5b8b1bf0cfe`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T183638Z-525612f376ea4a2c9def091eaf2e6645-ember`, `bughunter/20261113T183638Z-525612f376ea4a2c9def091eaf2e6645-ember`.
- **Run:** `20261113T183638Z-525612f376ea4a2c9def091eaf2e6645`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). Admin chore PRs #121/#122 do not overlap this repository. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.3.2. Host-authored UI has no content that flashes more than three times in any one-second period, including small/low-contrast pixels that 2.3.1 would still allow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; one history index. Constructor calls `initCookieConsent()`. `index.html` theme boot reads `qc-theme` / `prefers-color-scheme` once and sets `data-theme`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject animation or media.
2. [WCAG 2.2 SC 2.3.2](https://www.w3.org/TR/WCAG22/#three-flashes) (AAA), fetched this run: “Web pages do not contain anything that flashes more than three times in any one second period.”
3. [Understanding 2.3.2](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html) (fetched this run): compared with 2.3.1, this SC **does not allow** flashing that is dim enough or small enough. “Even a single flashing pixel would violate this criterion.” Sufficient technique: [G19](https://www.w3.org/WAI/WCAG22/Techniques/general/G19) (no component flashes more than three times in any 1-second period). “Blink” slower than 3 Hz is 2.2.2, not 2.3.2.
4. Host `app/styles/app.css` has **no** `@keyframes`, **no** `animation:` properties, **no** `blink`. Searches of `app/`, `index.html`, and `src/` found no `<video>`, `<audio>`, `<canvas>`, `<marquee>`, looping GIF, `setInterval`, or `requestAnimationFrame` visual toggle.
5. Host motion is hover/click CSS `transition` only: 160ms color/background on theme toggle and footer links; 160ms transform on action pills (`translateY(-1px)`); 180ms transform on feature-map cards and Contact CTA. Single-shot, user-initiated, well below 3 Hz. Theme switch is one `click` → `data-theme` / `.dark` class swap.
6. `CookieConsent.run` does not configure a pulsing banner. vanilla-cookieconsent **3.1.0** show/hide is a short CSS transition, not a strobe. Host `#cc-main` tokens only recolor the modal. `node_modules` absent in this worktree; library duration from prior 3.1.0 audits.
7. `prefers-reduced-motion: reduce` forces `animation-duration` / `transition-duration` to `.01ms` and `animation-iteration-count: 1`.
8. Related SCs already traced: 2.3.1 (no host flash; 20261110T095638Z); 2.3.3 (20261113T133538Z); 2.2.2 (20261109T231938Z).

Authz/validation/persistence: public demo; `qc-theme` localStorage; geo `sessionStorage`; consent cookie after choice. Side effects: optional GTM inject after analytics grant. Errors: geo fail-closed to opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **2.3.1 already passed, so 2.3.2 is automatic:** rejected. 2.3.2 forbids any >3 Hz flash regardless of area or luminance. Rechecked host CSS/JS for small/low-contrast loops; none exist.
- **Theme toggle or CTA hover is a flash:** one 160–180ms transition per user event. Understanding treats author-controlled flicker, not user click rate.
- **Cookie-consent modal show/hide strobes:** 3.1.0 hide path is click; show is a single short transition.
- **Iconify or Google Fonts inject flashing assets:** deferred `iconify-icon.min.js` plus Inter/Sora `@import`; host reserves a static 1em box; no animated icon class.
- **Embed gallery video can strobe a pixel:** out of scope (`embed.js` internals). Conformance Requirement 5 would apply to in-page embed media; this audit does not assert embed internals.
- **Host must meet AAA 2.3.2:** no such claim in README or `index.html`. With no host flash, G19 holds if AAA were claimed.
- **Issue search** `flash OR strobe OR seizure OR 2.3.2`: only closed #45 (first-paint theme, not photosensitivity). Open issues empty. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.3.2 Three Flashes](https://www.w3.org/TR/WCAG22/#three-flashes) (W3C TR retrieved 2026-11-13)
- [Understanding SC 2.3.2](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html) (W3C page retrieved 2026-11-13)
- [G19: Ensuring that no component of the content flashes more than three times in any 1-second period](https://www.w3.org/WAI/WCAG22/Techniques/general/G19)
- `app/components/qrati-demo.gts` (click-only host handlers; no visual timers)
- `app/styles/app.css` (no `@keyframes` / `animation:`; 160–180ms hover transitions; reduced-motion override)
- `app/lib/cookieConsent.ts` / `index.html` / `src/worker.ts` (no flash media)
- Prior: 2.3.1 (20261110T095638Z); 2.3.3 (20261113T133538Z); 2.2.2 (20261109T231938Z)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. vanilla-cookieconsent 3.1.0 show animation taken from prior library audits, not a live DevTools dump. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T18:36:38Z | 2026-11-13T18:37:01Z | 00:06:38 | 00:07:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-13T18:37:28Z | 2026-11-13T18:40:00Z | 00:07:28 | 00:10:00 | 00:02:32 (2.5 min) |
| `delivery` | 2026-11-13T18:40:00Z | 2026-11-13T18:40:34Z | 00:10:00 | 00:10:34 | 00:00:34 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-13T18:36:38Z | 2026-11-13T18:40:34Z | 00:06:38 | 00:10:34 | **00:03:56 (3.9 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:27 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T183638Z-525612f376ea4a2c9def091eaf2e6645.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

IST dates for the table are 2026-11-14 (UTC+05:30). Unclassified is total minus summed phase elapsed.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/168
- Base `main` `79f2b366034c2d64dcb9073f67a6d5b8b1bf0cfe` / head `bughunter/20261113T183638Z-525612f376ea4a2c9def091eaf2e6645-ember`
- `closingIssuesReferences`: none
- Assignees: none (example repo unmapped in ownership.html; do not guess)
- Checks at open: none reported (`statusCheckRollup` empty)
