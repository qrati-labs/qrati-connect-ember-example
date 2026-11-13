# Ember host WCAG 1.4.9 images of text (no exception)

- **Scope:** WCAG 2.2 SC 1.4.9 Images of Text (No Exception) (AAA) on host-authored UI: `QratiDemo` headings/body/theme toggle/action pills/feature-map and SEO cards/FAQ/CTA/footer, `app/styles/app.css` presentation, cookie-consent English strings (`vanilla-cookieconsent` 3.1.0 as configured), `index.html` document images, Worker HTML path. Excludes embed widget internals (`qrati-connect` / `embed.js` gallery media), 1.4.5 AA (20261110T101738Z), 1.1.1 (20261109T233938Z), 1.4.8 visual presentation (20261113T135638Z), favicon/OG as page copy.
- **Base:** `origin/main` at `4905f1f99cb3c76f491816630c50ab09873c67eb`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T210039Z-9b01c3e43bb249cba0b83e27d1dc15d3-qrati-connect-ember-example`, `bughunter/20261113T210039Z-9b01c3e43bb249cba0b83e27d1dc15d3-ember`.
- **Run:** `20261113T210039Z-9b01c3e43bb249cba0b83e27d1dc15d3`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty; chore PRs #121/#122 do not overlap a product workflow. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject bitmaps of text.
2. [WCAG 2.2 SC 1.4.9](https://www.w3.org/TR/WCAG22/#images-of-text-no-exception) (AAA): images of text are only used for **pure decoration** or where a particular presentation of text is **essential**. Note: logotypes (text that is part of a logo or brand name) are essential. Unlike 1.4.5, there is **no** “customizable image of text” exception. [Understanding 1.4.9](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html): implement text so users can change font, size, color, spacing, or alignment (sufficient: [C22](https://www.w3.org/WAI/WCAG22/Techniques/css/C22)); identity-bearing logotypes may remain images.
3. Headings, hero copy, short-answer, feature-map titles/body, FAQ summaries, Contact CTA (`Contact Qrati →`), footer nav, theme-toggle (`☀ Light` / `🌙 Dark`), answer-point `✓` prefixes, and cookie-consent modal strings are HTML/Unicode text. Visual presentation is CSS (`Inter` / `Sora` webfonts, `clamp()` sizes, colors, letter-spacing) — C22, not image replacement.
4. `app/styles/app.css` page backgrounds are CSS `radial-gradient` / `linear-gradient` color washes, not glyph bitmaps. No `background-image` of text, no `text-indent` image-replacement, no `-webkit-text-fill` bitmap trick. Google Fonts `@import` loads real fonts.
5. Sole in-page `<img>` is the footer brand (`https://assets.qrati.com/images/qrati-connect-logo-square.png`, `alt="Qrati Connect logo"`). Adjacent `.footer-title` is live HTML (`Qrati Connect`). 1.4.9’s logotype note covers this mark. Favicon / apple-touch-icon / `og:image` / `twitter:image` are browser chrome or crawler metadata, not in-page text.
6. Action-pill SVGs (`aria-hidden="true"`) and ten `iconify-icon` hosts sit beside visible text labels/`h3`; they are icons, not sentences rendered as pictures.
7. Quickstart snippet is a `<pre><code>` text node. CookieConsent **3.1.0** buttons/labels are CSS-styled text from `language.translations.en`. Host does not rely on 1.4.5’s customizable-image exception.

Authz/validation: public demo. Persistence: `qc-theme` localStorage; geo `sessionStorage`; consent cookie after preference click. Side effects: optional GTM inject after analytics consent. Errors: geo fetch fail-closed.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Footer logo is a non-essential image of text (1.4.9 drops 1.4.5’s customizable exception):** SC note still treats logotypes as essential. Adjacent HTML wordmark is extra, not required for the exception.
- **OG / social PNG is in-page text:** `qrati-connect-og.png` is metadata, not rendered as page copy.
- **Iconify / SVG paths encode letters that should be text:** controls have visible text; icons are not the sole information.
- **Cookie-consent library paints buttons as images:** 3.1.0 consent/preferences UI is HTML + CSS; host translations are strings.
- **Embed gallery captions as images:** out of scope; not claimed.
- **Issue search** `1.4.9 OR images of text no exception OR logotype OR image of text`: no matching open issues (open set empty). Closed #171 (GTM expansion) and image-adjacent #38 (icon reserved size) are different SCs. 1.4.5 report (20261110T101738Z) already treated the logotype as essential. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 1.4.9 Images of Text (No Exception)](https://www.w3.org/TR/WCAG22/#images-of-text-no-exception)
- [WCAG 2.2 Understanding SC 1.4.9 Images of Text (No Exception)](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html)
- [C22: Using CSS to control visual presentation of text](https://www.w3.org/WAI/WCAG22/Techniques/css/C22)
- `app/components/qrati-demo.gts`, `app/styles/app.css`, `app/lib/cookieConsent.ts`, `index.html`, `src/worker.ts`
- Prior: 1.4.5 images of text (20261110T101738Z); 1.4.8 visual presentation (20261113T135638Z); 1.1.1 non-text content (20261109T233938Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS/JS and WCAG 1.4.9 Understanding (fetched 2026-11-13). Embed widget media not claimed. `node_modules` absent in the worktree (library UI from 3.1.0 host config).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

timing incomplete

## PR / checks

- Issue: none (report-only)
- PR: pending
- Local tests **NOT RUN BY BUGHUNTER**
