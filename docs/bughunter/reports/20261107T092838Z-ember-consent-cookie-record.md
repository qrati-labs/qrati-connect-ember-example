# Ember cookie-consent cookie record (name, domain, path, SameSite)

- **Scope:** Persistence of the vanilla-cookieconsent consent record written by `CookieConsent.run` in `app/lib/cookieConsent.ts` (cookie name, domain, path, `SameSite`, `Secure`, TTL). Excludes first-layer modal copy (20261107T072738Z), geo fail-closed (#42), opt-out analytics default (#32), preferences sections (#30), GTM inject after analytics (20261106T204938Z), footer reopen (#28), consent contrast (#22).
- **Base:** `origin/main` at `11360185dcb1c63cb36f366ba51bd94a07c442e4`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T092838Z-f58b31feddce455bad747130da017dbb-qrati-connect-ember-example`, `bughunter/20261107T092838Z-f58b31feddce455bad747130da017dbb-ember`.
- **Run:** `20261107T092838Z-f58b31feddce455bad747130da017dbb`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Constructor calls `initCookieConsent()` (`app/components/qrati-demo.gts`).
2. `initCookieConsent` (`app/lib/cookieConsent.ts`) awaits geo `checkConsentRequired`, then `CookieConsent.run({ mode, autoShow, categories, onFirstConsent/onConsent/onChange, language })`. There is **no** `cookie: { ... }` object.
3. Library defaults for vanilla-cookieconsent **v3.1.0** (`src/core/global.js` + `COOKIE_NAME`): `name: 'cc_cookie'`, `expiresAfterDays: 182`, `path: '/'`, `secure: true`, `sameSite: 'Lax'`. `setConfig` sets `cookie.domain = location.hostname` when the user does not override domain (`src/core/config-init.js`).
4. On production `qrati.com/connect/ember-example`, that is a **host-only** `cc_cookie` for `qrati.com` (not `.qrati.com`), path `/`, Secure + SameSite=Lax, ~6 months.
5. Cross-repo (contract check only): `qrati-web` `CookieConsentBanner.tsx` and sibling `qrati-connect-qwik-example` set `name: 'qrati_consent'`, `domain: '.qrati.com'` when hostname contains `qrati.com`, same path/TTL/SameSite. Ember does not read or write `qrati_consent`.
6. `sessionStorage` key `qrati_geo_consent_required` is origin-scoped and matches qrati-web’s geo cache key (boolean `required` only). Not the consent cookie.

Authz/validation: public demo; geo payload type-checked before cache (#42). Persistence: `cc_cookie` via library defaults; geo cache in `sessionStorage`. Side effects: optional GTM only after analytics accept (out of scope). Errors: geo `catch` → opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `cookie.secure` / `sameSite` ships an insecure consent cookie:** contradicted by v3.1.0 defaults (`secure: true`, `sameSite: 'Lax'`).
- **Must use `qrati_consent` on `.qrati.com`:** not stated in this README, tests, or `CookieConsent.run` comments. Sibling/main-app cookie name is not an Ember host invariant (same limit as OG-locale / JSON-LD audits).
- **Host-only `cc_cookie` overwrites marketing-site consent:** qrati-web reads `qrati_consent`, not `cc_cookie`. Different name; Ember cannot clobber the main banner’s record.
- **Path `/` leaks a tracking cookie across qrati.com:** `cc_cookie` is the consent *record* (library JSON), not analytics. Extra first-party cookie on the apex is a hygiene risk, not a demonstrated functional or consent-mode failure on this example (`VITE_GTM_ID` empty in `.env.example`).
- **TTL not 6 months / EDPB:** default `expiresAfterDays: 182` matches the comment on qrati-web’s explicit config.
- **Issue search** `cookie name OR cc_cookie OR qrati_consent OR sameSite OR cookie domain`: no matching issue for this workflow. Closed consent issues (#22 contrast, #28 reopen, #30 sections, #32 opt-out, #42 geo) are different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [vanilla-cookieconsent v3.1.0 default cookie](https://github.com/orestbida/cookieconsent/blob/v3.1.0/src/core/global.js) (`name` `cc_cookie`, `secure`, `sameSite: 'Lax'`, 182 days, `path: '/'`)
- [config-init domain = `location.hostname`](https://github.com/orestbida/cookieconsent/blob/v3.1.0/src/core/config-init.js)
- `app/lib/cookieConsent.ts` (`CookieConsent.run` without `cookie`)
- `qrati-labs/qrati-web` `src/components/CookieConsentBanner.tsx` (`qrati_consent` / `.qrati.com`; not an Ember invariant)

## Limitations

CodeGraph unindexed. No browser session; cookie flags taken from v3.1.0 source, not DevTools on the live host. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T09:28:38Z | 2026-11-07T09:28:59Z | 14:58:38 | 14:58:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-07T09:29:21Z | 2026-11-07T09:34:48Z | 14:59:21 | 15:04:48 | 00:05:27 (5.5 min) |
| `delivery` | 2026-11-07T09:34:48Z | 2026-11-07T09:35:43Z | 15:04:48 | 15:05:43 | 00:00:55 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-07T09:28:38Z | 2026-11-07T09:35:43Z | 14:58:38 | 15:05:43 | **00:07:05 (7.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T092838Z-f58b31feddce455bad747130da017dbb.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/78
- Base `main` `11360185dcb1c63cb36f366ba51bd94a07c442e4` / head `bughunter/20261107T092838Z-f58b31feddce455bad747130da017dbb-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
