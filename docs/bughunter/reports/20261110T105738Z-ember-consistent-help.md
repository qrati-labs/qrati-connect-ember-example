# Ember host WCAG 3.2.6 consistent help

- **Scope:** WCAG 2.2 SC 3.2.6 Consistent Help on host-authored help/contact mechanisms: Contact Qrati CTA (`https://qrati.com/contact-us`), footer `qrati.com` / Pricing links, in-page FAQ self-help, single Ember history index. Excludes embed internals, cookie-consent chrome (not a listed 3.2.6 mechanism), 3.2.3 consistent navigation (20261110T024638Z), 3.2.4 consistent identification (20261110T030638Z), Contact CTA contrast (#18 / 20261106T124038Z), Contact CTA href (20261106T191338Z).
- **Base:** `origin/main` at `d59c0ca2b20046aa387339374212ef5f650d24c0`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T105738Z-15386ddc45cb4cdca889ac604bab61f7-ember`, `bughunter/20261110T105738Z-15386ddc45cb4cdca889ac604bab61f7-ember`.
- **Run:** `20261110T105738Z-15386ddc45cb4cdca889ac604bab61f7`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to ... No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (application index only). `config/environment.js` `locationType: 'history'`, `rootURL: '/'`.
2. Human contact mechanism: `app/components/qrati-demo.gts` `.seo-cta-section` → `<a class="btn-cta-primary" href="https://qrati.com/contact-us">Contact Qrati →</a>` (same-tab; no `target`).
3. Other off-site links: hero `https://qrati.com` (`target="_blank" rel="noopener noreferrer"`), footer `qrati.com`, npm, GitHub, Pricing (`https://qrati.com/pricing`). These are product/docs destinations, not a second copy of the contact mechanism.
4. Self-help on this URI: FAQ `<details>`/`<summary>` in the same template (how to embed, subscription, uploads, contests). Cookie Preferences reopens vanilla-cookieconsent; that is consent UI, not a 3.2.6 help type.
5. Authz: none (public demo). Persistence (`qc-theme`, geo session key, consent cookie) does not add host routes. Worker (`src/worker.ts`) serves one HTML document at `/connect/ember-example`. `public/sitemap.xml` lists that single `<loc>`.
6. [WCAG 2.2 SC 3.2.6](https://www.w3.org/TR/WCAG22/#consistent-help): if a page contains human contact details/mechanism, self-help, or automated contact, **and** those mechanisms are repeated on multiple pages in a set, they occur in the same relative order. [Understanding 3.2.6](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help): the SC does **not** require authors to provide help; it only requires consistent placement when a listed form is available across multiple pages. Sufficient technique [G220](https://www.w3.org/WAI/WCAG22/Techniques/general/G220) is for a contact-us link in a consistent location across a set.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing Contact CTA / no help in the header is a 3.2.6 failure:** Understanding: it is not the intent to require help. One contact link on a one-URI host cannot be “inconsistent across pages.”
- **FAQ + Contact CTA + footer qrati.com are the same mechanism in conflicting order:** different destinations and types (in-page self-help vs `/contact-us` vs homepage). 3.2.6 compares a repeated mechanism across pages, not distinct links on one page.
- **qrati.com marketing pages are the same set, so help must match qrati-web chrome:** this demo has its own chrome, sitemap, and robots; Understanding treats distinct authorship/purpose as a different set (same reading as 2.4.5 / 3.2.3 audits).
- **Contact CTA same-tab vs other `target=_blank` links fails 3.2.6:** windowing is not relative order of a repeated help mechanism; 3.2.4 already treated CTA vs homepage as different functionality.
- **Issue search** `consistent help OR 3.2.6 OR contact-us`: only closed #18 (CTA contrast). Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.2.6 Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help)
- [WCAG 2.2 SC 3.2.6](https://www.w3.org/TR/WCAG22/#consistent-help)
- [G220: Provide a contact-us link in a consistent location](https://www.w3.org/WAI/WCAG22/Techniques/general/G220)
- `app/components/qrati-demo.gts` (Contact CTA, FAQ, footer nav)
- `app/templates/application.gts`, `app/router.ts`
- `public/sitemap.xml`, `src/worker.ts`
- Prior: Contact CTA (20261106T191338Z), 3.2.3 (20261110T024638Z), 3.2.4 (20261110T030638Z), 2.4.5 (20261110T103738Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.2.6 Understanding (search snippets 2026-11-10). Embed widget routes and qrati-web contact form are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T105738Z-15386ddc45cb4cdca889ac604bab61f7.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**.
