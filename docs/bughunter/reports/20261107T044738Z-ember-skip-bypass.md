# Ember host keyboard bypass to the live gallery

- **Scope:** Keyboard/AT path from first tab stop to the live embed (`theme-toggle` → hero chrome → `<main>` gallery). Checks WCAG 2.2 SC 2.4.1 Bypass Blocks (skip link vs landmarks/headings) on this single-route host. Excludes cookie-consent reopen (#28), theme-toggle position/label (#34, 2026-11-07 position audit), contact CTA, embed mount, JSON-LD.
- **Base:** `origin/main` at `46c31ce8ee1712447cb490740931bd9a2a2e8ad3`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T044738Z-bc3ed9c9033c4bb4a64e48c12d3d4a51-ember`, `bughunter/20261107T044738Z-bc3ed9c9033c4bb4a64e48c12d3d4a51-ember`.
- **Run:** `20261107T044738Z-bc3ed9c9033c4bb4a64e48c12d3d4a51`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `application.gts` renders `QratiDemo`. DOM order in `app/components/qrati-demo.gts`: theme-toggle button (first focusable), then `.page-shell` → `<header class="hero">` (kicker, `h1`, two Qrati links, GitHub/VS Code pills), then `<main class="content-shell">`.
2. First focusable in `<main>` is the live gallery (`<section class="widget-frame" aria-label="Interactive Ember Event Gallery">` + `sr-only` `h2` + `mountEmbed` host). Keyboard users reach it after the toggle plus four hero links (five tab stops). No in-page skip link (`href="#…"` / “skip to”) exists in the template or `index.html`.
3. Landmarks: `<header class="hero">` (banner), `<main>`, `<footer>` with `<nav aria-label="Footer navigation">`. Section headings (`h1` then `h2`/`h3`) mark gallery, answer, feature-map, SEO cards, quickstart, FAQ, CTA.
4. WCAG 2.2 SC 2.4.1 (Level A): “A mechanism is available to bypass blocks of content that are repeated on **multiple web pages**.” This host is a single Ember route (`app/router.ts` empty `Router.map`). Header/pills are not repeated across a set of pages. Understanding 2.4.1: skip-over of in-page repeated blocks is **helpful but not required** when the page is not in a set. Sufficient techniques include G1 (skip link) **or** grouping that can be skipped via [ARIA11 landmarks](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11) / [H69 headings](https://www.w3.org/WAI/WCAG22/Techniques/html/H69).
5. Theme-toggle CSS (`position: fixed` then later `absolute`) does not remove it from the tab order; it remains the first control. That is host chrome, not a broken skip target.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: none thrown.

## Falsification

- **Missing skip link fails 2.4.1:** contradicted by the SC text (repeated blocks **on multiple web pages**) and Understanding note that in-page skips are not required for a page that is not in a set. Landmarks + headings are listed sufficient techniques even when a skip link is absent.
- **Must skip to `#main` because the gallery is the product:** five tab stops of unique (not cross-page-repeated) hero chrome is not a demonstrated 2.4.1 failure. Adding a skip link would be an enhancement.
- **Sibling examples with skip links are an invariant:** not stated in this README or tests. Parity is not a violated host contract.
- **Issue search** `skip OR landmark OR bypass OR keyboard focus`: no matching open or closed issue for this workflow. Existing a11y issues (#20 lang, #34 toggle name, #18/#22/#24 contrast) are different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
- [ARIA11: Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11)
- [H69: Providing heading elements at the beginning of each section of content](https://www.w3.org/WAI/WCAG22/Techniques/html/H69)
- `app/components/qrati-demo.gts` (theme-toggle, header, main, gallery section)
- `app/templates/application.gts`, `app/router.ts`

## Limitations

CodeGraph unindexed. No browser keyboard or screen-reader run. No claim about AT landmark support in a specific UA.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T04:47:38Z | 2026-11-07T04:47:59Z | 10:17:38 | 10:17:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-07T04:48:33Z | 2026-11-07T04:52:43Z | 10:18:33 | 10:22:43 | 00:04:10 (4.2 min) |
| `delivery` | 2026-11-07T04:52:43Z | 2026-11-07T04:53:39Z | 10:22:43 | 10:23:39 | 00:00:56 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-07T04:47:38Z | 2026-11-07T04:53:39Z | 10:17:38 | 10:23:39 | **00:06:02 (6.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:34 (0.6 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T044738Z-bc3ed9c9033c4bb4a64e48c12d3d4a51.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/68
- Base `main` `46c31ce8ee1712447cb490740931bd9a2a2e8ad3` / head `bughunter/20261107T044738Z-bc3ed9c9033c4bb4a64e48c12d3d4a51-ember` `805e6503e827ff44d4f3751a528266a192166893` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending
