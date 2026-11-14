# Ember cookie-consent preferences-modal WCAG 2.4.7 focus visible

- **Scope:** WCAG 2.2 SC 2.4.7 Focus Visible for second-layer vanilla-cookieconsent preferences chrome opened from the Ember host: `.pm__btn` (Accept all / Reject analytics / Save preferences), `.pm__close-btn` (`closeIconLabel: 'Close'`), and `.section__toggle` category switches. Excludes first-layer consent box 2.4.7 (20261113T224738Z), footer Cookie Preferences host button 2.4.7 (20261113T231138Z), preferences sections / off-toggle (#30), GTM abbreviation copy (#171), footer reopen (#28), embed internals.
- **Base:** `origin/main` at `1eef8b0defe953f81a87851b554d5593dd936e36`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261114T001838Z-47e91c6184b04044a8eb7c78d45add5e-ember`, `bughunter/20261114T001838Z-47e91c6184b04044a8eb7c78d45add5e-ember`.
- **Run:** `20261114T001838Z-47e91c6184b04044a8eb7c78d45add5e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` / `qrati-connect-preact-example` (open PR #80 overlaps cookie-consent a11y; did not inspect a second workflow there). Skipped `qrati-web` (open PRs including #497/#495/#494 overlap other product workflows; did not inspect a second workflow there). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). Footer control (`data-cc="show-preferencesModal"` + `openCookiePreferences` → `CookieConsent.showPreferences()`) opens the second-layer box (#28).
2. `CookieConsent.run` (vanilla-cookieconsent **3.1.0**) sets EN `preferencesModal` copy: `acceptAllBtn`, `acceptNecessaryBtn`, `savePreferencesBtn`, `closeIconLabel: 'Close'`, and two `linkedCategory` sections (necessary / analytics; #30 / #171). Host does not pass `guiOptions` (library default preferences layout `box`).
3. Host CSS (`app/styles/app.css`): `#cc-main` / dark `#cc-main` set color tokens only (background, button, toggle, category block). Repo-wide host CSS has **no** `outline: none`, `outline: 0`, or equivalent reset. Author `:focus-visible` rings exist only on `.theme-toggle` and `.footer-cookie-btn` (out of scope).
4. Library CSS (vanilla-cookieconsent@3.1.0 `cookieconsent.css`, fetched this run from jsDelivr): `#cc-main` `a` / `button` / `input` reset includes `outline: revert; outline-offset: 2px`. No `:focus` / `:focus-visible` rule and no `outline: none`. Preferences controls (`.pm__btn`, `.pm__close-btn`, `.section__toggle`) inherit that reset. `.pm__btn` is `min-height: 42px` (size out of scope for 2.4.7).
5. [WCAG 2.2 SC 2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible) (Level AA): any keyboard-operable UI has a mode where the focus indicator is visible. [G149](https://www.w3.org/WAI/WCAG22/Techniques/general/G149): components highlighted by the user agent on focus. Failure [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78): author CSS turns off or occludes the UA indicator. Host + imported CMP CSS implement `outline: revert`, not F78.

Authz: none (public demo). Persistence: `cc_cookie` (out of scope). Side effects: `showPreferences` / `syncGtm` on save (out of scope). Errors: geo fail-closed then `run` (out of scope).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing author `:focus-visible` on `.pm__btn` / `.pm__close-btn` / `.section__toggle` fails 2.4.7:** contradicted by G149 plus library `outline: revert`. Extra author rings on the theme toggle and footer cookie button are an enhancement, not evidence that preferences controls lack a visible indicator.
- **First-layer 2.4.7 already covered this CSS:** 20261113T224738Z scoped the consent box (`.cm__btn`). Preferences chrome (`.pm__*`, category toggles) is a different reachable UI; the same library reset applies, so the same G149/F78 conclusion holds, not a new host failure.
- **`overflow: hidden` on `#cc-main button` is F78 occlusion:** F78 is turning off or covering the indicator via outline/border styling. The same-element `outline: revert` remains; overflow clips descendants, not the element’s own outline. Not evidenced as a 2.4.7 failure.
- **Issue search** `focus-visible OR "focus visible" OR 2.4.7 OR preferencesModal`: closed #30 (category sections / off-toggle), #28 (footer reopen), #171 (GTM abbreviation). No 2.4.7 duplicate. Open set empty. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.4.7 Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible)
- [WCAG 2.2 Understanding SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [G149](https://www.w3.org/WAI/WCAG22/Techniques/general/G149)
- [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78)
- vanilla-cookieconsent v3.1.0 `cookieconsent.css` (`outline: revert` on `#cc-main` buttons/inputs; `.pm__btn` / `.pm__close-btn` / `.section__toggle`)
- `app/lib/cookieConsent.ts` (`preferencesModal` copy; `showCookiePreferences`)
- `app/styles/app.css` (`#cc-main` tokens only)
- Prior: first-layer 2.4.7 (20261113T224738Z); footer cookie 2.4.7 (20261113T231138Z); #28 / #30 / #171

## Limitations

CodeGraph unindexed. No keyboard session on `https://qrati.com/connect/ember-example` (historical deployment 404 out of scope). No claim about UA default ring contrast (1.4.11) or 2.4.13 size of library rings.

## Timing

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261114T001838Z-47e91c6184b04044a8eb7c78d45add5e.json`.

## PR / checks

- Issue: none (report-only)
- PR: pending this run
- Local tests **NOT RUN BY BUGHUNTER**
