# Ember host Open Graph locale / site_name and Twitter site identity

- **Scope:** Remaining social-unfurl identity on production `index.html` after issue [#16](https://github.com/qrati-labs/qrati-connect-ember-example/issues/16) and the OG/Twitter image alt/dimension audit (20261107T084238Z): `og:locale`, `og:site_name`, `twitter:site`, and `twitter:creator`. Excludes OG/Twitter image URLs and favicons (#16), image alt/width/height (20261107T084238Z), JSON-LD (20261107T042538Z), apple-touch-icon, cookie consent, embed mount.
- **Base:** `origin/main` at `2c35eb4da5c2bbd542f730f80e9d8c56e3acd91d`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T090638Z-08737ed637b245a0822382f80abc0211-ember`, `bughunter/20261107T090638Z-08737ed637b245a0822382f80abc0211-ember`.
- **Run:** `20261107T090638Z-08737ed637b245a0822382f80abc0211`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: production `index.html` `<head>` already declares (issue #16) `og:type` `website`, `og:url` / canonical `https://qrati.com/connect/ember-example`, `og:title`, `og:description`, `og:image`, `twitter:card` `summary_large_image`, `twitter:title`, `twitter:description`, and `twitter:image`. `<html lang="en">` is present (#20).
2. Absent tags: `og:locale`, `og:locale:alternate`, `og:site_name`, `twitter:site`, `twitter:creator`. `tests/unit/index-html-head-test.ts` asserts OG/Twitter image URLs and subpath favicons only.
3. Open Graph protocol: `og:locale` is optional and **defaults to `en_US`**. `og:site_name` is optional (“if your object is part of a larger web site”). Neither is in the required `og:title` / `og:type` / `og:image` / `og:url` set. [ogp.me](https://ogp.me/).
4. X/Twitter cards: `twitter:card` is already explicit. `twitter:site` / `twitter:creator` are optional handle-attribution tags with no Open Graph equivalent. Title/description/image already have explicit `twitter:*` tags (and would fall back to `og:*` if omitted). This repository does not record an X handle.
5. Sibling `qrati-connect-qwik-example/index.html` declares `og:locale` `en_US` and `og:site_name` `Qrati Connect`. This Ember host does not document those tags in README or tests.

Authz/validation/persistence: none (public static head tags). Side effects: optional unfurl locale/site chrome and optional X handle credit. Errors: missing optional properties do not remove `og:image` / `twitter:card`; crawlers still have title, description, URL, and PNG.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `og:locale` makes Facebook/LinkedIn drop the unfurl:** contradicted by ogp.me default `en_US` and by existing required OG tags. Document language is already `en` (#20).
- **Missing `og:site_name` fails a product invariant:** README and `index-html-head-test.ts` do not require it. Optional OGP property.
- **Missing `twitter:site` blocks `summary_large_image`:** card type, title, description, and image are already present. Handle attribution is optional; inventing `@…` without a recorded handle would be a worse defect.
- **Qwik sibling tags are required parity:** same limit as the JSON-LD / OG-alt audits — not stated in this repo’s contract.
- **Issue search** `og:locale OR og:site_name OR twitter:site OR site_name`: no matching issues. Closed #16 is OG/Twitter *image URLs*, not locale/site/handle.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [The Open Graph protocol — optional `og:locale` (default `en_US`) and `og:site_name`](https://ogp.me/)
- Issue [#16](https://github.com/qrati-labs/qrati-connect-ember-example/issues/16) / `tests/unit/index-html-head-test.ts`
- `index.html` (`og:*` / `twitter:card|title|description|image`; no `og:locale` / `og:site_name` / `twitter:site`)
- Sibling `qrati-labs/qrati-connect-qwik-example` `index.html` (has `og:locale` / `og:site_name`; not an Ember invariant)
- Prior: OG/Twitter image alt/dimensions report-only (20261107T084238Z)

## Limitations

CodeGraph unindexed. No Facebook Sharing Debugger, LinkedIn inspector, or X card validator run. No X handle is recorded in this repository.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Base `main` `2c35eb4da5c2bbd542f730f80e9d8c56e3acd91d` / head `bughunter/20261107T090638Z-08737ed637b245a0822382f80abc0211-ember`
- `pnpm test` **NOT RUN BY BUGHUNTER**.
