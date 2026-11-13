# Ember host WCAG 3.1.4 abbreviations (GTM)

- **Scope:** WCAG 2.2 SC 3.1.4 Abbreviations (AAA) on host-authored copy: cookie-consent English strings, `QratiDemo` template, `index.html` metadata. Excludes embed widget internals, 3.1.1 (#20), 3.1.2 (20261110T111938Z), 3.1.3 (20261113T192038Z), 3.1.5/3.1.6.
- **Base:** `origin/main` at `f98a4a738ec499750a8715b5b1eb7bfd613549c5`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T200039Z-533db56307c7428da5d6afac34f360f4-qrati-connect-ember-example`, `bughunter/20261113T200039Z-533db56307c7428da5d6afac34f360f4-ember-faq`.
- **Run:** `20261113T200039Z-533db56307c7428da5d6afac34f360f4`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` qrati-admin checkout skipped (open PRs #121/#122). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Cookie preferences use unexpanded GTM ID** — **Evidence:** `app/lib/cookieConsent.ts` analytics `preferencesModal` description; trigger is footer Cookie Preferences, first-layer Manage preferences, or geo opt-in autoShow. **Failure:** WCAG 3.1.4 requires a mechanism for the expanded form of abbreviations that have not become part of the language; `GTM` had none. **Fix:** G97 first-use expansion `Google Tag Manager (GTM) ID`. **Test:** `tests/unit/consent-gtm-abbreviation-test.ts` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty. Worker (`src/worker.ts`) substitutes `__GTM_ID__` in HTML only; it does not author consent copy.
2. `QratiDemo` constructor calls `initCookieConsent()`. Footer button `openCookiePreferences` → `CookieConsent.showPreferences()`.
3. User-visible analytics section (only host `GTM` string): `Optional analytics cookies are used only when you accept them and a GTM ID is configured.`
4. No `<abbr>`, first-use expansion, glossary, or definition link.
5. [WCAG 2.2 SC 3.1.4](https://www.w3.org/TR/WCAG22/#abbreviations): a mechanism for identifying the expanded form or meaning of abbreviations is available. [Understanding 3.1.4](https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html): IBM/NASA-style names used as words are exempt; beyond that, common/familiar abbreviations are not exempt. GTM is not a dictionary word.
6. Sibling host tokens: `HEIC` is the image-format proper name in a media-ops list (like JPEG); `URL`/`ID` are dictionary words; `npm` / `VS Code` are product names. FAQ heading is already expanded (“Frequently asked questions”). No other host-authored GTM copy.

Authz/validation/persistence: none (public demo). Side effect of this path: consent UI copy only.

Open PRs at selection: none (`OPEN_PR_COUNT=0`).

## Falsification

- **GTM is as familiar as IBM/NASA:** Understanding’s exemption is for names used as words in their own right (trademarks/org names). GTM remains an initialism for Google Tag Manager, not the product’s marketed name.
- **Developer-only audience:** the preferences modal is shown to every visitor who opens Cookie Preferences or (in opt-in geos) the first-layer flow.
- **`<abbr title>` required:** G97 first-use expansion is sufficient; vanilla-cookieconsent descriptions are plain text, so inline expansion is the safe mechanism.
- **Issue search** `GTM OR abbreviation OR 3.1.4 OR Google Tag Manager OR HEIC`: no matching open/closed 3.1.4 issue. Prior 3.1.3 report deferred this SC. Created #171.

## Disposition

Confirmed P3. Issue [#171](https://github.com/qrati-labs/qrati-connect-ember-example/issues/171). Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

`tests/unit/consent-gtm-abbreviation-test.ts` — analytics description contains `Google Tag Manager (GTM) ID` and not a bare `GTM ID`. `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check`.

## Citations

- [WCAG 2.2 SC 3.1.4 Abbreviations](https://www.w3.org/TR/WCAG22/#abbreviations)
- [WCAG 2.2 Understanding SC 3.1.4](https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html)
- [G97: Providing the first use of an abbreviation immediately before or after the expanded form](https://www.w3.org/WAI/WCAG22/Techniques/general/G97)
- `app/lib/cookieConsent.ts`, `app/components/qrati-demo.gts`
- Prior: 3.1.3 unusual words (20261113T192038Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.1.4 Understanding (search snippets 2026-11-13). Embed widget copy is out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T20:00:39Z | 2026-11-13T20:01:03Z | 01:30:39 | 01:31:03 | 00:00:25 (0.4 min) |
| `audit` | 2026-11-13T20:01:17Z | 2026-11-13T20:04:17Z | 01:31:17 | 01:34:17 | 00:03:01 (3.0 min) |
| `delivery` | 2026-11-13T20:03:45Z | 2026-11-13T20:04:17Z | 01:33:45 | 01:34:17 | 00:00:33 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-13T20:00:39Z | 2026-11-13T20:04:17Z | 01:30:39 | 01:34:17 | **00:03:39 (3.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:00 (0.0 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T200039Z-533db56307c7428da5d6afac34f360f4.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: https://github.com/qrati-labs/qrati-connect-ember-example/issues/171
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/172
- Base `main` `f98a4a738ec499750a8715b5b1eb7bfd613549c5` / head `bughunter/20261113T200039Z-533db56307c7428da5d6afac34f360f4-ember-faq` `ffe46cbc34975b05b54dd697372b8986959cdd7c`
- `closingIssuesReferences`: #171
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending
- Local tests **NOT RUN BY BUGHUNTER**
