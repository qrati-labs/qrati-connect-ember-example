# Ember host WCAG 3.3.7 redundant entry

- **Scope:** WCAG 2.2 SC 3.3.7 Redundant Entry on the Ember example host: whether any host-authored process requires the user to re-enter information already provided in the same activity. Excludes embed widget forms (`qrati-connect` / `embed.js`), qrati.com contact/account pages reached via outbound links, 3.3.1–3.3.4 / 3.3.8 form-error and authentication SCs already audited.
- **Base:** `origin/main` at `17d361d91df8a83fa1822e4a542fa09ce0be3e57`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T122338Z-06bb45c13c7f4c46adda5717d6199531-qrati-connect-ember-example`, `bughunter/20261110T122338Z-06bb45c13c7f4c46adda5717d6199531-ember`.
- **Run:** `20261110T122338Z-06bb45c13c7f4c46adda5717d6199531`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not collect or replay user-entered fields.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount, marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`: no `<input>`, `<textarea>`, `<form>`, `autocomplete`, or other data-entry controls. Theme persistence (`qc-theme` in `localStorage`) stores a host preference, not information the user typed into a process step.
4. Cookie consent (`app/lib/cookieConsent.ts`) is a CMP, not a multi-step data-entry process. First-layer actions are Accept all / Reject analytics / Manage preferences. The preferences modal exposes category toggles (`necessary` read-only, `analytics` optional) with no text fields. Geo required-flag is cached in `sessionStorage` (`qrati_geo_consent_required`) from `/api/cookie-consent-geo`, not from user-typed data. Reopening preferences via footer `showCookiePreferences` asks vanilla-cookieconsent to show the stored category state rather than blank text fields.
5. [WCAG 2.2 SC 3.3.7](https://www.w3.org/TR/WCAG22/#redundant-entry) (Level A): information previously entered by or provided to the user that is required to be entered again in the same process is auto-populated or available to select, except when re-entering is essential or the information is no longer valid. [Understanding 3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html): do not ask for the same information twice in the same activity. With no host multi-step process that collects information, there is no step that can fail 3.3.7.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Cookie first-layer then preferences is redundant entry:** the user has not typed information on the first layer; preferences are category toggles, not re-keyed fields. Understanding targets previously entered information in a process (e.g. address on a later step).
- **Saved consent cookie failing to restore toggles:** host does not implement a custom consent editor; it delegates display to `CookieConsent.showPreferences()` after `CookieConsent.run`. No host code blanks or re-asks typed values. Not evidenced as a host defect.
- **Embed gallery upload/checkout forms fail this host SC:** widget internals are out of scope; host markup does not include those fields.
- **`qrati.com/contact-us` contact form is this page’s process:** outbound navigation to another origin, not a later step on this document.
- **Issue search** `redundant OR 3.3.7 OR re-enter OR reenter OR autocomplete`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)
- [WCAG 2.2 SC 3.3.7](https://www.w3.org/TR/WCAG22/#redundant-entry)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `app/router.ts`
- `index.html`
- `src/worker.ts`

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.3.7 Understanding (search snippets 2026-11-10). Embed widget forms are out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- `closingIssuesReferences`: none
- Checks: pending. `pnpm test` **NOT RUN BY BUGHUNTER**.
