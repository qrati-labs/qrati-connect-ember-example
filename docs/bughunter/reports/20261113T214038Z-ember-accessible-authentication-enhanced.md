# Ember host WCAG 3.3.9 accessible authentication (enhanced)

- **Scope:** WCAG 2.2 SC 3.3.9 Accessible Authentication (Enhanced) (AAA) for host-authored UI in `QratiDemo`: whether any authentication step requires a cognitive function test, including object-recognition or user-provided-content challenges that 3.3.8 excepts. Excludes embed internals (`qrati-connect` / `embed.js` account/login), qrati.com account pages reached via outbound Contact/hero links, cookie-consent geo/GTM (not authentication), theme `localStorage` (not authentication), 3.3.8 Accessible Authentication (Minimum) (20261110T120238Z), 2.2.5 Re-authenticating (20261113T173338Z).
- **Base:** `origin/main` at `40e7ad8c3f2fda8022686c12d599fe6982524359`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T214038Z-bd8dcea74a454a4da08b46fd0976fe10-qrati-connect-ember-example`, `bughunter/20261113T214038Z-bd8dcea74a454a4da08b46fd0976fe10-ember`.
- **Run:** `20261113T214038Z-bd8dcea74a454a4da08b46fd0976fe10`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not accept credentials, set auth cookies, or serve an authentication challenge.
2. Host chrome (`app/components/qrati-demo.gts`): theme toggle, outbound links, live-gallery embed mount, marketing/FAQ/CTA, footer Cookie Preferences. Event bindings are `{{on "click"}}` only. Constructor calls `initCookieConsent()` and sets `data-theme`.
3. Host markup search of `app/`, `index.html`, `src/worker.ts`: no `<input>`, no `<form>`, no `type="password"` / credential `autocomplete`, no CAPTCHA / reCAPTCHA / hCaptcha / Turnstile, no object-recognition or “select images you uploaded” challenge, no WebAuthn/passkey ceremony, no login/signin UI. `tests/helpers/index.ts` mentions `authenticateSession()` only as a commented ember-simple-auth example; it is not imported or called.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0) is a CMP (geo gate + optional analytics/GTM), not an authentication process. Theme persistence (`qc-theme` in `localStorage`) is a preference, not an account login.
5. [WCAG 2.2 SC 3.3.9](https://www.w3.org/TR/WCAG22/#accessible-authentication-enhanced) (Level AAA, fetched this run): a cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides an alternative method that does not rely on a cognitive function test, or a mechanism to assist completing the test. [Understanding 3.3.9](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html) (fetched 2026-11-13): same as 3.3.8 Accessible Authentication (Minimum) **without** the exceptions for object recognition and user-provided content. Required auth steps cannot show image/video/audio object CAPTCHAs or “pick the images you previously supplied.” Failure [F109](https://www.w3.org/WAI/WCAG22/Techniques/failures/F109) is blocking password/code re-entry in the same format. With no host authentication process, there is no step that can fail 3.3.9, including the object-recognition class that 3.3.8 excepts.

Authz/validation: public demo. Persistence: `qc-theme` localStorage; geo `sessionStorage`; consent cookie after preference click. Side effects: optional GTM inject after analytics consent; theme persist; cookie-preferences modal. Errors: geo fetch fail-closed; `showCookiePreferences` awaits init then `CookieConsent.showPreferences()`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing password-manager `autocomplete` / WebAuthn fails AAA 3.3.9:** there is no authentication step to annotate or replace. The SC does not require adding login.
- **3.3.8 already covered authentication, so 3.3.9 cannot be this run’s workflow:** 3.3.8 excepts object-recognition and personal-content tests; 3.3.9 removes those exceptions. Traced separately against primary Understanding text. Host still has no CAPTCHA of either class.
- **Cookie consent / geo fetch is authentication:** it does not identify the user to an account. Understanding 3.3.9 targets login, not CMP banners.
- **Embed gallery login inside `qrati-connect` fails this host SC:** widget internals are out of scope; host markup does not include that UI.
- **`qrati.com/contact-us` or GitHub OAuth is this page’s auth process:** those are outbound navigations to other origins, not steps on this document.
- **Host must meet AAA 3.3.9:** no such claim in README or `index.html`. With no authentication process, G218/H100/F109 do not apply.
- **Issue search** `3.3.9 OR "accessible authentication enhanced" OR captcha OR cognitive function`: no matching issues. Open set empty. Closed 3.3.8 report-only is a different SC. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 3.3.9 Accessible Authentication (Enhanced)](https://www.w3.org/TR/WCAG22/#accessible-authentication-enhanced)
- [WCAG 2.2 Understanding SC 3.3.9 Accessible Authentication (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html) (W3C page retrieved 2026-11-13)
- [F109: Failure of 3.3.8 and 3.3.9 due to preventing password or code re-entry](https://www.w3.org/WAI/WCAG22/Techniques/failures/F109)
- `app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `app/templates/application.gts`, `app/router.ts`, `index.html`, `src/worker.ts`
- `tests/helpers/index.ts` (comment-only ember-simple-auth stub)
- Prior: 3.3.8 accessible authentication (20261110T120238Z); 2.2.5 re-authenticating (20261113T173338Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host source and WCAG 3.3.9 Understanding/TR (fetched 2026-11-13). Embed widget authentication is out of scope.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T21:40:38Z | 2026-11-13T21:41:04Z | 03:10:38 | 03:11:04 | 00:00:26 (0.4 min) |
| `audit` | 2026-11-13T21:41:21Z | 2026-11-13T21:44:31Z | 03:11:21 | 03:14:31 | 00:03:10 (3.2 min) |
| `delivery` | 2026-11-13T21:44:31Z | 2026-11-13T21:44:31Z | 03:14:31 | 03:14:31 | 00:00:00 (0.0 min) |
| **Total run (preflight start to finish)** | 2026-11-13T21:40:38Z | 2026-11-13T21:44:31Z | 03:10:38 | 03:14:31 | **00:03:53 (3.9 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:17 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T214038Z-bd8dcea74a454a4da08b46fd0976fe10.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/177
- Base `main` `40e7ad8c3f2fda8022686c12d599fe6982524359` / head `bughunter/20261113T214038Z-bd8dcea74a454a4da08b46fd0976fe10-ember` (timing-table commit follows)
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending, Test pending, Workers Builds pending, GitGuardian Security Checks pass
- Local tests **NOT RUN BY BUGHUNTER**
