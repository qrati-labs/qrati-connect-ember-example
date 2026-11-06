# Ember host SEO developer-feature cards

- **Scope:** Host “Why developers choose Qrati Connect” block in `QratiDemo` (`.seo-section[aria-labelledby=features-heading]`: kicker, `h2#features-heading`, four `.seo-feature-card` articles). Excludes feature-map cards, short-answer, quickstart, FAQ, CTA, embed mount, and cookie consent.
- **Base:** `origin/main` at `c738897912fbb5fdd3b16b3d45127c73b96fee7b`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T233039Z-1f7bf6ab8d254843bc13ab09387e4505-qrati-connect-ember-example`, `bughunter/20261106T233039Z-1f7bf6ab8d254843bc13ab09387e4505-ember`.
- **Run:** `20261106T233039Z-1f7bf6ab8d254843bc13ab09387e4505`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. After the capability-map section, `app/components/qrati-demo.gts` renders `<section class="seo-section" aria-labelledby="features-heading">` with:
   - `<p class="seo-kicker">Why developers choose Qrati Connect</p>`
   - `<h2 id="features-heading">A reliable event layer, ready for Ember</h2>`
   - `.seo-features-grid` of four `<article class="seo-feature-card">`s: Live photo wall, Guest uploads, Reactions and contests, Framework-friendly
   - each card: decorative `<iconify-icon>` (direct child), `<h3>`, then a `<p>` of product copy
3. Style (`app/styles/app.css`): auto-fit grid `minmax(14rem,1fr)`; cards use `--card-bg`, `--field-border`, left-aligned body; headings inherit `--page-text`; copy `--page-muted`; kicker `--brand-accent` weight 800 uppercase. Icons are `1.5rem` `--brand-accent` on a `#ff480014` chip (`display:block`, `.5rem` padding). Global `iconify-icon` 1em host box still applies; `.seo-feature-card > iconify-icon` overrides `display`. Global `prefers-reduced-motion` exists; this block has no transform of its own.
4. Contrast (sRGB relative luminance; light card `rgba(255,255,255,0.7)` over `#fff7f1` → `rgb(255,253,251)`; dark card `rgba(255,255,255,0.04)` over `#1c0e05` → `rgb(37,24,15)`; icon chip `#ff480014` over those fills):
   - Light: h2 `#1a1a2e` on page **16.10:1**; h3 `#213547` on card **12.43:1**; muted `#4a5568` on card **7.42:1**; kicker `#c24100` on page **4.90:1**; icon `#c24100` on chip **4.63:1**.
   - Dark: h2 `#f0f0f5` on page **16.59:1**; h3 0.87 white on card **13.25:1**; muted 0.6 white on card **6.91:1**; kicker `#ff6b35` on page **6.65:1**; icon `#ff6b35` on chip **5.57:1**.
5. Authz/validation/persistence: none (static marketing copy). Side effects: Iconify 2.1.0 (deferred in `index.html`) may fetch icon data when cards intersect the viewport; not gated by host cookie consent (analytics only). Not claimed as a cookie-consent invariant.

## Falsification

- **WCAG 1.4.3 on kicker/copy/headings:** all pairs ≥ 4.5:1 for normal text (light kicker on page is the floor at 4.90:1).
- **WCAG 1.4.11 on accent icons:** light `#c24100` on chip **4.63:1** (≥ 3:1).
- **Missing `aria-hidden` on `iconify-icon`:** Iconify web component documents that `aria-*` is supported when set; these hosts do not set it. The custom element is unnamed and sits above a visible `h3`. No screen-reader session; not claimed as 1.1.1 (same limit as the feature-map audit).
- **`<article>` landmark noise:** four self-titled articles; grouping preference, not a violated invariant.
- **`--field-border` vs card 1.38:1:** cards are not interactive UI components; 1.4.11 does not apply to static grouping chrome.
- **Copy vs this host’s hash-only embed:** marketing cards, not a runtime contract of the Ember demo.

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
- Iconify Icon web component [docs](https://iconify.design/docs/iconify-icon/) (Shadow DOM SVG; `aria-*` opt-in)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. Contrast computed from declared CSS tokens and alpha compositing, not a captured screenshot.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

TIMING_TABLE_PENDING

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T233039Z-1f7bf6ab8d254843bc13ab09387e4505.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: pending
