# Ember Worker prefix rewrite vs ASSETS `html_handling` redirects

- **Scope:** Cloudflare default `assets.html_handling` (`auto-trailing-slash`) 307/200 outcomes after `src/worker.ts` rewrites `/connect/ember-example` and then `env.ASSETS.fetch`. Covers whether non-HTML (including redirect) responses are returned unchanged, and whether the documented public URLs receive `index.html`. Excludes `run_worker_first` invocation order (20261112T194938Z), `assets.base_path` (20261113T160738Z), HTML body reconstruction / GTM replace (20261110T211438Z), Worker security headers (20261107T095138Z), prefix-branch coverage (20261017T073239Z), embed hash routing, cookie consent.
- **Base:** `origin/main` at `c379ad2c0080160d2f3d56d0c40c72edb765cb24`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T034438Z-aac7ca8fb642495281f33c39bc0e1a81-ember`, `bughunter/20261114T034438Z-aac7ca8fb642495281f33c39bc0e1a81-ember`.
- **Run:** `20261114T034438Z-aac7ca8fb642495281f33c39bc0e1a81`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` / `docs/bughunter/INDEX.md` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to `src/worker.ts`; `assets.directory` is `./dist`, binding `ASSETS`. There is no `html_handling`, `not_found_handling`, `run_worker_first`, or `base_path` override.
2. Wrangler default `assets.html_handling` is `auto-trailing-slash` ([configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)). `env.ASSETS.fetch` applies that handling and **returns HTML redirects** as responses ([bindings](https://developers.cloudflare.com/workers/static-assets/binding/)).
3. Worker (`src/worker.ts`): exact prefix and prefix+`/` → pathname `/`; descendants `pathname.slice(prefix.length)`. Then `env.ASSETS.fetch(new Request(url, request))`. If `Content-Type` does not include `text/html`, the ASSETS response is returned unchanged (status, headers, body). HTML is optionally GTM-substituted (no `__GTM_ID__` on current `index.html`).
4. Documented public URLs: README / canonical / `og:url` / sitemap `loc` are `https://qrati.com/connect/ember-example` (no trailing slash, no `index.html`). Worker maps that URL and the slash variant to `/`.
5. Cloudflare HTML-handling table ([html_handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)): a folder index is served **200** at the trailing-slash folder URL (`/folder/` → `dist/folder/index.html`). Root `dist/index.html` is that folder-index case at `/`. Incoming `/` is already the slash form, so the documented rewrite target is the 200 path, not a 307.
6. Vite `base: '/connect/ember-example/'` prefixes built asset hrefs; `dist` keys stay at `/index.html`, `/assets/…`, `public/` copies. Non-HTML assets skip the HTML branch.

Authz/validation/persistence: none (public demo). Side effects: ASSETS fetch after rewrite. Errors: unmatched rewritten paths follow default `not_found_handling` (`none`).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Default `auto-trailing-slash` 307s `/` to `/` or `/index.html` and the Worker forwards a loop or empty body:** contradicted by the folder-index row: `/folder/` is 200 with the index file. `/` is that row for `dist/index.html`.
- **Worker HTML gate drops the index because a 200 index has no `text/html`:** static HTML from ASSETS is served as `text/html`; that is the branch that rebuilds the body. Non-HTML 307s would be returned as-is, but the documented URLs are the 200 path.
- **`/connect/ember-example/index.html` 307 `Location: /` ejects the visitor to `qrati.com/`:** the published table lists `/folder/index.html` → 307 to `/folder`, **not** `/` or `/index.html`. Root `index.html` is not in that table. Treating it as `/folder/index.html` is analog, not a captured ASSETS response. Canonical, sitemap, and README do not advertise `…/index.html`. Not claimed.
- **Must set `html_handling: "none"` so `/index.html` is 200:** with `none`, `/` (the documented rewrite target) depends on `not_found_handling` and is not `/index.html`. That would risk 404ing the canonical URL. Product change, not a violated invariant.
- **Issue search** `html_handling OR trailing slash OR index.html redirect OR Location`: only closed #16 (social OG / document-relative favicon). Open issue list empty. No duplicate. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Cloudflare Workers — HTML handling (`auto-trailing-slash`)](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Configuration and Bindings (`ASSETS.fetch` returns HTML redirects)](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Wrangler `assets.html_handling` default](https://developers.cloudflare.com/workers/wrangler/configuration/)
- `src/worker.ts` prefix rewrite + non-HTML passthrough
- `wrangler.jsonc` (no `html_handling`)
- `index.html` canonical; `public/sitemap.xml`; README live URL
- Prior: Worker routing (20261017T073239Z); `run_worker_first` (20261112T194938Z); `assets.base_path` (20261113T160738Z)

## Limitations

CodeGraph unindexed. No live request to `qrati.com/connect/ember-example` (historical deployment 404 out of scope). No `wrangler dev`. Root `/` / `/index.html` rows are inferred from the folder-index table, not a captured ASSETS 307/200.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-14T03:44:38Z | 2026-11-14T03:45:01Z | 09:14:38 | 09:15:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-14T03:45:14Z | 2026-11-14T03:48:36Z | 09:15:14 | 09:18:36 | 00:03:22 (3.4 min) |
| `delivery` | 2026-11-14T03:48:36Z | 2026-11-14T03:49:24Z | 09:18:36 | 09:19:24 | 00:00:47 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-14T03:44:38Z | 2026-11-14T03:49:24Z | 09:14:38 | 09:19:24 | **00:04:46 (4.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:14 (0.2 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T034438Z-aac7ca8fb642495281f33c39bc0e1a81.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/188
- Base `main` `c379ad2c0080160d2f3d56d0c40c72edb765cb24` / head `bughunter/20261114T034438Z-aac7ca8fb642495281f33c39bc0e1a81-ember` `ca81606f9a16e19cf050ddcd74412fb734c2979e` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pass; CI Lint pending; CI Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
