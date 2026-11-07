# Ember cookie-consent analytics revoke (Consent Mode vs autoClear)

- **Scope:** After analytics was granted, user rejects it via preferences: `onChange` → `syncGtm`, leftover `#gtm-script`, Google Consent Mode `denied`, and vanilla-cookieconsent `categories.analytics.autoClear`. Excludes GTM first load (20261106T204938Z), first-layer modal (20261107T072738Z), cookie record (20261107T092838Z), geo fail-closed (#42), opt-out default (#32), preferences sections (#30), footer reopen (#28).
- **Base:** `origin/main` at `9128f86dbae3df1f7c2a01682558d2044fb6cac2`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T101539Z-0fffa1d0e74c4d33ac4419e2dc1e50bc-ember`, `bughunter/20261107T101539Z-0fffa1d0e74c4d33ac4419e2dc1e50bc-ember`.
- **Run:** `20261107T101539Z-0fffa1d0e74c4d33ac4419e2dc1e50bc`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `QratiDemo` constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `CookieConsent.run` registers `onFirstConsent` / `onConsent` / `onChange` → `syncGtm`, then calls `syncGtm()` once after `run`.
2. Grant path (already audited): `acceptedCategory('analytics')` true and `VITE_GTM_ID` set and no `#gtm-script` → inject `https://www.googletagmanager.com/gtm.js?id=…`. Empty `.env.example` `VITE_GTM_ID=` means this example build never injects GTM unless a host env supplies an ID.
3. Revoke path: preferences **Reject analytics** / save with analytics off → `onChange` → `syncGtm`. `gtag('consent', 'update', { analytics_storage, ad_storage, ad_user_data, ad_personalization: 'denied' })`. Guard `if (!analytics || !gtmId || document.getElementById('gtm-script')) return` then exits: the existing script node is **not** removed; Consent Mode is updated.
4. `categories.analytics` is `{ enabled: !required }` only. No `autoClear.cookies` (no `/^_ga/` / `_gid` list). Global `autoClearCookies` default is `true` in vanilla-cookieconsent **3.1.0**, but the docs require a valid `autoClear` array before anything is erased.
5. Authz: none (public demo). Persistence: `cc_cookie` plus optional GTM cookies if an ID was built in. Errors: none thrown on revoke.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Must delete `#gtm-script` on revoke:** Google Consent Mode is the documented control after the tag exists ([Consent Mode](https://cookieconsent.orestbida.com/advanced/google-consent-mode.html); gtag `consent` `update`). Host already sends `denied` on revoke. Removing the script is not a stated contract.
- **Missing `autoClear` fails GDPR / the library contract:** `[category].autoClear` is optional. Default `autoClearCookies: true` is a no-op without `cookies[]`. Library troubleshooting notes GA4 may recreate cookies unless the vendor API is used — that API is the `gtag('consent', 'update')` call already present.
- **Reject is a no-op because GTM stays loaded:** Consent Mode `denied` is observable in `syncGtm`; GTM load is gated on accept. Empty `VITE_GTM_ID` makes both inject and leftover-script paths unreachable on the stock example.
- **Issue search** `autoClear OR revoke OR GTM OR analytics cookie`: closed #32 (opt-out default), #28 (footer reopen), #30 (preferences sections), #42 (geo). No open duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [CookieConsent configuration — categories.autoClear](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- [CookieConsent Google consent mode](https://cookieconsent.orestbida.com/advanced/google-consent-mode.html)
- vanilla-cookieconsent 3.1.0 types: `autoClearCookies?: boolean` default true; `AutoClear.cookies` required to erase
- `app/lib/cookieConsent.ts` `syncGtm` / `categories.analytics`
- `.env.example` `VITE_GTM_ID=`

## Limitations

CodeGraph unindexed. No browser session; GTM leftover-script behavior is from source. No live GET to `qrati.com/connect/ember-example` (prior deployment 404 is out of scope). Whether production wrangler sets `VITE_GTM_ID` was not observed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T101539Z-0fffa1d0e74c4d33ac4419e2dc1e50bc.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
