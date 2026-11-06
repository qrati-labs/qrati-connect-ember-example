# Ember host Contact CTA

- **Scope:** Host conversion CTA in `QratiDemo` (`seo-cta-section` → `.btn-cta-primary` → `https://qrati.com/contact-us`), including href, contrast tokens, focus/hover, and reduced-motion.
- **Base:** `origin/main` at `74e4511fcad0e285ce3cc3fd00afc2ceeac4dafa`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T191338Z-021fc46b4204476b9d6955d4fd7d53f3-ember`, `bughunter/20261106T191338Z-021fc46b4204476b9d6955d4fd7d53f3-ember`.
- **Run:** `20261106T191338Z-021fc46b4204476b9d6955d4fd7d53f3`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Admin chore PRs #121/#122 were not used. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. CTA: `app/components/qrati-demo.gts` `seo-cta-section` → `<a class="btn-cta-primary" href="https://qrati.com/contact-us">Contact Qrati →</a>` (no `target`; same-site when hosted under `qrati.com`).
3. Style: `app/styles/app.css` `.btn-cta-primary` uses `background: var(--cta-bg); color: #fff !important`. Light and dark `--cta-bg: #c24100`. Relative luminance contrast vs white **5.19:1** (WCAG 1.4.3 AA for normal text). Prior issue [#18](https://github.com/qrati-labs/qrati-connect-ember-example/issues/18) already moved the button off `--brand-accent`.
4. Motion: hover `transform`/`box-shadow`; `@media (prefers-reduced-motion: reduce)` shortens transitions.
5. Focus: no extra `:focus-visible` rule; no global `outline: none`.
6. Live href check (read-only HEAD): `https://qrati.com/contact-us` → HTTP 200 (no redirect). `https://qrati.com/contact` → 404, so the chosen path is the live contact page.

Authz/validation/persistence: none (public marketing link). Side effects: navigation only.

## Falsification

- Contrast regression vs #18: `#c24100` on `#ffffff` is 5.19:1, above 4.5:1.
- Broken URL: contact-us is 200 at audit time; `/contact` is not used.
- Missing `rel="noopener"`: no `target="_blank"`, so the opener is not left in place.
- Dark theme using `--brand-accent` for the button: CTA uses `--cta-bg`, not `#ff6b35`.
- Ember example public route `https://qrati.com/connect/ember-example` returned HTTP 404 at audit time; that is the previously documented deployment-availability gap, not a CTA source defect.

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
- Prior CTA contrast issue [#18](https://github.com/qrati-labs/qrati-connect-ember-example/issues/18)

## Limitations

CodeGraph unindexed. No browser session of the Ember host (public example URL 404). Contact URL status is time-specific. Contrast computed from declared CSS tokens, not computed styles.

## Timing

Timing table inserted from `bughunter-timing.py finish` after remote read-back.

## PR / checks

To be recorded after remote read-back.
