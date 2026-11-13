# Ember host WCAG 2.4.7 focus visible (theme toggle / footer cookie button)

- **Scope:** WCAG 2.2 SC 2.4.7 Focus Visible (AA) for the two host-authored controls that draw custom `:focus-visible` rings: `.theme-toggle` and `.footer-cookie-btn`. Excludes first-layer CMP buttons (20261113T224738Z), FAQ `<summary>` (20261113T222138Z), host `<a>` / Contact CTA (20261107T050938Z), 2.4.13 focus appearance (20261110T182838Z), embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `95c8f9e2aa23ac5c6aad7dc6c51275a49f649f1f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T231138Z-57f0a42d112f4d1ebd523a5a34eece43-qrati-connect-ember-example`, `bughunter/20261113T231138Z-57f0a42d112f4d1ebd523a5a34eece43-ember`.
- **Run:** `20261113T231138Z-57f0a42d112f4d1ebd523a5a34eece43`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome is `app/components/qrati-demo.gts`. `app/router.ts` `Router.map` is empty (single history index).
2. Theme toggle: `<button class="theme-toggle" type="button" {{on "click" this.toggleTheme}}>` with visible text `☀ Light` / `🌙 Dark`. Constructor applies `data-theme` / `.dark`; `toggleTheme` flips theme, persists `qc-theme` (storage guarded), and `mountEmbed` updates in-place `theme` / `data-theme` (#60).
3. Footer Cookie Preferences: `<button type="button" class="footer-cookie-btn" data-cc="show-preferencesModal" {{on "click" this.openCookiePreferences}}>Cookie Preferences</button>` inside `<nav aria-label="Footer navigation">`. `openCookiePreferences` awaits `initCookieConsent()` then `CookieConsent.showPreferences()` (#28). CMP first-layer chrome is out of scope.
4. Host CSS (`app/styles/app.css`):
   - `.theme-toggle:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 2px; }`
   - `.footer-cookie-btn:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 2px; }`
   - Repo-wide host CSS has **no** `outline: none`, `outline: 0`, or equivalent reset. The later Pilot `.theme-toggle { position: absolute; z-index: 1; }` override does not touch outline.
5. Both controls are native `<button type="button">` (keyboard-operable without extra key handlers). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not alter focus styles.

Authz/validation: public demo. Persistence: `qc-theme` localStorage on toggle (out of scope except as side effect of the same control). Side effects: theme class + embed attribute; optional GTM after analytics accept (out of scope). Errors: storage `catch` keeps in-memory theme.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Author rings only on `:focus-visible` hide the indicator for keyboard users:** `:focus-visible` is the keyboard/modality-aware focus mode. [WCAG 2.2 SC 2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible) (TR fetched 2026-11-13) requires a mode where the keyboard focus indicator is visible, not a mouse-click ring.
- **Missing rings on these controls fail 2.4.7:** contradicted by the two author `outline` rules plus absence of F78 resets. [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) (fetched 2026-11-13) is styling outlines/borders so the indicator is not visible; host CSS draws a 2px accent outline with offset.
- **Must also pass 2.4.13 AAA size/contrast on these rings:** different SC; already audited 20261110T182838Z.
- **CMP / FAQ 2.4.7 already covered these buttons:** those runs explicitly excluded theme-toggle and footer cookie-button author rings.
- **Issue search** `focus-visible OR theme-toggle outline OR footer-cookie-btn focus`: no matching open issue (open set empty). Closed hits are new-tab indication (#146), Iconify size (#38), footer reopen (#28) — different paths. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.4.7 Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible) (TR retrieved 2026-11-13): “Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.”
- [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) (WAI page retrieved 2026-11-13)
- `app/components/qrati-demo.gts` theme toggle + footer cookie button
- `app/styles/app.css` `.theme-toggle:focus-visible` / `.footer-cookie-btn:focus-visible`
- Prior: CMP 2.4.7 (20261113T224738Z); FAQ 2.4.7 (20261113T222138Z); link 2.4.7 (20261107T050938Z); 2.4.13 (20261110T182838Z)

## Limitations

CodeGraph unindexed. No live keyboard session on `https://qrati.com/connect/ember-example` (HEAD this run: HTTP 404; deployment availability out of scope). Ring contrast/area vs 2.4.13 not re-measured.

## Timing

TIMING_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending
- Local tests **NOT RUN BY BUGHUNTER**
