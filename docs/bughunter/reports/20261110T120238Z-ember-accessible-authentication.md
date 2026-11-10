# Ember host WCAG 3.3.8 accessible authentication

- **Scope:** WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum) on the Ember example host: whether any host-authored authentication step requires recalling, transcribing, or solving a cognitive function test (password, CAPTCHA, transcription). Excludes embed widget login/upload auth (`qrati-connect` / `embed.js`), qrati.com account pages reached via outbound Contact/hero links, cookie-consent geo/GTM (not authentication), theme `localStorage` (not authentication), 3.3.1–3.3.4 form-error SCs already audited.
- **Base:** `origin/main` at `87cd63e2e0eafc2cbfe52eac96df68d2e9acb85f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T120238Z-30ef8f6e2a76462d93e4fcc2b7d24024-qrati-connect-ember-example`, `bughunter/20261110T120238Z-30ef8f6e2a76462d93e4fcc2b7d24024-ember`.
- **Run:** `20261110T120238Z-30ef8f6e2a76462d93e4fcc2b7d24024`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not accept credentials or serve an auth challenge.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount, marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`: no `<input>`, no `type="password"` / `type="email"` login fields, no `autocomplete` on credentials, no CAPTCHA, no WebAuthn/passkey ceremony, no `login` / `signin` / `password` UI. `tests/helpers/index.ts` mentions `authenticateSession()` only as a commented ember-simple-auth example; it is not imported or called.
4. Cookie consent (`app/lib/cookieConsent.ts`) is a CMP (geo gate + optional analytics/GTM), not an authentication process. Theme persistence (`qc-theme` in `localStorage`) is a preference, not an account login.
5. [WCAG 2.2 SC 3.3.8](https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum) (Level AA): a cognitive function test (remembering a password or solving a puzzle) is not required for any step in an **authentication process** unless an alternative that does not rely on that test is available. [Understanding 3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html): the SC applies to logins (do not force recall/transcription/puzzles to authenticate). With no host authentication process, there is no step that can fail 3.3.8.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing password-manager `autocomplete` fails 3.3.8:** there is no password field to annotate. The SC is about authentication steps, not a requirement to add login.
- **Cookie consent / geo fetch is authentication:** it does not identify the user to an account; Understanding targets login, not CMP banners.
- **Embed gallery login inside `qrati-connect` fails this host SC:** widget internals are out of scope; host markup does not include that UI.
- **`qrati.com/contact-us` or GitHub OAuth is this page’s auth process:** those are outbound navigations to other origins, not steps on this document.
- **Issue search** `authentication OR login OR password OR captcha OR 3.3.8`: no matching issue. Open set empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.3.8 Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)
- [WCAG 2.2 SC 3.3.8](https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/templates/application.gts`
- `app/router.ts`
- `index.html`
- `src/worker.ts`
- `tests/helpers/index.ts` (comment-only ember-simple-auth stub)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.3.8 Understanding (search snippets 2026-11-10). Embed widget authentication is out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
