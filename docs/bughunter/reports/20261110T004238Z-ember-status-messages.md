# Ember host WCAG 4.1.3 status messages

- **Scope:** WCAG 2.2 SC 4.1.3 Status Messages for host-authored UI in `QratiDemo`: theme toggle, cookie-consent init / GTM sync, embed mount, FAQ disclosures, footer Cookie Preferences. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dialog chrome, 4.1.2 name/role/value (20261110T000039Z), 1.3.1 info/relationships (20261109T210738Z).
- **Base:** `origin/main` at `2d44cae9a00403c56a666f61006d88308541ed4b`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T004238Z-1db71170ef2b431298fee5e8a087ec8c-ember`, `bughunter/20261110T004238Z-1db71170ef2b431298fee5e8a087ec8c-ember-workflow`.
- **Run:** `20261110T004238Z-1db71170ef2b431298fee5e8a087ec8c`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 were not used. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host-authored controls and side effects live in `app/components/qrati-demo.gts` and `app/lib/cookieConsent.ts`.
2. [WCAG 2.2 SC 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages) (Level AA): in markup languages, **status messages** can be programmatically determined through role or properties so assistive technologies can present them **without receiving focus**. [Understanding 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) limits scope to content changes that (a) report success/results, waiting, progress, or errors, and (b) are **not** delivered via a change of context. The SC does **not** require authors to create status messages; it applies only when such messages exist.
3. Host dynamic updates (none are 4.1.3 status messages):
   - Theme: `toggleTheme` flips `this.theme`, `data-theme` / `.dark` on `<html>`, `qc-theme` in `localStorage`, and the focused `<button class="theme-toggle">` visible name (`☀ Light` / `🌙 Dark`). That is a change to the **focused control’s name**, not unfocused status text. No toast, `role="status"`, or `aria-live` region is added.
   - Cookie consent: constructor calls `initCookieConsent()`; footer button calls `showCookiePreferences()` → `CookieConsent.showPreferences()`. First-layer / preferences UI is a **dialog** (change of context; Understanding 4.1.3: modal messages that take focus are out of scope). Host `onFirstConsent` / `onConsent` / `onChange` only run `syncGtm()` (Consent Mode + optional GTM script). No host success/error string is inserted into the page.
   - Embed: `mountEmbed` appends `embed.js` once or sets `theme` / `data-theme` in place. No host “loading” / “gallery ready” / error status text. The `h2.sr-only` “Live Event Photo Gallery Component” is a **static heading**, not a status message.
   - FAQ: native `<details>`/`<summary>` reveals existing content in place (disclosure, not a status message).
4. Repo search: no `aria-live`, `role="status"`, or `role="alert"` in host sources. `.sr-only` is used only for the static gallery heading.

Authz/validation/persistence: public demo; theme persist (`qc-theme`); geo consent cache (`qrati_geo_consent_required`). Errors: geo fetch fail-closed to `required=true`; storage reads/writes are try/catch. No swallowed status-message updates because none are authored.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing `aria-live` on theme change fails 4.1.3:** 4.1.3 applies to status messages that do not take focus. The only new text is the focused button’s label. Sighted and AT users of the control already get the new name. Absence of a live region is not a demonstrated failure.
- **Silent embed mount needs a busy/status message:** 4.1.3 does not require a waiting message. There is no host-authored “busy” icon or “gallery loaded” text that AT would miss.
- **Cookie accept/reject must announce via `role="status"`:** host does not add confirmation text; the library dialog is a change of context. GTM injection is not user-visible status content.
- **Issue search** `status messages OR 4.1.3 OR aria-live OR "status message"`: no matching open/closed 4.1.3 issue (search hit #26 is gallery heading remount, already closed). No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WCAG 2.2 SC 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages)
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`
- `app/lib/cookieConsent.ts`

## Limitations

CodeGraph unindexed. No screen-reader session; claims are from host markup plus WCAG 4.1.3 definition/scope, not an AT capture on `https://qrati.com/connect/ember-example`. Cookie-consent and embed widgets not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending
