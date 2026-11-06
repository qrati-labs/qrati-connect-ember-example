# Ember host feature-map cards

- **Scope:** Host “Complete capability map” block in `QratiDemo` (`.seo-section[aria-labelledby=feature-map-heading]`: kicker, `h2#feature-map-heading`, intro, six `.feature-map-card` articles). Excludes embed mount, cookie consent, short-answer, SEO feature cards, FAQ, and CTA.
- **Base:** `origin/main` at `61d68ff76d0cd623c6915f8ec82cdb9e81c5a587`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T224738Z-06b5ac8d5ba940619654054630b22a6b-qrati-connect-ember-example`, `bughunter/20261106T224738Z-06b5ac8d5ba940619654054630b22a6b-ember`.
- **Run:** `20261106T224738Z-06b5ac8d5ba940619654054630b22a6b`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. After `.answer-section`, `app/components/qrati-demo.gts` renders `<section class="seo-section" aria-labelledby="feature-map-heading">` with:
   - `<p class="seo-kicker">Complete capability map</p>`
   - `<h2 id="feature-map-heading">One embed. The full event experience.</h2>`
   - intro copy that an active subscription and organization ID select space, branding, access, and features
   - `.feature-map-grid` of six `<article class="feature-map-card">`s: Embed cleanly, Run the event, Show every memory, Collect uploads, Make it social, Keep people safe
   - each card: `.feature-map-heading` with a decorative `<iconify-icon>` plus `<h3>`, then a `<p>` of capability bullets in prose
3. Style (`app/styles/app.css`): auto-fit grid `minmax(15rem,1fr)`; cards use `--card-bg`, `#8884` border, hover `translateY(-3px)`; headings `--page-heading`; body copy `--page-muted`; icons `--brand-accent` at `1.5rem` with reserved `iconify-icon` 1em host box. Global `prefers-reduced-motion` zeros transition duration.
4. Contrast (sRGB relative luminance, card `rgba(255,255,255,0.7)` over light `#fff7f1` → `#fffdfb`; `rgba(255,255,255,0.04)` over dark `#1c0e05` → `rgb(37,24,15)`):
   - Light: heading `#1a1a2e` **16.77:1**; muted `#4a5568` **7.40:1**; kicker `#c24100` on page **4.90:1**, on card **5.10:1**.
   - Dark: heading `#f0f0f5` **15.23:1**; muted 0.6 white **6.07:1**; kicker `#ff6b35` on page **6.65:1**, on card **6.10:1**.
5. Authz/validation/persistence: none (static marketing copy). Side effects: Iconify 2.1.0 (deferred in `index.html`) may fetch icon data when cards intersect the viewport; not gated by host cookie consent (analytics only). Not claimed as a cookie-consent invariant.

## Falsification

- **WCAG 1.4.3 on kicker/copy/heading:** all pairs ≥ 4.5:1 for normal text (light kicker on page is the floor at 4.90:1).
- **WCAG 1.4.11 on accent icons:** light `#c24100` on card **5.10:1** (≥ 3:1).
- **Missing `aria-hidden` on `iconify-icon`:** Iconify 2.1.0 host/SVG render does not set `aria-hidden` by default; host is an unnamed custom element beside a visible `h3`. No screen-reader session; not claimed as 1.1.1.
- **`<article>` landmark noise:** six self-titled articles; grouping preference, not a violated invariant.
- **Hover-only lift:** transform is decorative; reduced-motion short-circuits the transition. Cards are not focusable controls.
- **Copy vs this host’s hash-only embed:** marketing capability map, not a runtime contract of the Ember demo.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: none (no confirmed defect).
- Command: none.
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**.
- Patch hygiene: `git diff --check` on docs-only diff.

## Citations

- WCAG 2.2 [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- WCAG 2.2 [1.4.11 Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast)
- Iconify Icon web component [render/svg.ts](https://github.com/iconify/iconify/blob/master/iconify-icon/icon/src/render/svg.ts) (no default `aria-hidden`)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. Contrast computed from declared CSS tokens and alpha compositing, not a captured screenshot.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.

## PR / checks

Filled after remote read-back.
