# Ember host WCAG 2.2.3 no timing

- **Scope:** WCAG 2.2 SC 2.2.3 No Timing (AAA) for host-authored UI in `QratiDemo`: theme toggle, FAQ `<details>`, hero/action-pill/Contact/footer links, Cookie Preferences, cookie-consent init (`app/lib/cookieConsent.ts`, vanilla-cookieconsent **3.1.0**), inline theme boot, Cloudflare Worker prefix rewrite. Excludes embed internals (`qrati-connect` / `embed.js`), 2.2.1 timing adjustable (20261110T093638Z), 2.2.2 pause/stop/hide (20261109T231938Z), 2.2.6 timeouts (not claimed; no authenticated session).
- **Base:** `origin/main` at `3be1e997df764d360901ca931d40311991c1667e`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T144038Z-d86f81c2787c4495a14736ee7c548a0e-qrati-connect-ember-example`, `bughunter/20261113T144038Z-d86f81c2787c4495a14736ee7c548a0e-ember`.
- **Run:** `20261113T144038Z-d86f81c2787c4495a14736ee7c548a0e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.2.3. The criterion forbids making timing *essential* to an activity, except non-interactive synchronized media and real-time events. This host sets no time limit, so G5 is met: users can complete every host activity without a time limit.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; `locationType` is `history`, `rootURL: '/'` (Vite `base` `/connect/ember-example/`). One document, no timed route change.
2. Host `app/`, `index.html`, `src/worker.ts`, `config/`: **no** `setTimeout` / `setInterval` / `requestAnimationFrame`, **no** `<meta http-equiv="refresh">`, **no** session/idle/inactivity timeout, **no** auto-dismiss or auto-advance of readable content. `index.html` theme boot is synchronous `localStorage` / `matchMedia` only.
3. Host interactions are user-initiated: `{{on "click" this.toggleTheme}}`, `{{on "click" this.openCookiePreferences}}`, native `<a>` / `<button>` / FAQ `<details>`. Content stays until the user acts. `sessionStorage` geo cache (`GEO_STORAGE_KEY`) stores a boolean for the tab; it does not close a reading or acting window.
4. `CookieConsent.run` (`vanilla-cookieconsent` 3.1.0): `autoShow: required` (geo fail-closed). Hide is Accept / Reject / preferences, not a timer. Host does not set a hide delay. Consent cookie lifetime is storage after a completed choice, not a task clock. Library-internal 100ms show / 500ms class-cleanup timers (documented in the 2.2.1 audit) do not bound the user's time to decide.
5. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`. Instant path rewrite / HTML rebuild is not a content time limit ([Understanding 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) treats 3xx/instant redirects as non-limits; 2.2.3 inherits that: timing is not part of the activity).
6. Host CSS 160–180ms color/transform transitions (theme toggle, pills, cards, CTA) do not remove or advance information. `prefers-reduced-motion` forces durations to `.01ms`. No carousel, marquee, or `@keyframes` that time out reading.
7. [WCAG 2.2 SC 2.2.3](https://www.w3.org/TR/WCAG22/#no-timing) (AAA): “Timing is not an essential part of the event or activity presented by the content, except for non-interactive synchronized media and real-time events.” [Understanding 2.2.3](https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html): goal is users do not face time limits; sufficient [G5](https://www.w3.org/WAI/WCAG22/Techniques/general/G5) is completing an activity with no time limit. This is stricter than 2.2.1 (which allows adjustable limits). With **no** host-set limit, 2.2.3 holds. No host video/live event that would use the SC exceptions.

Authz/validation/persistence: public demo. Persistence: `qc-theme` on click; geo `sessionStorage`; consent cookie after preference click. Side effects: GTM after analytics consent. Errors: geo fail-closed (`return true`); no timed abort.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **2.2.1 already passed so 2.2.3 cannot fail:** 2.2.1 allows *adjustable* limits. 2.2.3 forbids limits except media/real-time. Traced separately; this host has neither adjustable nor essential timing.
- **Consent `autoShow` is a timed interruption:** the modal stays until the user chooses. No auto-hide. Overlay until action is not a time limit on completing the activity.
- **182-day consent cookie / tab-scoped geo cache are time limits:** storage lifetime after a completed choice, not a window to finish a task (same distinction as 2.2.1).
- **CSS transitions make timing essential:** they do not score, expire, or replace content. Understanding’s examples are tests/games with clocks, not hover/color motion.
- **Embed gallery upload/session timers fail 2.2.3 on this host:** out of scope; not host-authored.
- **Host must meet AAA 2.2.3:** no such claim in README or `index.html`. Absence of a limit still satisfies G5 if AAA were claimed.
- **Issue search** `2.2.3 OR "no timing" OR timeout` and `timing`: no matching issues (open list empty; closed issues are target-size, `target=_blank`, gtag, remount, overflow, org id, contrast, theme boot, geo fail-open, storage). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.2.3 No Timing](https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html)
- [WCAG 2.2 SC 2.2.3](https://www.w3.org/TR/WCAG22/#no-timing)
- [G5: Allowing users to complete an activity without any time limit](https://www.w3.org/WAI/WCAG22/Techniques/general/G5)
- `app/components/qrati-demo.gts` (click-only host handlers; no timers)
- `app/lib/cookieConsent.ts` (`autoShow: required`; no hide delay)
- `index.html` / `src/worker.ts` / `app/styles/app.css` / `app/router.ts`
- Prior: 2.2.1 (20261110T093638Z); 2.2.2 (20261109T231938Z)

## Limitations

CodeGraph unindexed. No browser session. Live `https://qrati.com/connect/ember-example` was not used as evidence. Claims are from host markup/JS and WCAG 2.2.3 Understanding. Embed widget internals not claimed. `node_modules` absent in the worktree.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T14:40:38Z | 2026-11-13T14:41:00Z | 20:10:38 | 20:11:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-13T14:41:24Z | 2026-11-13T14:44:23Z | 20:11:24 | 20:14:23 | 00:02:59 (3.0 min) |
| `delivery` | 2026-11-13T14:44:23Z | 2026-11-13T14:44:43Z | 20:14:23 | 20:14:43 | 00:00:20 (0.3 min) |
| **Total run (preflight start to finish)** | 2026-11-13T14:40:38Z | 2026-11-13T14:44:43Z | 20:10:38 | 20:14:43 | **00:04:05 (4.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:24 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T144038Z-d86f81c2787c4495a14736ee7c548a0e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/160
- Base `main` `3be1e997df764d360901ca931d40311991c1667e` / head `bughunter/20261113T144038Z-d86f81c2787c4495a14736ee7c548a0e-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: none reported (`statusCheckRollup` empty)
