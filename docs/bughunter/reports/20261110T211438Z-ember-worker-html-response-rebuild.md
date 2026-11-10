# Ember Worker HTML response reconstruction

- **Scope:** HTML branch in `src/worker.ts` after `env.ASSETS.fetch`: `response.text()`, optional `__GTM_ID__` `replaceAll`, `new Response(html, { status, statusText, headers: response.headers })`. Covers copied `Content-Length` / `Content-Encoding` / `ETag` versus the decoded body. Excludes prefix rewrite (20261017T073239Z), Worker HTML security headers (20261107T095138Z), GTM load after analytics consent (20261106T204938Z), robots/sitemap routing (2026-10-22).
- **Base:** `origin/main` at `30fb07e68ffd17a479e2365f8d0de2d52b2f67f7`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T211438Z-bff91eca814c4020ab0676960e2f41a1-ember`, `bughunter/20261110T211438Z-bff91eca814c4020ab0676960e2f41a1-ember`.
- **Run:** `20261110T211438Z-bff91eca814c4020ab0676960e2f41a1`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to `src/worker.ts`; `assets.directory` is `./dist`, binding `ASSETS`. No `run_worker_first`, `_headers`, or `html_handling` override.
2. `fetch`: rewrite `/connect/ember-example` and `/connect/ember-example/` to `/`; strip the prefix from descendants; `env.ASSETS.fetch(new Request(url, request))`.
3. Non-HTML (`Content-Type` missing or not containing `text/html`) is returned unchanged.
4. HTML: `await response.text()`, then `html.replaceAll('__GTM_ID__', gtmId)` only when `env.VITE_GTM_ID || env.GTM_ID` is set and not the placeholder string. Return `new Response(html, { status, statusText, headers: response.headers })`.
5. `index.html` has no `__GTM_ID__` token. Client GTM is `import.meta.env.VITE_GTM_ID` in `app/lib/cookieConsent.ts` after analytics consent. `.env.example` leaves `VITE_GTM_ID` empty. On this document the replace is a no-op; the reconstructed body equals the decoded ASSETS HTML.
6. Cloudflare static-asset defaults attached to ASSETS responses are `Content-Type`, `Cache-Control: public, max-age=0, must-revalidate`, `ETag`, and `CF-Cache-Status` — not `Content-Encoding` ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/)).
7. Cloudflare `Response` constructor: `Content-Length` is set from the body; any `Content-Length` copied on `init.headers` is ignored ([Response](https://developers.cloudflare.com/workers/runtime-apis/response/)). Default `encodeBody` is `"automatic"` (compress according to client/runtime, not by treating a copied `Content-Encoding` as pre-compressed unless `encodeBody: "manual"`).

Authz/validation: public demo. Persistence: none. Side effects: GTM string replace (no-op on current HTML). Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Copied `Content-Length` truncates or pads the decoded HTML:** contradicted by Workers docs: user-supplied `Content-Length` on `Response` headers is ignored; the runtime measures the string body.
- **`response.text()` plus leftover `Content-Encoding: gzip` sends gunzip-garbage to the browser:** ASSETS default header set does not include `Content-Encoding`. Fetch passthrough of compressed bytes applies when the body is *not* read. This path reads the body. Not evidenced as a broken HTML response.
- **Stale `ETag` after GTM replace serves the wrong 304 body:** replace does not run on current `index.html` (no placeholder). A future placeholder plus runtime GTM would be a cache-validator hygiene risk, not a present failure. Client GTM is the documented path (20261106T204938Z).
- **Dead Worker GTM replace means analytics cannot load:** `syncGtm` injects `gtm.js` from the Vite env after consent. Worker substitution is unused, not a broken client path.
- **Issue search** `GTM OR __GTM_ID__ OR Content-Length OR worker HTML rewrite OR encodeBody`: no open issue. Closed hits are Consent Mode `arguments` (#138), geo/opt-out/preferences, theme, OG — different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Cloudflare Workers — Response (`Content-Length`, `encodeBody`)](https://developers.cloudflare.com/workers/runtime-apis/response/)
- [Cloudflare Workers static assets — Headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Cloudflare Workers — Fetch / Accept-Encoding passthrough](https://developers.cloudflare.com/workers/runtime-apis/fetch/)
- `src/worker.ts` HTML `new Response(html, { headers: response.headers })`
- `index.html` (no `__GTM_ID__`); `app/lib/cookieConsent.ts` (`VITE_GTM_ID`)
- Prior: Worker routing (20261017T073239Z); security headers (20261107T095138Z); GTM after consent (20261106T204938Z)

## Limitations

CodeGraph unindexed. No live request to `qrati.com/connect/ember-example` (historical deployment 404 out of scope). ASSETS header set taken from Cloudflare docs, not a captured production response.

## Timing

TIMING_PLACEHOLDER

## PR / checks

PR_PLACEHOLDER
