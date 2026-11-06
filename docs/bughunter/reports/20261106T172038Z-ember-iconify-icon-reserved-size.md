# Ember Iconify icon reserved size

- **Scope:** Feature-map and SEO feature-card `<iconify-icon>` hosts vs first-paint layout (`index.html` Iconify script, `app/components/qrati-demo.gts`, `app/styles/app.css`).
- **Base:** `origin/main` at `bd4cb2e20ae9807b816bd0c65b549932ecea65a9`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T172038Z-14c2f9a6e429423eb755a94d56c36d83-ember`, `bughunter/20261106T172038Z-14c2f9a6e429423eb755a94d56c36d83-ember`.
- **Run:** `20261106T172038Z-14c2f9a6e429423eb755a94d56c36d83`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` (qrati-admin) worktree add failed: `fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Iconify icons have no reserved size so feature cards shift on load** — **Evidence:** `index.html` loads `iconify-icon.min.js` with `defer`. `QratiDemo` renders 10 `<iconify-icon>` hosts (6 feature-map headings + 4 SEO feature cards) with no width/height attributes. Host CSS set `font-size: 1.5rem; flex: none` only. Iconify documents that the unregistered host has no intrinsic size and that omitting `display: inline-block; width: 1em; height: 1em` causes layout shift ([Iconify Icon web component](https://iconify.design/docs/iconify-icon/)). **Failure:** first paint of the capability map and “why developers choose” grids jumps when the deferred script upgrades the elements and fetches SVG. **Fix:** global `iconify-icon { display: inline-block; width: 1em; height: 1em; }` so CSS sizes the host before JS. **Test:** `tests/unit/iconify-icon-reserved-size-test.ts` via `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `application.gts` → `QratiDemo`; constructor sets theme/consent (out of scope).
2. Head: deferred Iconify web component from `code.iconify.design`.
3. Template: feature-map `h3` preceded by `<iconify-icon icon="material-symbols:…">`; SEO cards the same.
4. CSS: color + 1.5rem font-size; empty custom element still 0×0 until upgrade.
5. Iconify then loads icon data (API) into shadow DOM — second layout change without a reserved box.

## Falsification

- Not decorative-only “no impact”: Iconify’s own layout-shift section exists because empty hosts collapse.
- `flex: none` does not assign used width/height to an empty inline custom element.
- `.seo-feature-card > iconify-icon { display: block }` still inherits the reserved 1em width/height; left as-is.
- `aria-hidden` on decorative icons not claimed here (shadow SVG a11y unconfirmed without AT).
- No duplicate issue (`gh issue list --state all`).

## Disposition

Confirmed P3 layout defect. Issue [#38](https://github.com/qrati-labs/qrati-connect-ember-example/issues/38). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/iconify-icon-reserved-size-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Patch hygiene: `git diff --check` — no whitespace errors

## Citations

- [Iconify Icon web component — Layout shift](https://iconify.design/docs/iconify-icon/)
- `index.html` Iconify script; `app/components/qrati-demo.gts` feature-map / SEO cards; `app/styles/app.css`

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser session or CLS measurement. Local unit tests not executed per BugHunter boundary.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T17:20:38Z | 2026-11-06T17:21:01Z | 22:50:38 | 22:51:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T17:21:16Z | 2026-11-06T17:29:59Z | 22:51:16 | 22:59:59 | 00:08:43 (8.7 min) |
| **Total run (preflight start to finish)** | 2026-11-06T17:20:38Z | 2026-11-06T17:29:59Z | 22:50:38 | 22:59:59 | **00:09:21 (9.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:15 (0.2 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T172038Z-14c2f9a6e429423eb755a94d56c36d83.json`.
