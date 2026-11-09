# Ember host WCAG 1.1.1 non-text content

- **Scope:** WCAG 2.2 SC 1.1.1 Non-text Content for host-authored images, inline SVG, Iconify hosts, and text-as-glyph chrome on the Ember example: `QratiDemo`, `index.html` document images, `app/lib/cookieConsent.ts` close control name. Excludes embed internals (`qrati-connect` / `embed.js` gallery photos), favicon/OG crawler assets as page content, 1.4.11 non-text contrast (20261109T181138Z), Iconify loader/fetch (20261107T021238Z), reserved icon box (#38), footer brand image layout (2026-10-21).
- **Base:** `origin/main` at `fa8889fd08359c01a17fe1667c1ee1b432b65651`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T233938Z-a0431959b06649dfbf001581939353db-ember`, `bughunter/20261109T233938Z-a0431959b06649dfbf001581939353db-ember`.
- **Run:** `20261109T233938Z-a0431959b06649dfbf001581939353db`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Visual host chrome is `app/components/qrati-demo.gts` plus `index.html` head assets.
2. [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content) (Level A): non-text content presented to the user has a text alternative that serves the equivalent purpose, except when it is decorative / formatting / invisible, in which case it is implemented so assistive technology can ignore it ([Understanding 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)).
3. Meaningful image: footer `<img src="https://assets.qrati.com/images/qrati-connect-logo-square.png" alt="Qrati Connect logo">` next to visible “Qrati Connect” wordmark. Nonempty `alt` names the brand mark (H37).
4. Decorative inline SVG: GitHub and VS Code action-pill icons are `<svg aria-hidden="true">` beside visible `<span>View on GitHub</span>` / `<span>Open in VS Code</span>`. Adjacent name carries the purpose (ARIA decorative).
5. Iconify: ten `<iconify-icon icon="material-symbols:…">` hosts — six beside visible `h3` in `.feature-map-heading`, four as first children of `.seo-feature-card` that also have `h3` + `p`. No `aria-label` / `title`. Iconify Icon 2.1.0 (deferred in `index.html`) renders SVG in shadow DOM; prior fetch of the 2.1.0 bundle found no default `aria-hidden`. Hosts are unnamed custom elements with empty light DOM, redundant with adjacent headings. No screen-reader session this run; not claimed as 1.1.1 (same reading as feature-map 20261106T224738Z and Iconify-script 20261107T021238Z).
6. Text glyphs, not images: theme toggle `☀ Light` / `🌙 Dark` (visible name after #34); answer-point `✓` prefixes; Contact CTA `Contact Qrati →`. These are characters, not `<img>` / SVG.
7. Cookie-consent close control: `preferencesModal.closeIconLabel: 'Close'` is the accessible name for the library close affordance. No host-authored consent imagery.
8. `index.html`: SVG/PNG favicons and `og:image` / `twitter:image` are browser chrome / social crawler tags, not in-page non-text. Worker (`src/worker.ts`) only rewrites HTML/GTM placeholders.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `aria-hidden` on `iconify-icon` fails 1.1.1:** not evidenced. Unnamed custom elements with empty light DOM typically expose no image name; adjacent `h3` already names each card. No AT capture. Hardening, not a confirmed failure.
- **Footer logo `alt` duplicates visible “Qrati Connect”:** redundant alt on a brand image is allowed; empty `alt` would hide a standalone logo if the wordmark failed to load. Not a violated invariant.
- **Favicon / OG PNG lack in-page alt:** not presented as page content. OG image alt tags were already a separate report-only audit (20261107T084238Z).
- **Issue search** `1.1.1 OR alt OR non-text OR iconify aria`: closed #38 (reserved size), #34 (theme-toggle label-in-name), contrast issues. No open 1.1.1 issue. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)
- [Iconify Icon web component](https://iconify.design/docs/iconify-icon/)
- `app/components/qrati-demo.gts`
- `index.html`
- `app/lib/cookieConsent.ts` (`closeIconLabel`)

## Limitations

CodeGraph unindexed. No screen-reader or accessibility-tree session; decorative Iconify exposure is inferred from host markup and prior 2.1.0 bundle inspection, not a live AT log. Embed-internal gallery images not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-09T23:39:38Z | 2026-11-09T23:40:00Z | 05:09:38 | 05:10:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-09T23:40:23Z | 2026-11-09T23:44:04Z | 05:10:23 | 05:14:04 | 00:03:42 (3.7 min) |
| `delivery` | 2026-11-09T23:44:04Z | 2026-11-09T23:44:50Z | 05:14:04 | 05:14:50 | 00:00:46 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-09T23:39:38Z | 2026-11-09T23:44:50Z | 05:09:38 | 05:14:50 | **00:05:12 (5.2 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:23 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T233938Z-a0431959b06649dfbf001581939353db.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/99
- Base `main` `fa8889fd08359c01a17fe1667c1ee1b432b65651` / head `bughunter/20261109T233938Z-a0431959b06649dfbf001581939353db-ember` `4dbd3a21994a85f782b3baf4f8692d43412250e1` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; Lint/Test queued; Workers Builds in progress
- Local tests **NOT RUN BY BUGHUNTER**
