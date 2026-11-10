# Ember host WCAG 1.3.5 identify input purpose

- **Scope:** WCAG 2.2 SC 1.3.5 Identify Input Purpose for host-authored UI in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init/GTM, theme boot script, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dist (not in worktree), 1.3.1 info and relationships (20261109T210738Z), 1.3.2 meaningful sequence (20261109T212838Z), 1.3.4 orientation (20261110T081438Z).
- **Base:** `origin/main` at `b6134d81bb74d3a27d02379105969ada195e7836`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T083538Z-e99f725199364214ba92b05ff3719b24-qrati-connect-ember-example`, `bughunter/20261110T083538Z-e99f725199364214ba92b05ff3719b24-ember`.
- **Run:** `20261110T083538Z-e99f725199364214ba92b05ff3719b24`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject forms or autocomplete markup.
2. Host controls are buttons and links: theme toggle (`type="button"`), footer Cookie Preferences (`type="button"`), GitHub/VS Code/Contact/footer anchors, FAQ `<details>`/`<summary>`. Theme boot in `index.html` reads `localStorage['qc-theme']` or `prefers-color-scheme`; it does not render inputs.
3. Repo-wide search of `app/`, `index.html`, `src/`, `vite.config.mjs`, `wrangler.jsonc`, `public/`, and `tests/` (excluding lockfile) found no `<input>`, `<textarea>`, `<select>`, `<form>`, `contenteditable`, `autocomplete`, or `inputmode`. Host event bindings remain `{{on "click"}}` only.
4. CookieConsent host config (`CookieConsent.run`) sets mode/autoShow, categories, GTM sync, and English modal copy (accept/reject/preferences buttons and category sections). No fields collecting the user's name, email, telephone, address, username, or other [Input Purposes for User Interface Components](https://www.w3.org/TR/WCAG22/#input-purposes). Library dist is not in the worktree; this audit does not claim its internals.
5. [WCAG 2.2 SC 1.3.5](https://www.w3.org/TR/WCAG22/#identify-input-purpose) (Level AA): the purpose of each input field collecting information about the user can be programmatically determined when the field serves a purpose in that list and the technology can identify expected meaning. [Understanding 1.3.5](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html): the SC is specifically scoped to inputs collecting information about the user; HTML `autocomplete` tokens (H98) apply only when such fields exist. Cookie-category toggles, if present in the library, are preference controls, not Input Purposes tokens. With no host-authored user-info fields, H98 is not required and [F107](https://www.w3.org/WAI/WCAG22/Techniques/failures/F107.html) (incorrect autocomplete) does not apply.

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: none on identify-input-purpose. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Host contact form / email field lacks `autocomplete`:** contradicted by absence of `<input>`/`<textarea>`/`<select>`/`<form>` in host source; Contact CTA is an external link to `https://qrati.com/contact-us`.
- **Cookie-consent checkboxes fail 1.3.5:** Understanding 1.3.5 is scoped to collecting information about the user matching the Input Purposes list; category consent is not name/email/tel/address.
- **Missing `autocomplete` on the page is itself a failure:** H98 applies only when user-info fields exist; F107 requires an incorrect token on such a field.
- **Theme storage key `qc-theme` is an input purpose:** it is script-managed localStorage, not a form control collecting user identity.
- **Embed guest-upload / account fields fail 1.3.5 here:** out of scope.
- **Issue search** `1.3.5 OR autocomplete OR "input purpose" OR "identify input"`: `gh issue list --state all` has no matching issue. Open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
- [WCAG 2.2 SC 1.3.5](https://www.w3.org/TR/WCAG22/#identify-input-purpose)
- [WCAG 2.2 Input Purposes for User Interface Components](https://www.w3.org/TR/WCAG22/#input-purposes)
- [H98: Using HTML 5.2 autocomplete attributes](https://www.w3.org/WAI/WCAG22/Techniques/html/H98)
- [F107: Failure of Success Criterion 1.3.5 due to incorrect autocomplete attribute values](https://www.w3.org/WAI/WCAG22/Techniques/failures/F107.html)
- `app/components/qrati-demo.gts` (buttons/links/FAQ only; no form controls)
- `app/lib/cookieConsent.ts` (`CookieConsent.run`; no user-info fields)
- `index.html` (theme boot via storage / `prefers-color-scheme`; no inputs)
- `src/worker.ts` (path rewrite / GTM id only)
- Prior: 1.3.1 info and relationships (20261109T210738Z); 1.3.2 meaningful sequence (20261109T212838Z); 1.3.4 orientation (20261110T081438Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 1.3.5 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T08:35:38Z | 2026-11-10T08:36:00Z | 14:05:38 | 14:06:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T08:36:36Z | 2026-11-10T08:38:22Z | 14:06:36 | 14:08:22 | 00:01:46 (1.8 min) |
| `delivery` | 2026-11-10T08:38:22Z | 2026-11-10T08:39:07Z | 14:08:22 | 14:09:07 | 00:00:46 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-10T08:35:38Z | 2026-11-10T08:39:07Z | 14:05:38 | 14:09:07 | **00:03:29 (3.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:36 (0.6 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T083538Z-e99f725199364214ba92b05ff3719b24.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.
