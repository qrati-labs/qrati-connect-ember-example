# Ember host WCAG 2.2.5 re-authenticating

- **Scope:** WCAG 2.2 SC 2.2.5 Re-authenticating (AAA) for host-authored UI in `QratiDemo`: theme toggle, FAQ `<details>`, hero/action-pill/Contact/footer links, Cookie Preferences, cookie-consent init (`app/lib/cookieConsent.ts`, vanilla-cookieconsent **3.1.0**), inline theme boot, Cloudflare Worker HTML. Excludes embed internals (`qrati-connect` / `embed.js` account/login), 2.2.1 timing adjustable (20261110T093638Z), 2.2.2 pause/stop/hide (20261109T231938Z), 2.2.3 no timing (20261113T144038Z), 2.2.4 interruptions (20261113T165038Z), 2.2.6 timeouts (20261113T171238Z), 3.3.8 accessible authentication (20261110T120238Z).
- **Base:** `origin/main` at `b397b2737ba410225c43ff144c19ecde6279fff9`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T173338Z-8d03c74fee9f4ad0ab4710b91cda66d0-qrati-connect-ember-example`, `bughunter/20261113T173338Z-8d03c74fee9f4ad0ab4710b91cda66d0-ember`.
- **Run:** `20261113T173338Z-8d03c74fee9f4ad0ab4710b91cda66d0`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.2.5. There is no authenticated session, login, or session-expiry path that would require re-authentication, so F12 (session time limit without restoring input after re-auth) is not reachable.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; one history index.
2. [WCAG 2.2 SC 2.2.5](https://www.w3.org/TR/WCAG22/#re-authenticating) (AAA): when an authenticated session expires, the user can continue the activity without loss of data after re-authenticating. [Understanding 2.2.5](https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html) (fetched this run): intent is authenticated transactions with inactivity time limits or other logout while the user is mid-process. Failure [F12](https://www.w3.org/WAI/WCAG22/Techniques/failures/F12.html) applies to sites that require login to submit input and terminate the session after inactivity without restoring that input after re-auth. Sufficient techniques [G105](https://www.w3.org/WAI/WCAG22/Techniques/general/G105.html) / [G181](https://www.w3.org/WAI/WCAG22/Techniques/general/G181.html) restore process data after re-login.
3. Host JS (`app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `index.html` theme boot): no login form, password field, `autocomplete` token for username/current-password, token refresh, or session-expiry handler. No `setTimeout` / `setInterval`. Theme toggle, FAQ, and Cookie Preferences fire only on user activation.
4. Persistence that is not an authenticated session:
   - `qc-theme` in `localStorage` (theme preference, not an identity session).
   - `qrati_geo_consent_required` in `sessionStorage`: tab-scoped **geo decision cache**, not credentials.
   - CookieConsent `run()` stores a consent preference cookie. That is not a login; re-prompting after expiry is not F12.
5. No host `<form>`, `<input>`, or multi-step wizard whose values could be lost across re-auth. Contact CTA is navigation to `https://qrati.com/contact-us`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not set session cookies or `Set-Cookie` auth headers.

Authz/validation/persistence: public demo; `qc-theme` localStorage on toggle; geo `sessionStorage`; consent cookie after choice. Side effects: optional GTM inject after analytics grant. Errors: geo fail-closed to opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Consent cookie or geo `sessionStorage` is an authenticated session that expires:** rejected. Neither stores user identity nor gates a host transaction. Understanding 2.2.5 is about **re-login after an authenticated session ends** while process data exists.
- **Embed gallery login could idle-timeout:** out of scope (`qrati-connect` / `embed.js` internals). Host does not configure embed auth or session TTL.
- **3.3.8 already covered authentication, so 2.2.5 cannot be this run’s workflow:** 3.3.8 is cognitive password-managers / no transcription of passwords. 2.2.5 is data preservation across session expiry. Traced separately against primary Understanding text.
- **Host must meet AAA 2.2.5:** no such claim in README or `index.html`. With no authenticated session, G105/G181/F12 do not apply; there is no re-auth path to fail.
- **Issue search** `re-authenticating OR 2.2.5 OR session expire OR login OR authentication`: no matching issues (open set empty). Closed 3.3.8 report-only is a different SC. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.2.5 Re-authenticating](https://www.w3.org/TR/WCAG22/#re-authenticating)
- [Understanding SC 2.2.5](https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html) (W3C page retrieved 2026-11-13)
- [F12](https://www.w3.org/WAI/WCAG22/Techniques/failures/F12.html)
- `app/lib/cookieConsent.ts` (no login; `sessionStorage` geo cache only)
- `app/components/qrati-demo.gts` (`qc-theme` localStorage; no auth UI)
- `index.html` (no login markup)
- `src/worker.ts` (path rewrite / GTM placeholder only)
- Prior: 2.2.1 (20261110T093638Z); 2.2.2 (20261109T231938Z); 2.2.3 (20261113T144038Z); 2.2.4 (20261113T165038Z); 2.2.6 (20261113T171238Z); 3.3.8 (20261110T120238Z)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. vanilla-cookieconsent 3.1.0 cookie lifetime taken as library default (no host `cookie` block), not a live DevTools cookie dump. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T17:33:38Z | 2026-11-13T17:34:02Z | 23:03:38 | 23:04:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-13T17:34:25Z | 2026-11-13T17:38:42Z | 23:04:25 | 23:08:42 | 00:04:16 (4.3 min) |
| `delivery` | 2026-11-13T17:38:09Z | 2026-11-13T17:38:42Z | 23:08:09 | 23:08:42 | 00:00:33 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-13T17:33:38Z | 2026-11-13T17:38:42Z | 23:03:38 | 23:08:42 | **00:05:04 (5.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:00 (0.0 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T173338Z-8d03c74fee9f4ad0ab4710b91cda66d0.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time. `audit` and `delivery` overlap: delivery started before audit was closed.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/165
- Base `main` `b397b2737ba410225c43ff144c19ecde6279fff9` / head `bughunter/20261113T173338Z-8d03c74fee9f4ad0ab4710b91cda66d0-ember`
- `closingIssuesReferences`: none
- Checks at first read-back: none reported on the head branch yet
- Assignees: none (example repo unmapped in ownership.html; do not guess)
