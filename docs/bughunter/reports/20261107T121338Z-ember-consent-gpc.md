# Ember cookie-consent Global Privacy Control (`respectGpc`)

- **Scope:** Host cookie-consent handling of the browser Global Privacy Control signal (`navigator.globalPrivacyControl`) via vanilla-cookieconsent `respectGpc`, versus geo opt-in/opt-out and the analytics → GTM gate. Excludes geo fail-closed (#42), opt-out analytics default (#32), GTM load after analytics (20261106T204938Z), Consent Mode default (20261107T103738Z), first-layer modal (20261107T072738Z), cookie record (20261107T092838Z).
- **Base:** `origin/main` at `c016db054d1507faeeebbf76f70952fec3a19d6f`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T121338Z-b666717632e94b998bb7b7d7138e5503-ember`, `bughunter/20261107T121338Z-b666717632e94b998bb7b7d7138e5503-ember`.
- **Run:** `20261107T121338Z-b666717632e94b998bb7b7d7138e5503`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Constructor (`app/components/qrati-demo.gts`) calls `initCookieConsent()` after applying the host theme.
2. Geo gate (`app/lib/cookieConsent.ts` `checkConsentRequired`): session cache `qrati_geo_consent_required`; hostname containing `qrati.com` uses `/api/cookie-consent-geo`, otherwise `https://qrati.com/api/cookie-consent-geo`; non-OK / non-boolean `required` / thrown errors fail closed (`true`) without caching (#42).
3. `CookieConsent.run` (vanilla-cookieconsent **3.1.0**) sets `mode` opt-in when geo-required else opt-out, `autoShow: required`, categories `necessary` (readonly on) and `analytics.enabled: !required` (#32). Callbacks `onFirstConsent` / `onConsent` / `onChange` plus post-`run` `syncGtm` inject `gtm.js` only when `acceptedCategory('analytics')` and `VITE_GTM_ID` is set (20261106T204938Z).
4. `CookieConsent.run` does **not** pass `respectGpc`. Library configuration default is `false` ([configuration reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html)): until the user chooses, GPC would treat `enabled` categories as disabled and skip auto-showing the modal; no cookie is written from the signal alone. With the default, `navigator.globalPrivacyControl` is ignored.
5. Reachable effect on this example: in an opt-out geo (`required: false`), analytics starts enabled (`analytics.enabled: true`) even if the UA sends GPC. `syncGtm` would still no-op on the shipped `.env.example` empty `VITE_GTM_ID`. In opt-in geo, analytics starts off until Accept all / preferences, GPC or not.
6. Authz: none (public demo). Persistence: `cc_cookie` + sessionStorage geo flag. Side effects: optional GTM. Errors: geo `catch` → opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `respectGpc: true` violates this host’s cookie contract:** contradicted by in-repo copy and categories (`necessary` vs optional `analytics`) and by geo-based `mode`/`autoShow`. README, tests, and consent strings do not mention GPC / “do not sell”.
- **Must honor GPC as a WCAG or library-required default:** [CookieConsent `respectGpc`](https://cookieconsent.orestbida.com/reference/configuration-reference.html) defaults **false**. Enabling it would change opt-out-geo first-paint analytics without a documented product requirement.
- **GPC browsers load GTM before a choice:** GTM insert still requires `acceptedCategory('analytics')` and a non-empty `VITE_GTM_ID`. Default example ID is empty, so the inject path is not live even when analytics is enabled.
- **Issue search** `GPC OR respectGpc OR globalPrivacyControl OR "privacy control"`: no matching issue.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [CookieConsent configuration reference — `respectGpc`](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- `app/lib/cookieConsent.ts` (`CookieConsent.run`, `syncGtm`)
- `app/components/qrati-demo.gts` constructor `initCookieConsent()`
- `.env.example` empty `VITE_GTM_ID`

## Limitations

CodeGraph unindexed. No browser with `navigator.globalPrivacyControl` set. No live GTM container. Legal GPC/CPRA policy risk is not treated as a product-code defect.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending
- Base `main` `c016db054d1507faeeebbf76f70952fec3a19d6f` / head `bughunter/20261107T121338Z-b666717632e94b998bb7b7d7138e5503-ember`
- `closingIssuesReferences`: none
- Assignees none (repo unmapped; no guessed owner)
