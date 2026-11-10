# Ember host WCAG 1.4.5 images of text

- **Scope:** WCAG 2.2 SC 1.4.5 Images of Text for host-authored UI in `QratiDemo`: headings, body copy, theme toggle, action pills, feature-map / SEO cards, FAQ, Contact CTA, footer brand, cookie-consent copy, quickstart `<pre>`, host CSS (including `#cc-main` tokens), theme boot script, Cloudflare Worker HTML path. Includes vanilla-cookieconsent **3.1.0** as configured by this host (`app/lib/cookieConsent.ts`). Excludes embed internals (`qrati-connect` / `embed.js` gallery media), 1.1.1 non-text content (20261109T233938Z), 1.4.3 contrast (20261109T214938Z), 1.4.4/viewport zoom (20261107T115038Z).
- **Base:** `origin/main` at `2a9eeb64834529945d4518e0f1c7796fdb3c2901`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T101738Z-4d7c647abf8c4af296b4ccb48678ef30-qrati-connect-ember-example`, `bughunter/20261110T101738Z-4d7c647abf8c4af296b4ccb48678ef30-ember`.
- **Run:** `20261110T101738Z-4d7c647abf8c4af296b4ccb48678ef30`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` (`qrati-admin` SHA) has open PRs #121/#122 — skipped. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome and marketing copy live in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `index.html` inline theme boot only sets `data-theme`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject bitmaps of text.
2. Headings, hero copy, short-answer, feature-map titles/body, FAQ summaries, Contact CTA, footer nav, theme-toggle label (`☀ Light` / `🌙 Dark`), and cookie-consent modal strings are HTML/Unicode text. Visual presentation is CSS (`Inter` / `Sora` webfonts, `clamp()` sizes, colors, letter-spacing) — [C22](https://www.w3.org/WAI/WCAG22/Techniques/css/C22) style control, not image replacement.
3. Host `app/styles/app.css` has **no** `background-image` of glyphs, **no** `text-indent` image-replacement, **no** `-webkit-text-fill` bitmap trick. Google Fonts `@import` loads real fonts, not raster text.
4. Sole in-page `<img>` is the footer brand (`https://assets.qrati.com/images/qrati-connect-logo-square.png`, `alt="Qrati Connect logo"`). Adjacent `.footer-title` is live text (`Qrati Connect`). [WCAG 2.2 SC 1.4.5](https://www.w3.org/TR/WCAG22/#images-of-text) treats logotypes as **essential**. Favicon / apple-touch-icon / `og:image` are not in-page text presentation.
5. Action-pill SVGs and `iconify-icon` marks are decorative icons (`aria-hidden` on the GitHub/VS Code SVGs; material-symbol icons next to `<h3>` text). They do not substitute for readable sentences.
6. Quickstart snippet is a `<pre><code>` text node, not a screenshot. CookieConsent **3.1.0** buttons/labels are CSS-styled text from `language.translations.en`.
7. [Understanding 1.4.5](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text): if CSS can achieve the presentation, use text; logotypes are essential. Host meets the criterion.

Authz/validation: public demo. Persistence: `qc-theme` localStorage; geo `sessionStorage`; consent cookie after preference click. Side effects: optional GTM inject after analytics consent. Errors: geo fetch fail-closed.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Footer logo is a non-essential image of text:** SC note: logotypes are essential. Brand wordmark is also repeated as HTML in `.footer-title`.
- **OG / social PNG is in-page text:** `qrati-connect-og.png` is metadata (`og:image` / `twitter:image`), not rendered as page copy.
- **Iconify / SVG paths encode letters that should be text:** controls have visible text labels; icons are not the sole information.
- **Cookie-consent library paints buttons as images:** 3.1.0 consent/preferences UI is HTML + CSS; host translations are strings.
- **Embed gallery captions as images:** out of scope; not claimed.
- **Issue search** `images of text OR 1.4.5 OR logotype OR image of text`: no matching issues. Open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.5 Images of Text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text)
- [WCAG 2.2 SC 1.4.5](https://www.w3.org/TR/WCAG22/#images-of-text)
- `app/components/qrati-demo.gts` (HTML text + one logotype `<img>`)
- `app/styles/app.css` (webfonts/CSS presentation; no image-replacement)
- `app/lib/cookieConsent.ts` / `index.html` / `src/worker.ts`
- Prior: 1.1.1 (20261109T233938Z), 1.4.3 (20261109T214938Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS/JS and WCAG 1.4.5 Understanding. Embed widget media not claimed. `node_modules` absent in the worktree (library UI from 3.1.0 host config + prior UMD knowledge).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T10:17:38Z | 2026-11-10T10:18:00Z | 15:47:38 | 15:48:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T10:18:18Z | 2026-11-10T10:20:02Z | 15:48:18 | 15:50:02 | 00:01:43 (1.7 min) |
| `delivery` | 2026-11-10T10:20:02Z | 2026-11-10T10:21:02Z | 15:50:02 | 15:51:02 | 00:01:00 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-10T10:17:38Z | 2026-11-10T10:21:02Z | 15:47:38 | 15:51:02 | **00:03:24 (3.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:18 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T101738Z-4d7c647abf8c4af296b4ccb48678ef30.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/122
- Base `main` `2a9eeb64834529945d4518e0f1c7796fdb3c2901` / head `bughunter/20261110T101738Z-4d7c647abf8c4af296b4ccb48678ef30-ember`
- `closingIssuesReferences`: none
