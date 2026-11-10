# Ember host WCAG 2.5.2 pointer cancellation

- **Scope:** WCAG 2.2 SC 2.5.2 Pointer Cancellation for host-authored single-pointer activation in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome beyond host `click` / `data-cc` wiring, 2.1.1 keyboard (20261109T223538Z), 2.5.8 footer target size (20261107T053238Z), 2.4.7 focus visible (20261107T050938Z).
- **Base:** `origin/main` at `eeaecd92c9537bef428793ce601b0166cf638b12`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T051738Z-a6aff2b4f18a438f940435ccb070a5c5-qrati-connect-ember-example`, `bughunter/20261110T051738Z-a6aff2b4f18a438f940435ccb070a5c5-ember`.
- **Run:** `20261110T051738Z-a6aff2b4f18a438f940435ccb070a5c5`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap product source, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not handle pointer events.
2. Host-authored pointer bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">` (also `data-cc="show-preferencesModal"`). No `mousedown` / `mouseup` / `pointerdown` / `pointerup` / `touchstart` / `touchend` in host `app/` or `index.html`.
3. Other single-pointer host functions are native UA activation:
   - hero Qrati links, GitHub/VS Code action pills, Contact CTA, footer nav links (`<a href>`)
   - FAQ `<details>`/`<summary>` (four items)
4. [WCAG 2.2 SC 2.5.2](https://www.w3.org/TR/WCAG22/#pointer-cancellation) (Level A): for functionality operated with a single pointer, at least one of No Down-Event / Abort or Undo / Up Reversal / Essential must hold. Down-event names include `touchstart` and `mousedown`.
5. [Understanding 2.5.2](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html): authors meet **No Down-Event** by using only the up-event. The JavaScript `click` event “triggers on release of the primary mouse button, and is an example of an implicit up-event.” [G212](https://www.w3.org/WAI/WCAG22/Techniques/general/G212) (native controls, up-event) is sufficient. [F101](https://www.w3.org/WAI/WCAG22/Techniques/failures/F101) is activation on down-event without abort/undo/reversal/essential — not present in host source.
6. Theme toggle and cookie-preferences therefore complete on `click` (up-event). Native links and `<summary>` likewise activate on the platform click/up, so a pointer can be moved off the target before release to abort. No host drag-and-drop or press-and-hold path.

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: theme attribute/class; `CookieConsent.showPreferences()`. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme toggle fires on press, so accidental taps cannot be cancelled:** contradicted by Ember `{{on "click"}}`. Understanding 2.5.2 treats `click` as up-event; moving the pointer off the button before release does not fire `click`.
- **`data-cc="show-preferencesModal"` is a hidden down-event:** host also binds `click`. CookieConsent’s `data-cc` API is library chrome; host source does not register `pointerdown`/`mousedown`. Duplicate `click` + `data-cc` may both run `showPreferences` after up-event; that is not F101.
- **FAQ `<summary>` or links fail because they have no author click handler:** G212; native activation is up-event.
- **Embed lightbox/drag inside `qrati-connect` fails 2.5.2 here:** out of scope.
- **Issue search** `pointer cancellation OR 2.5.2 OR mousedown OR pointerdown OR click abort`: no matching open or duplicate issue. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html)
- [WCAG 2.2 SC 2.5.2](https://www.w3.org/TR/WCAG22/#pointer-cancellation)
- [G212: Using native controls to ensure functionality is triggered on the up-event](https://www.w3.org/WAI/WCAG22/Techniques/general/G212)
- [F101: Failure of Success Criterion 2.5.2 due to activating a control on the down-event](https://www.w3.org/WAI/WCAG22/Techniques/failures/F101.html)
- `app/components/qrati-demo.gts` (`toggleTheme`, `openCookiePreferences`, FAQ details, links)
- `app/styles/app.css` (no pointer-event JS; hover/focus only)
- Prior: 2.1.1 keyboard (20261109T223538Z); 2.5.8 footer target size (20261107T053238Z)

## Limitations

CodeGraph unindexed. No pointer session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 2.5.2 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T05:17:38Z | 2026-11-10T05:18:01Z | 10:47:38 | 10:48:01 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T05:18:19Z | 2026-11-10T05:20:48Z | 10:48:19 | 10:50:48 | 00:02:29 (2.5 min) |
| `delivery` | 2026-11-10T05:20:48Z | 2026-11-10T05:21:40Z | 10:50:48 | 10:51:40 | 00:00:51 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-10T05:17:38Z | 2026-11-10T05:21:40Z | 10:47:38 | 10:51:40 | **00:04:01 (4.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:19 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T051738Z-a6aff2b4f18a438f940435ccb070a5c5.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/112
- Base `main` `eeaecd92c9537bef428793ce601b0166cf638b12` / head `bughunter/20261110T051738Z-a6aff2b4f18a438f940435ccb070a5c5-ember` `dd6e7a9b9af37156b1581b2985d19b1b07eb05ee` (timing-table commit follows)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian/Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
