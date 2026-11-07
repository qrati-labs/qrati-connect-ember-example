# Ember host apple-touch-icon and PNG favicon bitmap

- **Scope:** Host document-head Web Clip / tab icons: `index.html` `rel="apple-touch-icon"` and `rel="icon"` PNG (`sizes="32x32"`) pointing at `public/qrati-connect-logo-square.png`, versus the SVG favicon and OG image. Excludes Open Graph/Twitter tags and document-relative favicon (issue #16), `theme-color` / manifest (20261107T014838Z), crawler robots/sitemap, cookie consent, embed mount.
- **Base:** `origin/main` at `939513fd1fe048f734dd2e8b17bd45c08019f8d1`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T081838Z-50c62a0cbdea4f2fa9fde7f2cf6da81b-qrati-connect-ember-example`, `bughunter/20261107T081838Z-50c62a0cbdea4f2fa9fde7f2cf6da81b-ember`.
- **Run:** `20261107T081838Z-50c62a0cbdea4f2fa9fde7f2cf6da81b`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: production `index.html` `<head>` declares (in order) SVG favicon `/connect/ember-example/qrati-logo-square.svg`, PNG favicon `type="image/png" sizes="32x32"` `/connect/ember-example/qrati-connect-logo-square.png`, and `rel="apple-touch-icon"` at the same PNG href. Worker prefix strip maps those URLs onto `public/` (prior worker-routing / social-head work).
2. On-disk bitmaps (this worktree, PNG IHDR + IDAT):
   - `public/qrati-connect-logo-square.png`: 128×128, color type 6 (RGBA). Fully transparent pixels 11017/16384 (67%), partial alpha 4713, opaque 654.
   - `public/qrati-connect-og.png`: 1200×630, color type 3 (indexed), used only as `og:image` / `twitter:image` (out of scope except as a non-square opaque sibling).
   - SVG favicons `qrati-logo-square.svg` / `favicon.svg`: 152×152 `viewBox`.
3. `tests/unit/index-html-head-test.ts` asserts subpath hrefs for SVG+PNG icons and OG/Twitter image URLs. It does not assert PNG pixel size, `sizes`, opacity, or a distinct apple-touch asset.
4. HTML Standard, link type `icon`: `sizes` keywords represent bitmap pixel sizes **actually available** in the linked resource (`32x32` is declared; the file is 128×128). User agents pick among icons using `type` / `media` / `sizes`; SVG is also advertised.
5. Apple archived *Configuring Web Applications*: Web Clip icons are PNG; if no icon matches the device’s recommended size, the smallest larger icon is used, else the largest. The 180×180 retina example is recommended, not required. That document does not state a transparency-fill rule for web clips.

Authz/validation/persistence: none (public static assets). Side effects: browser tab icon and optional iOS “Add to Home Screen” Web Clip. Errors: missing/ignored icons fall back to the SVG favicon or a Safari screenshot; not a thrown host failure.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Transparent apple-touch-icon always paints a black Home Screen Web Clip:** not stated in Apple’s archived web-clip documentation (native App Store icon rejection is a different pipeline). No iOS simulator or device observation in this run. Not claimed.
- **`sizes="32x32"` on a 128×128 PNG breaks tab icons:** authoring MUST in the HTML Standard is a conformance note. SVG favicon is present; UAs that distrust the PNG hint still have a scalable candidate. No demonstrated missing or wrong tab icon.
- **128 < 180 so iOS drops the Web Clip icon:** Apple’s size fallback uses the largest available icon when none is larger than recommended. Soft upscale, not omission.
- **Issue #16 already fixed this path:** #16 was missing OG/Twitter image tags and document-relative favicon hrefs. The follow-up added this PNG as both `rel="icon"` and `apple-touch-icon` without claiming opacity or 180×180. Different workflow; no open duplicate.
- **Sibling Qwik (and others) using the same PNG for apple-touch-icon is an invariant of this repo:** not stated in README or tests. Parity is not a violated Ember-host contract.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [HTML Standard — link type `icon` / `sizes`](https://html.spec.whatwg.org/multipage/links.html#rel-icon)
- [Apple — Configuring Web Applications (archived)](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- `index.html` (SVG icon, PNG `sizes="32x32"`, `apple-touch-icon`)
- `public/qrati-connect-logo-square.png` (128×128 RGBA)
- `tests/unit/index-html-head-test.ts`
- Prior: social document-head identity (#16); theme-color report-only (explicitly excluded apple-touch-icon)

## Limitations

CodeGraph unindexed. No iOS Safari / Web Clip observation. PNG alpha counts from IHDR/IDAT in this worktree, not from the live CDN.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: (filled after open)
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
