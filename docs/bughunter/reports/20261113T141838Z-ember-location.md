# Ember host WCAG 2.4.8 location

- **Scope:** WCAG 2.2 SC 2.4.8 Location (AAA) for this host document: whether the Ember example is a *set of web pages*, and whether breadcrumbs, sitemap-as-location, repeated nav `aria-current`, or G127 collection identity are required. Excludes 2.4.5 multiple ways (20261110T103738Z), 2.4.2 page titled (20261109T185738Z), 2.4.4 / 2.4.9 link purpose, footer brand image, robots/sitemap *routing* (2026-10-22), embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome.
- **Base:** `origin/main` at `8d29d203a18c9891e2c8885b854e6ba5f27551ec`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T141838Z-8f5f3b0a8a9b4387805635b1d0a7492d-ember`, `bughunter/20261113T141838Z-8f5f3b0a8a9b4387805635b1d0a7492d-ember`.
- **Run:** `20261113T141838Z-8f5f3b0a8a9b4387805635b1d0a7492d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.4.8. The criterion applies to the user's location *within a set of web pages*. This example is one URI (`https://qrati.com/connect/ember-example`): empty `Router.map`, one sitemap `<loc>`, no in-host page collection, no repeated intra-set navigation. Missing breadcrumbs / `aria-current` is not a 2.4.8 failure when there is no set.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; `locationType` is `history` with `rootURL: '/'` (Vite `base` is `/connect/ember-example/`). There is a single history index, not a multi-route app.
2. Document identity: `index.html` `<title>Qrati Connect — Ember Example</title>`, matching `{{pageTitle}}`, canonical `https://qrati.com/connect/ember-example`, `og:url` the same. Hero kicker is “Qrati Connect Demo”; `h1` names the Ember host. 2.4.2 already covered page titled.
3. Footer `<nav aria-label="Footer navigation">` links only off-site (`qrati.com`, npm, GitHub org, pricing) plus an in-page Cookie Preferences control. None of those targets is this document. No `aria-current`. G128 applies when a nav component is *repeated within a set* and must mark the selected item; this nav is not a set locator.
4. No breadcrumb `nav`, no “you are here” trail (G65). `public/sitemap.xml` lists exactly one URL (this page). G63 as a *location* technique requires a site map of a multi-page site plus links to it from listed pages; a one-URL sitemap is crawler discovery, not a 2.4.8 location UI. Robots `Sitemap:` points at that file (routing already audited).
5. WCAG 2.2 Understanding 2.4.8: goal is orientation *in a set of pages*. Glossary *set of web pages*: collection sharing a common purpose and author, typically with shared navigation (publication chapters; product pages sharing chrome). Distinct chrome (checkout vs catalog; blog subdomain vs primary) is *not* the same set. Sibling Connect framework examples are other hosts; this page does not link them or share their nav.
6. Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject breadcrumbs or collection markup.

Authz/validation/persistence: none (public demo). Side effects: none for location UI. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing breadcrumb is a 2.4.8 failure:** G65 is a *sufficient* technique when a set exists. The SC text is location within a set, not a mandate to invent a hierarchy for a single URI.
- **Footer without `aria-current` fails G128:** G128’s procedure is “when the navigation component is repeated within a set of web pages.” Footer items are external; this page is not among them.
- **One-URL `sitemap.xml` fails G63 location:** G63 expects a map of site sections and reciprocal links. Crawler sitemap ≠ in-page location indicator; prior robots/sitemap routing audit found no delivery defect.
- **Connect examples on qrati.com are one set, so this page must show “Ember” in that set:** they do not share this host’s navigation or identification chrome. Understanding’s checkout/blog counterexamples treat different templates as different sets. No in-repo contract claims a multi-example location trail.
- **Host must meet AAA 2.4.8:** no such claim in README or `index.html`.
- **Issue search** `2.4.8 OR location OR breadcrumb OR aria-current`: no matching issue (open and search hits empty). Closed 2.4.x issues (page titled, link purpose, focus, skip) are different paths. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.8 Location](https://www.w3.org/WAI/WCAG22/Understanding/location.html)
- [WCAG 2.2 SC 2.4.8](https://www.w3.org/TR/WCAG22/#location)
- [G65 breadcrumb](https://www.w3.org/WAI/WCAG22/Techniques/general/G65), [G63 site map](https://www.w3.org/WAI/WCAG22/Techniques/general/G63), [G128 nav current](https://www.w3.org/WAI/WCAG22/Techniques/general/G128.html)
- `app/router.ts` (empty map); `app/templates/application.gts`; `app/components/qrati-demo.gts` (footer nav); `index.html` title/canonical; `public/sitemap.xml`
- Prior: multiple ways (20261110T103738Z); page titled (20261109T185738Z)

## Limitations

CodeGraph unindexed. No browser session. Live `https://qrati.com/connect/ember-example` was not used as evidence. Claims are from host markup/router/sitemap and WCAG 2.4.8 Understanding plus glossary *set of web pages*.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

timing incomplete

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `8d29d203a18c9891e2c8885b854e6ba5f27551ec` / head `bughunter/20261113T141838Z-8f5f3b0a8a9b4387805635b1d0a7492d-ember`
- `closingIssuesReferences`: none
