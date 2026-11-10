# Ember host WCAG 2.4.5 multiple ways

- **Scope:** WCAG 2.2 SC 2.4.5 Multiple Ways for host-authored pages in this example: Ember `Router.map`, application template, `QratiDemo` in-page sections, `public/sitemap.xml`, `public/robots.txt`, canonical URL, Cloudflare Worker prefix, footer off-site links. Excludes embed internals (`qrati-connect` / `embed.js` hash routes). Excludes 2.4.1 skip/bypass (20261107T044738Z), 2.4.2 page titled (20261109T185738Z), 2.4.4 link purpose (20261109T183438Z), 3.2.3 consistent navigation (20261110T024638Z).
- **Base:** `origin/main` at `b032e330e5fb132dc05479234a19405065fa170d`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T103738Z-93523280dd3240de881f5b406d8cb73b-qrati-connect-ember-example`, `bughunter/20261110T103738Z-93523280dd3240de881f5b406d8cb73b-ember`.
- **Run:** `20261110T103738Z-93523280dd3240de881f5b406d8cb73b`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path is not present under `~/Projects`. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />` and `{{outlet}}`. `app/router.ts` `Router.map` is empty (application index only). `config/environment.js` uses `locationType: 'history'` and `rootURL: '/'`. No second host route exists.
2. Inputs: public GET of `https://qrati.com/connect/ember-example` (canonical in `index.html`). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and `/connect/ember-example/` to `/` HTML; other prefix paths are asset/HTML fetches, not additional Ember routes.
3. Authz: none (public demo). Validation: N/A for page location. Persistence: `qc-theme` localStorage and consent cookies do not create additional URIs.
4. Side effects: optional GTM after analytics consent; embed script mounts inside `.widget-embed-host` with `data-router="hash"` — widget hash changes are not host Web pages (same HTTP URI).
5. Output: one host Web page. `public/sitemap.xml` lists a single `<loc>https://qrati.com/connect/ember-example</loc>`. `public/robots.txt` allows `/` and points at that sitemap. Footer links (`qrati.com`, npm, GitHub, Pricing) leave this demo’s navigation chrome.
6. [WCAG 2.2 SC 2.4.5](https://www.w3.org/TR/WCAG22/#multiple-ways): more than one way to locate a Web page **within a set of Web pages**, except process results. [Understanding 2.4.5](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways) defines a **set of Web pages** as a collection that shares a common purpose and author. This repository’s conformance unit is a one-URI Ember host. Sufficient techniques (G125, G64, G63, G161, G126, G185) apply when there are other pages in the set to locate.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing site search / TOC is a 2.4.5 failure:** those techniques are sufficient for multi-page sets. A singleton set has no other host page to locate. In-page FAQ/feature sections share the same URI (WCAG “web page”).
- **qrati.com marketing pages are the same set:** Understanding example: different navigation and distinct authorship/purpose are a different set. This demo has its own chrome, sitemap, and robots; footer links are cross-site, not intra-set locators.
- **Embed hash routes are extra Web pages:** `data-router="hash"` is the widget; host URI does not change. Out of host scope.
- **Sitemap-only listing is incomplete for this site:** G63 would list the pages in the set; the set here has one URL, which the sitemap contains.
- **Issue search** `multiple ways OR 2.4.5 OR sitemap OR site map`: no matching open issues (open set empty; sitemap hits only closed social-head #16). No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.5 Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)
- [WCAG 2.2 SC 2.4.5](https://www.w3.org/TR/WCAG22/#multiple-ways)
- `app/router.ts` (empty `Router.map`)
- `app/templates/application.gts`, `app/components/qrati-demo.gts`
- `public/sitemap.xml`, `public/robots.txt`, `index.html` canonical
- `src/worker.ts`, `config/environment.js`
- Prior: 2.4.1 (20261107T044738Z), 2.4.2 (20261109T185738Z), 2.4.4 (20261109T183438Z), 3.2.3 (20261110T024638Z), robots/sitemap (2026-10-22T161839Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 2.4.5 Understanding (fetched 2026-11-10). Sibling `/connect/*-example` deployments are not treated as this repo’s set without a shared nav/sitemap in this codebase. Embed widget routes not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T10:37:38Z | 2026-11-10T10:38:01Z | 16:07:38 | 16:08:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-10T10:38:25Z | 2026-11-10T10:40:26Z | 16:08:25 | 16:10:26 | 00:02:01 (2.0 min) |
| `delivery` | 2026-11-10T10:40:26Z | 2026-11-10T10:41:16Z | 16:10:26 | 16:11:16 | 00:00:50 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-10T10:37:38Z | 2026-11-10T10:41:16Z | 16:07:38 | 16:11:16 | **00:03:38 (3.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:24 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T103738Z-93523280dd3240de881f5b406d8cb73b.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/123
- Base `main` `b032e330e5fb132dc05479234a19405065fa170d` / head `bughunter/20261110T103738Z-93523280dd3240de881f5b406d8cb73b-ember`
- `closingIssuesReferences`: none
- Checks at first read-back: Lint/Test/Workers Builds pending; GitGuardian pass. `pnpm test` **NOT RUN BY BUGHUNTER**.
