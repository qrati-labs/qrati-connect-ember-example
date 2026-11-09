# Ember host WCAG 2.4.4 link purpose (in context)

- **Scope:** WCAG 2.2 SC 2.4.4 Link Purpose (In Context) on host-authored `<a>` elements in `QratiDemo`: hero `Qrati` links, GitHub/VS Code action pills, Contact CTA, footer nav (`qrati.com`, npm, GitHub, Pricing). Excludes cookie-consent chrome, embed-shadow links, 2.4.9 (link-only, AAA), 3.2.5 new-window warning (AAA/G201), 1.4.1 underline (#49), 2.4.7 focus-visible (20261107T050938Z), 2.5.8 footer target size (20261107T053238Z).
- **Base:** `origin/main` at `a62e00138c79c14c8e5933d7de7ed03dc17df962`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T183438Z-838b261bac71429fb7ae719a61666100-qrati-connect-ember-example`, `bughunter/20261109T183438Z-838b261bac71429fb7ae719a61666100-ember`.
- **Run:** `20261109T183438Z-838b261bac71429fb7ae719a61666100`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `QratiDemo`. Nine host `<a>` elements live in `app/components/qrati-demo.gts`. Theme-toggle and Cookie Preferences are `<button>`, not links. Footer brand `<img>` is not wrapped in an anchor.
2. SC 2.4.4 (A): the purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context, except where the purpose would be ambiguous to users in general. [Understanding 2.4.4](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html). Programmatically determined context in HTML includes the same sentence, paragraph, list item, or table cell (not a preceding heading by itself; H80 is advisory).
3. Named-from-content links (H30 / G91):
   - Action pills: visible text `View on GitHub` / `Open in VS Code`; inline SVGs `aria-hidden="true"` so they are not the accessible name. Destinations: `https://github.com/qrati-labs/qrati-connect-ember-example` and `https://vscode.dev/github/qrati-labs/qrati-connect-ember-example`. Group `aria-label="Example links"` is extra, not required for 2.4.4.
   - Contact CTA: `Contact Qrati →` → `https://qrati.com/contact-us` (same-site path; no `target="_blank"`).
   - Footer: `qrati.com` → `https://qrati.com`; `npm` → `@qratilabs/qrati-connect` package; `GitHub` → `https://github.com/qrati-labs`; `Pricing` → `https://qrati.com/pricing`. Enclosed in `<nav aria-label="Footer navigation">`.
4. Short product-name links with enclosing context (G53 / H78):
   - Hero `<h1>`: link text `Qrati` plus remaining heading text `Connect inside an Ember host site` (same heading / sentence). Destination `https://qrati.com`.
   - `.hero-copy` paragraph: `This example shows how to embed Qrati Connect into an Ember app…` — link text `Qrati` in that sentence. Same destination.
5. Identical accessible names: both `Qrati` anchors share destination `https://qrati.com`. Test rule “Links with identical accessible names and same context serve equivalent purpose” is satisfied. Footer `GitHub` (org) vs pill `View on GitHub` (this repo) use different names for different destinations.

Authz/validation/persistence: none (public demo). Side effects: `target="_blank"` + `rel="noopener noreferrer"` on off-site links except the Contact CTA (same registrable domain). Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`Qrati` fails 2.4.4 as ambiguous “click here”:** contradicted by G53/H78. Enclosing heading/paragraph names the product and host. Not F63 (context is the same heading/paragraph, not unrelated content).
- **F84 / identical names, different destinations:** both `Qrati` links go to `https://qrati.com`. Footer `GitHub` vs `View on GitHub` are not identical names.
- **`npm` is too terse:** H30 allows the name of the destination document/application; the link identifies the npm package listing. Footer nav label is supplemental, not required.
- **Missing “opens in a new tab” fails 2.4.4:** G201 / 3.2.5 is AAA and advisory for 2.4.4. Not this SC.
- **Contact CTA without `target="_blank"` is inconsistent:** 2.4.4 does not require matching `target`. Same-site contact URL is a valid purpose from the visible name.
- **Image-only pill links fail F89:** SVGs are `aria-hidden`; visible `<span>` text is the name.
- **Issue search** `link purpose OR 2.4.4 OR "link text" OR F84`: closed #18/#24 (1.4.3 contrast). No open duplicate. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- [WCAG 2.2 SC 2.4.4](https://www.w3.org/TR/WCAG22/#link-purpose-in-context)
- [G91](https://www.w3.org/WAI/WCAG22/Techniques/general/G91) / [H30](https://www.w3.org/WAI/WCAG22/Techniques/html/H30) / [G53](https://www.w3.org/WAI/WCAG22/Techniques/general/G53) / [H78](https://www.w3.org/WAI/WCAG22/Techniques/html/H78)
- `app/components/qrati-demo.gts` (nine host anchors)
- `app/templates/application.gts` (`QratiDemo` only)

## Limitations

CodeGraph unindexed. No screen-reader session; accessible names inferred from source (visible text + `aria-hidden` SVGs). Live `https://qrati.com/connect/ember-example` was not used as evidence this run. 2.4.9 Link Purpose (Link Only) was not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-09T18:34:38Z | 2026-11-09T18:35:02Z | 00:04:38 | 00:05:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-09T18:35:27Z | 2026-11-09T18:39:46Z | 00:05:27 | 00:09:46 | 00:04:19 (4.3 min) |
| `delivery` | 2026-11-09T18:39:46Z | 2026-11-09T18:40:43Z | 00:09:46 | 00:10:43 | 00:00:57 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-09T18:34:38Z | 2026-11-09T18:40:43Z | 00:04:38 | 00:10:43 | **00:06:05 (6.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:25 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T183438Z-838b261bac71429fb7ae719a61666100.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/88
- Base `main` `a62e00138c79c14c8e5933d7de7ed03dc17df962` / head `bughunter/20261109T183438Z-838b261bac71429fb7ae719a61666100-ember` `736e72a77cb58d88c3d5492353ff330a9a156f44`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; Lint/Test/Workers pending
- Local tests **NOT RUN BY BUGHUNTER**
