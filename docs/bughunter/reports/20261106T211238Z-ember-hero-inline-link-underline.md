# Ember hero inline link underline

- **Scope:** In-paragraph host links in `QratiDemo` hero (`h1` “Qrati” and `.hero-copy` qrati.com anchors) vs `text-decoration` in `app/styles/app.css`.
- **Base:** `origin/main` at `cd19aa4640e06d86dcced1fce7717a277cbb95c2`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T211238Z-834436b1941a4523b7a6eb6396c70d34-ember`, `bughunter/20261106T211238Z-834436b1941a4523b7a6eb6396c70d34-ember`.
- **Run:** `20261106T211238Z-834436b1941a4523b7a6eb6396c70d34`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Admin chore PRs #121/#122 were not used as a source checkout. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Inline hero Qrati links are distinguished only by color** — **Evidence:** `app/components/qrati-demo.gts` puts `https://qrati.com` anchors inside `<h1>` and `.hero-copy`. `app/styles/app.css` `.hero a, .footer a { text-decoration: none; }` removes the resting underline. Link `--brand-accent` vs surrounding `--page-muted`: light `#c24100` / `#4a5568` **1.451:1**; dark `#ff6b35` vs composited copy **~1.08:1**. **Failure:** [WCAG 2.2 SC 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color) / [F73](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73) — in-paragraph links with no non-color cue and <3:1 lightness difference vs surrounding text. Issue [#24](https://github.com/qrati-labs/qrati-connect-ember-example/issues/24) addressed 1.4.3 vs background, not 1.4.1 vs surrounding text. **Fix:** resting `text-decoration: underline` on `.hero h1 a, .hero-copy a`. **Test:** `tests/unit/hero-inline-link-underline-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` renders `QratiDemo`.
2. Hero markup: `h1` and `.hero-copy` each contain a `target="_blank"` qrati.com link (no `<strong>` / extra weight on the anchor).
3. Styles: `.hero h1 a, .hero-copy a { color: var(--brand-accent); }` then `.hero a, .footer a { text-decoration: none; }`.
4. Action pills (bordered chips) and footer `<nav>` are sibling `.hero a` / `.footer a` uses; F73 treats navigational/context links as identifiable from layout.
5. No later CSS restores underline on the in-paragraph selectors.

## Falsification

- **Already fixed by #24:** 1.4.3 vs page background now passes (`#c24100` on cream **4.895:1**, `#ff6b35` on `#111` **6.66:1**). 1.4.1 vs surrounding copy still fails.
- **3:1 lightness exception in F73:** not met (1.451 / ~1.08).
- **Hover/focus underline:** not present; F73 states hover-only cues still fail.
- **Bold as non-color cue:** anchors are not bold; nearby `<strong>embed script</strong>` is not the link.
- **Footer / pills:** left un-underlined; they are nav/chip chrome, not running text.

## Impact / severity

P3 (low). Demo visitors who cannot rely on hue cannot tell the in-copy “Qrati” words are links. No data loss or authz failure.

## Root cause

Blanket `text-decoration: none` on `.hero a` also covers running-text links that have no other resting non-color indicator.

## Disposition

Confirmed defect. Issue https://github.com/qrati-labs/qrati-connect-ember-example/issues/49. Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for merge routing.

## Tests

- Authored: `tests/unit/hero-inline-link-underline-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- `git diff --check`: clean (no output)
- lint / typecheck / ember test / CI: **NOT RUN BY BUGHUNTER**

## Citations

- [WCAG 2.2 Success Criterion 1.4.1 Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [F73: Failure of SC 1.4.1 due to creating links that are not visually evident without color vision](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73)

## Limitations

CodeGraph unindexed. Contrast computed from declared CSS (sRGB relative luminance), not a browser screenshot. Live page not mutated.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T21:12:38Z | 2026-11-06T21:13:02Z | 02:42:38 | 02:43:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-06T21:13:32Z | 2026-11-06T21:19:28Z | 02:43:32 | 02:49:28 | 00:05:56 (5.9 min) |
| **Total run (preflight start to finish)** | 2026-11-06T21:12:38Z | 2026-11-06T21:19:28Z | 02:42:38 | 02:49:28 | **00:06:50 (6.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:30 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T211238Z-834436b1941a4523b7a6eb6396c70d34.json`.

## PR / checks

- Issue: https://github.com/qrati-labs/qrati-connect-ember-example/issues/49 (open, unassigned; repo unmapped)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/50
- Base `main` `cd19aa4640e06d86dcced1fce7717a277cbb95c2` / head `bughunter/20261106T211238Z-834436b1941a4523b7a6eb6396c70d34-ember`
- `Fixes #49` verified via `closingIssuesReferences`
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian IN_PROGRESS; Workers Builds IN_PROGRESS; CI Lint/Test not yet reported
- Local tests **NOT RUN BY BUGHUNTER**
