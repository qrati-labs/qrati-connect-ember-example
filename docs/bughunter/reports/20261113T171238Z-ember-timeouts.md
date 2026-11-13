# Ember host WCAG 2.2.6 timeouts

- **Scope:** WCAG 2.2 SC 2.2.6 Timeouts (AAA) for host-authored UI in `QratiDemo`: theme toggle, FAQ `<details>`, hero/action-pill/Contact/footer links, Cookie Preferences, cookie-consent init (`app/lib/cookieConsent.ts`, vanilla-cookieconsent **3.1.0**), inline theme boot, Cloudflare Worker HTML. Excludes embed internals (`qrati-connect` / `embed.js`), 2.2.1 timing adjustable (20261110T093638Z), 2.2.2 pause/stop/hide (20261109T231938Z), 2.2.3 no timing (20261113T144038Z), 2.2.4 interruptions (20261113T165038Z), 2.2.5 re-authenticating (no authenticated session).
- **Base:** `origin/main` at `3d337e266b1ab088d83153015724ff5148948407`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T171238Z-e5fe59792ae74f0d9aa33525738e7c52-qrati-connect-ember-example`, `bughunter/20261113T171238Z-e5fe59792ae74f0d9aa33525738e7c52-ember`.
- **Run:** `20261113T171238Z-e5fe59792ae74f0d9aa33525738e7c52`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.2.6. There is no host-controlled inactivity timeout that discards user-entered data. Theme and consent records persist in `localStorage` / the consent cookie; geo is a one-shot lookup cache. Closing the tab without a form to submit is explicitly out of SC 2.2.6.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; one history index.
2. [WCAG 2.2 SC 2.2.6](https://www.w3.org/TR/WCAG22/#timeouts) (AAA): users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours with no user action. [Understanding 2.2.6](https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html) (fetched this run): intent is notification of **inactivity** timeouts that lose process data (forms, multi-step tasks). Best conformance is keep data ≥ 20 hours. The SC applies only to timeouts in the content provider's knowledge/control; closing the browser and losing unsubmitted page content is **not** a failure.
3. Host JS (`app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `index.html` theme boot): no `setTimeout`, `setInterval`, idle listener, or session-expiry handler. Theme toggle, FAQ, and Cookie Preferences fire only on user activation. `year = new Date().getFullYear()` is computed once at class init.
4. Persistence that could be mistaken for a timeout:
   - `qc-theme` in `localStorage` (read in theme boot + `readHostTheme`; written on toggle). Survives inactivity far beyond 20 hours until the user clears storage.
   - `qrati_geo_consent_required` in `sessionStorage`: tab-scoped **geo decision cache**, not user-entered task data. A new tab re-fetches; fail-closed opt-in does not drop a form.
   - CookieConsent `run()` has no `cookie.expires` override. Consent is a preference record, not a multi-step form. Re-prompting after cookie expiry is not inactivity data loss under 2.2.6.
5. No host `<form>`, `<input>`, or multi-step wizard. Contact CTA is a same-document navigation to `https://qrati.com/contact-us`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not set session cookies or inactivity headers. `index.html` has no `http-equiv="refresh"`.

Authz/validation/persistence: public demo; `qc-theme` localStorage on toggle; geo `sessionStorage`; consent cookie after choice. Side effects: optional GTM inject after analytics grant. Errors: geo fail-closed to opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Consent cookie or geo `sessionStorage` is an unannounced inactivity timeout:** rejected. Geo cache is not user-entered data. Consent expiry (library default, months-scale when set) re-shows a banner; it does not discard a host task. Understanding 2.2.6 is about losing **entered information** in a process.
- **Embed gallery session could idle-timeout:** out of scope (`qrati-connect` / `embed.js` internals). Host does not configure an embed timeout.
- **`sessionStorage` geo cache drops when the tab is closed:** Understanding states closing the browser/device and losing unsubmitted page content is not a 2.2.6 failure.
- **Host must meet AAA 2.2.6:** no such claim in README or `index.html`. Even if claimed, there is no inactivity timeout to warn about; data that exists is kept well past 20 hours (`localStorage`).
- **Issue search** `timeouts OR 2.2.6 OR inactivity OR "session expire"`: no matching issues (open set empty). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.2.6 Timeouts](https://www.w3.org/TR/WCAG22/#timeouts)
- [Understanding SC 2.2.6](https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html) (W3C page retrieved 2026-11-13)
- `app/lib/cookieConsent.ts` (no idle timer; `sessionStorage` geo cache only)
- `app/components/qrati-demo.gts` (`qc-theme` localStorage; no timers)
- `index.html` (no meta refresh)
- `src/worker.ts` (path rewrite / GTM placeholder only)
- Prior: 2.2.1 (20261110T093638Z); 2.2.2 (20261109T231938Z); 2.2.3 (20261113T144038Z); 2.2.4 (20261113T165038Z)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. vanilla-cookieconsent 3.1.0 default cookie lifetime taken as library default (no host `cookie` block), not a live DevTools cookie dump. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PENDING

## PR / checks

- Issue: none (report-only)
- PR: pending
- `closingIssuesReferences`: none
