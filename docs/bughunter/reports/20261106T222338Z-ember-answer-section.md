# Ember host short-answer section

- **Scope:** Host “short answer” block in `QratiDemo` (`.answer-section`: kicker, heading, copy, `.answer-points`), including structure, theme tokens, and WCAG 1.4.3 contrast. Excludes embed mount, cookie consent, footer, and CTA.
- **Base:** `origin/main` at `de505fddbe4619744d0da9c659f7b3b3a90ff26c`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T222338Z-4a0eb1828d6a46898b0efd5c4d50be4c-ember`, `bughunter/20261106T222338Z-4a0eb1828d6a46898b0efd5c4d50be4c-ember`.
- **Run:** `20261106T222338Z-4a0eb1828d6a46898b0efd5c4d50be4c`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. After the live-gallery `widget-frame`, `app/components/qrati-demo.gts` renders `<section class="answer-section">` with:
   - `<span class="seo-kicker">The short answer</span>`
   - `<h2>What does Qrati Connect add to Ember?</h2>`
   - one paragraph of product copy
   - `.answer-points` four text `<span>`s (`✓ One embed to maintain`, `✓ No gallery backend`, `✓ Host-controlled theme and routing`, `✓ Organization-controlled features`)
3. Style (`app/styles/app.css` “Pilot design parity” block): two-column grid (`1.2fr .8fr`), `#ff480044` border, `#ff48000d` fill; heading uses `--page-heading`; copy uses `--page-muted`; points use `--page-heading` at weight 600. `.seo-kicker` is `--brand-accent`, weight 800, uppercase. `@media (max-width: 640px)` collapses to one column.
4. Contrast (sRGB relative luminance vs the composited section fill):
   - Light fill `#ff48000d` over `#fff7f1` → `rgb(255,238,229)`: heading `#1a1a2e` **15.12:1**; muted `#4a5568` **6.67:1**; kicker `#c24100` **4.60:1**.
   - Dark fill over `#1c0e05` → `rgb(40,17,5)`: heading `#f0f0f5` **15.77:1**; muted 0.6 white **6.98:1**; kicker `#ff6b35` **6.32:1**.
5. Authz/validation/persistence: none (static marketing copy). Side effects: none.

## Falsification

- **WCAG 1.4.3 on kicker/copy/heading:** all pairs ≥ 4.5:1 for normal text (kicker light is the floor at 4.60:1).
- **Dark theme ignored by hardcoded orange fill:** fill is alpha orange; text still uses theme tokens and remains AA.
- **Missing `aria-labelledby`:** the section contains a visible `h2`; sibling SEO sections that use `aria-labelledby` point at the same pattern of in-section headings.
- **Points not a `<ul>`:** each item is a text node in the accessibility tree; no information is color- or icon-only. Not claimed as 1.3.1.
- **Motion:** this block has no transform/animation of its own; global `prefers-reduced-motion` exists for other host chrome.

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
- WCAG 2.2 [1.3.1 Info and Relationships](https://www.w3.org/TR/WCAG22/#info-and-relationships) (considered, not claimed)

## Limitations

CodeGraph unindexed. No browser session of the Ember host (public example URL 404). Contrast computed from declared CSS tokens and alpha compositing, not a captured screenshot.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.

## PR / checks

To be recorded after publication/readback.
