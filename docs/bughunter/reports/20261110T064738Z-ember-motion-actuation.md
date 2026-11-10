# Ember host WCAG 2.5.4 motion actuation

- **Scope:** WCAG 2.2 SC 2.5.4 Motion Actuation for host-authored functionality in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init/GTM, theme boot script. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dist (not in worktree), 2.5.1 pointer gestures (20261110T062738Z), 2.5.2 pointer cancellation (20261110T051738Z), 2.2.2 pause/stop/hide and `prefers-reduced-motion` (20261109T231938Z).
- **Base:** `origin/main` at `eb6291eb1059bbbe2f27d3a3f7fc547311a34fb2`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T064738Z-93afa6ecbc9c4bb089cdc0875c4694f8-qrati-connect-ember-example`, `bughunter/20261110T064738Z-93afa6ecbc9c4bb089cdc0875c4694f8-ember`.
- **Run:** `20261110T064738Z-93afa6ecbc9c4bb089cdc0875c4694f8`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `app/router.ts` `Router.map` is empty (single history index). Worker (`src/worker.ts`) only rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not read motion sensors.
2. Host-authored event bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">`. Theme boot in `index.html` reads `localStorage['qc-theme']` or `prefers-color-scheme`; it does not subscribe to device motion.
3. Repo-wide search of `app/`, `index.html`, and `src/` found no `DeviceMotionEvent`, `DeviceOrientationEvent`, `devicemotion`, `deviceorientation`, `Accelerometer`, `Gyroscope`, `LinearAcceleration`, `getUserMedia`, `shake`, or motion-permission APIs. `addEventListener` does not appear in those host sources.
4. Other host functions are native UA activation (links, FAQ `<details>`/`<summary>`). CSS hover `transform` on `.btn-cta-primary` and `@media (prefers-reduced-motion: reduce)` are visual animation policy, not device/user-motion input (Understanding 2.5.4). Geo consent fetch (`/api/cookie-consent-geo`) is location policy, excluded by the SC note on geolocation/beacons.
5. [WCAG 2.2 SC 2.5.4](https://www.w3.org/TR/WCAG22/#motion-actuation) (Level A): functionality operated by device motion or user motion can also be operated by UI components, and responding to the motion can be disabled, except supported-interface or essential motion.
6. [Understanding 2.5.4](https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html): the SC covers shaking/tilting a device or camera-interpreted gestures. It does not cover geolocation, pointing a camera at a QR/object, or incidental motion of keyboard/pointer/AT. [G213](https://www.w3.org/WAI/WCAG22/Techniques/general/G213.html) and [F106](https://www.w3.org/WAI/WCAG22/Techniques/failures/F106.html) apply only when motion sensors are used as input. Host source has no such input, so G213 is not required and F106 does not apply.

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: theme attribute/class; `CookieConsent.showPreferences()`. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme toggle or cookie-preferences require shake/tilt:** contradicted by Ember `{{on "click"}}` only; no motion APIs.
- **FAQ or CTA navigation uses device orientation:** native `<summary>` / `<a href>`; no orientation listeners.
- **`prefers-reduced-motion` CSS is 2.5.4:** Understanding 2.5.4 is sensor/gesture *input*, not CSS animation duration.
- **Geo consent endpoint is motion actuation:** Understanding 2.5.4 excludes movement through space registered by geolocation.
- **Embed lightbox/camera inside `qrati-connect` fails 2.5.4 here:** out of scope.
- **Issue search** `motion actuation OR 2.5.4 OR DeviceMotion OR shake OR gyroscope OR accelerometer`: no matching issue. `gh issue list --state open` empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.4 Motion Actuation](https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html)
- [WCAG 2.2 SC 2.5.4](https://www.w3.org/TR/WCAG22/#motion-actuation)
- [G213: Provide conventional controls and an application setting for motion activated input](https://www.w3.org/WAI/WCAG22/Techniques/general/G213.html)
- [F106: Failure due to inability to deactivate motion actuation](https://www.w3.org/WAI/WCAG22/Techniques/failures/F106.html)
- `app/components/qrati-demo.gts` (`toggleTheme`, `openCookiePreferences`, FAQ details, links)
- `app/lib/cookieConsent.ts` (geo fetch; `CookieConsent.run`; no motion APIs)
- `index.html` (theme boot via storage / `prefers-color-scheme`)
- `src/worker.ts` (path rewrite / GTM id only)
- Prior: 2.5.1 pointer gestures (20261110T062738Z); 2.5.2 pointer cancellation (20261110T051738Z); 2.2.2 pause/stop/hide (20261109T231938Z)

## Limitations

CodeGraph unindexed. No device-motion session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS and WCAG 2.5.4 Understanding. Embed widget internals not claimed. vanilla-cookieconsent dist not present in the worktree (`node_modules` absent).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T06:47:38Z | 2026-11-10T06:47:59Z | 12:17:38 | 12:17:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-10T06:48:19Z | 2026-11-10T06:50:52Z | 12:18:19 | 12:20:52 | 00:02:33 (2.5 min) |
| `delivery` | 2026-11-10T06:50:40Z | 2026-11-10T06:51:35Z | 12:20:40 | 12:21:35 | 00:00:55 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-10T06:47:38Z | 2026-11-10T06:51:35Z | 12:17:38 | 12:21:35 | **00:03:57 (4.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:09 (0.1 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T064738Z-93afa6ecbc9c4bb089cdc0875c4694f8.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/114
- Base `main` `eb6291eb1059bbbe2f27d3a3f7fc547311a34fb2` / head `bughunter/20261110T064738Z-93afa6ecbc9c4bb089cdc0875c4694f8-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending; GitGuardian pass
