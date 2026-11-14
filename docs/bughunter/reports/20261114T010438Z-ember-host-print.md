# Ember host print rendering vs dark theme

- **Scope:** Host print medium for `QratiDemo` chrome: absence of `@media print`, `print-color-adjust`, and print-specific color/background overrides, versus light/dark `data-theme` tokens (`--page-text`, page gradients, `.page-shell` overflow, absolute theme toggle). Excludes WCAG 1.4.3 screen contrast (#18 / 20261113T120438Z), forced-colors (20261107T112538Z), theme first-paint (#45), cookie-consent chrome, embed internals.
- **Base:** `origin/main` at `01315f6f67ad69409d12ba045fea0beb51ce587f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T010438Z-11b61b8f8754430496d1f7bcc2e0bf50-qrati-connect-ember-example`, `bughunter/20261114T010438Z-11b61b8f8754430496d1f7bcc2e0bf50-ember`.
- **Run:** `20261114T010438Z-11b61b8f8754430496d1f7bcc2e0bf50`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Theme is `qc-theme` / `prefers-color-scheme` (`index.html` boot script + `readHostTheme` / `toggleTheme` in `app/components/qrati-demo.gts`). Host colors live in `app/styles/app.css`.
2. Light tokens: `[data-theme='light']` sets `color-scheme: light`, `--page-text: #213547`, `--page-heading: #1a1a2e`, paper-like gradients on the themed element. Dark tokens: `[data-theme='dark']` sets `color-scheme: dark`, `--page-text: rgba(255, 255, 255, 0.87)`, `--page-heading: #f0f0f5`, dark gradients (`#111111` → `#1c0e05`). `body` is `min-height: 100vh` with no independent background (inherits from the themed root).
3. Print-specific CSS: repo-wide search of `app/`, `index.html`, `src/`, `public/` found **no** `@media print`, `print-color-adjust`, `-webkit-print-color-adjust`, or `@page`. Default CSS Color Adjustment value is `print-color-adjust: economy`.
4. Layout that could affect a print box: `.page-shell { overflow: hidden }` has no fixed height (in-flow blocks grow; prior 1.4.4 / 1.4.10). `.theme-toggle` is `position: absolute; top: 1rem; right: 1rem` (not `fixed` after the pilot override). `.widget-frame { overflow: hidden }` wraps the live gallery (2D widget; print of embed internals out of scope).
5. [CSS Color Adjustment](https://www.w3.org/TR/css-color-adjust-1/#print-color-adjust) / [MDN `print-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/print-color-adjust): `economy` (initial) lets the UA omit backgrounds and **adjust text colors for white paper**. Authors may hint `exact` when ink-economy would harm the design. This host neither forces `exact` nor supplies a print palette.
6. Product contract: README describes an interactive Ember embed demo (script tag, host theme, live gallery). It does not document a print stylesheet, printable handout, or paper delivery.

Authz/validation/persistence: none (public demo). Side effects: none on print. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Dark theme prints light-gray text on white paper (1.4.3 fail):** not established. Default `print-color-adjust: economy` explicitly allows UAs to drop backgrounds and darken text for paper. No print-preview session in this run; UA-dependent ink economy is not a host invariant violation.
- **Missing `@media print` is a broken host contract:** not stated in README, tests, or `wrangler.jsonc`. Screen contrast and theme persistence are already covered (#18, #40, #45). Print CSS would be a feature.
- **Must set `print-color-adjust: exact` so dark gradients survive:** that would *increase* ink use and could make light-on-dark worse if the user disables background graphics. Opposite of economy; not required.
- **`.page-shell { overflow: hidden }` clips printed content:** same as 1.4.10 — no max-height; in-flow growth. Not evidenced as a print clip.
- **Issue search** `print OR stylesheet OR print-color-adjust OR "@media print"`: closed hits are theme first-paint (#45), unguarded `localStorage` (#40), CTA contrast (#18). No print-medium duplicate. Open set empty.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [CSS Color Adjustment Module Level 1 — `print-color-adjust`](https://www.w3.org/TR/css-color-adjust-1/#print-color-adjust)
- [MDN `print-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/print-color-adjust)
- `app/styles/app.css` (`[data-theme='light'|'dark']` tokens; no `@media print`)
- `app/components/qrati-demo.gts` (theme toggle / host chrome)
- `index.html` theme-boot script
- Prior: 1.4.3 CTA contrast (#18); theme first-paint (#45); forced-colors (20261107T112538Z); 1.4.10 reflow (20261109T174738Z)

## Limitations

CodeGraph unindexed. No browser print-preview or paper output. No claim about a specific UA’s economy rewrite. Live `https://qrati.com/connect/ember-example` was not used as evidence (historical deployment 404 out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: (filled after open)
- Base `main` `01315f6f67ad69409d12ba045fea0beb51ce587f` / head `bughunter/20261114T010438Z-11b61b8f8754430496d1f7bcc2e0bf50-ember`
- `closingIssuesReferences`: none
