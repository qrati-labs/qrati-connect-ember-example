# Ember host WCAG 3.3.6 error prevention (all)

- **Scope:** WCAG 2.2 SC 3.3.6 Error Prevention (All) (AAA) for host-authored UI in `QratiDemo`: theme toggle, FAQ `<details>`, hero/action-pill/Contact/footer links, Cookie Preferences, cookie-consent init (`app/lib/cookieConsent.ts`, vanilla-cookieconsent **3.1.0**), Worker HTML. Excludes embed internals (`qrati-connect` / `embed.js` upload/search/account forms), 3.3.4 legal/financial/data (20261110T045638Z), 3.3.5 help (20261113T175438Z), 3.3.1–3.3.3, 3.3.7 redundant entry (20261110T122338Z).
- **Base:** `origin/main` at `b97f1dc198afb7ec246585ea9490511d708aa4d7`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T181539Z-f686a58a4cdc4ebfb69757dac02ab37b-ember-example`, `bughunter/20261113T181539Z-f686a58a4cdc4ebfb69757dac02ab37b-ember`.
- **Run:** `20261113T181539Z-f686a58a4cdc4ebfb69757dac02ab37b`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. Admin chore PRs #121/#122 do not overlap this repository. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 3.3.6. There is no host form that requires the user to submit information, so the SC’s Reversible / Checked / Confirmed obligations are not reachable. Cookie-category choice, if treated as a submission, is reversible via footer Cookie Preferences.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; one history index. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not accept form posts.
2. [WCAG 2.2 SC 3.3.6](https://www.w3.org/TR/WCAG22/#error-prevention-all) (AAA), fetched this run: “For web pages that require the user to submit information, at least one of the following is true: Reversible / Checked / Confirmed.”
3. [Understanding 3.3.6](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html) (fetched this run): intent is avoiding consequences of mistakes **when submitting form data**. It “builds on Success Criterion 3.3.4 … in that it applies to **all forms** that require users to submit information.” Sufficient techniques: follow 3.3.4 techniques for those forms.
4. Host source search for `<input>`, `<textarea>`, `<select>`, `<form>`, `contenteditable`, `method="post"`, `type="submit"` in `*.gts` / `*.ts` / `*.html` / `*.js` / `*.css`: **none**. Theme toggle, FAQ `<summary>`, Cookie Preferences, and host links are activation/navigation, not data collection.
5. CookieConsent `run()` (3.1.0): first-layer buttons (`acceptAllBtn` / `acceptNecessaryBtn` / `showPreferencesBtn`) and preferences category toggles (`linkedCategory`: `necessary` / `analytics`). Host does not inject extra HTML fields. Footer `openCookiePreferences` → `showCookiePreferences()` awaits `initCookieConsent()` then `CookieConsent.showPreferences()` (closed #28). A later change replaces the consent cookie — **reversible** if this UI is counted as a submission.
6. Theme persist (`qc-theme` localStorage) and geo cache (`qrati_geo_consent_required` sessionStorage) are client preference writes, not HTTP form submissions. Contact CTA is `<a href="https://qrati.com/contact-us">` (navigation).
7. Related SCs already traced:
   - 3.3.4 legal/financial/data: not applicable (20261110T045638Z).
   - 3.3.5 help: no text-input form (20261113T175438Z).
   - 3.3.2 labels or instructions: no host inputs (20261110T035038Z).

Authz/validation/persistence: public demo; `qc-theme` localStorage; geo `sessionStorage`; consent cookie after choice. Side effects: optional GTM inject after analytics grant. Errors: geo fail-closed to opt-in.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing confirm step on Accept all / Save preferences fails 3.3.6:** rejected unless the page requires submitting information. Even if consent is a submission, Understanding’s Reversible clause is met by footer reopen + `onChange` → `syncGtm`.
- **Theme toggle is a submission without undo:** it is a local `light`/`dark` write, not a form. Clicking again reverses it; storage guard already handles blocked `localStorage` (#40).
- **Contact CTA posts without review:** it is same-window navigation to `qrati.com/contact-us`, not a host form. Off-site contact form is out of this repo.
- **Embed gallery upload/search needs 3.3.6 on the host:** out of scope (`embed.js` internals). Host does not wrap those fields.
- **Host must meet AAA 3.3.6:** no such claim in README or `index.html`. With no host form, the SC does not apply.
- **Issue search** `error prevention OR 3.3.6 OR confirm submit`: no matching issue (open set empty). Closed hits are unrelated (#28 preferences reopen, #138 gtag helper). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 3.3.6 Error Prevention (All)](https://www.w3.org/TR/WCAG22/#error-prevention-all) (W3C TR retrieved 2026-11-13)
- [Understanding SC 3.3.6](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html) (W3C page retrieved 2026-11-13)
- `app/components/qrati-demo.gts` (no form/input; FAQ + Contact CTA + theme toggle + footer Cookie Preferences)
- `app/lib/cookieConsent.ts` (button/toggle consent; `showCookiePreferences` reopen)
- `index.html` / `src/worker.ts` (no form markup / no POST handler)
- Prior: 3.3.4 (20261110T045638Z); 3.3.5 (20261113T175438Z); 3.3.2 (20261110T035038Z); #28 preferences reopen

## Limitations

CodeGraph unindexed. No browser session of the Ember host. vanilla-cookieconsent 3.1.0 preferences chrome taken from host `run()` config plus prior library audits, not a live DevTools dump. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T181539Z-f686a58a4cdc4ebfb69757dac02ab37b.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
