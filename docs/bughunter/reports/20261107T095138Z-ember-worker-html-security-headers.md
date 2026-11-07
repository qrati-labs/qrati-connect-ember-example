# Ember Worker HTML security headers

- **Scope:** HTTP security headers on HTML responses from `src/worker.ts` (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` / `frame-ancestors`). Excludes subpath URL rewrite and GTM placeholder pass-through (20261017T073239Z), robots/sitemap routing (2026-10-22), `rootURL` vs Vite base (20261107T040238Z), cookie-consent cookie record (20261107T092838Z).
- **Base:** `origin/main` at `58f7cac562c94fad6d0deb318e0b548c80c5fe56`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T095138Z-9e766a1d72b04af19e4f849e8b249836-qrati-connect-ember-example`, `bughunter/20261107T095138Z-9e766a1d72b04af19e4f849e8b249836-ember`.
- **Run:** `20261107T095138Z-9e766a1d72b04af19e4f849e8b249836`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to this Worker (`main`: `src/worker.ts`; `assets.directory`: `./dist`; binding `ASSETS`). No `headers` / `_headers` asset config.
2. `fetch` (`src/worker.ts`): rewrite `/connect/ember-example` and descendants to ASSETS paths; `env.ASSETS.fetch(new Request(url, request))`. Non-HTML is returned unchanged.
3. HTML: `await response.text()`, optional `replaceAll('__GTM_ID__', gtmId)` when `env.VITE_GTM_ID || env.GTM_ID` is set and not the placeholder, then `new Response(html, { status, statusText, headers: response.headers })`. The Worker does **not** `headers.set` / `append` any security header. `index.html` contains no `__GTM_ID__` placeholder (GTM is injected from `VITE_GTM_ID` in `app/lib/cookieConsent.ts` after analytics consent).
4. `public/` has no `_headers` file. `index.html` has no `<meta http-equiv="Content-Security-Policy">` and no `<meta name="referrer">`. Footer logo uses `referrerpolicy="no-referrer"`; outbound links use `rel="noopener noreferrer"` (out of scope).
5. Cloudflare Workers static-assets docs describe default `Content-Type` / `ETag` / `Cache-Control` on assets and optional custom headers via `_headers` or Worker mutation. They do not inject CSP, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, or `X-Frame-Options` by default.
6. Sibling connect Workers (Qwik and others) use the same HTML `headers: res.headers` pass-through without adding those names. README does not claim a CSP or framing policy for this example.

Authz/validation: public demo. Persistence: none on this path. Side effects: optional GTM string replace (no-op on current HTML). Errors: none thrown for missing headers.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing CSP is a broken host contract:** not stated in README, tests, or `wrangler.jsonc`. [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) is optional. Inventing a policy would also have to allow Iconify, Google Fonts, jsDelivr embed, and GTM — product work, not a violated invariant.
- **Must set `X-Frame-Options: DENY` / `frame-ancestors`:** clickjacking of a public embed demo is not an evidenced failure. The live gallery is the intended third-party embed pattern.
- **`X-Content-Type-Options: nosniff` absence MIME-sniffs HTML into script:** ASSETS serves `text/html` for the rewritten index; no evidence of a wrong `Content-Type` on this path (20261017T073239Z already treated ASSETS types as given).
- **Pass-through `Content-Encoding`/`Content-Length` after `response.text()` garbles HTML:** possible Workers footgun, but not demonstrated from source. Cloudflare ASSETS bodies presented to the Worker are typically already decoded; this audit does not claim a live encoding mismatch. Same construction as the Oct 17 routing audit (report-only).
- **Zone-level qrati.com headers already cover this route:** unknown without a production GET (not performed). Absence in this Worker is not proof the edge omits them, and presence at the zone would mean this file is not the defect site.
- **Issue search** `CSP OR Content-Security-Policy OR nosniff OR Referrer-Policy OR Permissions-Policy OR X-Frame-Options OR security header`: no matching issue.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Cloudflare Workers static assets — Headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [MDN: Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- `src/worker.ts` HTML `new Response(..., { headers: response.headers })`
- `wrangler.jsonc` (no headers config); `public/` (no `_headers`)

## Limitations

CodeGraph unindexed. No live request to `qrati.com/connect/ember-example` (prior deployment 404 is out of scope). Zone-level Cloudflare transform/WAF headers were not observed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending this delivery
- Base `main` `58f7cac562c94fad6d0deb318e0b548c80c5fe56`
- `closingIssuesReferences`: none
- Assignees: none (repo unmapped; no guessed owner)
- Local tests **NOT RUN BY BUGHUNTER**
