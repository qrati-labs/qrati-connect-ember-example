# Ember host WCAG 2.1.3 keyboard (no exception)

- **Scope:** WCAG 2.2 SC 2.1.3 Keyboard (No Exception) (AAA) for host-authored functionality in `QratiDemo`: theme toggle, hero/action-pill/Contact/footer links, FAQ `<details>`/`<summary>`, footer Cookie Preferences. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome (library-owned), 2.1.1 Keyboard (20261109T223538Z), 2.1.2 No Keyboard Trap (20261109T225738Z), skip/bypass (20261107T044738Z), focus-visible (20261107T050938Z).
- **Base:** `origin/main` at `652d029150d40d4f6420e3067b4242aedf628696`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T211938Z-3063ee0d44e643f0ba8e1df2a38289b7-ember`, `bughunter/20261113T211938Z-3063ee0d44e643f0ba8e1df2a38289b7-ember`.
- **Run:** `20261113T211938Z-3063ee0d44e643f0ba8e1df2a38289b7`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Host interaction is in `app/components/qrati-demo.gts`.
2. [WCAG 2.2 SC 2.1.3](https://www.w3.org/TR/WCAG22/#keyboard-no-exception) (AAA): *All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.* [Understanding 2.1.3](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html) (fetched 2026-11-13): same as 2.1.1 except **no exceptions**. Path-dependent input is not required to be made keyboard-accessible; content that *uses* path-dependent input cannot meet 2.1.3. Sufficient techniques: follow 2.1.1 ([G202](https://www.w3.org/WAI/WCAG22/Techniques/general/G202)).
3. Host-authored event bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">`. Repo-wide host `app/` / `index.html` / `src/` / CSS: no `keydown`/`keyup`/`keypress`, `mousedown`/`pointerdown`/`touchstart`, `tabindex`, `accesskey`, `preventDefault`, `draggable`, `contenteditable`, or `pointer-events`.
4. Remaining operable host UI is native: `<a href>` (hero Qrati links, GitHub/VS Code pills, Contact CTA, footer nav) and FAQ `<details>`/`<summary>`. HTML `button`, `a[href]`, and `summary` are keyboard-operable in user agents (Enter/Space on buttons and summary; Enter on links). Hover-only CSS (`.theme-toggle:hover`, `.footer-cookie-btn:hover`, `.btn-cta-primary:hover`, `.feature-map-card:hover`) does not gate function.
5. No path-dependent host function (drawing, handwriting, drag-to-reorder, gesture path). 2.1.1’s path exception is unused, so 2.1.3 does not fail for that class. No host timing of individual keystrokes. 2.1.1 (20261109T223538Z) already treated the same controls as G202; this AAA run re-checked that the exception is not in play.
6. Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not add pointer-only UI.

Authz/validation: public demo. Persistence: `qc-theme` localStorage; geo `sessionStorage`; consent cookie after preference click. Side effects: optional GTM inject after analytics consent; theme persist; cookie-preferences modal. Errors: geo fetch fail-closed; `showCookiePreferences` awaits init then `CookieConsent.showPreferences()`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`{{on "click"}}` is mouse-only, so AAA fails even if 2.1.1 passed:** HTML `click` on a focused `button` fires from keyboard activation. Not F54. 2.1.3 does not require a separate keydown handler.
- **Path-dependent embed gallery (lightbox swipe / crop) fails 2.1.3 for the host page:** embed internals are out of scope; host has no path-dependent function of its own. Not claimed.
- **Hover-only CTA transform means keyboard users cannot activate Contact:** `href` remains keyboard-activatable; transform is visual, not the activation path.
- **Theme toggle `position: absolute` / `fixed` removes it from tab order:** `position` does not remove a `button` from sequential focus.
- **Must include cookie-consent dialog Tab wrap / embed keyboard:** third-party chrome; not host source. Not claimed.
- **Issue search** `keyboard OR 2.1.3 OR tabindex OR keytrap`: no matching open or closed issue for this SC (search hit #146 is `target=_blank` new-tab indication, different path). Open issue set empty. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.1.3 Keyboard (No Exception)](https://www.w3.org/TR/WCAG22/#keyboard-no-exception)
- [WCAG 2.2 Understanding SC 2.1.3 Keyboard (No Exception)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html)
- [G202: Ensuring keyboard control for all functionality](https://www.w3.org/WAI/WCAG22/Techniques/general/G202)
- `app/components/qrati-demo.gts`, `app/styles/app.css`, `app/templates/application.gts`, `app/router.ts`
- Prior: 2.1.1 keyboard (20261109T223538Z); 2.1.2 no keyboard trap (20261109T225738Z)

## Limitations

CodeGraph unindexed. No browser keyboard session; operability is from host markup + HTML/WCAG native-control techniques, not a captured Tab pass on `https://qrati.com/connect/ember-example`. Cookie-consent and embed keyboard behavior not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `652d029150d40d4f6420e3067b4242aedf628696` / head `bughunter/20261113T211938Z-3063ee0d44e643f0ba8e1df2a38289b7-ember`
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
