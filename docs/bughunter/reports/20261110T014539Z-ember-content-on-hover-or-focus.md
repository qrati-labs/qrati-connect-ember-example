# Ember host WCAG 1.4.13 content on hover or focus

- **Scope:** WCAG 2.2 SC 1.4.13 Content on Hover or Focus for host-authored UI in `QratiDemo`: theme-toggle, hero/action-pill links, FAQ disclosures, feature-map cards, Contact CTA, footer nav / Cookie Preferences, and host CSS `:hover` / `:focus-visible` rules. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent first-layer/preferences chrome (modal; out of 1.4.13), 2.4.7 link focus-visible (20261107T050938Z), 2.4.11 focus not obscured (20261109T194038Z), 1.4.1 use of color (20261110T012438Z).
- **Base:** `origin/main` at `8d12d85c7775bd1b94270d843d19be541eed796e`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T014539Z-440118f8deeb4f7996c2070b57276850-ember`, `bughunter/20261110T014539Z-440118f8deeb4f7996c2070b57276850-ember`.
- **Run:** `20261110T014539Z-440118f8deeb4f7996c2070b57276850`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 were not used. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome and copy live in `app/components/qrati-demo.gts` and `app/styles/app.css`. Cookie-consent init is `app/lib/cookieConsent.ts`. Single history index route (`app/router.ts` map empty).
2. [WCAG 2.2 SC 1.4.13](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus) (Level AA) applies only **where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden**. Then dismissible / hoverable / persistent apply. [Understanding 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html): custom tooltips, sub-menus, and nonmodal popups are in scope; UA `title` tooltips are excepted; **modal dialogs are out of scope**; skip-link unhide is not additional content; the SC covers content **in addition to** the triggering component.
3. Host hover/focus effects (no additional content):
   - `.theme-toggle:hover` — background only; label stays `☀ Light` / `🌙 Dark`.
   - `.action-pills a:hover` — transform / border / color; visible text+icon unchanged.
   - `.feature-map-card:hover` — translateY + border-color; card heading/body already visible.
   - `.btn-cta-primary:hover` — transform + box-shadow; “Contact Qrati →” already visible.
   - `.footer a:hover` / `.footer-cookie-btn:hover` — color only.
   - `:focus-visible` on theme-toggle and cookie button is an outline on the control, not extra content.
4. No host `title=` attributes in `app/`, `index.html`, or `src/`. No CSS `content:` / `::before` / `::after` tooltip on hover/focus (`::before`/`::after` appear only in the reduced-motion reset). No custom tooltip, submenu, or nonmodal popup.
5. FAQ uses native `<details>`/`<summary>`: extra panel appears on **activation** (click / Enter / Space), not pointer hover or focus alone. Cookie-consent first layer is an auto-shown dialog (`CookieConsent.run` + `autoShow: required`), not hover/focus additional content.

Authz/validation/persistence: public demo; theme persist (`qc-theme`); geo consent cache. No hover-triggered state.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Hover restyles fail 1.4.13 because content “changes”:** SC requires **additional** content that appears then hides. Color/transform/outline on the same control is not additional content (Understanding note 3).
- **FAQ `<details>` fail because the panel is extra content:** trigger is activation, not hover/focus. Closed summaries do not open on `:hover` or `:focus`.
- **Cookie-consent banner fails 1.4.13:** Understanding excludes modal dialogs; the banner is not hover/focus triggered. Out of this workflow (20261107T072738Z).
- **Iconify may inject `title` after upgrade:** host does not set `title`; UA/library tooltips are the 1.4.13 exception when unmodified. Not claimed.
- **Issue search** `1.4.13 OR hover OR tooltip OR dismissible OR "content on hover"`: closed #22 (consent contrast) and #49 (hero underline / 1.4.1). No open 1.4.13 gap. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus)
- `app/components/qrati-demo.gts`
- `app/styles/app.css`
- `app/lib/cookieConsent.ts`

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS plus WCAG 1.4.13 Understanding. Cookie-consent and embed widgets not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T01:45:39Z | 2026-11-10T01:46:00Z | 07:15:39 | 07:16:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T01:46:20Z | 2026-11-10T01:50:53Z | 07:16:20 | 07:20:53 | 00:04:32 (4.5 min) |
| `delivery` | 2026-11-10T01:50:53Z | 2026-11-10T01:50:53Z | 07:20:53 | 07:20:53 | 00:00:00 (0.0 min) |
| **Total run (preflight start to finish)** | 2026-11-10T01:45:39Z | 2026-11-10T01:50:53Z | 07:15:39 | 07:20:53 | **00:05:14 (5.2 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:20 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T014539Z-440118f8deeb4f7996c2070b57276850.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/103
- Base `main` `8d12d85c7775bd1b94270d843d19be541eed796e` / head `bughunter/20261110T014539Z-440118f8deeb4f7996c2070b57276850-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending; GitGuardian pass
- Local tests **NOT RUN BY BUGHUNTER**
