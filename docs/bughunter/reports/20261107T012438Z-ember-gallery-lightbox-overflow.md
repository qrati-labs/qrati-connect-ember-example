# Ember live gallery lightbox vs host overflow

- **Scope:** Host overflow clipping of the Qrati Connect full-screen lightbox. Paths: `.page-shell` / `.widget-frame` in `app/styles/app.css`; live gallery mount in `app/components/qrati-demo.gts`. Cross-repo contract: `qrati-connect-ts` PhotoSwipe `appendToEl` and global lightbox CSS. Excludes theme remount (#60), gallery heading (#26), hash routing, cookie-consent, webfonts.
- **Base:** `origin/main` at `be75faec841242b711ab139981b934f048ac36b5`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T012438Z-825ef4ad1e3c4a3aadba4d1262c302af-ember`, `bughunter/20261107T012438Z-825ef4ad1e3c4a3aadba4d1262c302af-ember`.
- **Run:** `20261107T012438Z-825ef4ad1e3c4a3aadba4d1262c302af`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` is `qrati-admin` with open PRs #121/#122. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` → `QratiDemo`. Live gallery is `<section class="widget-frame">` → `.widget-embed-host {{mountEmbed this.theme}}`.
2. `mountEmbed` injects classic `embed.js` once (`data-organization-id`, `data-router="hash"`, `data-theme`). Loader inserts `<qrati-connect>` next to the script (`qrati-connect-ts` `src/exports/embed.ts` `resolveMount`).
3. Host CSS: `.page-shell { isolation: isolate; overflow: hidden }` (later rule only restates `position: relative`). `.widget-frame { position: relative; overflow: hidden; border-radius: 2rem }` — rounded chrome clip, same pattern as sibling examples.
4. Widget contract: `element.tsx` `injectGlobalLightboxStyles()` documents PhotoSwipe as fullscreen in **document.body (light DOM)** and copies `photoswipe.css` into `document.head`. PhotoSwipe core appends `.pswp` to `options.appendToEl || document.body` (`photoswipe.js`). `.pswp` is `position: fixed; inset 0; z-index: 100000` with `transform: translateZ(0)`.
5. Gallery click path (`MediaGallery.tsx`) sets `appendToEl: portalContainer ?? document.body`. `portalContainer` is `#qrati-connect-container` inside the widget tree (`SessionContext.tsx`), not the host overflow boxes themselves.
6. Host ancestors do not set `transform`, `filter`, `perspective`, `contain`, or `will-change` on `.page-shell` / `.widget-frame`. Those properties are what CSS uses to replace the viewport as a `position: fixed` containing block. `isolation: isolate` creates a stacking context only.

Authz/validation/persistence: none (public demo). Side effects: embed script + PhotoSwipe portal (inside widget, not host JS).

## Falsification

- **Host `overflow: hidden` clips `position: fixed` lightbox:** not established. Overflow clip applies to the fixed box only when an ancestor is its containing block. Cited host rules do not establish that block. Quickstart overflow (#57) was UA `pre` + `.page-shell` overflow of in-flow text, not a fixed overlay.
- **Lightbox is a descendant of `.widget-frame` therefore clipped:** PhotoSwipe is `position: fixed`; element loader comment states body/light-DOM mount; global pswp CSS is injected on `document.head` specifically so a body-level overlay can be styled. `appendToEl: portalContainer` is widget-internal; a clip there would be a connect-ts portal choice, not a missing host rule.
- **Must drop `.widget-frame` overflow to match README “full-screen lightbox”:** overflow is the border-radius clip used across examples. Changing it without a reproduced clip is speculative cleanup.
- **Safari/overflow quirks:** possible residual risk; not observed here (no browser session).

Issue search `lightbox OR overflow OR photoswipe OR widget-frame` in this repo: #26 (heading remount) and #57 (quickstart `pre`) only — neither is this overlay path.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [CSS Positioned Layout — fixed containing block](https://www.w3.org/TR/css-position-3/#fixed-pos)
- `qrati-connect-ts` `src/exports/element.tsx` `injectGlobalLightboxStyles`
- `qrati-connect-ts` `src/libs/photoswipe/photoswipe.js` `appendToEl || document.body`
- `qrati-connect-ts` `src/pages/contents/_components/MediaGallery.tsx` lightbox options
- `app/styles/app.css` `.page-shell` / `.widget-frame`
- `app/components/qrati-demo.gts` `mountEmbed`

## Limitations

CodeGraph unindexed. No browser session; public example URL has previously 404’d. Overlay clip not live-toggled.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T01:24:38Z | 2026-11-07T01:25:00Z | 06:54:38 | 06:55:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-07T01:25:15Z | 2026-11-07T01:31:35Z | 06:55:15 | 07:01:35 | 00:06:19 (6.3 min) |
| `delivery` | 2026-11-07T01:31:35Z | 2026-11-07T01:32:12Z | 07:01:35 | 07:02:12 | 00:00:37 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-07T01:24:38Z | 2026-11-07T01:32:12Z | 06:54:38 | 07:02:12 | **00:07:34 (7.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:16 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T012438Z-825ef4ad1e3c4a3aadba4d1262c302af.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/62
- Base `main` `be75faec841242b711ab139981b934f048ac36b5` / head `bughunter/20261107T012438Z-825ef4ad1e3c4a3aadba4d1262c302af-ember` (timing-table commit follows)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at PR open: Lint/Test/Workers/GitGuardian pending
