# Ember host WCAG 1.3.4 orientation

- **Scope:** WCAG 2.2 SC 1.3.4 Orientation for host-authored presentation in `QratiDemo`: viewport meta, host CSS breakpoints/transforms, theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init/GTM, theme boot script, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dist (not in worktree), 1.3.1 info and relationships (20261109T210738Z), 1.3.2 meaningful sequence (20261109T212838Z), 2.5.4 motion actuation (20261110T064738Z).
- **Base:** `origin/main` at `ef38199af28ae3549fb53a99c12e03c519dab1dd`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T081438Z-7a7a8fd782994678ad9277d7d154ae34-ember`, `bughunter/20261110T081438Z-7a7a8fd782994678ad9277d7d154ae34-ember`.
- **Run:** `20261110T081438Z-7a7a8fd782994678ad9277d7d154ae34`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not set orientation headers or inject orientation-lock markup.
2. Viewport (`index.html`): `<meta name="viewport" content="width=device-width, initial-scale=1">`. No `user-scalable=no`, `maximum-scale`, `height=device-height`, or orientation token. Theme boot script reads `localStorage['qc-theme']` or `prefers-color-scheme`; it does not call `screen.orientation` or lock display.
3. Repo-wide search of `app/`, `index.html`, `src/`, `vite.config.mjs`, `wrangler.jsonc`, and `public/` found no `screen.orientation`, `orientation.lock`, `@media (orientation: …)`, `transform: rotate`, web app `manifest` with `orientation`, or copy asking the user to rotate the device. Host event bindings remain `{{on "click"}}` only.
4. Host CSS uses width breakpoints only: `@media (min-width: 640px)` (page-frame/widget-frame/footer) and `@media (max-width: 640px)` (`.answer-section` single column). `.page-shell { overflow: hidden }` and the later `.theme-toggle { position: absolute }` cascade do not constrain portrait vs landscape. `prefers-reduced-motion` zeros animation/transition duration only.
5. CookieConsent host config (`CookieConsent.run`) sets mode/autoShow, categories, GTM sync, and English modal copy. No orientation restriction. Library dist is not in the worktree; this audit does not claim its internals.
6. [WCAG 2.2 SC 1.3.4](https://www.w3.org/TR/WCAG22/#orientation) (Level AA): content does not restrict its view and operation to a single display orientation unless that orientation is essential. [Understanding 1.3.4](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html): size-based layout changes are **not** this SC; the SC is about author locks. Failures are [F97](https://www.w3.org/WAI/WCAG22/Techniques/failures/F97.html) (lock to landscape or portrait) and [F100](https://www.w3.org/WAI/WCAG22/Techniques/failures/F100.html) (message asking to reorient). [G214](https://www.w3.org/WAI/WCAG22/Techniques/general/G214.html) is only needed when content is otherwise locked. Host source has no lock, so G214 is not required and F97/F100 do not apply. A gallery demo is not an essential-orientation exception (check deposit, piano, projector, VR).

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: none on orientation. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Viewport or Worker locks portrait/landscape:** contradicted by `width=device-width, initial-scale=1` only; worker copies HTML and optional GTM id.
- **Width media queries fail 1.3.4:** Understanding 1.3.4 excludes changes due to display **size**.
- **Missing web app manifest is an orientation lock:** absence of `orientation` in a manifest is not F97; there is no manifest at all.
- **`overflow: hidden` / absolute theme-toggle restrict rotation:** those rules do not set or detect orientation.
- **FAQ/CTA/consent require a rotate-device message:** no such copy in host templates or `CookieConsent.run` strings (F100 not present).
- **Embed lightbox inside `qrati-connect` fails 1.3.4 here:** out of scope.
- **Issue search** `orientation OR 1.3.4 OR "rotate"`: `gh issue list --state all` has no matching issue. Open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html)
- [WCAG 2.2 SC 1.3.4](https://www.w3.org/TR/WCAG22/#orientation)
- [G214: Using a control to allow access to content in different orientations which is otherwise restricted](https://www.w3.org/WAI/WCAG22/Techniques/general/G214.html)
- [F97: Failure due to locking the orientation to landscape or portrait view](https://www.w3.org/WAI/WCAG22/Techniques/failures/F97.html)
- [F100: Failure of Success Criterion 1.3.4 due to showing a message asking to reorient device](https://www.w3.org/WAI/WCAG22/Techniques/failures/F100.html)
- `index.html` (viewport `width=device-width, initial-scale=1`; theme boot via storage / `prefers-color-scheme`)
- `app/styles/app.css` (640px width breakpoints; no `orientation` media; no rotate transform)
- `app/components/qrati-demo.gts` (click-only host controls; no orientation APIs)
- `app/lib/cookieConsent.ts` (`CookieConsent.run`; no orientation copy)
- `src/worker.ts` (path rewrite / GTM id only)
- Prior: 1.3.1 info and relationships (20261109T210738Z); 1.3.2 meaningful sequence (20261109T212838Z); 2.5.4 motion actuation (20261110T064738Z)

## Limitations

CodeGraph unindexed. No device-rotation session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS/CSS and WCAG 1.3.4 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.
