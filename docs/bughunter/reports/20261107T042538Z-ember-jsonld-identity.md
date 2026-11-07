# Ember host JSON-LD SoftwareApplication identity

- **Scope:** Crawler structured-data identity on the Ember example document head (`index.html`): presence/absence of `application/ld+json` (Schema.org `SoftwareApplication` / `WebPage` / `Organization`), versus existing canonical, robots, sitemap, and Open Graph/Twitter tags. Excludes social OG/favicon (issue #16), crawler robots/sitemap routing (2026-10-18), host `rootURL` (2026-11-07), cookie consent, theme, embed mount.
- **Base:** `origin/main` at `cb2a5290bbf091b77c6451f43307ce1af5cc7c11`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T042538Z-d1122ebf56b844a4bd2d1dd3eec9bef0-ember`, `bughunter/20261107T042538Z-d1122ebf56b844a4bd2d1dd3eec9bef0-ember`.
- **Run:** `20261107T042538Z-d1122ebf56b844a4bd2d1dd3eec9bef0`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: production `index.html` `<head>` already declares `lang="en"`, title, meta description, `robots index,follow`, canonical `https://qrati.com/connect/ember-example`, subpath favicons, and OG/Twitter image tags (issue #16). There is **no** `<script type="application/ld+json">`.
2. Visible FAQ is host HTML `<details>`/`<summary>` in `app/components/qrati-demo.gts` (`#faq-heading`). No `FAQPage` JSON-LD is emitted from the template or worker.
3. Worker (`src/worker.ts`) only rewrites the `/connect/ember-example` prefix and optionally substitutes `__GTM_ID__` in HTML. `index.html` contains no `__GTM_ID__` placeholder and no JSON-LD injection.
4. Discovery already covered separately: `public/robots.txt` + `public/sitemap.xml` + Worker prefix strip (2026-10-18). Canonical/OG URL match the sitemap `loc`.
5. Sibling connect examples (Qwik, Vue, Svelte, Solid, React, Preact, Vanilla JS, Lit, Angular) ship JSON-LD in `index.html`. Qwik uses an `@graph` of Organization / WebSite / BreadcrumbList / WebPage / SoftwareApplication. This Ember host does not document JSON-LD in README.
6. Google Search Central (intro to structured data): JSON-LD is the *recommended format when you mark up a feature*; required properties apply to *eligibility for enhanced display* of that feature, not to ordinary indexing. Google Search uses on-page content, canonical, and sitemaps without JSON-LD. [Software App structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app) is optional rich-result markup.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: missing JSON-LD is absence of optional markup, not a thrown failure.

## Falsification

- **Missing JSON-LD blocks indexing or unfurls:** contradicted by robots/sitemap/canonical plus OG/Twitter image tags already on this head. Social unfurl was the #16 defect class; it is already fixed.
- **Sibling JSON-LD is an invariant of this repo:** not stated in README, tests (`tests/unit/index-html-head-test.ts` asserts OG/favicon only), or Ember-specific docs. Parity with Qwik/Preact is a product enhancement, not a violated host contract.
- **Must add `FAQPage` JSON-LD because four `<details>` exist:** Google FAQ rich results are restricted; FAQ copy is already in the accessibility tree. Inventing FAQPage would not fix a reachable failure.
- **Incomplete SoftwareApplication markup is safer than none:** Google’s intro says supplying incomplete/inaccurate recommended properties is worse than omitting the feature. No in-repo `offers` / download metadata for a rich-result payload.
- **Issue search** `json-ld OR JSON-LD OR SoftwareApplication OR "structured data"`: only closed #16 (OG image), unrelated. No duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Google Search Central — Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Search Central — Software App (`SoftwareApplication`) structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Schema.org `SoftwareApplication`](https://schema.org/SoftwareApplication)
- `index.html` head (no `application/ld+json`)
- `tests/unit/index-html-head-test.ts` (OG/favicon only)
- Sibling: `qrati-connect-qwik-example/index.html` JSON-LD `@graph`
- Prior related: social document-head identity (#16); crawler robots/sitemap (2026-10-18)

## Limitations

CodeGraph unindexed. No live production GET and no Rich Results Test run. No claim about current Google indexing of the public URL.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table filled after `finish`.

## PR / checks

Filled after remote read-back.
