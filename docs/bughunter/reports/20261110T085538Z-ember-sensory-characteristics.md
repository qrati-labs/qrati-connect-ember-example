# Ember host WCAG 1.3.3 sensory characteristics

- **Scope:** WCAG 2.2 SC 1.3.3 Sensory Characteristics for host-authored UI in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, SEO/feature-map/quickstart copy, cookie-consent init/GTM, theme boot script, Cloudflare Worker HTML path. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dist (not in worktree), 1.3.1 info and relationships (20261109T210738Z), 1.3.2 meaningful sequence (20261109T212838Z), 1.3.4 orientation (20261110T081438Z), 1.3.5 identify input purpose (20261110T083538Z), 1.4.1 use of color (20261110T012438Z).
- **Base:** `origin/main` at `f63942d7a65dca8dbd1e1887ee4ded9c8a711706`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T085538Z-4c360d8048b5437a98fb2c6054d35eee-ember`, `bughunter/20261110T085538Z-4c360d8048b5437a98fb2c6054d35eee-ember`.
- **Run:** `20261110T085538Z-4c360d8048b5437a98fb2c6054d35eee`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject instructional copy.
2. Host controls are named in text: theme toggle (`☀ Light` / `🌙 Dark`), footer Cookie Preferences, GitHub/VS Code/Contact/footer anchors, FAQ `<details>`/`<summary>`. Feature-map and SEO cards pair `iconify-icon` with an `<h3>` plus body text. Action-pill SVGs are `aria-hidden` beside visible labels.
3. Instructional copy (hero, short-answer, feature map, “Embed in 3 simple steps”, FAQ, cookie-consent English strings) names objects by role or identifier: embed script, organization ID, Accept all / Reject analytics / Manage preferences / Save preferences / Close. No host string identifies a control only by color, shape, size, visual location, orientation, or sound.
4. Theme toggle is `position: fixed; top: 1rem; right: 1rem` in CSS. That is layout, not an instruction such as “use the button on the right.”
5. [WCAG 2.2 SC 1.3.3](https://www.w3.org/TR/WCAG22/#sensory-characteristics) (Level A): instructions for understanding and operating content must not rely solely on sensory characteristics. [Understanding 1.3.3](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html): describe controls by name; “below”/“above” in reading order may conform. Failures [F14](https://www.w3.org/WAI/WCAG22/Techniques/failures/F14.html) (shape/location only) and [F26](https://www.w3.org/WAI/WCAG22/Techniques/failures/F26.html) (graphical symbol alone as the instruction) do not apply to this host copy. Color-as-information is 1.4.1 (already audited).

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: none on sensory-characteristics. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Copy says “click the button on the right/orange/round”:** contradicted by extracted host template and `CookieConsent.run` English strings; controls are labeled (Light/Dark, Cookie Preferences, Accept all, Contact Qrati).
- **Theme toggle position is itself a 1.3.3 failure:** SC 1.3.3 applies to instructions, not CSS placement. No host instruction refers to that location.
- **Iconify icons / checkmarks / emoji fail F26:** each sits next to visible text (`<h3>`, “✓ One embed…”, “☀ Light”). F26 is using a graphical symbol *alone* to convey the instruction.
- **README “embed code below” fails 1.3.3:** Understanding 1.3.3 allows unambiguous reading-order “below.” README is not the live host page.
- **Embed gallery internals instruct by color/shape:** out of scope.
- **Issue search** `1.3.3 OR sensory OR shape OR location OR "color only"`: `gh issue list --state all` has no matching issue. Open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html)
- [WCAG 2.2 SC 1.3.3](https://www.w3.org/TR/WCAG22/#sensory-characteristics)
- [F14: identifying content only by shape or location](https://www.w3.org/WAI/WCAG22/Techniques/failures/F14.html)
- [F26: using a graphical symbol alone to convey information](https://www.w3.org/WAI/WCAG22/Techniques/failures/F26.html)
- `app/components/qrati-demo.gts` (named buttons/links/FAQ/feature copy)
- `app/lib/cookieConsent.ts` (named consent/preferences strings)
- `app/styles/app.css` (theme-toggle layout; not instructional copy)
- `index.html` / `src/worker.ts` (no instructional overlay)
- Prior: 1.3.1 (20261109T210738Z); 1.3.2 (20261109T212838Z); 1.3.4 (20261110T081438Z); 1.3.5 (20261110T083538Z); 1.4.1 (20261110T012438Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 1.3.3 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

timing incomplete
