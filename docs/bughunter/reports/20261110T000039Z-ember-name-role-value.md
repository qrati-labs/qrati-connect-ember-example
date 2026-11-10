# Ember host WCAG 4.1.2 name, role, value

- **Scope:** WCAG 2.2 SC 4.1.2 Name, Role, Value for host-authored UI components in `QratiDemo`: theme toggle, hero/action-pill/Contact/footer links, FAQ `<details>`/`<summary>`, footer Cookie Preferences. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome beyond host-supplied strings, 1.3.1 info/relationships (20261109T210738Z), 2.4.6 headings/labels (20261109T200338Z), 2.5.3 label-in-name (#34), 1.1.1 non-text (20261109T233938Z).
- **Base:** `origin/main` at `d99a71a520cc6fe7270cf0b217071db377d027b6`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T000039Z-5b97c6bf83c44796b3ae173ec3c9e261-ember`, `bughunter/20261110T000039Z-5b97c6bf83c44796b3ae173ec3c9e261-ember`.
- **Run:** `20261110T000039Z-5b97c6bf83c44796b3ae173ec3c9e261`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host-authored controls live in `app/components/qrati-demo.gts`.
2. [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value) (Level A): for all UI components, name and role can be programmatically determined; user-settable states/values can be programmatically set; changes are available to user agents. [Understanding 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) states the SC is primarily for custom/scripted widgets: **standard HTML controls already meet it when used according to specification**.
3. Host interactive elements (all native HTML, no `role` / `tabindex` / `contenteditable` overrides):
   - Theme: `<button type="button" class="theme-toggle">` with visible text `☀ Light` / `🌙 Dark` (name from contents after #34 dropped a generic `aria-label`). Action label changes with theme; not implemented as `aria-pressed` toggle. Focus is UA-native plus author `:focus-visible`.
   - Links: hero Qrati `<a href>`, GitHub/VS Code `.action-pills a` (visible `<span>` + `aria-hidden` SVG), Contact `.btn-cta-primary`, footer nav `href`s. Accessible names from link text (H91).
   - FAQ: four native `<details>`/`<summary>` (first `open`). HTML `summary` is a disclosure control; open/closed is the `details.open` IDL state, not a host ARIA mapping.
   - Footer Cookie Preferences: `<button type="button">` with visible name “Cookie Preferences” and `data-cc="show-preferencesModal"`. `{{on "click" this.openCookiePreferences}}` calls `CookieConsent.showPreferences()` after init.
4. Non-components (out of 4.1.2): decorative `iconify-icon` hosts beside `h3`s; `.action-pills` generic `div` with `aria-label` (grouping, not a control — already noted in 1.3.1). Cookie-consent dialog tree is library-owned (vanilla-cookieconsent); host supplies `closeIconLabel: 'Close'` and section titles.
5. Sufficient techniques: [G108](https://www.w3.org/WAI/WCAG22/Techniques/general/G108) / [H91](https://www.w3.org/WAI/WCAG22/Techniques/html/H91) / [H88](https://www.w3.org/WAI/WCAG22/Techniques/html/H88). Failures F59 (div/span as control without role), F68 (no name), F42 (emulated links) do not match this markup.

Authz/validation/persistence: none (public demo). Side effects: theme persist (`qc-theme`), preferences modal, navigation. Errors: `showCookiePreferences` awaits init; no swallowed control-state updates.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme button needs `aria-pressed`:** 4.1.2 requires user-settable *state* when the control is a toggle/checkbox/radio. This control is a native button whose **name** is the next action (`Light`/`Dark`), not a pressed toggle. Understanding 4.1.2: standard HTML used per spec is sufficient. Missing `aria-pressed` is not a demonstrated failure.
- **`aria-label` on `.action-pills` without role fails 4.1.2:** 4.1.2 applies to UI components. A generic grouping `div` is not a component; both child links have names.
- **FAQ needs `aria-expanded`:** native `details`/`summary` exposes expanded state in the HTML accessibility mapping. Host does not re-purpose them.
- **`iconify-icon` custom elements lack role/name:** not interactive; not UI components. 1.1.1 decorative path already report-only.
- **Issue search** `4.1.2 OR "name role value" OR aria-pressed OR "accessible name"`: closed #34 (theme-toggle label-in-name) and #26 (gallery heading remount). No open 4.1.2 issue. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value)
- [H91: Using HTML form controls and links](https://www.w3.org/WAI/WCAG22/Techniques/html/H91)
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- `app/lib/cookieConsent.ts`

## Limitations

CodeGraph unindexed. No screen-reader session; name/role/state claims are from host markup plus HTML/WCAG native-control techniques, not an AT capture on `https://qrati.com/connect/ember-example`. Cookie-consent and embed widgets not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T00:00:39Z | 2026-11-10T00:01:02Z | 05:30:39 | 05:31:02 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-10T00:01:36Z | 2026-11-10T00:04:03Z | 05:31:36 | 05:34:03 | 00:02:27 (2.5 min) |
| `delivery` | 2026-11-10T00:04:03Z | 2026-11-10T00:05:04Z | 05:34:03 | 05:35:04 | 00:01:02 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-10T00:00:39Z | 2026-11-10T00:05:05Z | 05:30:39 | 05:35:05 | **00:04:26 (4.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:34 (0.6 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T000039Z-5b97c6bf83c44796b3ae173ec3c9e261.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/100
- Base `main` `d99a71a520cc6fe7270cf0b217071db377d027b6` / head `bughunter/20261110T000039Z-5b97c6bf83c44796b3ae173ec3c9e261-ember` `03e413d3fdfafa8dea65688c912626c3de9aa380` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
