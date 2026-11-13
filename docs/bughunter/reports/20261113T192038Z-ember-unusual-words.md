# Ember host WCAG 3.1.3 unusual words

- **Scope:** WCAG 2.2 SC 3.1.3 Unusual Words (AAA) on host-authored copy: production `index.html` metadata, `QratiDemo` template (hero, feature map, FAQ, CTA, footer, theme toggle), cookie-consent English strings. Excludes embed widget internals, 3.1.1 document language (#20 / 20261106T130238Z), 3.1.2 language of parts (20261110T111938Z), 3.1.4 abbreviations (AAA; e.g. GTM expansion), 3.1.6 pronunciation.
- **Base:** `origin/main` at `9b0ef3bb867141ffec9ad4811c0cabe0e8c7e18e`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T192038Z-08a8bdaacf46468da50e96a6102f101c-ember`, `bughunter/20261113T192038Z-08a8bdaacf46468da50e96a6102f101c-ember`.
- **Run:** `20261113T192038Z-08a8bdaacf46468da50e96a6102f101c`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to ... No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject copy.
2. Host chrome (`app/components/qrati-demo.gts`): English marketing/FAQ/CTA plus integrator tokens (`embed script`, `organization ID`, `hash` router on the injected script, feature-map phrases `Web component`, `hash or memory routing`, `host URL allowlists`, `lightbox`, `HEIC conversion`). Theme toggle labels are `Light` / `Dark`. Footer is brand + nav. No `<dfn>`, `<abbr>`, `<dl>` glossary, or definition links.
3. Cookie chrome (`app/lib/cookieConsent.ts`): English consent/preferences copy. Analytics section mentions `GTM ID` (abbreviation; 3.1.4, out of scope).
4. `index.html` description/OG/Twitter use ordinary English plus `lightbox` in the same photo-gallery sentence. `<html lang="en">`.
5. [WCAG 2.2 SC 3.1.3](https://www.w3.org/TR/WCAG22/#unusual-words) (Level AAA): a mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon. [Understanding 3.1.3](https://www.w3.org/WAI/WCAG22/Understanding/unusual-words): “used in an unusual or restricted way” requires the reader to know exactly which definition applies (WCAG’s own use of “text”). The Understanding example for “gig” states the appropriate definition can be determined from context and is not that case. Jargon is field-specific vocabulary; idioms cannot be deduced from the individual words.
6. Host terms are proper names (`Qrati`, `Ember`, `GitHub`, `VS Code`, `npm`) or industry words used in their ordinary sense, with surrounding feature/FAQ context (uploads card: “HEIC conversion”; gallery card: “lightbox”; FAQ: organization ID connects the embed to the event space). No host-invented restricted definition of a common English word. No idiom whose meaning cannot be deduced (`Give every event a place to come alive` is ordinary figurative English).

Authz/validation/persistence: none (public demo). Side effects: none on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing glossary for HEIC / lightbox / hash routing fails 3.1.3:** G101 applies when a word is used unusually or as field jargon that needs a specific definition. Understanding’s “gig” example: context selects the ordinary sense; a glossary is not required. Feature-map and FAQ sentences supply that context.
- **Integrator jargon on a public page is automatically a defect:** AAA jargon coverage is for words used in a particular way by a field when that restricted sense is required to understand the content. These tokens keep their standard web/media meanings; the page is an embed example for that audience.
- **`GTM ID` without expansion fails this SC:** that is 3.1.4 Abbreviations, explicitly out of scope here.
- **No `<dfn>` / glossary markup is itself a failure:** techniques (G101, G55, H40, G62) are sufficient, not required, and only when 3.1.3’s condition (unusual/restricted use) is met.
- **Issue search** `unusual words OR 3.1.3 OR jargon OR glossary`: no matching issues (open set empty). Language-of-parts report explicitly deferred 3.1.3. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 3.1.3 Unusual Words](https://www.w3.org/TR/WCAG22/#unusual-words)
- [WCAG 2.2 Understanding SC 3.1.3](https://www.w3.org/WAI/WCAG22/Understanding/unusual-words)
- [G101: Providing the definition of a word or phrase used in an unusual or restricted way](https://www.w3.org/WAI/WCAG22/Techniques/general/G101)
- `app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `index.html`
- Prior: 3.1.2 language of parts (20261110T111938Z); 3.1.1 html lang (#20 / 20261106T130238Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.1.3 Understanding (search snippets 2026-11-13). Embed widget copy is out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T19:20:38Z | 2026-11-13T19:21:01Z | 00:50:38 | 00:51:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-13T19:21:18Z | 2026-11-13T19:23:02Z | 00:51:18 | 00:53:02 | 00:01:44 (1.7 min) |
| `delivery` | 2026-11-13T19:23:02Z | 2026-11-13T19:23:54Z | 00:53:02 | 00:53:54 | 00:00:52 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-13T19:20:38Z | 2026-11-13T19:23:54Z | 00:50:38 | 00:53:54 | **00:03:16 (3.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:17 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T192038Z-08a8bdaacf46468da50e96a6102f101c.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/170
- Base `main` `9b0ef3bb867141ffec9ad4811c0cabe0e8c7e18e` / head `bughunter/20261113T192038Z-08a8bdaacf46468da50e96a6102f101c-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian SUCCESS; Lint QUEUED; Test QUEUED; Workers Builds IN_PROGRESS
- Local tests **NOT RUN BY BUGHUNTER**
