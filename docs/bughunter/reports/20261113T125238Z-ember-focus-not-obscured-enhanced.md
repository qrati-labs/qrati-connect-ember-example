# Ember host WCAG 2.4.12 focus not obscured (enhanced)

- **Scope:** WCAG 2.2 SC 2.4.12 Focus Not Obscured (Enhanced) for host-authored keyboard targets in `QratiDemo` versus author-created overlays: vanilla-cookieconsent first-layer box (`#cc-main .cm`) and host `.theme-toggle`. Excludes 2.4.11 Minimum (20261109T194038Z), 2.4.7 / 2.4.13 focus appearance (20261107T050938Z, 20261110T182838Z), first-layer consent chrome (20261107T072738Z), embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `3a10a6103fb2a0e541669101a560e64c3287d304`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T125238Z-c5b30c0f69fe455697c6c56f90de193e-ember`, `bughunter/20261113T125238Z-c5b30c0f69fe455697c6c56f90de193e-ember`.
- **Run:** `20261113T125238Z-c5b30c0f69fe455697c6c56f90de193e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main'`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Partial overlap of a sticky cookie banner with focused footer controls is **plausible** from CSS (same geometry 2.4.11 declined to measure). That is not a pixel-proven 2.4.12 failure, and this host does not claim AAA 2.4.12.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single history index).
2. Host focusable controls (`app/components/qrati-demo.gts`) in source order: `.theme-toggle`, hero `qrati.com` anchors, GitHub/VS Code `.action-pills`, FAQ `<summary>`s, Contact `.btn-cta-primary`, footer nav anchors, `.footer-cookie-btn`. No host `tabindex`. No host sticky header/footer. `.footer` is in-flow (`padding-bottom: 0.5rem`). At `min-width: 640px`, `.footer-meta { align-items: flex-end }`.
3. Overlays:
   - `.theme-toggle`: `position: fixed; z-index: 100` then later Pilot rule `position: absolute; z-index: 1` (`app/styles/app.css`). Later same-specificity wins → absolute inside `.page-shell { position: relative }`. Not viewport-sticky while scrolling. Toggle is first in tab order; hero/pills are centered.
   - Cookie first-layer: `CookieConsent.run` does not set `guiOptions`, `disablePageInteraction`, or host `scroll-padding` (`app/lib/cookieConsent.ts`). vanilla-cookieconsent **3.1.0** defaults: `layout: box`, `position: bottom right`; `disablePageInteraction: false`. Published CSS: `#cc-main { position: fixed; z-index: var(--cc-z-index, 2147483647) }`; `.cm { position: fixed; max-width: 24rem }`; `.cm--bottom` / `.cm--right` with `--cc-modal-margin: 1rem`. At `max-width: 640px`, `.cm { max-width: none; width: auto }` (not `.cm--bar` full-bleed). Host `#cc-main` rules set color tokens only.
4. `autoShow: required` with geo fail-closed (`checkConsentRequired` → `true` on non-OK / non-boolean / throw). Banner can appear without a user gesture. Understanding note for user-opened content does not apply.
5. SC 2.4.12 (AAA): when a component receives keyboard focus, **no part** of the component is hidden by author-created content. [Understanding 2.4.12](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html): a cookie banner fails if it **partially** covers a focused control. Sufficient patterns: modal banner (`disablePageInteraction`) or [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43) `scroll-padding`. Host sets neither. 2.4.11 already allowed partial obscuring at AA (20261109T194038Z) and left 2.4.12 unclaimed.

Authz/validation/persistence: none (public demo). Side effects: theme persist, cookie preferences, outbound links. Errors: none thrown by overlay geometry.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Bottom-right 24rem banner partially covers right-aligned footer nav / Cookie Preferences, so file like 2.5.5 AAA:** Understanding names that failure class, but intersection was not measured in a viewport (same limit as 2.4.11, which refused even the stronger “entirely hidden” claim). CSS makes overlap *possible* when the in-flow footer is scrolled to the viewport bottom with `scroll-padding: 0`; it does not prove a specific control’s box is covered.
- **Missing `disablePageInteraction` / `scroll-padding-bottom` is itself 2.4.12:** those are documented *ways of passing*, not required techniques. Absence without a measured covered target is not a confirmed failure.
- **AAA unclaimed is still a WG failure (2.5.5 / 3.2.5):** those had source-measurable invariants (44×44 boxes; `target=_blank` without a new-tab name). 2.4.12 needs a covered focused component. Inventing `scroll-padding-bottom: 16rem` without a banner height would be a palette-style guess, not a narrow correction.
- **Theme-toggle covers later targets:** contradicted by Pilot `position: absolute` (not sticky) and centered hero/pills; toggle is first in tab order.
- **Issue search** `2.4.12 OR scroll-padding OR “focus not obscured”`: no matching issue (open set empty). 2.4.11 report-only. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.12 Focus Not Obscured (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html)
- [WCAG 2.2 SC 2.4.12](https://www.w3.org/TR/WCAG22/#focus-not-obscured-enhanced)
- [C43: Using CSS scroll-padding to un-obscure content](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)
- [CookieConsent configuration](https://cookieconsent.orestbida.com/reference/configuration-reference.html) (`guiOptions.consentModal`, `disablePageInteraction`)
- vanilla-cookieconsent v3.1.0 `dist/cookieconsent.css` (`#cc-main` fixed, `.cm` max-width 24rem, `.cm--bottom` / `.cm--right`)
- `app/lib/cookieConsent.ts`; `app/styles/app.css`; `app/components/qrati-demo.gts`
- Prior: 2.4.11 (20261109T194038Z)

## Limitations

CodeGraph unindexed. No keyboard/layout session; overlay vs target intersection is inferred from host CSS plus published 3.1.0 consent CSS, not a captured viewport. Live `https://qrati.com/connect/ember-example` was not used as evidence.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T12:52:38Z | 2026-11-13T12:53:02Z | 18:22:38 | 18:23:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-13T12:53:30Z | 2026-11-13T12:57:13Z | 18:23:30 | 18:27:13 | 00:03:43 (3.7 min) |
| `delivery` | 2026-11-13T12:57:08Z | 2026-11-13T12:58:05Z | 18:27:08 | 18:28:05 | 00:00:57 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-13T12:52:38Z | 2026-11-13T12:58:05Z | 18:22:38 | 18:28:05 | **00:05:27 (5.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T125238Z-c5b30c0f69fe455697c6c56f90de193e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/155
- Base `main` `3a10a6103fb2a0e541669101a560e64c3287d304` / head `bughunter/20261113T125238Z-c5b30c0f69fe455697c6c56f90de193e-ember`
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
