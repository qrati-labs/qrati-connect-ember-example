# Ember host favicon vs OS `prefers-color-scheme`

- **Scope:** Tab / bookmarks icon selection on production `index.html`: `rel="icon"` SVG + PNG, optional `media="(prefers-color-scheme: …)"` pairs, `mask-icon`, versus the shipped `public/qrati-logo-square.svg` / `favicon.svg` / PNG. Excludes apple-touch-icon / PNG bitmap (20261107T081838Z), social OG/Twitter image (#16), theme-color / web app manifest (20261107T014838Z), color-scheme meta (20261114T014938Z), crawler robots/sitemap, cookie consent, embed mount.
- **Base:** `origin/main` at `38e4bdc21bc6cd378eced133da400d87ea8e4d02`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T025838Z-03a5cdea2c8c449ea55e0ae02b9ed44f-ember`, `bughunter/20261114T025838Z-03a5cdea2c8c449ea55e0ae02b9ed44f-ember`.
- **Run:** `20261114T025838Z-03a5cdea2c8c449ea55e0ae02b9ed44f`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `index.html` `<head>` declares two tab icons after canonical:
   - `rel="icon" type="image/svg+xml" href="/connect/ember-example/qrati-logo-square.svg"`
   - `rel="icon" type="image/png" sizes="32x32" href="/connect/ember-example/qrati-connect-logo-square.png"`
   Neither has a `media` attribute. There is no `rel="mask-icon"` and no second SVG/PNG gated on `(prefers-color-scheme: dark)` or `light`.
2. `public/qrati-logo-square.svg` (also duplicated as `public/favicon.svg`, same 152×152 `viewBox`) paints the brand mark with `fill="#ff4800"` on a transparent canvas. A leftover Inkscape path uses `fill-opacity:0` and is not the visible glyph. The PNG is the square Connect logo already used as apple-touch-icon (20261107T081838Z).
3. Worker (`src/worker.ts`) prefix-strips `/connect/ember-example` then `ASSETS.fetch`; it does not inject icon links. `public/` has no `_headers`.
4. [MDN `<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link): if several `rel="icon"` links exist, the UA uses `media`, `type`, and `sizes` as hints and picks the most appropriate (last among equals). `media` is optional. [MDN `rel` / `icon`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel): the icon keyword itself is optional; a document without any icon link is still valid.
5. `prefers-color-scheme` is the **OS/UA** theme, not `qc-theme` / `data-theme`. A `media` pair would not follow the in-page theme toggle (same split as theme-color, 20261107T014838Z).

Authz/validation/persistence: none (public demo). Side effects: browser fetches the SVG and/or PNG for chrome. Errors: if the SVG fails, the PNG `sizes="32x32"` hint remains; if both fail, the UA uses its default.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Orange-on-transparent SVG vanishes on dark browser chrome:** not established. `#ff4800` is the host brand accent (also `--brand-accent` / `--cta-bg` family) and remains a saturated orange on both light and dark tab strips. The PNG is an independent bitmap, not a black-only glyph.
- **Missing `media="(prefers-color-scheme: dark)"` icon is a broken host contract:** MDN documents `media` as an optional selector among multiple icons, not a requirement. README, `tests/unit/index-html-head-test.ts` (OG URL + subpath favicon hrefs only), and apple-touch audit do not require scheme-paired icons.
- **Must add `mask-icon` for Safari pinned tabs:** non-standard Safari chrome; not a documented invariant of this example.
- **`favicon.svg` unused while `qrati-logo-square.svg` is linked:** both files are the same 152×152 square SVG. Duplicate on disk is not a tab-icon failure.
- **Issue search** `favicon OR mask-icon OR "prefers-color-scheme" icon OR "dark icon"`: closed #16 (OG/Twitter image URLs and document-relative favicon hrefs) and unrelated #18 (CTA contrast). No open duplicate. `gh issue list --state open` is empty.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [MDN `<link>` — icons and `media`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link)
- [MDN `rel` attribute — `icon`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel)
- `index.html` (`rel="icon"` SVG + PNG; no `media`, no `mask-icon`)
- `public/qrati-logo-square.svg` (`fill="#ff4800"`)
- Prior: apple-touch-icon (20261107T081838Z); social head (#16); theme-color (20261107T014838Z); color-scheme meta (20261114T014938Z)

## Limitations

CodeGraph unindexed. No browser session comparing light vs dark OS chrome. Live `https://qrati.com/connect/ember-example` was not used as evidence (historical deployment 404 out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PENDING

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T025838Z-03a5cdea2c8c449ea55e0ae02b9ed44f.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- `closingIssuesReferences`: none
- Assignees: none (repo unmapped; no guessed owner)
- Local tests **NOT RUN BY BUGHUNTER**
