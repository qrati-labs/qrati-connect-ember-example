# Ember host FAQ disclosures (post 2.5.5 target-size CSS)

- **Scope:** Host FAQ accordion in `QratiDemo`: native `<details>` / `<summary>` expand-collapse, first-item `open`, names, keyboard, and interaction with the 2.5.5 `min-height`/`min-width: 44px` rule on `.faq-list summary`. Excludes cookie-consent, embed mount, theme toggle, Contact CTA, 2.5.5 target-size itself (#148), 2.4.7 focus-visible on links (20261107T050938Z).
- **Base:** `origin/main` at `f108cd119b80eda5e1b748ddd95f0968a9044c11`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T204938Z-10fb21f517d54319ab433267a712e9c8-ember`, `bughunter/20261110T204938Z-10fb21f517d54319ab433267a712e9c8-ember`.
- **Run:** `20261110T204938Z-10fb21f517d54319ab433267a712e9c8`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. FAQ lives in `<section class="seo-section" aria-labelledby="faq-heading">` with `h2#faq-heading` “Frequently asked questions” (`app/components/qrati-demo.gts`).
2. Four native `<details>` in `.faq-list`. The first has the `open` attribute; the rest start collapsed. Each `<summary>` is the full question text; the following `<p>` is the answer. No Ember actions, modifiers, or ARIA `expanded`/`controls` on this path.
3. HTML: `<details>` is a disclosure widget; `<summary>` is the control. Keyboard: Enter and Space toggle while summary is focused ([HTML living standard — the `details` element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)). Assistive tech gets an implicit disclosure role from the native elements ([ARIA APG disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)).
4. Host CSS (`app/styles/app.css`): `.faq-list details` is a padded card; `summary { cursor: pointer; font-weight: 600 }`. After #148, `.faq-list summary` is included in the 2.5.5 group (`box-sizing: border-box; min-height: 44px; min-width: 44px`) but is **not** switched to `inline-flex` (that display change is only `.footer nav a` / `.footer-cookie-btn`), so the UA `list-item` disclosure marker remains.
5. `@media (prefers-reduced-motion: reduce)` zeros transition/animation duration globally; `<details>` open/close is not a CSS animation on this host.
6. Authz/validation/persistence: none (public static copy). Side effects: none (no analytics or navigation). Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **2.5.5 `min-height: 44px` on `summary` removes the disclosure triangle or blocks toggle:** contradicted by keeping UA `list-item` (explicit in #148). `min-height`/`min-width` do not change `display` or remove the `details`/`summary` activation behavior.
- **First FAQ `open` is a broken accordion (cannot collapse / only one open):** native `<details>` groups are independent; `open` is the HTML default-open flag, not a JS-enforced single-expand. User can collapse the first item and open any combination.
- **Missing `aria-expanded` fails 4.1.2:** native `details`/`summary` expose name, role, and expanded state. Prior name-role-value audit (20261110T000039Z) did not claim this host control.
- **Answers contradict the README embed contract:** first answer (“Inject the Qrati Connect embed script with your organization ID”) matches README / `mountEmbed` (`embed.js` + `data-organization-id`). Subscription / upload / contest answers match the surrounding host copy; not a code-path failure.
- **Oct 18 / Oct 22 FAQ report-only audits are stale after #148:** the only FAQ CSS change since those runs is the 44px min box on `summary`. No new handler, markup, or `open` semantics.
- **Issue search** `faq OR disclosure OR details OR summary`: no open issue. Closed hits (#148 target size, #36 quickstart, #20 lang, others) are different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). Existing `tests/unit/target-size-enhanced-test.ts` already requires `.faq-list summary` in the 44px group. `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [HTML living standard — `details`](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)
- [ARIA APG — Disclosure (Show/Hide)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- `app/components/qrati-demo.gts` FAQ `<details>` / `<summary>`
- `app/styles/app.css` `.faq-list` + 2.5.5 summary min box (#148)
- Prior: 2026-10-18 / 2026-10-22 FAQ report-only; #148

## Limitations

CodeGraph unindexed. No browser session. Public `https://qrati.com/connect/ember-example` historically 404; deployment availability out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: to be opened
- `closingIssuesReferences`: none
- Assignees none (repo unmapped; no guessed owner)
- Local tests **NOT RUN BY BUGHUNTER**
