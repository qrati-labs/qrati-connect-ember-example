# Ember first-layer cookie-consent modal

- **Scope:** First-layer vanilla-cookieconsent box (`Accept all` / `Reject analytics` / `Manage preferences`): `hideFromBots`, cookie persistence defaults, `disablePageInteraction`, `guiOptions.equalWeightButtons`, and stacking versus the host theme toggle. Excludes geo fail-closed (#42), opt-out analytics default (#32), preferences sections / off-toggle (#30), primary-button contrast (#22), footer reopen (#28), GTM load after analytics (20261106T204938Z).
- **Base:** `origin/main` at `80dce9949550d46481ba2f391fe57846342a6ef5`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T072738Z-62a806a036644d1192a2e57836ff2331-ember`, `bughunter/20261107T072738Z-62a806a036644d1192a2e57836ff2331-ember`.
- **Run:** `20261107T072738Z-62a806a036644d1192a2e57836ff2331`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Constructor (`app/components/qrati-demo.gts`) calls `initCookieConsent()` after applying the host theme.
2. Geo gate (`app/lib/cookieConsent.ts` `checkConsentRequired`): session cache `qrati_geo_consent_required`; `qrati.com` host uses `/api/cookie-consent-geo`, otherwise `https://qrati.com/api/cookie-consent-geo`; non-OK / non-boolean `required` / thrown errors fail closed (`true`) without caching (#42).
3. `CookieConsent.run` (vanilla-cookieconsent **3.1.0**): `mode` opt-in when required else opt-out; `autoShow: required`; categories `necessary` readonly-on and `analytics.enabled: !required` (#32). Language strings supply first-layer `acceptAllBtn: 'Accept all'`, `acceptNecessaryBtn: 'Reject analytics'`, `showPreferencesBtn: 'Manage preferences'`. Preferences `linkedCategory` sections already exist (#30). Host does **not** pass `hideFromBots`, `disablePageInteraction`, `guiOptions`, `revision`, or `cookie`.
4. Library defaults from v3.1.0 `cookieconsent.esm.js` constructor + types: `hideFromBots: true` (UA `/bot|crawl|spider|slurp|teoma/i` or `navigator.webdriver`); `disablePageInteraction: false`; `guiOptions.consentModal.equalWeightButtons: true`; cookie `{ name: 'cc_cookie', expiresAfterDays: 182, domain: '', path: '/', secure: true, sameSite: 'Lax' }`. Setter writes `Path=/; SameSite=Lax; Secure` on HTTPS; `Domain=` is appended only when `hostname` contains `.` **and** the configured domain is used (`b(hostname,'.')`). Empty default domain keeps a host-only cookie. Read-back via `document.cookie` / `validConsent` suppresses `autoShow` on the next load.
5. Side effects: `onFirstConsent` / `onConsent` / `onChange` and post-`run` `syncGtm` (already audited). `#cc-main` mounts on `document.body` (`root` default), `position: fixed; z-index: var(--cc-z-index)` with compiled `--cc-z-index: 2147483647`. Host `#cc-main` rules set color tokens only (`app/styles/app.css`). Default consent layout is `box` at bottom-right; theme toggle is top-right (`z-index: 1` after the Pilot absolute override). Footer **Cookie Preferences** awaits init then `showPreferences()` (#28).
6. Authz: none (public demo). Persistence: `cc_cookie` + sessionStorage geo flag. Errors: geo `catch` → opt-in banner.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`hideFromBots` swallows real browsers:** rejected. Detector is UA bot tokens or `webdriver`, not Safari/Chrome/Firefox product tokens. Host does not set `hideFromBots: false`; default `true` is documented (avoid indexing modal copy).
- **Missing `disablePageInteraction` fails GDPR/UX:** library default `false`; banner copy does not claim a blocking overlay. Preact sibling stacking audit treated the same default as non-defect.
- **Unequal Accept vs Reject weight:** `equalWeightButtons` defaults **true**; host does not override `guiOptions`.
- **Cookie not restored / banner re-prompts forever:** rejected. Defaults persist `cc_cookie` 182 days, `path /`, `SameSite=Lax`, `Secure` on HTTPS. Same class as Preact report-only `20261105T205938Z-preact-consent-cookie-persist.md`.
- **`path: /` on `qrati.com` collides with the marketing site:** host-only cookie (empty `domain`) is still sent on every `qrati.com` path. That is the library default and the shared connect-example pattern, not a broken first-layer control. No in-repo contract requires a subpath-scoped name. Not treated as a defect (sibling persist audit).
- **Theme toggle covers Accept/Reject:** rejected. Banner default bottom-right vs toggle top-right; `#cc-main` z-index `2147483647` vs toggle `1`.
- **Issue search** `hideFromBots OR "first-layer" OR "consent modal" OR cc_cookie OR "Accept all"`: closed #22 (primary contrast), #28 (footer reopen), #42 (geo), #32 (opt-out default). No open duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [CookieConsent configuration reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html) (`hideFromBots`, `disablePageInteraction`, `cookie`, `guiOptions.equalWeightButtons`)
- vanilla-cookieconsent v3.1.0 `dist/cookieconsent.esm.js` defaults + bot regex; `dist/cookieconsent.css` `--cc-z-index: 2147483647`
- `app/lib/cookieConsent.ts` `CookieConsent.run` / first-layer copy
- `app/styles/app.css` `#cc-main` tokens (no z-index override)
- Preact sibling: cookie persist and consent-vs-toggle stacking report-only

## Limitations

CodeGraph unindexed. No browser run of the first-layer box (live `https://qrati.com/connect/ember-example` returned HTTP 404 this run; deployment availability out of scope). Cookie Domain/Path inferred from pinned library source, not a Set-Cookie capture.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T07:27:38Z | 2026-11-07T07:27:58Z | 12:57:38 | 12:57:58 | 00:00:20 (0.3 min) |
| `audit` | 2026-11-07T07:28:22Z | 2026-11-07T07:35:21Z | 12:58:22 | 13:05:21 | 00:06:59 (7.0 min) |
| `delivery` | 2026-11-07T07:35:17Z | 2026-11-07T07:35:21Z | 13:05:17 | 13:05:21 | 00:00:04 (0.1 min) |
| **Total run (preflight start to finish)** | 2026-11-07T07:27:38Z | 2026-11-07T07:35:21Z | 12:57:38 | 13:05:21 | **00:07:43 (7.7 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:20 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T072738Z-62a806a036644d1192a2e57836ff2331.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/73
- Base `main` `80dce9949550d46481ba2f391fe57846342a6ef5` / head `bughunter/20261107T072738Z-62a806a036644d1192a2e57836ff2331-ember` (timing amend after first push)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
