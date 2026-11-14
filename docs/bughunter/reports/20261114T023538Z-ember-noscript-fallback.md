# Ember host JS-disabled (`noscript`) fallback

- **Scope:** Document delivery when scripting is disabled or unsupported: production `index.html` `<noscript>` (and `@media (scripting: none)`), Worker HTML rewrite, versus CSR-only `QratiDemo` (live gallery embed, marketing copy, FAQ). Excludes crawler robots/sitemap (2026-10-22 / 2026-10-18), JSON-LD identity (20261107T042538Z), social head (#16), live gallery embed loader mount (20261107T075138Z), cookie consent.
- **Base:** `origin/main` at `f4614b4dc67071a6fa85f1607cdabb69a847f3f1`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T023538Z-8b59b7615299422a8396caa40ce05866-ember`, `bughunter/20261114T023538Z-8b59b7615299422a8396caa40ce05866-ember`.
- **Run:** `20261114T023538Z-8b59b7615299422a8396caa40ce05866`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `wrangler.jsonc` routes `*qrati.com/connect/ember-example*` to `src/worker.ts`. HTML responses are `env.ASSETS.fetch` after prefix rewrite, optional `__GTM_ID__` `replaceAll`, then `new Response(html, { status, statusText, headers })`. The Worker does not inject `<noscript>` or other body fallback.
2. Production document (`index.html`): `<head>` has charset, blocking `qc-theme` boot script, title, description, robots, canonical, subpath icons, OG/Twitter tags, viewport, Iconify `defer`, Embroider virtual CSS. `<body>` is `{{content-for "body"}}` plus vendor.js and a `type="module"` Ember boot. **No** `<noscript>`. Repo-wide search of `app/`, `index.html`, `src/`, `public/` found no `noscript` and no `@media (scripting: none)`.
3. Visible host chrome and the live gallery live in `app/templates/application.gts` → `<QratiDemo />` (`app/components/qrati-demo.gts`): theme toggle, hero, `.widget-embed-host` `mountEmbed`, FAQ, Contact CTA, footer. That tree is client-rendered after the module boot. `mountEmbed` injects classic `embed.js` only in the browser.
4. MDN `<noscript>`: children render as HTML **only when scripting is disabled or unsupported**; with scripting on, they are not presented as HTML. `@media (scripting: none)` is an optional CSS hint for the same UA setting. Neither is required for a script-hosted Ember app to be a valid document.
5. README presents this as an Ember host that injects the Qrati Connect **embed script** (`pnpm start`). Head SEO (title, description, canonical, OG/Twitter) is already static for non-JS fetchers.

Authz/validation/persistence: none (public demo). Side effects: none on the JS-off path (no Ember, no embed, no consent). Errors: without JS the body is empty aside from script tags; UA shows a blank content area under the static title.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `<noscript>` breaks the documented live gallery:** the gallery is an Ember-injected classic `embed.js` widget. JS-off cannot run that contract. README’s snippet is a `<script>` tag.
- **Crawlers that skip JS get an unindexable page:** static `title`, `meta name="description"`, canonical, robots `index, follow`, OG/Twitter, and `public/sitemap.xml` remain in the first response. JSON-LD absence was already report-only (20261107T042538Z); crawler discovery was report-only (2026-10-18).
- **Must ship a static HTML clone of `QratiDemo`:** that would be SSR/prerender, not a noscript stub. No host invariant requires a JS-off gallery or FAQ.
- **`@media (scripting: none)` is required:** MDN documents an optional media feature for UA scripting settings; it does not create a content invariant.
- **Issue search** `noscript OR javascript-disabled OR "js disabled" OR "without javascript"`: no matching issues (open issue list empty).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [MDN `<noscript>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript)
- [MDN `scripting` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/scripting)
- `index.html` (no `<noscript>`; CSR Ember boot only)
- `app/templates/application.gts`, `app/components/qrati-demo.gts` `mountEmbed`
- `src/worker.ts` (HTML pass-through; no body fallback)
- Prior: crawler discovery (2026-10-18); JSON-LD (20261107T042538Z); embed loader mount (20261107T075138Z)

## Limitations

CodeGraph unindexed. No browser session with scripting disabled. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T023538Z-8b59b7615299422a8396caa40ce05866.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `f4614b4dc67071a6fa85f1607cdabb69a847f3f1` / head `bughunter/20261114T023538Z-8b59b7615299422a8396caa40ce05866-ember`
- `closingIssuesReferences`: none
- Assignees: none (repo unmapped; no guessed owner)
- Local tests **NOT RUN BY BUGHUNTER**
