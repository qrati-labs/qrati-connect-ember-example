# Ember live gallery embed CDN resource hints

- **Scope:** Host document hints that could warm the Qrati Connect `embed.js` origin before `mountEmbed` injects the classic loader (`index.html` `preconnect` / `dns-prefetch` / `preload` / `modulepreload`; Worker `Link` header). Cross-repo contract: default `https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js` and same-origin `../element/web.es.js`. Excludes DOM injection / `currentScript` (20261107T075138Z), theme remount (#60), org-id fallback (#51), hash routing, Iconify, Google Fonts `@import`, GTM.
- **Base:** `origin/main` at `d4fc1a5f1b98e53f77cfc3fc78f44d2ed0ad57d2`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T012638Z-6bffc574edb54a529cc3a6eb014512bd-ember`, `bughunter/20261114T012638Z-6bffc574edb54a529cc3a6eb014512bd-ember`.
- **Run:** `20261114T012638Z-6bffc574edb54a529cc3a6eb014512bd`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Live gallery host is `.widget-embed-host` with `{{mountEmbed this.theme}}` (`app/components/qrati-demo.gts`).
2. `mountEmbed` creates a classic `script` (`async = true`) with `src = import.meta.env.VITE_CDN_URL || 'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js'` after the Ember app boots. The loader then `import()`s `../element/web.es.js` relative to that `src` (`qrati-connect-ts` `src/exports/embed.ts`).
3. `index.html` head: charset, theme-boot script, title/description/robots/canonical/icons/OG/Twitter, viewport, Iconify `defer`. **No** `rel="preconnect"`, `dns-prefetch`, `preload`, or `modulepreload`. No `Link` hints.
4. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not set `Link`. `wrangler.jsonc` / `public/` have no `_headers`.
5. `.env.example` documents `VITE_CDN_URL` as the same jsDelivr URL; production may override the origin.
6. MDN `rel=preconnect`: optional hint to start DNS+TCP+TLS for a **likely** future origin. Best used only for the most critical connection; preconnecting many third parties is counterproductive. `dns-prefetch` is the cheaper DNS-only fallback. Neither is required for the subresource to load.

Authz/validation/persistence: none (public demo). Side effects: none until `embed.js` is injected. Errors: loader logs to console if `currentScript` / org id / element import fail; host has no user-visible fetch error UI (out of scope of hints).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `preconnect` to jsDelivr is a broken gallery:** not established. The loader still fetches after Ember boots. MDN documents a hint, not a loading invariant. README’s embed snippet has no resource hints.
- **Must `preload` `embed.js`:** the URL is build-time `VITE_CDN_URL` and is injected only from JS. A static `preload` of the default jsDelivr URL would be wrong when `VITE_CDN_URL` points elsewhere, and `modulepreload` does not apply to the classic IIFE loader.
- **Late-discovered CDN origin always needs a head hint:** Ember JS is already on the critical path; the extra handshake is a performance smell, not a functional failure. Iconify + Google Fonts already occupy other origins; MDN warns against preconnecting them all.
- **Issue search** `preconnect OR dns-prefetch OR "resource hint"`: no matching issue. Broader CDN search hit closed #57 (quickstart `<pre>` overflow), unrelated.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [MDN `rel="preconnect"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect)
- [MDN Using dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/dns-prefetch)
- `index.html` (no resource hints)
- `app/components/qrati-demo.gts` `EMBED_URL` / `mountEmbed`
- `src/worker.ts` (no `Link` header)
- Prior: live gallery embed loader mount (20261107T075138Z); host webfonts (explicitly no fonts.googleapis preconnect)

## Limitations

CodeGraph unindexed. No browser connection waterfall. Live `https://qrati.com/connect/ember-example` was not used as evidence (historical deployment 404 out of scope). Whether production sets `VITE_CDN_URL` away from jsDelivr was not observed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery read-back
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**.
