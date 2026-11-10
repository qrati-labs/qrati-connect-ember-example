# Ember host WCAG 2.5.1 pointer gestures

- **Scope:** WCAG 2.2 SC 2.5.1 Pointer Gestures for host-authored functionality in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links. Excludes embed internals (`qrati-connect` / `embed.js` lightbox, swipe, pinch), vanilla-cookieconsent modal chrome beyond host `click` / `data-cc` wiring, 2.5.2 pointer cancellation (20261110T051738Z), 2.1.1 keyboard (20261109T223538Z), 2.5.8 footer target size (20261107T053238Z).
- **Base:** `origin/main` at `9329d6be77625d8008d152055027f1f529038c45`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T062738Z-225028aa0e3f457698c8b4499997c8d4-qrati-connect-ember-example`, `bughunter/20261110T062738Z-225028aa0e3f457698c8b4499997c8d4-ember`.
- **Run:** `20261110T062738Z-225028aa0e3f457698c8b4499997c8d4`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap product source, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not handle pointer events.
2. Host-authored pointer bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">` (also `data-cc="show-preferencesModal"`). Repo-wide search of `app/`, `index.html`, and `src/` found no `pointerdown` / `touchstart` / `touchmove` / `mousedown` / `drag` / `swipe` / `gesture` / `pinch` / `wheel` handlers.
3. Other single-pointer host functions are native UA activation:
   - hero Qrati links, GitHub/VS Code action pills, Contact CTA, footer nav links (`<a href>`)
   - FAQ `<details>`/`<summary>` (four items)
4. CSS hover transforms (`.btn-cta-primary:hover`, `.feature-map-card:hover`) are visual only; they do not interpret a path. Native overflow on `.seo-section pre` (`overflow-x: auto`) is user-agent scrolling, excluded by SC 2.5.1.
5. [WCAG 2.2 SC 2.5.1](https://www.w3.org/TR/WCAG22/#pointer-gestures) (Level A): all functionality that uses multipoint or path-based gestures can be operated with a single pointer without a path-based gesture, unless essential. The note limits the SC to web content that interprets pointer actions (not UA/AT/OS gestures).
6. [Understanding 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html): path-based examples are swipe/flick, prescribed shapes, and movement that must follow a direction/speed. Multipoint examples are pinch/spread, split tap, two-/three-finger tap or swipe. Clicks, taps, and native control activation are single-pointer, non-path-based. [F105](https://www.w3.org/WAI/WCAG22/Techniques/failures/F105.html) is path-based functionality without a simple tap/click alternative — not present in host source. [G215](https://www.w3.org/WAI/WCAG22/Techniques/general/G215.html) is not required when no path-based/multipoint gesture exists.

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: theme attribute/class; `CookieConsent.showPreferences()`. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme toggle or cookie-preferences require a swipe:** contradicted by Ember `{{on "click"}}` only.
- **FAQ `<details>` is a path-based disclosure:** native `<summary>` activates on click/tap; no author `touchmove`.
- **Horizontal `pre` overflow is an author swipe gesture:** Understanding 2.5.1 excludes UA scrolling of natively scrollable containers.
- **Embed lightbox/pinch inside `qrati-connect` fails 2.5.1 here:** out of scope.
- **Issue search** `pointer gestures OR 2.5.1 OR swipe OR drag OR multipoint OR path-based`: no matching issue. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.1 Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html)
- [WCAG 2.2 SC 2.5.1](https://www.w3.org/TR/WCAG22/#pointer-gestures)
- [G215: Providing controls to achieve the same result as path based or multipoint gestures](https://www.w3.org/WAI/WCAG22/Techniques/general/G215.html)
- [F105: Failure of Success Criterion 2.5.1 due to providing functionality via a path-based gesture without simple pointer alternative](https://www.w3.org/WAI/WCAG22/Techniques/failures/F105.html)
- `app/components/qrati-demo.gts` (`toggleTheme`, `openCookiePreferences`, FAQ details, links)
- `app/styles/app.css` (hover transforms; `pre` overflow-x; no pointer-event JS)
- Prior: 2.5.2 pointer cancellation (20261110T051738Z); 2.1.1 keyboard (20261109T223538Z)

## Limitations

CodeGraph unindexed. No pointer session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 2.5.1 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending remote read-back
