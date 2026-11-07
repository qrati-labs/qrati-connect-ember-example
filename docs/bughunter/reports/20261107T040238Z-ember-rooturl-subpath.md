# Ember host history rootURL vs Vite subpath base

- **Scope:** Host Ember `history` location `rootURL` versus Vite `base` and the documented public path `/connect/ember-example`, including empty `Router.map`, application template render, and Worker prefix strip for ASSETS. Excludes embed `data-router="hash"` (#60 / hash-routing report), Worker asset-rewrite branches (2026-10-17), live HTTP 404 availability (2026-10-19), cookie consent, theme toggle.
- **Base:** `origin/main` at `01442f0a75bd8d8374abb90fb94773057524fe90`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T040238Z-8fb8f6d9b69841658c7efdf1acf9be5d-ember`, `bughunter/20261107T040238Z-8fb8f6d9b69841658c7efdf1acf9be5d-ember`.
- **Run:** `20261107T040238Z-8fb8f6d9b69841658c7efdf1acf9be5d`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` always renders `<QratiDemo />` then `{{outlet}}`. `{{pageTitle "Qrati Connect — Ember Example"}}` matches `index.html` `<title>`.
2. Host router (`config/environment.js`): `rootURL: '/'`, `locationType: 'history'` (test env uses `none`). `app/router.ts` maps no extra routes.
3. Vite (`vite.config.mjs`): `base: '/connect/ember-example/'` prefixes built asset URLs. Worker (`src/worker.ts`) maps browser `/connect/ember-example` and `/connect/ember-example/` to `/` before `env.ASSETS.fetch`; descendant paths lose the prefix. `wrangler.jsonc` route pattern is `*qrati.com/connect/ember-example*`.
4. README documents the live example at `https://qrati.com/connect/ember-example`. Canonical / `og:url` / sitemap `loc` use that URL without a trailing slash (`index.html`, `public/sitemap.xml`).
5. Ember Guides (release, Specifying the URL Type): `history` uses pathnames like `/posts/new`; the server must serve the Ember app from those router URLs. This host has only the application index route.
6. `QratiDemo` is not rendered through `{{outlet}}`. An unmatched pathname would at most leave the outlet empty; the demo chrome and embed host remain in the application template.

Authz/validation/persistence: none (public demo). Side effects: Ember history API may read `location.pathname`; embed hash routing is out of scope. Errors: no host `error` route is declared.

## Falsification

- **`rootURL: '/'` with Vite `base` `/connect/ember-example/` is a broken deploy:** they are different jobs. Vite `base` is asset href prefix; Worker strips the prefix for ASSETS lookup so `dist` is rooted at `/`. No source evidence that built script/style URLs omit the public prefix.
- **Unrecognized `/connect/ember-example` blanks the page:** application template unconditionally mounts `QratiDemo`. Empty `Router.map` has no child that must match for the gallery host to exist.
- **Ember `replaceState`s the browser to `/` and leaves `qrati.com`:** not evidenced in this repo; Ember history `getURL` / `setURL` implementation was not present in the checkout (no `node_modules`). Not claimed.
- **Canonical without slash vs Vite base with slash is duplicate-content:** sitemap and canonical agree on the no-slash URL; Worker treats both slash variants as the same index. Not a host routing failure.
- **Issue search** `rootURL OR subdirectory OR locationType`: no open issue; closed hits were social OG (#16) and quickstart overflow (#57), unrelated.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Ember Guides — Specifying the URL Type](https://guides.emberjs.com/release/configuring-ember/specifying-url-type/)
- `config/environment.js` `rootURL` / `locationType`
- `vite.config.mjs` `base`
- `src/worker.ts` prefix rewrite
- `app/templates/application.gts`, `app/router.ts`
- Prior related: Worker subpath asset routing (report-only, 2026-10-17); deployment route 404 (unconfirmed availability, 2026-10-19); embed hash routing (report-only, 2026-11-06)

## Limitations

CodeGraph unindexed. No browser session and no Ember `HistoryLocation` source in-tree. Public example URL has previously 404’d (deployment-availability, out of scope). No claim about current live routing.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T04:02:38Z | 2026-11-07T04:03:00Z | 09:32:38 | 09:33:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-07T04:03:11Z | 2026-11-07T04:09:06Z | 09:33:11 | 09:39:06 | 00:05:55 (5.9 min) |
| `delivery` | 2026-11-07T04:09:06Z | 2026-11-07T04:10:02Z | 09:39:06 | 09:40:02 | 00:00:56 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-07T04:02:38Z | 2026-11-07T04:10:02Z | 09:32:38 | 09:40:02 | **00:07:24 (7.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:12 (0.2 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T040238Z-8fb8f6d9b69841658c7efdf1acf9be5d.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/66
- Base `main` `01442f0a75bd8d8374abb90fb94773057524fe90` / head `bughunter/20261107T040238Z-8fb8f6d9b69841658c7efdf1acf9be5d-ember`
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian SUCCESS; CI Lint/Test QUEUED; Workers Builds IN_PROGRESS
- Local tests **NOT RUN BY BUGHUNTER**
