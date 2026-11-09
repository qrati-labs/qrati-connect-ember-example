# Ember host WCAG 1.4.12 text spacing

- **Scope:** WCAG 2.2 SC 1.4.12 Text Spacing on host-authored text: `.page-shell` / `.widget-frame` overflow, hero kicker/heading, action pills, answer/SEO/FAQ copy, footer nav, quickstart `pre`. Excludes embed internals / lightbox (20261107T012438Z), quickstart horizontal clip already fixed (#57), reduced-motion (20261107T061938Z), viewport zoom (20261107T115038Z), cookie-consent modal chrome, Iconify boxes (#38).
- **Base:** `origin/main` at `e3ee22887f497bbad3f268b535dd21c3cdbbbc0a`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T165738Z-d023892e61964939a0a257258e493a08-qrati-connect-ember-example`, `bughunter/20261109T165738Z-d023892e61964939a0a257258e493a08-ember`.
- **Run:** `20261109T165738Z-d023892e61964939a0a257258e493a08`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `QratiDemo`. Host copy lives in `app/components/qrati-demo.gts` (hero kicker + `h1`, action pills, gallery `sr-only` `h2`, answer/feature-map/SEO cards, FAQ `<details>`, Contact CTA, footer).
2. SC 1.4.12 (AA) requires no loss of content or functionality after a user sets **all** of: line-height ≥ 1.5× font size, paragraph spacing ≥ 2× font size, letter-spacing ≥ 0.12em, word-spacing ≥ 0.16em, changing no other property. Failures in [Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) are cut-off text (vertical/horizontal) and overlapping text. Authors need not ship these values; they must not clip when a user stylesheet/bookmarklet applies them.
3. Clip risks in `app/styles/app.css`:
   - `.page-shell { overflow: hidden }` (also `isolation: isolate`). No `max-height` / fixed height on `.page-shell`; in-flow growth expands the box. Horizontal clip would require a non-wrapping descendant wider than the shell.
   - `.widget-frame { overflow: hidden; border-radius: 2rem }` clips the embed chrome, not host paragraphs (lightbox already treated as body/fixed; 20261107T012438Z).
   - `.hero-kicker` is `display: inline-flex` (no wrap) with authored `letter-spacing: 0.28em`. The 1.4.12 test **sets** letter-spacing to 0.12em rather than adding to the author value, so the kicker becomes narrower, not wider.
   - `.hero h1` is a wrapping block (`line-height: 1.05` becomes 1.5 under the test). Longest tokens are ordinary English words.
   - `.action-pills` and `.footer nav` use `flex-wrap: wrap` with gaps.
   - `:root { line-height: 1.5 }` already matches the line-height floor; extra paragraph spacing lengthens the page without a height cap.
4. `.seo-section pre { overflow-x: auto }` is an intentional scroll box for the embed snippet (#57). Understanding 1.4.12 allows truncated/scroll regions when the full text remains available (here: horizontal scroll of the same `<code>`).
5. No host rule sets `white-space: nowrap` on paragraphs, `text-overflow: ellipsis` without a reveal, or `overflow: hidden` on a max-height text card. `prefers-reduced-motion` only zeros durations.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`.page-shell { overflow: hidden }` fails 1.4.12 by clipping spaced text:** not established from source. Auto-height in-flow blocks grow; the kicker’s letter-spacing decreases under the required override; pills/footer wrap. Horizontal clip of host copy is a residual layout risk, not a demonstrated cut-off.
- **Must treat `#57` as this failure:** that issue was UA `<pre>` overflow of the snippet at authored styles, already patched with `overflow-x: auto`. Distinct from user text-spacing on prose.
- **`inline-flex` kicker cannot wrap therefore fails:** contradicted by the SC’s *set-to* metrics (0.12em < authored 0.28em) and by the kicker sitting in a centered column with page-frame padding.
- **Need a browser bookmarklet session to claim a pass:** this run does not claim a live 1.4.12 pass; it claims no source-level invariant is shown to be violated. Unconfirmed clip is not filed as a defect.
- **Issue search** `text spacing OR 1.4.12 OR letter-spacing OR overflow hidden`: only closed #57 (quickstart `pre` clip). No duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- `app/components/qrati-demo.gts` (hero, pills, SEO/FAQ, footer)
- `app/styles/app.css` (`.page-shell`, `.hero-kicker`, `.hero h1`, `.action-pills`, `.footer nav`, `.seo-section pre`)

## Limitations

CodeGraph unindexed. No browser text-spacing bookmarklet session; sizes are from CSS, not captured overflow. No claim about cookie-consent modal or embed-internal text.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T165738Z-d023892e61964939a0a257258e493a08.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `e3ee22887f497bbad3f268b535dd21c3cdbbbc0a` / head `bughunter/20261109T165738Z-d023892e61964939a0a257258e493a08-ember`
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
