# Ember host WCAG 1.4.11 non-text contrast (interactive chrome)

- **Scope:** WCAG 2.2 SC 1.4.11 Non-text Contrast on host-authored interactive chrome: `.theme-toggle`, `.action-pills a`, `.btn-cta-primary`, footer cookie-preferences control, author-drawn `:focus-visible` rings, cookie-consent primary/secondary buttons and category toggles (`#cc-main` tokens). Excludes 1.4.3 text contrast already fixed (#18/#22/#24), preference-section toggle reachability (#30), forced-colors / prefers-contrast (20261107T112538Z), decorative Iconify / feature-map icons (20261106T224738Z / 20261106T233039Z), static card/widget borders, embed internals.
- **Base:** `origin/main` at `9273cd906a8a2a97f9490cc551dff508d86a77d2`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T181138Z-7bf4ad0f77514466b7ada963769d7ed4-qrati-connect-ember-example`, `bughunter/20261109T181138Z-7bf4ad0f77514466b7ada963769d7ed4-ember`.
- **Run:** `20261109T181138Z-7bf4ad0f77514466b7ada963769d7ed4`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `QratiDemo`. Interactive host controls live in `app/components/qrati-demo.gts` with tokens in `app/styles/app.css`. Cookie-consent chrome is vanilla-cookieconsent 3.1.0, restyled only via `#cc-main` custom properties.
2. SC 1.4.11 (AA): visual information **required to identify** UI components and states has ≥ 3:1 against adjacent colors, except inactive controls and UA-determined (unmodified) appearance. [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). A visible hit-area border/fill is **not** required when the control has visible text (or an equivalently identifying graphic); faint borders then are not in scope. Author-drawn focus indicators **are** in scope (with 2.4.7).
3. Text-identified controls (boundary/fill not required):
   - `.theme-toggle` visible label `🌙 Dark` / `☀ Light`. Light border `rgba(0,0,0,0.12)` vs `#fffdfb` ≈ **1.31:1**; dark `rgba(255,255,255,0.12)` vs `#111` ≈ **1.39:1**. Out of scope for 1.4.11 because the name identifies the control. Toggle text itself is 1.4.3 (`#374151` vs light page **10.16:1**).
   - `.action-pills a` contain `View on GitHub` / `Open in VS Code` plus `aria-hidden` SVGs. Same `--pill-border` ≈ **1.31:1 / 1.39:1**. Out of scope.
   - Footer `Cookie Preferences` is unbordered text (`padding: 0`; `color: var(--footer-muted)`). Identified by text, not a graphic boundary.
   - Consent secondary `#fff0e9` vs `#ffffff` ≈ **1.11:1** (dark `#2a2020` vs `#161622` ≈ **1.13:1**). Labels `Reject analytics` / `Manage preferences` / `Save preferences` identify those buttons.
4. Filled controls where the fill *could* be treated as the identifying shape (still ≥ 3:1):
   - `.btn-cta-primary` `--cta-bg: #c24100` vs light page `#fffdfb` **5.11:1**; vs dark `#0f0f14` **3.69:1**; vs `#111111` **3.64:1**.
   - `#cc-main` `--cc-btn-primary-bg: #cc3d00` vs `--cc-bg: #ffffff` **4.96:1**; vs dark `#161622` **3.61:1**.
5. State graphics required to operate the control:
   - Category toggles (`linkedCategory` sections from #30): `--cc-toggle-off-bg: #667481` vs `#ffffff` **4.79:1**, vs block `#fff7f1` **4.53:1**. `--cc-toggle-on-bg: #ff4800` vs `#ffffff` **3.40:1**, vs `#fff7f1` **3.21:1**. Dark off `#6b7280` vs `#161622` **3.71:1**; on `#ff4800` vs `#161622` **5.27:1**. All ≥ 3:1.
   - Author focus rings: `.theme-toggle:focus-visible` and `.footer-cookie-btn:focus-visible` use `outline: 2px solid var(--brand-accent)`. Light `#c24100` vs toggle fill ≈ **4.48:1** / vs white **5.19:1**. Dark `#ff6b35` vs toggle fill ≈ **5.47:1** / vs `#0f0f14` **6.74:1**.
   - Hero / pill / CTA / footer `<a>` do not set `outline: none`; appearance remains UA-determined (2.4.7 G149 / 1.4.11 UA exception). Link focus-visible already audited (20261107T050938Z).
6. Graphics not required for understanding: feature-map / SEO Iconify accents (text headings present); static `.feature-map-card` / `.faq-list details` / `.widget-frame` borders are grouping chrome, not UI components.

Authz/validation/persistence: none on this path (public demo; consent cookie out of scope). Side effects: none. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Faint theme-toggle / pill borders fail 1.4.11:** contradicted by Understanding “Boundaries”: visible text identifies the control; a hit-area border is then not required and not subject to 3:1. [W3C WCAG issue 800](https://github.com/w3c/wcag/issues/800) same reading for button background.
- **Consent secondary 1.11:1 fails:** same exception; button text is the identifier. Primary fill still ≥ 3:1 if treated as a shape.
- **Toggle-on `#ff4800` vs `#fff7f1` (3.21:1) fails:** 3.21 ≥ 3.0. Source relative-luminance using sRGB WCAG formula; not a live eyedropper.
- **Must fail CTA on dark (3.64:1) as “barely”:** 3:1 is the SC threshold; 3.64 meets it. Not filed.
- **Missing custom `:focus-visible` on links fails 1.4.11:** author did not modify UA focus appearance (`outline` not removed). Exception for UA-determined appearance applies. Distinct from 2.4.7 (already report-only).
- **Forced-colors / 1.4.3 text contrast is this defect:** different SCs; already audited.
- **Issue search** `1.4.11 OR "non-text contrast" OR toggle-off-bg OR focus-visible`: closed #30 (preferences sections + off-toggle), #18/#22/#24 (text 1.4.3), #34 (toggle name). No open duplicate for host interactive 1.4.11.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WCAG 2.2 SC 1.4.11](https://www.w3.org/TR/WCAG22/#non-text-contrast)
- [w3c/wcag#800 — button background vs identifying text](https://github.com/w3c/wcag/issues/800)
- `app/components/qrati-demo.gts` (theme-toggle, action pills, Contact CTA, footer cookie button)
- `app/styles/app.css` (host tokens, `#cc-main` / dark consent tokens, `:focus-visible`)
- `app/lib/cookieConsent.ts` (preferences `linkedCategory` sections)

## Limitations

CodeGraph unindexed. Contrast ratios are from authored CSS tokens blended over documented page backgrounds, not from a browser computed-style capture. No claim about cookie-consent library internals beyond host CSS variables, or about embed-shadow UI. Live `https://qrati.com/connect/ember-example` was not used as evidence this run.

## Timing

TIMING_PLACEHOLDER

## PR / checks

PR_PLACEHOLDER
