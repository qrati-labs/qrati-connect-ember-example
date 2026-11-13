# Ember host WCAG 1.3.6 identify purpose

- **Scope:** WCAG 2.2 SC 1.3.6 Identify Purpose (AAA) for host-authored regions, icons, and UI components in `QratiDemo`: `<header>` / `<main>` / `<footer>` / footer `<nav>`, labelled `<section>`s, theme toggle, links, FAQ disclosures, Cookie Preferences, ten `iconify-icon` hosts. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome beyond host-supplied strings, 1.3.1 info/relationships (20261109T210738Z), 1.3.5 identify input purpose (20261110T083538Z), 4.1.2 name/role/value (20261110T000039Z), 1.1.1 non-text (20261109T233938Z).
- **Base:** `origin/main` at `9d62ed11a03a267b2be9ef29eaf1e51f604e9eed`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T162938Z-a54f4080d63c4ab9aa7e4926ba832d09-qrati-connect-ember-example`, `bughunter/20261113T162938Z-a54f4080d63c4ab9aa7e4926ba832d09-ember`.
- **Run:** `20261113T162938Z-a54f4080d63c4ab9aa7e4926ba832d09`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 1.3.6. Regions use native HTML landmarks (ARIA11). Controls are native HTML with visible names. There is no published, required purpose vocabulary for the decorative Iconify hosts; missing WAI-Adapt / microdata is not a violated invariant.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; one history index.
2. [WCAG 2.2 SC 1.3.6](https://www.w3.org/TR/WCAG22/#identify-purpose) (AAA): in markup languages, the purpose of user interface components, icons, and regions can be programmatically determined. [Understanding 1.3.6](https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html): associate purpose so user agents can adapt indicators/terminology; example sufficient path is landmarks so users can hide or highlight regions. Sufficient [ARIA11](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11) (landmarks). “Using microdata to markup user interface components” is still a **future link**, not a published required technique.
3. Regions in `app/components/qrati-demo.gts`:
   - `<header class="hero">` → banner
   - `<main class="content-shell">` → main
   - `<footer class="footer">` → contentinfo
   - `<nav aria-label="Footer navigation">` → named navigation
   - Gallery `<section class="widget-frame" aria-label="Interactive Ember Event Gallery">`
   - FAQ `<section class="seo-section" aria-labelledby="faq-heading">`
   - Feature-map section `aria-labelledby="feature-map-heading"`
   Native HTML5 sectioning elements create landmarks without `role="banner|main|contentinfo|navigation"`. Extra `aria-label` / `aria-labelledby` names the gallery, FAQ, feature-map, and footer nav.
4. UI components (same set as 4.1.2): native `<button>` (theme toggle with visible `Light`/`Dark` name; Cookie Preferences), native `<a>` (hero, action pills, Contact, footer), native `<details>`/`<summary>`. Purpose is the accessible name / href, not an undocumented personalization token. No host `<input>` / `<select>` / `autocomplete` fields (1.3.5 already: no input purpose to mark).
5. Icons: ten `<iconify-icon icon="material-symbols:…">` with empty light DOM, no `aria-label` / `title` / WAI-Adapt attributes. Six sit beside visible `h3` in `.feature-map-heading`; four are first children of `.seo-feature-card` that also have `h3` + `p`. They are not controls. 1.1.1 already treated them as unnamed decorative hosts redundant with adjacent headings. Understanding 1.3.6’s icon examples are *substitutable* UI icons (home, next) mapped to a personalization vocabulary — not card decoration next to text headings.
6. Cookie-consent: host strings only (`consentModal` / `preferencesModal` titles and section titles). Dialog tree is library-owned (`vanilla-cookieconsent` 3.1.0). Worker (`src/worker.ts`) does not inject landmarks or purpose metadata.

Authz/validation/persistence: none (public demo). Side effects: none on this path. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `role="banner|main"` fails 1.3.6:** HTML `<header>` / `<main>` / `<footer>` / `<nav>` already map to those landmarks. ARIA11 is an example, not the only mapping.
- **Iconify hosts lack purpose microdata / `coga-*`:** the microdata technique is unpublished (“future link”). WAI-Adapt is advisory. Adjacent headings already name the cards. Hardening, not a confirmed failure.
- **Theme toggle purpose is not in a standard taxonomy:** it is a native button whose name is the next action. 4.1.2 already accepted that; 1.3.6 does not require a private `theme` token.
- **`.action-pills` `aria-label` without `role`:** grouping name, not a component purpose. Child links have names.
- **Host must meet AAA 1.3.6:** no such claim in README or `index.html`. Landmarks still satisfy ARIA11 if AAA were claimed.
- **Issue search** `1.3.6 OR "identify purpose" OR landmark OR "icon purpose"`: no matching issues (open set empty). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 1.3.6 Identify Purpose](https://www.w3.org/TR/WCAG22/#identify-purpose)
- [Understanding SC 1.3.6](https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html)
- [ARIA11: Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA11)
- `app/components/qrati-demo.gts` landmarks, controls, `iconify-icon` hosts
- `app/templates/application.gts`
- Prior: 1.3.1 (20261109T210738Z); 1.3.5 (20261110T083538Z); 4.1.2 (20261110T000039Z); 1.1.1 (20261109T233938Z)

## Limitations

CodeGraph unindexed. No screen-reader or WAI-Adapt user-agent session. Iconify 2.1.0 default accessibility mapping not re-fetched this run (same reading as 1.1.1). Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T16:29:38Z | 2026-11-13T16:30:01Z | 21:59:38 | 22:00:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-13T16:30:16Z | 2026-11-13T16:33:42Z | 22:00:16 | 22:03:42 | 00:03:27 (3.5 min) |
| `delivery` | 2026-11-13T16:33:30Z | 2026-11-13T16:34:03Z | 22:03:30 | 22:04:03 | 00:00:33 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-13T16:29:38Z | 2026-11-13T16:34:03Z | 21:59:38 | 22:04:03 | **00:04:25 (4.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:02 (0.0 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T162938Z-a54f4080d63c4ab9aa7e4926ba832d09.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/162
- Base `main` `9d62ed11a03a267b2be9ef29eaf1e51f604e9eed` / head `bughunter/20261113T162938Z-a54f4080d63c4ab9aa7e4926ba832d09-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Local tests **NOT RUN BY BUGHUNTER**
