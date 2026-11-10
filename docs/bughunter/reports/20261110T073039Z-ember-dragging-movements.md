# Ember host WCAG 2.5.7 dragging movements

- **Scope:** WCAG 2.2 SC 2.5.7 Dragging Movements for host-authored functionality in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init/GTM, theme boot script, host CSS overflow. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dist (not in worktree), 2.5.1 pointer gestures (20261110T062738Z), 2.5.2 pointer cancellation (20261110T051738Z), 2.5.4 motion actuation (20261110T064738Z).
- **Base:** `origin/main` at `5c9afe3f12d2e9953d6b7636789eaced17c57a41`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T073039Z-7151d0eec20b4233b465a53d695f740e-ember`, `bughunter/20261110T073039Z-7151d0eec20b4233b465a53d695f740e-ember`.
- **Run:** `20261110T073039Z-7151d0eec20b4233b465a53d695f740e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not handle pointer input.
2. Host-authored event bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">`. Theme boot in `index.html` reads `localStorage['qc-theme']` or `prefers-color-scheme`; it does not bind pointer drag.
3. Repo-wide search of `app/`, `index.html`, and `src/` found no `draggable`, `ondrag`, `DragEvent`, `pointerdown`/`pointermove`, `mousedown`/`mousemove`, `touchstart`/`touchmove`, `addEventListener`, sortable, or slider APIs. Host functions besides the two clicks are native UA activation (links, FAQ `<details>`/`<summary>`).
4. Host CSS: `.seo-section pre { overflow-x: auto }` is UA scrolling of overflowing content. Hover `transform` on `.action-pills a`, `.feature-map-card`, and `.btn-cta-primary` is visual, not grab-and-move of a target.
5. CookieConsent host config (`CookieConsent.run`) exposes click buttons (`acceptAllBtn`, `acceptNecessaryBtn`, `showPreferencesBtn`, `savePreferencesBtn`) and `linkedCategory` sections. No host drag handler. Library dist is not in the worktree; this audit does not claim its internals.
6. [WCAG 2.2 SC 2.5.7](https://www.w3.org/TR/WCAG22/#dragging-movements) (Level AA): functionality that uses a dragging movement can also be achieved by a single pointer without dragging, unless dragging is essential or determined by the user agent and not modified by the author. Applies to web content that interprets pointer actions, not UA/AT operation.
7. [Understanding 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): dragging is tap/click to establish a start point, press-and-hold, reposition the pointer, then release. The SC does **not** apply to UA scrolling (browser scrollbar, touch drag-to-scroll, CSS `overflow` that still uses the UA scroller). [G219](https://www.w3.org/WAI/WCAG22/Techniques/general/G219.html) and [F108](https://www.w3.org/WAI/WCAG22/Techniques/failures/F108.html) apply only when author-interpreted dragging exists without a non-drag single-pointer alternative. Host source has no such dragging, so G219 is not required and F108 does not apply.

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: theme attribute/class; `CookieConsent.showPreferences()`. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme toggle or cookie-preferences require grab-and-move:** contradicted by Ember `{{on "click"}}` only; no drag APIs.
- **FAQ or CTA navigation uses dragging:** native `<summary>` / `<a href>`; no drag listeners.
- **`.seo-section pre` overflow-x is 2.5.7:** Understanding 2.5.7 excludes CSS `overflow` when the scroller is the user agent.
- **Hover translateY is dragging:** visual CSS transform, not pointer engage/follow/release of a target.
- **Embed lightbox/reorder inside `qrati-connect` fails 2.5.7 here:** out of scope.
- **vanilla-cookieconsent category toggle is drag-only:** dist not present; host-authored controls are click buttons. Not claimed as a host defect.
- **Issue search** `dragging OR 2.5.7 OR drag`: no matching issue. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [WCAG 2.2 SC 2.5.7](https://www.w3.org/TR/WCAG22/#dragging-movements)
- [G219: Ensuring that an alternative is available for dragging movements that operate on content](https://www.w3.org/WAI/WCAG22/Techniques/general/G219.html)
- [F108: Failure of Success Criterion 2.5.7 due to not providing a single pointer method that does not require a dragging movement](https://www.w3.org/WAI/WCAG22/Techniques/failures/F108.html)
- `app/components/qrati-demo.gts` (`toggleTheme`, `openCookiePreferences`, FAQ details, links)
- `app/lib/cookieConsent.ts` (`CookieConsent.run` click-button copy; no drag APIs)
- `app/styles/app.css` (`.seo-section pre` overflow-x; hover transforms)
- `index.html` (theme boot via storage / `prefers-color-scheme`)
- `src/worker.ts` (path rewrite / GTM id only)
- Prior: 2.5.1 pointer gestures (20261110T062738Z); 2.5.2 pointer cancellation (20261110T051738Z); 2.5.4 motion actuation (20261110T064738Z)

## Limitations

CodeGraph unindexed. No pointer session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 2.5.7 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T07:30:39Z | 2026-11-10T07:31:01Z | 13:00:39 | 13:01:01 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T07:31:17Z | 2026-11-10T07:34:12Z | 13:01:17 | 13:04:12 | 00:02:54 (2.9 min) |
| `delivery` | 2026-11-10T07:34:12Z | 2026-11-10T07:34:58Z | 13:04:12 | 13:04:58 | 00:00:46 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-10T07:30:39Z | 2026-11-10T07:34:58Z | 13:00:39 | 13:04:58 | **00:04:19 (4.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:16 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T073039Z-7151d0eec20b4233b465a53d695f740e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/115
- Base `main` `5c9afe3f12d2e9953d6b7636789eaced17c57a41` / head `bughunter/20261110T073039Z-7151d0eec20b4233b465a53d695f740e-ember` `2b38714f14af29f5311c7c5c74cc67c5487680c0`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending; GitGuardian pass
