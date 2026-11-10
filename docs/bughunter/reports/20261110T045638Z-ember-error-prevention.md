# Ember host WCAG 3.3.4 error prevention (legal, financial, data)

- **Scope:** WCAG 2.2 SC 3.3.4 Error Prevention (Legal, Financial, Data) for host-authored pages in `QratiDemo`: cookie-consent first layer / preferences, theme persist, Contact CTA, footer navigation. Excludes embed internals (`qrati-connect` / `embed.js` uploads, account, checkout), vanilla-cookieconsent library chrome beyond host config, 3.3.1–3.3.3 (20261110T041539Z / 20261110T035038Z / 20261110T043638Z).
- **Base:** `origin/main` at `acd21243eb974eb0904a58e6846534ef67877975`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T045638Z-41bc6c836e25401b87d7fe447017da39-qrati-connect-ember-example`, `bughunter/20261110T045638Z-41bc6c836e25401b87d7fe447017da39-ember-embed`.
- **Run:** `20261110T045638Z-41bc6c836e25401b87d7fe447017da39`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` chore PRs #121/#122 do not overlap product source, but `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). Footer Cookie Preferences calls `showCookiePreferences()`. `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not accept form posts.
2. Host source search for `<input>`, `<textarea>`, `<select>`, `<form>` in `*.gts`/`*.ts`/`*.html`/`*.js`/`*.css`: none. Theme toggle writes `qc-theme` to `localStorage`. Geo gate writes `qrati_geo_consent_required` to `sessionStorage`. CookieConsent.run stores the consent cookie locally. Contact CTA is `<a href="https://qrati.com/contact-us">` (navigation, not a host submission).
3. [WCAG 2.2 SC 3.3.4](https://www.w3.org/TR/WCAG22/#error-prevention-legal-financial-data) (Level AA) applies only to web pages that cause **legal commitments** or **financial transactions**, that **modify or delete user-controllable data in data storage systems**, or that **submit user test responses**. Then at least one of Reversible / Checked / Confirmed is required.
4. [Understanding 3.3.4](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html): legal commitments are binding obligations (license, contract, stock trade). Intent for data modification is **mass loss** such as deleting a file or record in a database, not confirmation on each save. [user-controllable](https://www.w3.org/TR/WCAG22/#dfn-user-controllable) examples are account name/address fields, not internet logs.
5. This host page does none of those:
   - No purchase, signup contract, tax, or other legal commitment UI.
   - No payment or order path.
   - No server-side user profile / record delete. Theme and consent writes are local client storage plus a boolean consent cookie; they are save-style preference writes, not mass deletion of user-controllable records.
   - No quiz / test responses.
6. Therefore 3.3.4 is **not applicable**. Missing confirm/undo on Accept all / Reject analytics / Save preferences / theme toggle is not a failure of this SC.

Authz/validation: public demo. Persistence: `qc-theme` localStorage, `qrati_geo_consent_required` sessionStorage, consent cookie. Side effects: GTM inject after analytics grant (`syncGtm`); no host data-store mutation.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Accepting cookies is a legal commitment without confirm:** WCAG legal-commitment examples are contracts/licenses/trades. Cookie-category toggles are not a host page that causes a legally binding obligation in the SC sense. GDPR/ePrivacy policy is out of this SC’s examples; 3.3.4 still requires one of the four page types first.
- **Consent cookie is user-controllable data in a data storage system:** Understanding 3.3.4 targets deleting a file or record (e.g. travel profile). A local consent cookie / `localStorage` theme key is a preference save, which the intent explicitly does not require confirming.
- **Contact CTA submits without review:** it is a same-window/navigation link to `qrati.com/contact-us`, not a form post on this page.
- **Embed checkout/upload delete needs 3.3.4 here:** out of scope (`qrati-connect` internals).
- **Issue search** `error prevention OR 3.3.4 OR legal OR financial OR confirm OR reversible`: no matching open or duplicate issue. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 3.3.4 Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)
- [WCAG 2.2 SC 3.3.4](https://www.w3.org/TR/WCAG22/#error-prevention-legal-financial-data)
- [WCAG 2.2 dfn user-controllable](https://www.w3.org/TR/WCAG22/#dfn-user-controllable)
- [WCAG 2.2 dfn legal commitments](https://www.w3.org/TR/WCAG22/#dfn-legal-commitments)
- `app/lib/cookieConsent.ts`
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- `src/worker.ts`
- Prior: 3.3.1 error identification (20261110T041539Z); 3.3.2 labels (20261110T035038Z); 3.3.3 error suggestion (20261110T043638Z)

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 3.3.4 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Timing table inserted after `finish`.

## PR / checks

- Issue: none (report-only)
- PR: pending
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
