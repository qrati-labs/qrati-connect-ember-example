# Ember host Label in Name (remaining controls)

- **Scope:** WCAG 2.2 SC 2.5.3 Label in Name for remaining host-authored controls in `QratiDemo` after closed issue [#34](https://github.com/qrati-labs/qrati-connect-ember-example/issues/34): action-pill links, hero/footer/Contact anchors, FAQ `<summary>`, footer Cookie Preferences. Excludes theme-toggle AccName (#34), cookie-consent modal chrome (library-owned), embed internals (`qrati-connect` / `embed.js`), 2.4.7 focus visible (20261107T050938Z), 4.1.2 name/role/value (20261110T000039Z), 2.5.8 footer target size (20261107T053238Z).
- **Base:** `origin/main` at `1249b0031e19224bc963bd9e870b80edeffb86ac`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T180538Z-e59a18b8451c47398e25895961b69e9f-qrati-connect-ember-example`, `bughunter/20261110T180538Z-e59a18b8451c47398e25895961b69e9f-ember`.
- **Run:** `20261110T180538Z-e59a18b8451c47398e25895961b69e9f`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Host controls live in `app/components/qrati-demo.gts`.
2. Theme toggle (`☀ Light` / `🌙 Dark`) is **out of scope**: closed [#34](https://github.com/qrati-labs/qrati-connect-ember-example/issues/34) dropped the generic `aria-label`; visible text is the AccName. Covered by `tests/unit/theme-toggle-label-in-name-test.ts`.
3. Remaining operable host controls and AccName vs visible text:
   - Hero `https://qrati.com` links (`h1` and `.hero-copy`): visible word **Qrati**; no `aria-label` / `aria-labelledby` on the anchors; `rel="noopener noreferrer"` only.
   - `.action-pills` container has `aria-label="Example links"` (group name). Child anchors expose `<span>View on GitHub</span>` / `<span>Open in VS Code</span>` with decorative SVGs `aria-hidden="true"`. Group `aria-label` does not replace descendant AccNames ([AccName computation](https://www.w3.org/TR/accname-1.2/)).
   - Contact CTA `.btn-cta-primary`: visible **Contact Qrati →**; no overriding name.
   - FAQ `<details>`/`<summary>`: visible summary strings are the disclosure names; `aria-labelledby="faq-heading"` is on the section, not the summaries.
   - Footer nav `aria-label="Footer navigation"` (group). Links: **qrati.com**, **npm**, **GitHub**, **Pricing**. Cookie Preferences is `<button type="button">` with that visible name plus `data-cc="show-preferencesModal"`; no `aria-label`.
4. `iconify-icon` beside feature-card `<h3>` is not a labeled UI component (not operable). Gallery section `aria-label="Interactive Ember Event Gallery"` names a region; the sr-only `h2` is not a control label.
5. [Understanding 2.5.3](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html): where a control has a visual text label, the accessible name must contain that string (G208 / failure F96). Host remaining controls use descendant text as AccName.

Authz: none (public demo). Persistence: none on this path. Side effects: navigation, FAQ open/close, cookie-preferences modal. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR. Open issues: none.

## Falsification

- **Theme-toggle emoji prefix hides Light/Dark:** excluded (#34). AccName is the visible `☀ Light` / `🌙 Dark` string, which contains Light/Dark.
- **`aria-label="Example links"` / `"Footer navigation"` / gallery region label overrides child names:** contradicted by AccName; those labels are on grouping elements, not on the links/buttons.
- **SVG glyphs in action pills become the name:** rejected; both SVGs set `aria-hidden="true"`; name comes from the sibling `<span>`.
- **Cookie Preferences `data-cc` supplies a mismatched name:** `data-cc` is an action hook, not AccName. Visible button text is the name.
- **FAQ `aria-labelledby="faq-heading"` makes every summary “Frequently asked questions”:** the heading id is on the `<section>`, not `<summary>`.
- **Must match visible label including punctuation for Contact CTA:** visible “Contact Qrati →” is the entire name (G211 match). Speech “Contact Qrati” is a substring of that name (G208).
- **Issue search** `label in name OR 2.5.3 OR accessible name OR aria-label`: closed #34 only (theme toggle). No open duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
- [G208 Including the text of the visible label as part of the accessible name](https://www.w3.org/WAI/WCAG22/Techniques/general/G208)
- [F96 Accessible name does not contain the visible label](https://www.w3.org/WAI/WCAG22/Techniques/failures/F96)
- `app/components/qrati-demo.gts` (action pills, FAQ, Contact CTA, footer nav / Cookie Preferences)
- Closed [#34](https://github.com/qrati-labs/qrati-connect-ember-example/issues/34)

## Limitations

CodeGraph unindexed. No AT / speech-input session on `https://qrati.com/connect/ember-example`. AccNames taken from host markup and the AccName algorithm, not a computed-name dump. Embed widget internals not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T18:05:38Z | 2026-11-10T18:06:04Z | 23:35:38 | 23:36:04 | 00:00:26 (0.4 min) |
| `audit` | 2026-11-10T18:06:30Z | 2026-11-10T18:11:24Z | 23:36:30 | 23:41:24 | 00:04:54 (4.9 min) |
| `delivery` | 2026-11-10T18:11:24Z | 2026-11-10T18:12:33Z | 23:41:24 | 23:42:33 | 00:01:09 (1.1 min) |
| **Total run (preflight start to finish)** | 2026-11-10T18:05:38Z | 2026-11-10T18:12:33Z | 23:35:38 | 23:42:33 | **00:06:55 (6.9 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:26 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T180538Z-e59a18b8451c47398e25895961b69e9f.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/141
- Base `main` `1249b0031e19224bc963bd9e870b80edeffb86ac` / head `bughunter/20261110T180538Z-e59a18b8451c47398e25895961b69e9f-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
