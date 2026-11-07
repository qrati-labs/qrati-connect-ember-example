# Ember host footer pointer target size

- **Scope:** WCAG 2.2 SC 2.5.8 Target Size (Minimum) for host footer pointer targets: `footer nav` links (`qrati.com`, `npm`, `GitHub`, `Pricing`) and the Cookie Preferences control. Excludes theme-toggle (padded control; position/label already audited), hero/action-pills/Contact CTA (larger hit areas; CTA #18 / focus 20261107T050938Z), cookie-consent modal chrome, embed internals, skip/bypass (20261107T044738Z), footer brand image (2026-10-21), footer reopen wiring (#28).
- **Base:** `origin/main` at `fa3c469a4d7b8b763880bb9e26ae19ea1a50ac6e`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T053238Z-b5f40a0083154db3855f29b61304af1e-ember`, `bughunter/20261107T053238Z-b5f40a0083154db3855f29b61304af1e-ember`.
- **Run:** `20261107T053238Z-b5f40a0083154db3855f29b61304af1e`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / light-theme off-toggle in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `application.gts` renders `QratiDemo`. Footer in `app/components/qrati-demo.gts`: `<footer class="footer">` → `<nav aria-label="Footer navigation">` with four `target="_blank"` links plus `<button type="button" class="footer-cookie-btn">Cookie Preferences</button>`.
2. CSS (`app/styles/app.css`): footer links `font-size: 0.78rem; font-weight: 500` with no padding/min-width/min-height. Cookie button `padding: 0; margin: 0; font: inherit; font-size: 0.78rem`. `:root { line-height: 1.5 }`. At the UA 16px root, line-box height is `0.78rem × 1.5 = 18.72px` (< 24px). Shortest visible name is `npm`.
3. Spacing: `.footer nav { display: flex; flex-wrap: wrap; gap: 0.5rem 1.15rem }` → 8px row gap, 18.4px column gap. Centers of adjacent wide labels are farther apart than 24px horizontally. Wrapped rows: center-to-center ≈ `18.72 + 8 = 26.72px` (> 24px).
4. SC 2.5.8 requires 24×24 CSS pixels unless an exception applies. [Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) **Spacing**: undersized targets pass when a 24px-diameter circle centered on each bounding box does not intersect another target or another undersized target’s circle. That geometry holds for this flex nav.
5. **Inline** exception does not need to be used: these are a nav of separate controls, not sentence-constrained links. Theme-toggle (`padding: 0.5rem 0.9rem`) is ≥ 24px tall and out of this workflow.

Authz/validation/persistence: none (public demo). Side effects: navigation / cookie-preferences modal. Errors: none thrown on this path.

## Falsification

- **Undersized height (18.72px) fails 2.5.8:** contradicted by the Spacing exception; vertical center pitch 26.72px and horizontal pitch of labeled links exceed 24px circle diameter.
- **`npm` is too narrow:** even if the glyph box is under 24px wide, its circle is still centered on that box; neighbors (`qrati.com` / `GitHub`) plus 18.4px column gap keep circles from intersecting.
- **Cookie button `padding: 0` is a unique failure:** same line-box and same nav `gap` as the links; not isolated.
- **Must use 2.5.5 Target Size (Enhanced) 44×44 (AAA):** not claimed; this audit is 2.5.8 (AA).
- **Issue search** `target size OR 2.5.8 OR footer tap`: only closed #28/#30 (preferences reopen / category sections), unrelated. No duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- `app/components/qrati-demo.gts` (footer nav links + `footer-cookie-btn`)
- `app/styles/app.css` (`.footer nav` gap; `.footer a`; `.footer-cookie-btn`)

## Limitations

CodeGraph unindexed. No browser pointer session; sizes are from CSS (16px root assumption), not a captured boundingClientRect. No claim about cookie-consent modal controls.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T05:32:38Z | 2026-11-07T05:33:00Z | 11:02:38 | 11:03:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-07T05:33:17Z | 2026-11-07T05:40:18Z | 11:03:17 | 11:10:18 | 00:07:01 (7.0 min) |
| `delivery` | 2026-11-07T05:40:18Z | 2026-11-07T05:41:16Z | 11:10:18 | 11:11:16 | 00:00:58 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-07T05:32:38Z | 2026-11-07T05:41:16Z | 11:02:38 | 11:11:16 | **00:08:38 (8.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:17 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T053238Z-b5f40a0083154db3855f29b61304af1e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/70
- Base `main` `fa3c469a4d7b8b763880bb9e26ae19ea1a50ac6e` / head `bughunter/20261107T053238Z-b5f40a0083154db3855f29b61304af1e-ember` `77ee361ebd1d2d60b979ea1873c47d77db498c9c` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
