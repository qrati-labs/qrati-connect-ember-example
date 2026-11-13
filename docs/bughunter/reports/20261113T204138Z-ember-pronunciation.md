# Ember host WCAG 3.1.6 pronunciation

- **Scope:** WCAG 2.2 SC 3.1.6 Pronunciation (AAA) on host-authored English copy: `QratiDemo` template (hero, short answer, feature map, developer cards, FAQ, CTA, footer, theme toggle), `index.html` metadata, cookie-consent English strings. Excludes embed widget internals, code samples in `<pre>`, 3.1.1 (#20), 3.1.2 (20261110T111938Z), 3.1.3 (20261113T192038Z), 3.1.4 (#171), 3.1.5 (20261113T202038Z).
- **Base:** `origin/main` at `f1415ca90616a6a6febcd5344d9cf57435445819`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T204138Z-99477c8691e24f4891cab142b9c979a8-ember`, `bughunter/20261113T204138Z-99477c8691e24f4891cab142b9c979a8-ember`.
- **Run:** `20261113T204138Z-99477c8691e24f4891cab142b9c979a8`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty; chore PRs #121/#122 do not overlap a product workflow. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not author copy.
2. Host chrome (`app/components/qrati-demo.gts`): English hero, short-answer, feature-map / SEO cards, FAQ, CTA, footer. Cookie chrome (`app/lib/cookieConsent.ts`): short English consent/preferences strings. `index.html` description/OG/Twitter: one English sentence. Document language is `en` (`<html lang="en">`).
3. [WCAG 2.2 SC 3.1.6](https://www.w3.org/TR/WCAG22/#pronunciation) (AAA): a mechanism is available for identifying specific pronunciation of words where meaning of the words, in context, is ambiguous without knowing the pronunciation. [Understanding 3.1.6](https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html): English heteronyms (e.g. desert/desert) require a mechanism **only if** context does not determine the reading. Same-pronunciation homonyms and ordinary verbs are out of scope. Sufficient techniques (G120, G121, G62, G163, H62 `ruby`) apply when that condition is met; they are not required otherwise.
4. User-visible tokens that could be heteronyms:
   - **live / Live:** “Live Event Photo Gallery”, “live event photo gallery”, “live photo wall”, “live contest rankings”, “bring its live gallery”. Collocates (event, gallery, contest, rankings) select /laɪv/ (happening now), not /lɪv/ (reside). CTA “come alive” uses `alive`, not `live`.
   - **does:** “What does Qrati Connect add” is the auxiliary verb /dʌz/, not the animal.
   - **use / used / using:** “using the no-code embed script”, “We use cookies”, “used only when you accept them” are verbs /juːz/, not the noun /juːs/.
   - **Close:** cookie `closeIconLabel` is the UI dismiss action, not the adjective /kloʊs/.
   - **rate / ratings / react:** “search, react, rate”; “reactions, ratings”; contest copy. Verb/noun senses share /reɪt/ and /riˈækt/; meaning does not flip with pronunciation.
   - **hash / memory / crop / trim / progress:** routing and upload pipeline. `hash` (fragment vs food) and `memory` (RAM vs recollection) are same-pronunciation senses, not 3.1.6 heteronyms.
5. No `<ruby>`/`<rt>`, IPA, diacritics, pronunciation glossary, or audio links. None is required while context selects the reading. Brand name `Qrati` is a proper name; 3.1.6 does not require teaching brand pronunciation.

Authz/validation/persistence: none on this path (public demo). Side effects: none from reading the copy.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing ruby/IPA for `live` fails 3.1.6:** Understanding: if pronunciation is determined from sentence context, nothing is required. Event/gallery/contest collocates fix /laɪv/.
- **Missing pronunciation of `Qrati` / `HEIC` / `GTM` fails 3.1.6:** proper names and abbreviations are not heteronyms whose meaning depends on pronunciation. GTM expansion is 3.1.4 (#171).
- **`hash` (routing) vs food, or `memory` (router vs photos), requires a glossary:** those are same-pronunciation homonyms. 3.1.6 is pronunciation-dependent meaning, already judged as ordinary field words under 3.1.3.
- **Absence of G120/H62 is itself a failure:** those are sufficient techniques when the SC’s condition is met, not a required page chrome.
- **Issue search** `pronunciation OR 3.1.6 OR ruby OR phonetic OR IPA OR homograph`: no matching issues (open set empty). Closed #20 (html lang) and #171 (GTM expansion) are different SCs. 3.1.3/3.1.5 reports deferred 3.1.6. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 3.1.6 Pronunciation](https://www.w3.org/TR/WCAG22/#pronunciation)
- [WCAG 2.2 Understanding SC 3.1.6 Pronunciation](https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html)
- [G120: Providing the pronunciation immediately following the word](https://www.w3.org/WAI/WCAG22/Techniques/general/G120)
- [H62: Using the ruby element](https://www.w3.org/WAI/WCAG22/Techniques/html/H62.html)
- `app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `index.html`
- Prior: 3.1.5 reading level (20261113T202038Z); 3.1.4 abbreviations (#171 / 20261113T200039Z); 3.1.3 unusual words (20261113T192038Z); 3.1.2 language of parts (20261110T111938Z); 3.1.1 html lang (#20)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.1.6 Understanding (search snippets 2026-11-13). Embed widget copy is out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T20:41:38Z | 2026-11-13T20:42:02Z | 02:11:38 | 02:12:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-13T20:42:23Z | 2026-11-13T20:44:05Z | 02:12:23 | 02:14:05 | 00:01:42 (1.7 min) |
| `delivery` | 2026-11-13T20:43:45Z | 2026-11-13T20:44:32Z | 02:13:45 | 02:14:32 | 00:00:47 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-13T20:41:38Z | 2026-11-13T20:44:32Z | 02:11:38 | 02:14:32 | **00:02:54 (2.9 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:00 (0.0 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T204138Z-99477c8691e24f4891cab142b9c979a8.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/174
- Base `main` `f1415ca90616a6a6febcd5344d9cf57435445819` / head `bughunter/20261113T204138Z-99477c8691e24f4891cab142b9c979a8-ember` `376c163d1091d2dcf736a9f526dcc2080cd455e6` (timing-table commit follows)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Test QUEUED
- Local tests **NOT RUN BY BUGHUNTER**
