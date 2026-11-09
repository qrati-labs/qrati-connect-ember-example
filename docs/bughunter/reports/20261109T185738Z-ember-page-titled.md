# Ember host WCAG 2.4.2 page titled

- **Scope:** WCAG 2.2 SC 2.4.2 Page Titled on the Ember example host document: static `<title>` in `index.html`, `ember-page-title` in the application template, and the single history index route. Excludes social `og:title` / `twitter:title` (2026-11-06 social-head / #16), `html lang` (#20), JSON-LD identity (20261107T042538Z), rootURL vs Vite base (20261107T040238Z), embed hash routing, cookie-consent chrome.
- **Base:** `origin/main` at `de05a2f822e9224f13e590b89047375e03f70bfd`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T185738Z-a8afbc0a74a04797a683a2e045467292-ember`, `bughunter/20261109T185738Z-a8afbc0a74a04797a683a2e045467292-ember`.
- **Run:** `20261109T185738Z-a8afbc0a74a04797a683a2e045467292`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: crawlers and the first paint read `index.html` `<title>Qrati Connect — Ember Example</title>` (line 29). The same file’s `og:title` / `twitter:title` repeat that string (out of scope except as corroboration).
2. After boot, `app/templates/application.gts` is the only route template (`app/router.ts` `Router.map` is empty). It calls `{{pageTitle "Qrati Connect — Ember Example"}}` via `ember-page-title` 9.0.3 (`package.json`), then renders `<QratiDemo />`.
3. SC 2.4.2 (A): web pages have titles that describe topic or purpose. [Understanding 2.4.2](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html). Sufficient techniques: [H25](https://www.w3.org/WAI/WCAG22/Techniques/html/H25) (`title` in `head`) and [G88](https://www.w3.org/WAI/WCAG22/Techniques/general/G88) (descriptive title).
4. The title names the product (Qrati Connect) and the host (Ember Example). That matches the visible hero (`Qrati Connect inside an Ember host site`) and the canonical URL `https://qrati.com/connect/ember-example`.
5. One `pageTitle` token, identical to the static `<title>`. `ember-page-title` joins registered tokens; it does not append the HTML title as an extra token. Runtime `document.title` is expected to remain the same string, not `… | …`.
6. `tests/index.html` uses `QratiConnectEmberExample Tests` (test harness only; not the public page).

Authz/validation/persistence: none (public demo). Side effects: `ember-page-title` writes `document.title` after boot. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing / empty `<title>` (F25):** contradicted by `index.html` line 29 and the non-empty `pageTitle` argument.
- **Generic scaffold title (“Ember App”, package `description`):** the document title is not `package.json`’s “Small description for qrati-connect-ember-example goes here”. It identifies Qrati Connect and the Ember example.
- **Duplicate concatenation after boot:** only one `pageTitle` call exists; its string equals the static title. No second token in a child route (empty `Router.map`).
- **Multi-page uniqueness required:** the host exposes a single application index. 2.4.2 does not require distinct titles across non-existent routes.
- **`og:title` / JSON-LD absence fails 2.4.2:** 2.4.2 is the document title. Social tags and JSON-LD were prior, separate audits.
- **Issue search** `title OR pageTitle OR 2.4.2`: closed #16 (OG image) and #20 (`lang`). No open duplicate. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.2 Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)
- [WCAG 2.2 SC 2.4.2](https://www.w3.org/TR/WCAG22/#page-titled)
- [G88](https://www.w3.org/WAI/WCAG22/Techniques/general/G88) / [H25](https://www.w3.org/WAI/WCAG22/Techniques/html/H25)
- `index.html` (`<title>`)
- `app/templates/application.gts` (`pageTitle`)
- `app/router.ts` (empty map)
- `package.json` (`ember-page-title` 9.0.3)

## Limitations

CodeGraph unindexed. No browser session to observe post-boot `document.title`. Live `https://qrati.com/connect/ember-example` was not used as evidence this run. `ember-page-title` join behavior was taken from the addon’s token model (v9) plus this repo having a single token, not from executing the addon.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-09T18:57:38Z | 2026-11-09T18:58:02Z | 00:27:38 | 00:28:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-09T18:58:23Z | 2026-11-09T19:01:22Z | 00:28:23 | 00:31:22 | 00:02:59 (3.0 min) |
| `delivery` | 2026-11-09T19:01:22Z | 2026-11-09T19:02:23Z | 00:31:22 | 00:32:23 | 00:01:00 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-09T18:57:38Z | 2026-11-09T19:02:23Z | 00:27:38 | 00:32:23 | **00:04:45 (4.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:21 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T185738Z-a8afbc0a74a04797a683a2e045467292.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/89
- Base `main` `de05a2f822e9224f13e590b89047375e03f70bfd` / head `bughunter/20261109T185738Z-a8afbc0a74a04797a683a2e045467292-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: CI Lint queued; CI Test queued; Workers Builds in progress
- Local tests **NOT RUN BY BUGHUNTER**
