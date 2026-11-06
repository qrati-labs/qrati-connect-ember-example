# Ember example social document-head identity

- **Run:** `20261106T115738Z-5b2e7ec6cf414781b2f3092b898dfaa1`
- **Scope:** Public document-head identity for crawlers and social unfurls (`index.html` favicon + Open Graph / Twitter Card tags) on `qrati-connect-ember-example`.
- **Base:** `origin/main` `4051c6052c0316ccfac3cc0344259a7e092221a5`
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T115738Z-5b2e7ec6cf414781b2f3092b898dfaa1-ember`
- **Branch:** `bughunter/20261106T115738Z-5b2e7ec6cf414781b2f3092b898dfaa1-ember`
- **Disposition:** Confirmed defect; narrow head-tag fix. Issue [#16](https://github.com/qrati-labs/qrati-connect-ember-example/issues/16).

## Candidate selection

Preflight used once. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent). `REPO=main` (qrati-admin) worktree add failed: `fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`. Selected next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[low] Social crawlers get no Open Graph image; favicon is document-relative on a no-slash canonical URL.**

**Evidence:** `index.html` had title, description, robots, and canonical but no `og:*` / `twitter:*` tags, despite `public/qrati-connect-og.png`. The only icon was `href="./qrati-logo-square.svg"`. Canonical and sitemap loc are `https://qrati.com/connect/ember-example` (no trailing slash). WHATWG URL resolution maps `./qrati-logo-square.svg` to `https://qrati.com/connect/qrati-logo-square.svg`, which is outside this Worker route (`*qrati.com/connect/ember-example*`) and is not rewritten by `src/worker.ts`. Sibling `qrati-connect-qwik-example/index.html` already declares absolute OG/Twitter image URLs and a subpath PNG favicon. Open Graph basics: https://ogp.me/ (`og:title`, `og:type`, `og:image`, `og:url`).

**Failure:** Indexed demo unfurls without the shipped preview image; browsers on the canonical URL request the favicon off this Worker’s prefix.

**Fix:** Absolute subpath favicon/apple-touch-icon hrefs plus OG/Twitter tags pointing at `https://qrati.com/connect/ember-example/qrati-connect-og.png`.

**Test:** `tests/unit/index-html-head-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Root cause

Document-head identity was only partially filled (title/description/canonical) and never wired to the shipped OG/favicon assets or the Vite/Worker subpath base.

## Ownership

`web/ownership.html` has no assignment for `qrati-connect-ember-example`. No owner was guessed or invited. Issue #16 remains unassigned.

## Tests and commands

- Authored: `tests/unit/index-html-head-test.ts` (Vite `?raw` import of production `index.html`).
- `git diff --check` — clean (no output).
- `pnpm test` / lint / type-check / build / install — **NOT RUN BY BUGHUNTER**.

## Limitations

- Vite may prefix leading-slash HTML URLs with `base` (`/connect/ember-example/`). Sibling Qwik uses the same `/connect/<example>/…` icon hrefs; if Vite rewrites those paths, icons could double-prefix. Not verified locally (no build).
- No live production GET was made.
- `?raw` import of `index.html` is assumed available in this Embroider/Vite test build.

## Timing

Measured wall-clock from `bughunter-timing.py finish` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T11:57:38Z | 2026-11-06T11:58:00Z | 17:27:38 | 17:28:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-06T11:58:19Z | 2026-11-06T12:01:52Z | 17:28:19 | 17:31:52 | 00:03:33 (3.5 min) |
| `delivery` | 2026-11-06T12:01:52Z | 2026-11-06T12:02:42Z | 17:31:52 | 17:32:42 | 00:00:50 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-06T11:57:38Z | 2026-11-06T12:02:42Z | 17:27:38 | 17:32:42 | **00:05:04 (5.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:18 (0.3 min) |

## PR / checks

PR [#17](https://github.com/qrati-labs/qrati-connect-ember-example/pull/17): `Fixes #16`; `MERGEABLE`; base `main` `4051c6052c0316ccfac3cc0344259a7e092221a5`; head `26f849784c802ee16e0881e8916ab2c8793fe1f9`. At first readback, CI Lint and Test were QUEUED; Cloudflare Workers Builds was IN_PROGRESS. Example repo: squash-merge with branch deletion after this report update.
