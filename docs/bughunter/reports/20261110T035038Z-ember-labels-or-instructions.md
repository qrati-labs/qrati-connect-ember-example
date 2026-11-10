# Ember host WCAG 3.3.2 labels or instructions

- **Scope:** WCAG 2.2 SC 3.3.2 Labels or Instructions for host-authored data-entry UI: cookie-consent first layer copy and preferences category toggles configured in `cookieConsent.ts`. Excludes links, theme toggle, FAQ `<details>`, Contact CTA (not data entry per Understanding 3.3.2), embed internals (`qrati-connect` / `embed.js`), 3.3.1 error identification, 2.4.6 headings and labels (20261109T200338Z), 4.1.2 name/role/value (20261110T000039Z).
- **Base:** `origin/main` at `9142fc21f7b52b1a58e48695bf990b91d0eadaf6`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T035038Z-9e5f7e9edc28453fa803bbb7f0999d1c-ember`, `bughunter/20261110T035038Z-9e5f7e9edc28453fa803bbb7f0999d1c-ember`.
- **Run:** `20261110T035038Z-9e5f7e9edc28453fa803bbb7f0999d1c`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap a product workflow, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. `QratiDemo` constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). Footer Cookie Preferences calls `showCookiePreferences()`. `app/router.ts` `Router.map` is empty (single history index).
2. Host source search for `<input>`, `<textarea>`, `<select>`, `contenteditable` in `*.gts`/`*.ts`/`*.html`/`*.js`/`*.css`: no matches. Theme toggle, action pills, FAQ `<details>`, Contact CTA, and footer links are not data-entry controls.
3. [WCAG 2.2 SC 3.3.2 Labels or Instructions](https://www.w3.org/TR/WCAG22/#labels-or-instructions) (Level A): labels or instructions are provided when content requires user input. [Understanding 3.3.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html): the SC does **not** apply to links or expand/collapse widgets that are not associated with data entry. Visible labels must be presented to all users, not only via `aria-label`.
4. Only host-authored data-entry UI is vanilla-cookieconsent v3.1.0, configured in `cookieConsent.ts`:
   - First layer (`consentModal`): title `We use cookies`; description `Essential cookies keep this example working. Analytics cookies are optional.`; buttons `Accept all`, `Reject analytics`, `Manage preferences`.
   - Preferences (`preferencesModal`): title `Cookie preferences`; `closeIconLabel: 'Close'`; sections with `title`, `description`, and `linkedCategory` for `necessary` and `analytics` (issue #30).
5. Library (jsDelivr `vanilla-cookieconsent@3.1.0`): `ve()` builds a `<label class="section__toggle-wrapper">` wrapping a checkbox and `<span class="toggle__label">` whose `textContent` is the section title. Visible row title is `.pm__section-title` (`innerHTML` = section `title`). CSS sets `.toggle__label { opacity: 0; position: absolute; z-index: -1 }` (AT name); the section title remains visible on the same row as the switch.
6. Geo / GTM paths do not add extra fields. `checkConsentRequired` fail-closed opt-in is not an input-error UI (3.3.1 out of scope).

Authz/validation: public demo. Persistence: `qrati_geo_consent_required` sessionStorage and the consent cookie — neither removes section titles.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Host has unlabeled inputs:** no host `<input>`/`<textarea>`/`<select>`. Theme toggle and FAQ are excluded by Understanding 3.3.2 (not data entry).
- **Preferences toggles fail 3.3.2 because `.toggle__label` is visually hidden:** the SC requires a visible label for the control, not that the accessible-name node itself be visible. Section titles `Strictly necessary cookies` / `Analytics cookies` plus descriptions are on-screen in the same section row. 4.1.2 name computation was a prior audit.
- **Close icon (`aria-label` only) fails 3.3.2:** close is not data entry; out of this SC.
- **First-layer buttons lack instructions:** modal description states essential vs optional analytics before Accept/Reject/Manage.
- **Issue search** `3.3.2 OR "labels or instructions" OR "user input" OR linkedCategory`: closed #30 (category toggles missing) is the related prior defect; current `preferencesModal.sections` + `linkedCategory` are present. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [WCAG 2.2 SC 3.3.2](https://www.w3.org/TR/WCAG22/#labels-or-instructions)
- vanilla-cookieconsent 3.1.0 `ve()` toggle + section title construction (`dist/cookieconsent.umd.js`); `.toggle__label` / `.pm__section-title` in `dist/cookieconsent.css`
- `app/lib/cookieConsent.ts`
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS plus library CSS/JS and WCAG 3.3.2 Understanding. Embed widget internals not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T03:50:38Z | 2026-11-10T03:50:59Z | 09:20:38 | 09:20:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-10T03:51:21Z | 2026-11-10T03:58:04Z | 09:21:21 | 09:28:04 | 00:06:43 (6.7 min) |
| `delivery` | 2026-11-10T03:58:04Z | 2026-11-10T03:58:58Z | 09:28:04 | 09:28:58 | 00:00:55 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-10T03:50:38Z | 2026-11-10T03:58:58Z | 09:20:38 | 09:28:58 | **00:08:20 (8.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T035038Z-9e5f7e9edc28453fa803bbb7f0999d1c.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/108
- Base `main` `9142fc21f7b52b1a58e48695bf990b91d0eadaf6` / head `bughunter/20261110T035038Z-9e5f7e9edc28453fa803bbb7f0999d1c-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint/Test queued
- Local tests **NOT RUN BY BUGHUNTER**
