# Ember host keyboard focus indicators on links and Contact CTA

- **Scope:** WCAG 2.2 SC 2.4.7 Focus Visible for host `<a>` controls: hero Qrati links, GitHub/VS Code action pills, Contact CTA, footer nav links. Excludes theme-toggle and footer cookie-preferences button (custom `:focus-visible` already present; #34 / reopen #28), skip/bypass to gallery (20261107T044738Z), cookie-consent modal chrome, embed internals.
- **Base:** `origin/main` at `f7d4d9dbd52cf9ea50cda7e764a3b843a8e79c71`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T050938Z-ace9422ea910459ca9bb39ca3fb7e556-qrati-connect-ember-example`, `bughunter/20261107T050938Z-ace9422ea910459ca9bb39ca3fb7e556-ember`.
- **Run:** `20261107T050938Z-ace9422ea910459ca9bb39ca3fb7e556`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `QratiDemo`. Keyboard-operable host links in `app/components/qrati-demo.gts`:
   - two `https://qrati.com` anchors in the hero (`h1` and `.hero-copy`), both `target="_blank"` `rel="noopener noreferrer"`
   - GitHub and VS Code `.action-pills` anchors (same new-tab rel)
   - Contact CTA `.btn-cta-primary` → `https://qrati.com/contact-us` (same-tab, no `target`)
   - footer nav: qrati.com, npm, GitHub, Pricing (new-tab)
2. Custom focus styles in `app/styles/app.css` exist only for `.theme-toggle:focus-visible` and `.footer-cookie-btn:focus-visible` (2px `var(--brand-accent)` outline). No `:focus` / `:focus-visible` rules on `a`, `.action-pills a`, `.hero a`, `.footer a`, or `.btn-cta-primary`.
3. No `outline: none`, `outline: 0`, or `a:focus { outline: … }` reset in host CSS. Global `prefers-reduced-motion` zeros `transition-duration` / `animation-duration` only; it does not remove UA focus rings.
4. CTA uses `color: #fff !important; text-decoration: none` and a hover transform; those do not suppress outline. Hero/footer `text-decoration` rules affect underline, not focus rings.
5. WCAG 2.2 SC 2.4.7 (AA): “Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.” [Understanding 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) lists [G149](https://www.w3.org/WAI/WCAG22/Techniques/general/G149) (user-agent default focus indicator) as sufficient when the author does not hide it. [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) is the failure of styling outlines/borders so the indicator is not visible — not present here.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: none thrown.

## Falsification

- **Missing author `:focus-visible` on links fails 2.4.7:** contradicted by G149. Host CSS does not implement F78.
- **CTA `!important` color or `text-decoration: none` hides focus:** those properties do not remove outline. Contrast of the CTA face was issue #18, a different SC (1.4.3).
- **Unequal treatment vs theme-toggle/cookie button is a defect:** extra author rings on those two controls are an enhancement, not evidence that links lack a visible indicator.
- **WCAG 2.4.13 Focus Appearance (AAA) / 1.4.11 on a custom ring:** not claimed; 1.4.11 applies to author-drawn component indicators. Default UA rings are 2.4.7’s G149 path.
- **Issue search** `focus OR outline OR focus-visible OR "keyboard focus"`: no matching issue. Closed a11y issues (#18/#22/#24 contrast, #20 lang, #34 toggle name, skip-bypass report-only) are different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [G149: Using user interface components that are highlighted by the user agent when they receive focus](https://www.w3.org/WAI/WCAG22/Techniques/general/G149)
- [F78: Failure of 1.4.11 and 2.4.7 due to styling that removes the focus indicator](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78)
- `app/components/qrati-demo.gts` (hero links, action pills, Contact CTA, footer nav)
- `app/styles/app.css` (`.theme-toggle:focus-visible`, `.footer-cookie-btn:focus-visible`; no link outline reset)

## Limitations

CodeGraph unindexed. No browser keyboard session; UA default ring presence is from CSS absence of F78 plus G149, not a captured screenshot.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T05:09:38Z | 2026-11-07T05:10:00Z | 10:39:38 | 10:40:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-07T05:10:29Z | 2026-11-07T05:15:30Z | 10:40:29 | 10:45:30 | 00:05:01 (5.0 min) |
| `delivery` | 2026-11-07T05:15:27Z | 2026-11-07T05:16:28Z | 10:45:27 | 10:46:28 | 00:01:01 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-07T05:09:38Z | 2026-11-07T05:16:28Z | 10:39:38 | 10:46:28 | **00:06:50 (6.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:26 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T050938Z-ace9422ea910459ca9bb39ca3fb7e556.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/69
- Base `main` `f7d4d9dbd52cf9ea50cda7e764a3b843a8e79c71` / head `bughunter/20261107T050938Z-ace9422ea910459ca9bb39ca3fb7e556-ember` `715344b42e3d157ea6b2ead5fac159b4fd9fd84f` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
