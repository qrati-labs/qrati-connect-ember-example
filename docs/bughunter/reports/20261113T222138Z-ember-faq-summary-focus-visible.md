# Ember host WCAG 2.4.7 focus visible (FAQ `<summary>`)

- **Scope:** WCAG 2.2 SC 2.4.7 Focus Visible (AA) for remaining host-authored keyboard targets in `QratiDemo` FAQ disclosures (`<details>` / `<summary>`), which the 2026-11-07 link-only 2.4.7 audit excluded. Excludes `<a>` chrome already covered (20261107T050938Z), theme-toggle / footer cookie button author rings, 2.4.13 focus appearance (20261110T182838Z), FAQ disclosure semantics (2026-10-18 / 20261110T204938Z), cookie-consent modal chrome, embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `681c0d6ca692cb5744943049ab46626568a22f35`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T222138Z-60cb99958bc5471aac456037fcec3edf-ember`, `bughunter/20261113T222138Z-60cb99958bc5471aac456037fcec3edf-ember`.
- **Run:** `20261113T222138Z-60cb99958bc5471aac456037fcec3edf`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not style focus.
2. FAQ chrome (`app/components/qrati-demo.gts`): section `aria-labelledby="faq-heading"` → four native `<details>` / `<summary>` pairs. First item has `open`. No `{{on}}` handlers, no `tabindex`, no `aria-expanded` (native disclosure). Summaries are keyboard-operable in supporting UAs (Enter/Space).
3. Host CSS (`app/styles/app.css`): `.faq-list summary { cursor: pointer; font-weight: 600 }`. Later C44 rule sets `.faq-list summary` `min-height`/`min-width` 44px (issue #148). No `:focus` / `:focus-visible` rule on `summary`, `details`, or `.faq-list`. Repo-wide host CSS has **no** `outline: none`, `outline: 0`, or equivalent reset.
4. Author `:focus-visible` rings exist only on `.theme-toggle` and `.footer-cookie-btn` (out of scope). Link 2.4.7 (20261107T050938Z) already treated missing author rings on `<a>` as G149, not F78.
5. Imported `vanilla-cookieconsent@3.1.0` CSS (fetched this run from jsDelivr) uses `outline: revert` / `outline-offset: 2px` on `#cc-main` controls and has no `:focus { outline: none }`. Consent chrome remains out of this FAQ scope; recorded only to confirm the host stylesheet import does not apply F78 to `summary`.
6. [WCAG 2.2 SC 2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible) (Level AA, Understanding fetched 2026-11-13): any keyboard-operable UI has a mode where the focus indicator is visible. [Understanding 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html): authors must provide at least one mode; UAs may show the indicator only for keyboard use. Sufficient [G149](https://www.w3.org/WAI/WCAG22/Techniques/general/G149): components highlighted by the user agent on focus. Failure [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) (fetched 2026-11-13): author CSS turns off or occludes the UA indicator (`:focus { outline: none }` class). Host FAQ summaries do not implement F78.

Authz/validation: public demo. Persistence: none on this path. Side effects: native open/close of `<details>`. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing author `:focus-visible` on FAQ `<summary>` fails 2.4.7:** contradicted by G149. Host CSS does not implement F78. Extra author rings on the theme toggle and cookie button are an enhancement, not evidence that summaries lack a visible indicator.
- **First FAQ `open` hides focus on that summary:** `open` is initial expanded state, not `display:none` / `tabindex=-1`. The summary remains in the tab order.
- **`min-height: 44px` / `overflow` on `.faq-list details` clips the UA ring:** details cards use padding and a 1px border; no `overflow: hidden` on `.faq-list` / `summary`. `.page-shell { overflow: hidden }` has no fixed height (prior 1.4.4/1.4.10 report-only).
- **Must match 2.4.13 AAA author ring size/contrast on summaries:** 2.4.13 is a different SC, already audited for the two author-drawn rings. This run is 2.4.7 AA.
- **FAQ disclosure semantics already covered this path:** prior FAQ audits checked activate/answer mapping, not 2.4.7 focus indication. Distinct SC; still no F78.
- **Issue search** `2.4.7 OR focus-visible OR "focus visible" OR FAQ summary OR outline`: no matching issue. Open set empty. Closed #148 is 2.5.5 target size on these summaries. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.4.7 Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible)
- [WCAG 2.2 Understanding SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) (W3C page retrieved 2026-11-13)
- [G149: Using user interface components that are highlighted by the user agent when they receive focus](https://www.w3.org/WAI/WCAG22/Techniques/general/G149)
- [F78: Failure of 1.4.11, 2.4.7 and 2.4.13 due to styling outlines/borders so the focus indicator is not visible](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) (W3C page retrieved 2026-11-13)
- `app/components/qrati-demo.gts` FAQ `<details>`/`<summary>`
- `app/styles/app.css` (`.faq-list summary`; no outline reset)
- Prior: link 2.4.7 (20261107T050938Z); FAQ disclosures (2026-10-18, 20261110T204938Z); 2.4.13 (20261110T182838Z); #148 target size

## Limitations

CodeGraph unindexed. No live keyboard session on `https://qrati.com/connect/ember-example`; claims are from host source plus WCAG 2.4.7 Understanding/F78 (fetched 2026-11-13). UA default ring appearance varies by browser and is not pixel-measured here.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T22:21:38Z | 2026-11-13T22:22:01Z | 03:51:38 | 03:52:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-13T22:22:27Z | 2026-11-13T22:29:51Z | 03:52:27 | 03:59:51 | 00:07:24 (7.4 min) |
| `delivery` | 2026-11-13T22:29:42Z | 2026-11-13T22:30:51Z | 03:59:42 | 04:00:51 | 00:01:09 (1.1 min) |
| **Total run (preflight start to finish)** | 2026-11-13T22:21:38Z | 2026-11-13T22:30:51Z | 03:51:38 | 04:00:51 | **00:09:13 (9.2 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:17 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T222138Z-60cb99958bc5471aac456037fcec3edf.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/178
- Base `main` `681c0d6ca692cb5744943049ab46626568a22f35` / head `bughunter/20261113T222138Z-60cb99958bc5471aac456037fcec3edf-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: Lint pending; Test pending; GitGuardian pass
- Local tests **NOT RUN BY BUGHUNTER**
