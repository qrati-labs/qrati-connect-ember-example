# Ember host document language (`html lang`)

- **Run:** `20261106T130238Z-0201b98899084c2692f1a9cfa131b6b7`
- **Repository:** `qrati-labs/qrati-connect-ember-example`
- **Base:** fetched `origin/main` at `c7295f377023965a5996676bd625cec328e9d218` (`c7295f3 fix(a11y): raise Contact CTA text contrast (#19)`)
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T130238Z-0201b98899084c2692f1a9cfa131b6b7-ember`
- **Branch:** `bughunter/20261106T130238Z-0201b98899084c2692f1a9cfa131b6b7-ember`
- **Workflow:** host production document language (`index.html` `<html>` / WCAG 3.1.1)
- **Disposition:** P3 confirmed; `<html lang="en">`; issue [#20](https://github.com/qrati-labs/qrati-connect-ember-example/issues/20)
- **Ownership:** `qrati-connect-ember-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent). `qrati-admin` checkout `REPO=main` worktree add failed: `fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Host page omits `html lang`** — **Evidence:** `index.html` line 2 is a bare `<html>`. Vite `base` is `/connect/ember-example/`; no plugin sets language. `application.gts` and `QratiDemo` never assign `document.documentElement.lang`. Host copy is English (`cookieConsent.ts` `language.default: 'en'`). Sibling Connect examples ship `<html lang="en">`. **Failure:** [WCAG 2.2 SC 3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html) (Level A) requires the default human language to be programmatically determined; sufficient technique [H57](https://www.w3.org/WAI/WCAG22/Techniques/html/H57) is `lang` on the HTML element. Screen readers may use the wrong pronunciation rules. **Fix:** `<html lang="en">`. **Test:** `tests/unit/index-html-lang-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: browser/AT loads the Worker-served production `index.html`.
2. Inputs: public page; no authz.
3. Output: root element had no `lang` / `xml:lang`.
4. Worker (`src/worker.ts`) rewrites HTML only for `__GTM_ID__`; it does not add `lang`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **HTTP `Content-Language`:** not set in `src/worker.ts`; not a substitute for in-document language (H57).
- **Ember `pageTitle` / runtime:** does not set `lang`.
- **`tests/index.html`:** QUnit harness, not the public page; left unchanged.
- **Intentional omission:** sibling examples all declare `lang="en"`; English is the only host language.

## Scope and non-goals

Host Ember example production `index.html` document language only. Not cookie-consent, not embed widget, not CTA contrast, not `tests/index.html`.

## Tests and verification

- Authored: `tests/unit/index-html-lang-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used
- Primary docs: [Understanding 3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)

## Limitations

No screen-reader or axe run. `?raw` import of `index.html` is assumed available in this Embroider/Vite test build (same pattern as `tests/unit/index-html-head-test.ts`).

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_PLACEHOLDER

## PR / checks

PR pending remote read-back.
