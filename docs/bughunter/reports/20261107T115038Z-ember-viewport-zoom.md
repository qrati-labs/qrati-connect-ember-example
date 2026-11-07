# Ember host viewport zoom / text resize

- **Scope:** Host `index.html` viewport meta and WCAG 2.2 SC 1.4.4 (Resize Text) / 1.4.10 (Reflow) for the Ember example chrome: pinch/browser zoom, `user-scalable` / `maximum-scale`, rem-based type, `.page-shell` / `.widget-frame` `overflow: hidden`, and 320 CSS-px layout. Excludes quickstart `<pre>` overflow (issue #57), gallery lightbox vs host overflow (20261107T012438Z), reduced-motion (20261107T061938Z), embed internals.
- **Base:** `origin/main` at `46cbb0cc5fca7b991a540ba2f2f9e0cb050a4a9f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T115038Z-fd2ecb79da2549979040ecdc1de6593f-ember`, `bughunter/20261107T115038Z-fd2ecb79da2549979040ecdc1de6593f-ember`.
- **Run:** `20261107T115038Z-fd2ecb79da2549979040ecdc1de6593f`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `index.html` `<head>` declares `<meta name="viewport" content="width=device-width, initial-scale=1">` after charset, theme-boot script, title/description/robots/canonical/icons/OG/Twitter. No `user-scalable`, `minimum-scale`, `maximum-scale`, or `shrink-to-fit`. `tests/index.html` uses the same viewport token.
2. [ACT b4f0c3](https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/) maps viewport zoom locks to SC 1.4.4: `user-scalable=no|0` or `maximum-scale < 2` fail. This document sets neither.
3. Host type in `app/styles/app.css` is rem/`clamp` (`:root` does not freeze `font-size` in px; `.hero h1` is `clamp(2.25rem, 3vw, 3.6rem)`; kickers/pills/footer `0.68rem`–`0.78rem`; body inherits UA 16px). Decorative SVGs in action pills use `width="16"` `height="16"` with `aria-hidden="true"`.
4. Layout at ~320 CSS px: `.page-frame` horizontal padding `1rem`; `.feature-map-grid` / `.seo-features-grid` `minmax(15rem, 1fr)` / `minmax(14rem, 1fr)` (240px / 224px tracks + 32px padding fit inside 320px); `.answer-section` becomes one column at `max-width: 640px`. `.seo-section pre` has `max-width: 100%; overflow-x: auto` (#57).
5. `.page-shell { overflow: hidden }` and `.widget-frame { overflow: hidden }` remain. Shell has no fixed height, so vertical growth is not clipped. Horizontal clip would require a child wider than the shell; the remaining long token (quickstart URL) is confined to a scrollable `pre`. Widget overflow is embed chrome (lightbox already treated as `document.body`).
6. [WCAG 2.2 Understanding 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html): 200% resize without assistive technology, without loss of content/function; page zoom is a sufficient path when the viewport is not locked. [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): two-dimensional scrolling is not required except for content that needs two axes (e.g. the already-scrolling code sample).

Authz: none (public demo). Persistence: none. Side effects: none. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`width=device-width, initial-scale=1` blocks zoom:** contradicted by ACT b4f0c3; those tokens do not set `user-scalable=no` or `maximum-scale < 2`. iOS historical `maximum-scale=1` is not present.
- **`.page-shell { overflow: hidden }` fails 1.4.4/1.4.10 at 320px:** not evidenced from source. Grid minima plus padding fit 320 CSS px; the previous narrow-viewport clip (#57) is already `overflow-x: auto` on `pre`. No browser reflow session in this run.
- **Must add `user-scalable=yes`:** redundant when the attribute is omitted; HTML viewport default allows zoom.
- **px SVG icons fail 1.4.4:** decorative (`aria-hidden`), not text. SC 1.4.4 excepts images of text; these are not text.
- **Issue search** `viewport OR user-scalable OR maximum-scale OR resize text OR reflow OR zoom`: only closed #57 (quickstart snippet clip on narrow viewports), a different path already fixed. No duplicate for this workflow.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [WCAG 2.2 Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [ACT: Meta viewport allows for zoom (b4f0c3)](https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/)
- `index.html` viewport meta
- `app/styles/app.css` (rem/`clamp` type; `.page-shell` / `.widget-frame` overflow; grid minima; `pre` overflow-x)

## Limitations

CodeGraph unindexed. No browser 200%/400% zoom or 320 CSS-px device session. Embed widget internals not re-audited.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

timing incomplete

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- `closingIssuesReferences`: none
