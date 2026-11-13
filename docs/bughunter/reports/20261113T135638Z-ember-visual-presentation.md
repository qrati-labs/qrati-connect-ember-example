# Ember host WCAG 1.4.8 visual presentation

- **Scope:** WCAG 2.2 SC 1.4.8 Visual Presentation (AAA) for host-authored blocks of text in `QratiDemo`: hero copy, short-answer, feature-map / SEO cards, FAQ, Contact CTA, footer notes; plus author colors, line length, justification, leading / paragraph spacing, and 200% resize / reflow. Excludes 1.4.4 viewport zoom (20261107T115038Z), 1.4.10 reflow (20261109T174738Z), 1.4.12 text spacing (20261109T165738Z), 1.4.5 images of text (20261110T101738Z), 1.4.6 contrast enhanced (20261113T120438Z), embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome.
- **Base:** `origin/main` at `15198205d6871268239efcd5c1e3c8e300b26341`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T135638Z-3097f86435e5453fa099e4f739220083-qrati-connect-ember-example`, `bughunter/20261113T135638Z-3097f86435e5453fa099e4f739220083-ember`.
- **Run:** `20261113T135638Z-3097f86435e5453fa099e4f739220083`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 1.4.8. Default author CSS does not implement every listed presentation value (80-character measure, paragraph spacing ≥ 1.5× leading). SC 1.4.8 Note 1 requires a *mechanism*, which may be the user agent; content is not required to ship those values or an in-page style switcher. Nothing in this host blocks browser zoom, reader mode, or user styles for blocks of text.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single history index). Blocks of text live in `app/components/qrati-demo.gts` (hero copy, answer paragraph, section intro, feature/SEO/FAQ/CTA copy). Headings, kickers, and single-line chrome are not blocks of text.
2. Colors: `[data-theme='light'|'dark']` sets `--page-text`, `--page-muted`, `--page-heading`, `--page-bg` / page gradients. `.btn-cta-primary` uses `color:#fff!important` over `--cta-bg`. Author palettes are present; they do not disable UA color override (forced-colors / user stylesheet / reader mode).
3. Measure: `.hero-copy { max-width: 44rem; font-size: 1rem }`. At 16px that is 704px, typically slightly over 80 glyphs for Inter. `.faq-list` is `max-width: 48rem`. `.page-frame` is `max-width: 72rem`. No `max-width: 80ch`. SC Note 1: default need not be 80ch if a UA mechanism exists.
4. Justification: no `text-align: justify`. Hero / `.seo-section` use `text-align: center`; feature cards / FAQ bodies use `text-align: left`.
5. Leading: `:root { line-height: 1.5 }` (space-and-a-half). `.hero-copy` 1.75; answer / intro / card / FAQ / CTA paragraphs 1.7. `.hero h1 { line-height: 1.05 }` is heading, not a block of text.
6. Paragraph spacing: no global `p { margin: 0 }`. UA default ~1em around paragraphs. FAQ / card copy is typically one paragraph per block. 1.4.8’s 1.5× leading value is not authored; UA reader/user styles remain available.
7. Resize / reflow: `index.html` viewport is `width=device-width, initial-scale=1` (no `user-scalable=no` / `maximum-scale`). Host layout uses `%` / `rem` / `clamp` / wrapping flex-grid. Horizontal scroll for *reading a line* is already scoped under 1.4.4 / 1.4.10; those audits found no host lockout. Quickstart `<pre>` uses `overflow-x: auto` (issue #57); that is a code snippet, not a prose line.
8. SC 1.4.8 (AAA): “a mechanism is available to achieve” the five presentation aspects. [Understanding 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) Note 1: content is not required to use the values; the mechanism can be the browser; content is not required to provide it.

Authz/validation/persistence: none (public demo). Side effects: visual presentation only. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Default 44rem / 48rem prose is a 1.4.8 failure:** contradicted by Note 1. The SC is a mechanism requirement, not a default-measure mandate.
- **`color:#fff!important` on the Contact CTA blocks user color selection for all blocks of text:** the `!important` is one control, not host body copy. G156 (HTML/CSS in UAs that can restyle text) still holds for blocks of text. Forced-colors was already report-only (20261107T112538Z).
- **Must ship an in-page text-style switcher:** Understanding allows the user agent. No host script disables zoom, reader mode, or user stylesheets.
- **`text-align: center` fails 1.4.8:** the SC forbids *justified* (both margins), not centering.
- **`.hero h1` line-height 1.05 fails leading:** not a block of text (single heading, not multi-sentence prose).
- **1.4.4 / 1.4.10 / 1.4.12 already covered this, so 1.4.8 cannot be this run’s workflow:** those SCs are resize, 320px reflow, and author-adjustable spacing. 1.4.8 is the AAA visual-presentation *mechanism* set; traced here against primary Understanding text.
- **Issue search** `1.4.8 OR visual presentation OR 80 characters OR line spacing OR justified`: no matching issue (open set empty). Closed contrast/reflow issues (#18/#22/#24/#57) are different paths. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.8 Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
- [WCAG 2.2 SC 1.4.8](https://www.w3.org/TR/WCAG22/#visual-presentation)
- `app/styles/app.css` (`:root` line-height 1.5; `.hero-copy` 44rem / 1.75; no `text-align: justify`)
- `index.html` viewport (zoom not locked)
- `app/components/qrati-demo.gts` (prose blocks)
- Prior: viewport zoom (20261107T115038Z); reflow (20261109T174738Z); text spacing (20261109T165738Z)

## Limitations

CodeGraph unindexed. No browser session at 200% zoom or with a user stylesheet; claims are from host CSS/markup and WCAG 1.4.8 Understanding Note 1. Live `https://qrati.com/connect/ember-example` was not used as evidence.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T13:56:38Z | 2026-11-13T13:57:02Z | 19:26:38 | 19:27:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-13T13:57:22Z | 2026-11-13T14:01:40Z | 19:27:22 | 19:31:40 | 00:04:19 (4.3 min) |
| `delivery` | 2026-11-13T14:01:40Z | 2026-11-13T14:02:15Z | 19:31:40 | 19:32:15 | 00:00:34 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-13T13:56:38Z | 2026-11-13T14:02:15Z | 19:26:38 | 19:32:15 | **00:05:37 (5.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:20 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T135638Z-3097f86435e5453fa099e4f739220083.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/158
- Base `main` `15198205d6871268239efcd5c1e3c8e300b26341` / head `bughunter/20261113T135638Z-3097f86435e5453fa099e4f739220083-ember`
- `closingIssuesReferences`: none
