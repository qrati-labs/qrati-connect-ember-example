# Ember cookie-consent first-layer WCAG 2.4.7 focus visible

- **Scope:** WCAG 2.2 SC 2.4.7 Focus Visible (AA) for first-layer vanilla-cookieconsent controls (`Accept all` / `Reject analytics` / `Manage preferences`) and the preferences-modal close / category chrome as configured by this host. Excludes host FAQ `<summary>` 2.4.7 (20261113T222138Z), host `<a>` 2.4.7 (20261107T050938Z), theme-toggle / footer cookie-button author rings, first-layer modal layout / `hideFromBots` / `equalWeightButtons` (20261107T072738Z), 2.4.13 focus appearance (20261110T182838Z), embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `9e167dd935e89d9af5aff5919bd881d23b382e8b`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T224738Z-553912327ddb4ecc848830e3a632f4e0-qrati-connect-ember-example`, `bughunter/20261113T224738Z-ember-workflow`.
- **Run:** `20261113T224738Z-553912327ddb4ecc848830e3a632f4e0`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 do not apply to this repository. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Constructor (`app/components/qrati-demo.gts`) calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). Geo gate then `CookieConsent.run` (vanilla-cookieconsent **3.1.0**). First-layer strings: `acceptAllBtn: 'Accept all'`, `acceptNecessaryBtn: 'Reject analytics'`, `showPreferencesBtn: 'Manage preferences'`. Host does not pass `guiOptions`.
2. Banner is `autoShow` only when geo `required` is true (opt-in). Opt-out regions skip the first layer; footer `Cookie Preferences` still opens the preferences modal (`showCookiePreferences` → `CookieConsent.showPreferences()`). Keyboard path is the same `#cc-main` controls.
3. Host CSS (`app/styles/app.css`): `#cc-main` / dark `#cc-main` set color tokens only (background, button, toggle, category block). Repo-wide host CSS has **no** `outline: none`, `outline: 0`, or equivalent reset. Author `:focus-visible` rings exist only on `.theme-toggle` and `.footer-cookie-btn` (out of scope).
4. Library CSS (vanilla-cookieconsent@3.1.0 `cookieconsent.css`, fetched this run from jsDelivr): `#cc-main` form controls reset includes `outline: revert; outline-offset: 2px`. No `:focus` / `:focus-visible` rule and no `outline: none`. `.cm__btn` is `min-height: 42px` (size out of scope for 2.4.7).
5. Library JS (`cookieconsent.esm.js`, fetched this run): one `focus()` helper temporarily sets `tabIndex=-1`, focuses, then removes the attribute. No style mutation of `outline`.
6. [WCAG 2.2 SC 2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible) (Level AA, TR fetched 2026-11-13): any keyboard-operable UI has a mode where the focus indicator is visible. [G149](https://www.w3.org/WAI/WCAG22/Techniques/general/G149): components highlighted by the user agent on focus. Failure [F78](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) (fetched 2026-11-13): author CSS turns off or occludes the UA indicator. Host + imported CMP CSS implement `outline: revert`, not F78.

Authz/validation: public demo. Persistence: `cc_cookie` / sessionStorage geo flag (out of scope). Side effects: optional GTM inject after analytics accept (out of scope). Errors: geo `catch` → opt-in banner (already covered).

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing author `:focus-visible` on `#cc-main .cm__btn` fails 2.4.7:** contradicted by G149 plus library `outline: revert`. Extra author rings on the theme toggle and footer cookie button are an enhancement, not evidence that CMP buttons lack a visible indicator.
- **`overflow: hidden` on the CMP reset clips the UA ring (F78 occlusion):** F78 (fetched 2026-11-13) is turning off or covering the indicator via outline/border styling, not a generic overflow reset. Not evidenced as a 2.4.7 failure from this stylesheet.
- **Must match 2.4.13 AAA author ring size/contrast on CMP buttons:** 2.4.13 is a different SC, already audited for the two host-drawn rings. This run is 2.4.7 AA.
- **First-layer modal audit already covered focus:** 20261107T072738Z checked `hideFromBots`, `disablePageInteraction`, `equalWeightButtons`, stacking vs theme toggle — not 2.4.7.
- **FAQ 2.4.7 already covered this path:** that run excluded cookie-consent modal chrome. Distinct targets; still no F78.
- **Issue search** `focus-visible OR "outline: none" OR F78 OR "focus visible" consent`: no matching issue. Closed #22 is primary-button *color* contrast, not focus indication. Open set empty. No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.4.7 Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible) (TR retrieved 2026-11-13)
- [G149: Using user interface components that are highlighted by the user agent when they receive focus](https://www.w3.org/WAI/WCAG22/Techniques/general/G149)
- [F78: Failure of 1.4.11, 2.4.7 and 2.4.13 due to styling outlines/borders so the focus indicator is not visible](https://www.w3.org/WAI/WCAG22/Techniques/failures/F78) (W3C page retrieved 2026-11-13)
- vanilla-cookieconsent@3.1.0 `cookieconsent.css` (`outline: revert`) and `cookieconsent.esm.js` (`focus()` helper)
- `app/lib/cookieConsent.ts` `CookieConsent.run` first-layer strings
- `app/styles/app.css` `#cc-main` tokens; no outline reset
- Prior: FAQ 2.4.7 (20261113T222138Z); first-layer modal (20261107T072738Z); link 2.4.7 (20261107T050938Z); #22 primary contrast

## Limitations

CodeGraph unindexed. No live keyboard session on `https://qrati.com/connect/ember-example` (that route returned HTTP 404 this run; deployment availability is out of scope). UA default ring appearance varies by browser and is not pixel-measured here. CMP CSS/JS taken from jsDelivr `@3.1.0`, matching `package.json`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T224738Z-553912327ddb4ecc848830e3a632f4e0.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: (filled after open)
- Base `main` `9e167dd935e89d9af5aff5919bd881d23b382e8b` / head `bughunter/20261113T224738Z-ember-workflow`
