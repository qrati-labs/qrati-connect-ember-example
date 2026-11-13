# Ember host WCAG 3.1.5 reading level

- **Scope:** WCAG 2.2 SC 3.1.5 Reading Level (AAA) on host-authored English copy: `QratiDemo` template (hero, short answer, feature map, developer cards, FAQ, CTA, footer), `index.html` metadata, cookie-consent English strings. Excludes embed widget internals, code samples in `<pre>`, 3.1.1 (#20), 3.1.2 (20261110T111938Z), 3.1.3 (20261113T192038Z), 3.1.4 (#171), 3.1.6 pronunciation.
- **Base:** `origin/main` at `26dd1d7d3ddea29bc7e469a536459bcb4a5e7c11`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T202038Z-0b8f09479ff3426dae8639b8312eb11a-ember`, `bughunter/20261113T202038Z-0b8f09479ff3426dae8639b8312eb11a-ember`.
- **Run:** `20261113T202038Z-0b8f09479ff3426dae8639b8312eb11a`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty; chore PRs #121/#122 do not overlap a product workflow. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to ... No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not author copy.
2. Host chrome (`app/components/qrati-demo.gts`): English hero, “The short answer” plus four bullets, feature-map cards, developer cards, FAQ `<details>`, CTA, footer. Cookie chrome (`app/lib/cookieConsent.ts`): short English consent/preferences strings. `index.html` description/OG/Twitter: one English sentence about embedding a live event photo gallery.
3. [WCAG 2.2 SC 3.1.5](https://www.w3.org/TR/WCAG22/#reading-level) (AAA): when text requires reading ability more advanced than the lower secondary education level after removal of proper names and titles, supplemental content, or a version that does not require that ability, is available. [Understanding 3.1.5](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html): lower secondary is 7–9 years of school; supplemental content is required when text demands more than nine years. Proper names and titles are removed before assessment. [G153](https://www.w3.org/WAI/WCAG22/Techniques/general/G153) is a sufficient technique (English sentences typically ≤25 words), not a hard fail of the SC.
4. After removing proper names (`Qrati`, `Ember`, `GitHub`, `VS Code`, `HEIC`, `Google Tag Manager`/`GTM`, `npm`, `Labs`) and the quickstart `<pre>` sample, combined host prose is Flesch–Kincaid grade **8.05** (41 sentences, 251 words, avg 6.12 words/sentence). No sentence exceeds 25 words after name removal. FAQ copy is grade **6.86**. CTA is grade **8.35**. Feature-map cards are short noun lists (longest 11 words).
5. The densest single sentence is the short-answer paragraph (26 words including `Qrati`; 25 after name removal). It is already labeled “The short answer” and restated by four bullets and the FAQ (“Inject the … embed script…”, “An active subscription is required.”). Consent strings are short imperative/declarative sentences.
6. No spoken version, Easy Read edition, or Dublin Core education-level metadata. None is required while the primary text stays at or below lower secondary.

Authz/validation/persistence: none on this path (public demo). Side effects: none from reading the copy.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Short-answer FK ~15.9 on that paragraph alone fails 3.1.5:** rejected. The SC applies after removing proper names, to whether the text as presented requires more than nine years of school. Isolated automated grade on one compound sentence is a proxy, not the UNESCO test. The same ideas are restated in the bullets and FAQ below lower secondary.
- **26-word short-answer sentence fails G153’s 25-word English note:** G153 is sufficient, not required. After removing `Qrati` the sentence is 25 words. One borderline sentence with common verbs (`adds`, `discover`, `upload`, `search`, `join`) is not evidence the page exceeds lower secondary.
- **Feature-map jargon (`allowlists`, `blurhash`, `lightbox`) forces a simplified edition:** those tokens were already judged ordinary field words in context under 3.1.3 (20261113T192038Z). 3.1.5 measures reading ability of the prose, not a glossary obligation. Cards are 5–11 word lists, not long clauses.
- **Missing audio/sign-language supplement fails 3.1.5:** G79/G160 are sufficient options when the primary text is above lower secondary. They are not required when it is not.
- **Issue search** `reading level OR 3.1.5 OR flesch OR lower secondary`: no matching issues (open set empty). Language-of-parts / unusual-words / abbreviations reports deferred 3.1.5. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 3.1.5 Reading Level](https://www.w3.org/TR/WCAG22/#reading-level)
- [WCAG 2.2 Understanding SC 3.1.5](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html)
- [G153: Making the text easier to read](https://www.w3.org/WAI/WCAG22/Techniques/general/G153)
- `app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `index.html`
- Prior: 3.1.4 abbreviations (#171 / 20261113T200039Z); 3.1.3 unusual words (20261113T192038Z); 3.1.2 language of parts (20261110T111938Z); 3.1.1 html lang (#20)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source, WCAG 3.1.5 Understanding (search snippets 2026-11-13), and a local Flesch–Kincaid proxy (not a teacher evaluation). Embed widget copy is out of scope. Syllable counts are heuristic.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

timing incomplete

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `26dd1d7d3ddea29bc7e469a536459bcb4a5e7c11` / head `bughunter/20261113T202038Z-0b8f09479ff3426dae8639b8312eb11a-ember`
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
