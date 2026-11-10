# Ember host WCAG 2.4.10 section headings

- **Scope:** WCAG 2.2 SC 2.4.10 Section Headings (AAA) for host-authored written sections in `QratiDemo`. Excludes 2.4.6 headings/labels (20261109T200338Z), 1.3.1 info and relationships (20261109T210738Z), 2.4.1 bypass (20261107T044738Z), 4.1.2 name/role/value (20261110T000039Z), cookie-consent modal chrome (library-owned), embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `fb1893ee226860365abe616cef53c280548caafe`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T193838Z-0241b0de0b744076a0b75f5fe002dc48-qrati-connect-ember-example`, `bughunter/20261110T193838Z-0241b0de0b744076a0b75f5fe002dc48-ember-embed`.
- **Run:** `20261110T193838Z-0241b0de0b744076a0b75f5fe002dc48`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Written content lives in `app/components/qrati-demo.gts`.
2. [SC 2.4.10](https://www.w3.org/WAI/WCAG22/Understanding/section-headings) (AAA): where content is organized into sections, section headings are used. “Heading” includes titles and other ways to introduce a section. The SC covers sections within writing, not user interface components (those are 4.1.2). Sufficient: G141 / H69 — heading elements at the beginning of each section.
3. Host sections and their headings:
   - `<header class="hero">`: `h1` “Qrati Connect inside an Ember host site”
   - `<section class="widget-frame" aria-label="Interactive Ember Event Gallery">`: `h2.sr-only` “Live Event Photo Gallery Component”
   - `<section class="answer-section">`: `h2` “What does Qrati Connect add to Ember?”
   - `<section class="seo-section" aria-labelledby="feature-map-heading">`: `h2#feature-map-heading` plus `h3` cards (Embed cleanly, Run the event, Show every memory, Collect uploads, Make it social, Keep people safe)
   - `<section class="seo-section" aria-labelledby="features-heading">`: `h2#features-heading` plus `h3` cards (Live photo wall, Guest uploads, Reactions and contests, Framework-friendly)
   - `<section class="seo-section" aria-labelledby="quickstart-heading">`: `h2#quickstart-heading` “Embed in 3 simple steps”
   - `<section class="seo-section" aria-labelledby="faq-heading">`: `h2#faq-heading` “Frequently asked questions”
   - `<section class="seo-section seo-cta-section">`: `h2` “Give every event a place to come alive.”
4. FAQ items are native `<details>`/`<summary>` controls (UI components, 4.1.2), nested under the FAQ `h2`. Theme toggle, Cookie Preferences, and links are controls, not written sections.
5. Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not strip or inject headings.

Authz: none (public demo). Persistence: none on this path. Side effects: none from heading markup. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **sr-only gallery `h2` is not a heading:** it is an `h2` in the accessibility tree; visual hiding does not remove the section title (H69).
- **`answer-section` / CTA lack `aria-labelledby`:** 2.4.10 requires a heading for the section, not a labelled landmark. Both have an `h2`.
- **FAQ questions must be `h3`s:** Understanding note 2: UI components are 4.1.2. The FAQ writing section has `h2#faq-heading`; each disclosure is a control.
- **Missing headings on footer / action pills:** those are navigation/chrome, not written-content sections.
- **Level skip `h1` → `h2` → `h3` is a 2.4.10 fail:** levels are sequential; no `h1`→`h3` skip. 1.3.1 already covered landmark/heading markup (20261109T210738Z).
- **Issue search** `section headings OR 2.4.10 OR heading hierarchy`: no matching issue. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.10 Section Headings](https://www.w3.org/WAI/WCAG22/Understanding/section-headings)
- `app/components/qrati-demo.gts` section/`h1`–`h3` markup
- Prior: 2.4.6 headings and labels (20261109T200338Z); 1.3.1 info and relationships (20261109T210738Z); 2.4.1 skip/bypass (20261107T044738Z)

## Limitations

CodeGraph unindexed. No assistive-technology heading-navigation session. Embed shadow tree and cookie-consent modal titles are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T19:38:38Z | 2026-11-10T19:39:02Z | 01:08:38 | 01:09:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-10T19:39:27Z | 2026-11-10T19:44:14Z | 01:09:27 | 01:14:14 | 00:04:48 (4.8 min) |
| `delivery` | 2026-11-10T19:44:14Z | 2026-11-10T19:45:11Z | 01:14:14 | 01:15:11 | 00:00:56 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-10T19:38:38Z | 2026-11-10T19:45:11Z | 01:08:38 | 01:15:11 | **00:06:33 (6.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:25 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T193838Z-0241b0de0b744076a0b75f5fe002dc48.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

IST dates are 2026-11-11 (UTC+05:30).

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/145
- Base `main` `fb1893ee226860365abe616cef53c280548caafe` / head `bughunter/20261110T193838Z-0241b0de0b744076a0b75f5fe002dc48-ember-embed` `65c1cdc2e52c6c700ddcfb8e4ffdc42eb921869a` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
