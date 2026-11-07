# Ember host Open Graph / Twitter image alt and dimension tags

- **Scope:** Remaining social-unfurl image metadata on production `index.html` after issue [#16](https://github.com/qrati-labs/qrati-connect-ember-example/issues/16): `og:image:alt`, `og:image:width`, `og:image:height`, `og:image:type`, and `twitter:image:alt`, versus the shipped `public/qrati-connect-og.png` bitmap. Excludes missing OG/Twitter image URLs and document-relative favicon (#16), apple-touch-icon / PNG favicon bitmap (20261107T081838Z), JSON-LD identity (20261107T042538Z), crawler robots/sitemap, cookie consent, embed mount.
- **Base:** `origin/main` at `f3a57f2353d80c108363a7c50a0dea385b25ddcb`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T084238Z-d74f46da12d445499cd60b18c285f3ff-ember`, `bughunter/20261107T084238Z-d74f46da12d445499cd60b18c285f3ff-ember`.
- **Run:** `20261107T084238Z-d74f46da12d445499cd60b18c285f3ff`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: production `index.html` `<head>` already declares (issue #16) `og:type`, `og:url`, `og:title`, `og:description`, `og:image` `https://qrati.com/connect/ember-example/qrati-connect-og.png`, `twitter:card` `summary_large_image`, `twitter:title`, `twitter:description`, and `twitter:image` at the same PNG URL. Canonical matches `og:url` and sitemap `loc`.
2. Absent tags: `og:image:alt`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:secure_url`, `twitter:image:alt`. `tests/unit/index-html-head-test.ts` asserts OG/Twitter image URLs and subpath favicons only.
3. On-disk bitmap (this worktree, PNG IHDR): `public/qrati-connect-og.png` is 1200×630, 8-bit indexed (color type 3), 117921 bytes, non-interlaced. That matches the common 1.91:1 share-image size used with `summary_large_image`.
4. Open Graph protocol: `og:image:width` / `:height` / `:type` / `:alt` are **optional structured properties** of `og:image`. It also says a page that specifies `og:image` **should** specify `og:image:alt` (authoring SHOULD, not a crawler MUST). [ogp.me](https://ogp.me/).
5. X/Twitter cards: `twitter:image:alt` is recommended (screen-reader description, typically ≤420 characters) and falls back to `og:image:alt` when omitted. `summary_large_image` image requirement is satisfied by the existing 1200×630 PNG plus `twitter:image` / `og:image`. Card type is already explicit.
6. Sibling `qrati-connect-qwik-example/index.html` declares `og:image:secure_url`, `og:image:width` `1200`, `og:image:height` `630`, `og:image:type` `image/png`, `og:image:alt`, and `twitter:image:alt`. This Ember host does not document those tags in README or tests.

Authz/validation/persistence: none (public static head tags + PNG). Side effects: social crawler unfurl and optional platform alt text. Errors: missing structured properties do not remove `og:image`; crawlers still have an absolute HTTPS PNG.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `og:image:alt` blocks Facebook/LinkedIn/X unfurls:** contradicted by #16’s absolute `og:image` / `twitter:image` and by ogp.me treating width/height/type/alt as optional structured metadata. No crawler session in this run.
- **OGP SHOULD for `og:image:alt` is a product invariant of this repo:** #16’s regression test and README do not require alt or dimension tags. Authoring SHOULD is not a reachable host failure.
- **1200×630 without `og:image:width`/`height` makes crawlers drop the image:** not stated in ogp.me. The file’s IHDR already is 1200×630; dimension tags only duplicate that.
- **`twitter:image` without `twitter:image:alt` fails WCAG 1.1.1 on this page:** 1.1.1 applies to images in the accessibility tree of this document. The OG PNG is not an `<img>` in `index.html`; in-page images (footer logo) already have `alt`. Platform-feed a11y was not observed.
- **Qwik sibling tags are required parity:** same limit as the JSON-LD audit — not stated in this repo’s contract.
- **Issue search** `og:image:alt OR twitter:image:alt OR og:image:width OR "image alt" OR unfurl`: only closed #16 (missing OG/Twitter image URLs). No open duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [The Open Graph protocol — optional image structured properties](https://ogp.me/)
- Issue [#16](https://github.com/qrati-labs/qrati-connect-ember-example/issues/16) / `tests/unit/index-html-head-test.ts`
- `index.html` (`og:image`, `twitter:card`, `twitter:image`; no `:alt` / `:width` / `:height`)
- `public/qrati-connect-og.png` (1200×630, indexed PNG)
- Sibling `qrati-labs/qrati-connect-qwik-example` `index.html` (has alt/width/height; not an Ember invariant)

## Limitations

CodeGraph unindexed. No Facebook Sharing Debugger, LinkedIn inspector, or X card validator run. PNG dimensions from IHDR in this worktree, not from the live CDN.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T08:42:38Z | 2026-11-07T08:42:59Z | 14:12:38 | 14:12:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-07T08:43:15Z | 2026-11-07T08:49:19Z | 14:13:15 | 14:19:19 | 00:06:04 (6.1 min) |
| `delivery` | 2026-11-07T08:49:19Z | 2026-11-07T08:50:10Z | 14:19:19 | 14:20:10 | 00:00:51 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-07T08:42:38Z | 2026-11-07T08:50:10Z | 14:12:38 | 14:20:10 | **00:07:32 (7.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:16 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T084238Z-d74f46da12d445499cd60b18c285f3ff.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/76
- Base `main` `f3a57f2353d80c108363a7c50a0dea385b25ddcb` / head `bughunter/20261107T084238Z-d74f46da12d445499cd60b18c285f3ff-ember`
- Checks at first readback: GitGuardian pass; Lint/Test/Workers Builds pending. `pnpm test` **NOT RUN BY BUGHUNTER**.
