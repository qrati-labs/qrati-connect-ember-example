# Ember host WCAG 3.1.2 language of parts

- **Scope:** WCAG 2.2 SC 3.1.2 Language of Parts on host-authored copy: production `index.html`, `QratiDemo` template, cookie-consent English strings, Worker HTML rewrite. Excludes embed widget internals, 3.1.1 document language (#20 / 20261106T130238Z), 3.1.3 unusual words (AAA), screen-reader pronunciation quality.
- **Base:** `origin/main` at `13fd81aa449e036161c94bd8631994d2a0e70c53`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T111938Z-32851e0313f243de82f429a548a52867-qrati-connect-ember-example`, `bughunter/20261110T111938Z-32851e0313f243de82f429a548a52867-ember`.
- **Run:** `20261110T111938Z-32851e0313f243de82f429a548a52867`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to ... No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: Worker (`src/worker.ts`) serves one HTML document at `/connect/ember-example`. `index.html` declares `<html lang="en">` (issue #20). Worker rewrites only `__GTM_ID__`; it does not strip or replace `lang`, and it does not set `Content-Language`.
2. Host UI: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). `config/environment.js` `locationType: 'history'`, `rootURL: '/'`.
3. Host-authored strings in `app/components/qrati-demo.gts` (hero, feature map, FAQ, CTA, footer, theme toggle) are English. Non-ASCII glyphs are punctuation/emoji only (`©`, `·`, `→`, `☀`, `✓`, `🌙`), not another human language. No inner `lang` / `xml:lang` / `hreflang`.
4. Cookie chrome: `app/lib/cookieConsent.ts` `language.default: 'en'` with a single `translations.en` catalog (consent + preferences copy). No other locale catalogs.
5. Names/terms that are not English dictionary prose: product/brand (`Qrati`, `Qrati Connect`, `Qrati Labs`, `Ember`, `GitHub`, `VS Code`, `npm`), technical tokens (`HEIC`, `GTM`, `embed.js`, `organization ID`). These are proper names or technical terms under 3.1.2 exceptions.
6. [WCAG 2.2 SC 3.1.2](https://www.w3.org/TR/WCAG22/#language-of-parts): the human language of each passage or phrase can be programmatically determined except for proper names, technical terms, words of indeterminate language, and vernacular borrowings. [Understanding 3.1.2](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html): when no other language is specified for a phrase, its language is the page default (3.1.1). Single-language documents therefore satisfy 3.1.2 via the root `lang`. Sufficient technique [H58](https://www.w3.org/WAI/WCAG22/Techniques/html/H58) applies only when a passage actually changes language.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing inner `lang` on every heading/button fails 3.1.2:** Understanding: unmarked passages inherit the page language. Inner `lang` is required only for a real language change.
- **`Qrati` / `Ember` / `npm` / `HEIC` need `lang`:** proper names and technical terms are explicit exceptions; authors are encouraged but not required to mark source language for pronunciation.
- **Emoji in the theme toggle (`☀ Light` / `🌙 Dark`) are a second language:** not human-language passages; adjacent words are English.
- **Cookie-consent modal is a separate document without `lang`:** vanilla-cookieconsent uses the configured `language.default: 'en'` on the English-only host; not a language change relative to `html lang="en"`.
- **Embed gallery copy in other languages fails this host SC:** widget internals are out of scope; host markup does not include that copy.
- **Issue search** `language of parts OR 3.1.2 OR lang`: closed #20 (3.1.1 `html lang`). Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.1.2 Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html)
- [WCAG 2.2 SC 3.1.2](https://www.w3.org/TR/WCAG22/#language-of-parts)
- [H58: Using language attributes to identify changes in the human language](https://www.w3.org/WAI/WCAG22/Techniques/html/H58)
- `index.html` (`<html lang="en">`)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `src/worker.ts`
- Prior: 3.1.1 html lang (#20 / 20261106T130238Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.1.2 Understanding (search snippets 2026-11-10). Embed widget routes and qrati-web localized pages are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Base `main` `13fd81aa449e036161c94bd8631994d2a0e70c53` / head `bughunter/20261110T111938Z-32851e0313f243de82f429a548a52867-ember`
- `closingIssuesReferences`: none
- Checks: pending. `pnpm test` **NOT RUN BY BUGHUNTER**.
