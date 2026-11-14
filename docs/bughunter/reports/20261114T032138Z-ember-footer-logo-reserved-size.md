# Ember footer brand image reserved size

- **Scope:** First-paint layout reservation for the host footer `<img>` in `QratiDemo`: HTML `width`/`height` / CSS `aspect-ratio` versus `.footer-brand img { width: auto; height: 2.25rem }`. Excludes footer logo CDN availability / alt (2026-10-21), Iconify reserved box (#38), apple-touch / PNG favicon (20261107T081838Z), embed mount CLS (20261107T075138Z), cookie consent, Worker routing.
- **Base:** `origin/main` at `d6b11b4ece65c86d0ba616a0c2ffb26115d82983`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T032138Z-10e3f32c85f543c3b1e49130aaaafc4c-ember`, `bughunter/20261114T032138Z-10e3f32c85f543c3b1e49130aaaafc4c-ember`.
- **Run:** `20261114T032138Z-10e3f32c85f543c3b1e49130aaaafc4c`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Footer brand markup is in `app/components/qrati-demo.gts`: `<img src="https://assets.qrati.com/images/qrati-connect-logo-square.png" alt="Qrati Connect logo" referrerpolicy="no-referrer" />`. No `width`, `height`, `loading`, or `decoding` attributes. Adjacent copy is `.footer-title` / tagline in a flex row (`.footer-brand { display: flex; align-items: center; gap: 0.85rem }`).
2. Host CSS (`app/styles/app.css`): `.footer-brand img { width: auto; height: 2.25rem; }`. No `aspect-ratio`. Vertical used height is therefore specified before decode. Horizontal used width depends on the replaced element’s intrinsic ratio once the PNG is available.
3. Local sibling bitmap `public/qrati-connect-logo-square.png` is 128×128 RGBA (square). The live `src` is the CDN path audited 2026-10-21, not this file. Repo-wide host chrome has one other `<img>` (this footer). Action-pill SVGs already set `width="16" height="16"`.
4. [web.dev Optimize CLS](https://web.dev/articles/optimize-cls): include HTML `width`/`height` **or** reserve space with CSS `aspect-ratio` **or similar**. [web.dev Serve images with correct dimensions](https://web.dev/articles/serve-images-with-correct-dimensions): without those attributes **or equivalent CSS sizing**, the UA cannot allocate space until decode. This host already applies equivalent CSS **height**. The documented failure class is the responsive `width: 100%; height: auto` pattern without attributes — not this rule.
5. Iconify #38 reserved a 1em box because the unregistered custom element is 0×0 until deferred JS. An HTML `<img>` with specified CSS height is not that element class.

Authz/validation/persistence: none (public demo). Side effects: GET of `assets.qrati.com` (existing footer path). Errors: missing bitmap leaves alt text; CSS height still holds a 2.25rem row.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing HTML `width`/`height` is the same defect as Iconify #38:** contradicted. #38’s host was an empty custom element with no used size. This `<img>` has `height: 2.25rem` in author CSS.
- **Must add `width="128" height="128"` because web.dev says always:** authoring SHOULD for CLS. Equivalent CSS sizing is an accepted alternative. No README / `index-html-head` / footer test requires attributes. Unmeasured horizontal shift after decode is not a pixel-proven failure (same bar as 2.4.11 overlay geometry).
- **CDN PNG may not be square, so CSS height alone distorts then snaps:** not evidenced. Local square PNG is 128×128; live CDN bytes were not fetched this run. Distortion would be a different defect class (wrong bitmap), not missing attributes.
- **Sibling connect examples already set attributes, so Ember is a regression:** Preact / React / Vue / Next / Qwik footer imgs use the same CDN URL without `width`/`height`. `qrati-web` marketing `width="28" height="28"` is a different app.
- **Issue search** `footer logo OR layout shift OR CLS OR aspect-ratio OR footer-brand`: closed #38 only (Iconify). Open issue list empty. No duplicate. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [web.dev — Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls)
- [web.dev — Serve images with correct dimensions](https://web.dev/articles/serve-images-with-correct-dimensions)
- `app/components/qrati-demo.gts` (footer `<img>`; no width/height)
- `app/styles/app.css` (`.footer-brand img { width: auto; height: 2.25rem }`)
- `public/qrati-connect-logo-square.png` (128×128)
- Prior: footer brand CDN/alt (2026-10-21); Iconify reserved size (#38)

## Limitations

CodeGraph unindexed. No browser CLS session. CDN bitmap bytes not fetched. Live `https://qrati.com/connect/ember-example` not used as evidence (historical deployment 404 out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T032138Z-10e3f32c85f543c3b1e49130aaaafc4c.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: (filled after open)
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
