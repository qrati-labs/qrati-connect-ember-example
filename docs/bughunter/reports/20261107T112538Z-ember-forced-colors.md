# Ember host forced-colors / prefers-contrast

- **Scope:** Host chrome under CSS `forced-colors` (Windows High Contrast / UA forced palette) and `prefers-contrast`, including `app/styles/app.css` tokens, theme-toggle, Contact CTA, footer controls, feature/SEO cards, and absence of `forced-color-adjust`. Excludes 1.4.3 author-palette contrast already fixed (#18/#22/#24), reduced-motion (20261107T061938Z), theme-color (20261107T014838Z), cookie-consent first-layer chrome (20261107T072738Z), embed internals.
- **Base:** `origin/main` at `8eef97ee123e9d57d621b1cd6200ccab9dea8b6a`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T112538Z-5871be018b864b7baf6abe433a6bf156-ember`, `bughunter/20261107T112538Z-5871be018b864b7baf6abe433a6bf156-ember`.
- **Run:** `20261107T112538Z-5871be018b864b7baf6abe433a6bf156`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host colors come from `app/styles/app.css` `[data-theme='light'|'dark']` custom properties (`--page-text`, `--page-bg` via `background` gradients on `html`, `--brand-accent`, `--cta-bg`, `--footer-muted`, `--field-border`, `--card-bg`, `--theme-toggle-*`).
2. Interactive host controls: `.theme-toggle` (border + background + color), hero / footer `<a>` (color; `target=_blank` links also `rel="noopener noreferrer"`), `.btn-cta-primary` (`<a>` with `background: var(--cta-bg); color: #fff`), `.footer-cookie-btn` (`background: none; border: none; color: var(--footer-muted)`), FAQ `<details>`/`<summary>` (native).
3. There is **no** `@media (forced-colors: active)`, **no** `@media (prefers-contrast: …)`, and **no** `forced-color-adjust` (neither `none` nor `preserve-parent-color`) in `app/styles/app.css` or `index.html`. Reduced-motion is already handled separately (`@media (prefers-reduced-motion: reduce)`).
4. MDN `forced-colors`: at paint time the UA replaces author `color`, `background-color`, `border-color`, `outline-color`, non-URL `background-image` (including the host’s `linear-gradient` / `radial-gradient` page wash), and `box-shadow` with system colors (`Canvas` / `CanvasText` / `ButtonText` / `LinkText`, etc.). Authors are **not** expected to ship a separate forced-colors design; the query is for small fixes when the default remap fails. Setting `forced-color-adjust: none` would *disable* that remap.
5. WCAG 2.2 SC 1.4.11 applies to the **author-specified** palette (already audited for CTA / consent primary / hero kicker). W3C discussion of 1.4.3/1.4.11 vs user palettes: user-controlled `forced-colors` colors are outside author conformance; if the author *did* write `prefers-contrast` / `forced-colors` overrides, those overrides would then be in scope. This host writes none.
6. `prefers-contrast: more|less|custom` is optional enhancement. No host copy or test claims a contrast theme beyond `qc-theme` / `prefers-color-scheme`.

Authz: none (public demo). Persistence: none on this path. Side effects: none. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `@media (forced-colors: active)` fails 1.4.11 / High Contrast:** contradicted by MDN accessibility note (do not build a parallel design) and by UA paint-time override of color/background/border. Absence of the query is the default, not a broken invariant.
- **`forced-color-adjust: none` is implied by gradients / `backdrop-filter`:** not present in CSS. Gradients are non-URL `background-image` and are forced to `none`; html/body then use Canvas. Backdrop-filter is not in the forced-property list; it does not keep author colors against the UA remap of `color` / `background-color`.
- **Footer cookie button `border: none` disappears in forced colors:** it is a `<button>` with text “Cookie Preferences”. UA forces `color` to `ButtonText` on native buttons; text remains the identifier. Not an icon-only control.
- **Must add `prefers-contrast: more` tokens:** not required by 1.4.3/1.4.11. Adding a second palette would create a new conformance surface, not fix a demonstrated failure.
- **Issue search** `forced-colors OR prefers-contrast OR "high contrast"`: only closed #18 (CTA 1.4.3 in the author palette). No duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [MDN: `forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors) (UA remap list; do not ship a separate design; `forced-color-adjust: none` opts out)
- [WCAG 2.2 Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [w3c/wcag#2271](https://github.com/w3c/wcag/issues/2271) (user-controlled `forced-colors` palette outside author conformance)
- `app/styles/app.css` (`[data-theme]` tokens; reduced-motion only)
- `app/components/qrati-demo.gts` (theme-toggle, CTA, footer cookie button)

## Limitations

CodeGraph unindexed. No browser forced-colors / Windows High Contrast session. Cookie-consent modal chrome is third-party CSS (`vanilla-cookieconsent`) and was not re-audited here.

## Timing

TIMING_TABLE_PENDING

## PR / checks

- Issue: none (report-only)
- PR: pending
- `closingIssuesReferences`: none
