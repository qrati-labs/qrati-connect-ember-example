# Ember host WCAG 2.2.1 timing adjustable

- **Scope:** WCAG 2.2 SC 2.2.1 Timing Adjustable for host-authored UI in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init, theme boot script, Cloudflare Worker HTML path. Includes vanilla-cookieconsent **3.1.0** as configured by this host (`app/lib/cookieConsent.ts`). Excludes embed internals (`qrati-connect` / `embed.js`), 2.2.2 pause/stop/hide (20261109T231938Z), 3.2.1 on focus (20261110T020738Z).
- **Base:** `origin/main` at `e1fe7a8f8142408bd81a5afad60770603a2c1414`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T093638Z-96ed190801e34e1498b4270d4a767905-ember`, `bughunter/20261110T093638Z-96ed190801e34e1498b4270d4a767905-ember`.
- **Run:** `20261110T093638Z-96ed190801e34e1498b4270d4a767905`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / light-theme off-toggle in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` is an admin checkout with open chore snapshot PRs #121/#122. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `index.html` inline theme boot only reads `qc-theme` / `prefers-color-scheme`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it is a non-timed path rewrite (Understanding: 3xx/instant server redirects are not time limits).
2. Host `app/`, `index.html`, and `src/` have **no** `setTimeout` / `setInterval`, **no** `<meta http-equiv="refresh">`, **no** session/inactivity timeout, and **no** auto-dismiss/auto-advance of readable content. Router map is empty (`app/router.ts`); there is no timed navigation.
3. Host-authored interactions are click-driven (`toggleTheme`, `openCookiePreferences`) plus native `<a>`, `<button>`, and FAQ `<details>`. Content remains until the user acts. `sessionStorage` geo cache (`GEO_STORAGE_KEY`) stores a boolean for the tab; it does not expire a reading/acting window.
4. `CookieConsent.run` sets `autoShow: required` (geo). vanilla-cookieconsent **3.1.0** default `autoShow` shows the consent modal until Accept/Reject/preferences; hide is on those clicks, not a timer. Library `setTimeout` uses are 100ms CSS/`focus` after show and 500ms `disablePageInteraction` class cleanup after hide. Host does not set `disablePageInteraction`. Cookie `expiresAfterDays: 182` is consent persistence, not a task time limit (and exceeds the 20-hour exception even if it were).
5. Host CSS uses 160–180ms color/transform transitions on chrome (theme toggle, links, cards, CTA). These do not auto-update or remove information. `prefers-reduced-motion` forces `animation-duration` / `transition-duration` to `.01ms`. No `@keyframes` marquee/carousel.
6. [WCAG 2.2 SC 2.2.1](https://www.w3.org/TR/WCAG22/#timing-adjustable) (Level A) applies **if** the content sets a time limit. [Understanding 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html): any process that happens without user initiation after a set time or on a periodic basis is a time limit (refresh, auto-dismiss, advancing content). With no host-set time limit, the SC is satisfied (nothing to turn off, adjust, or extend).

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme click; geo `sessionStorage`; consent cookie after preference click. Side effects: GTM inject after analytics consent. Errors: geo fetch fail-closed (`return true`); no timed abort.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Consent modal auto-hides and fails 2.2.1:** 3.1.0 UMD hide path is click (`accept-all` / `accept-necessary` / preferences). No autoHide config; host does not call `setTimeout(CookieConsent.hide, …)`.
- **182-day cookie expiry is a time limit:** it is storage lifetime after a completed choice, not a window to finish a task.
- **CSS 160ms transitions are time limits on reading:** they do not move, scroll, or remove content; Understanding points 2.2.1 at advancing/updating content, not hover/color transitions.
- **Geo `fetch` without timeout fails 2.2.1:** network latency is not author-set content timing; fail-closed still shows the modal (`autoShow: required`).
- **Embed gallery has session/upload timers:** out of scope; not claimed.
- **Issue search** `timing OR timeout OR 2.2.1 OR auto-hide`: `gh issue list --state all` empty for that query; open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)
- [WCAG 2.2 SC 2.2.1](https://www.w3.org/TR/WCAG22/#timing-adjustable)
- [CookieConsent configuration `autoShow`](https://github.com/orestbida/cookieconsent/blob/master/docs/reference/configuration-reference.md)
- vanilla-cookieconsent 3.1.0 UMD (`setTimeout` only for 100ms show animation/focus and 500ms interaction-class cleanup)
- `app/components/qrati-demo.gts` (click-only host handlers; no timers)
- `app/lib/cookieConsent.ts` (`autoShow: required`; no hide delay)
- `index.html` / `src/worker.ts` / `app/styles/app.css` (no refresh, no timed redirect, no auto-advancing animation)
- Prior: 2.2.2 (20261109T231938Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS, WCAG 2.2.1 Understanding, and the published 3.1.0 UMD. Embed widget internals not claimed. `node_modules` absent in the worktree.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PENDING

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T093638Z-96ed190801e34e1498b4270d4a767905.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `e1fe7a8f8142408bd81a5afad60770603a2c1414` / head `bughunter/20261110T093638Z-96ed190801e34e1498b4270d4a767905-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
