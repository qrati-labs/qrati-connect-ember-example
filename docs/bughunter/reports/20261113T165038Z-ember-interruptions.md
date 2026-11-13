# Ember host WCAG 2.2.4 interruptions

- **Scope:** WCAG 2.2 SC 2.2.4 Interruptions (AAA) for host-authored UI in `QratiDemo`: theme toggle, FAQ `<details>`, hero/action-pill/Contact/footer links, Cookie Preferences, cookie-consent init (`app/lib/cookieConsent.ts`, vanilla-cookieconsent **3.1.0** `autoShow`), inline theme boot, Cloudflare Worker HTML. Excludes embed internals (`qrati-connect` / `embed.js`), 2.2.1 timing adjustable (20261110T093638Z), 2.2.2 pause/stop/hide (20261109T231938Z), 2.2.3 no timing (20261113T144038Z), 2.2.6 timeouts (no authenticated session).
- **Base:** `origin/main` at `7028709e0ce14c3b132dcbd44f2c37c39fc47206`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T165038Z-933d81af5632477da5ba1955c052d4bb-qrati-connect-ember-example`, `bughunter/20261113T165038Z-933d81af5632477da5ba1955c052d4bb-ember`.
- **Run:** `20261113T165038Z-933d81af5632477da5ba1955c052d4bb`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Host does not claim AAA 2.2.4. There is no author/server content update, `meta refresh`, or timed alert. The only automatic overlay is a one-shot cookie-consent modal when geo says consent is required and no consent cookie exists; the user dismisses it with Accept / Reject / Manage preferences. That is not an unsuppressible interruption under SC 2.2.4.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty; one history index.
2. [WCAG 2.2 SC 2.2.4](https://www.w3.org/TR/WCAG22/#interruptions) (AAA): interruptions can be postponed or suppressed by the user, except emergencies. [Understanding 2.2.4](https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html) (fetched this run): intent is to let users turn off **updates from the author/server** except emergencies (health/safety/property, including data loss). Sufficient techniques: G75 postpone updates, G76 request updates instead of auto-update, SCR14 make nonessential alerts optional. Documented failures: F40 meta redirect with time limit; F41 meta refresh reload.
3. Host JS (`app/components/qrati-demo.gts`, `app/lib/cookieConsent.ts`, `index.html` theme boot): no `setTimeout`, `setInterval`, `requestAnimationFrame`, `alert`, or `confirm`. Theme toggle, FAQ, and Cookie Preferences fire only on user activation.
4. Cookie consent: `initCookieConsent()` from the constructor. After geo `checkConsentRequired()`, `CookieConsent.run({ mode: required ? 'opt-in' : 'opt-out', autoShow: required, ... })`. `autoShow: true` only when geo `required` is true (fail-closed on fetch/JSON errors). The library then shows the first-layer modal **if** no valid consent record exists. Buttons (`acceptAllBtn`, `acceptNecessaryBtn`, `showPreferencesBtn`) end that overlay. Footer `showCookiePreferences()` is user-initiated. `syncGtm` runs on consent callbacks; it does not schedule later UI.
5. Document head (`index.html`): charset, theme boot, title/description/robots/canonical/icons/OG/Twitter, viewport, Iconify `defer`. No `http-equiv="refresh"`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not inject refresh or alerts.

Authz/validation/persistence: public demo; `qc-theme` localStorage on toggle; geo `sessionStorage`; consent cookie after choice. Side effects: optional GTM inject after analytics grant. Errors: geo fail-closed to opt-in + `autoShow`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`autoShow` cookie modal is an unsuppressible interruption:** rejected. SC 2.2.4 targets author/server **updates** (and meta refresh). The modal is a one-shot legal banner the user closes with explicit buttons. Understanding failures are F40/F41, not a CMP first layer.
- **Host must meet AAA 2.2.4:** no such claim in README or `index.html`. Even if claimed, there is no auto-updating content to postpone.
- **GTM / Iconify / Google Fonts later mutate the page:** Iconify and webfonts are load-time resources, not timed content replacement. GTM loads only after analytics consent and is not a host-authored alert. Out of scope as embed/third-party internals beyond the host schedule.
- **Issue search** `interruptions OR 2.2.4 OR "meta refresh" OR autoShow`: no matching open issue (hits are closed consent contrast/geo/opt-out/reopen, different paths). No issue created.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.2.4 Interruptions](https://www.w3.org/TR/WCAG22/#interruptions)
- [Understanding SC 2.2.4](https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html) (W3C page retrieved 2026-11-13)
- `app/lib/cookieConsent.ts` (`autoShow: required`)
- `app/components/qrati-demo.gts`
- `index.html` (no meta refresh)
- Prior: 2.2.1 (20261110T093638Z); 2.2.2 (20261109T231938Z); 2.2.3 (20261113T144038Z)

## Limitations

CodeGraph unindexed. No browser session of the Ember host. vanilla-cookieconsent 3.1.0 `autoShow` behavior taken from host config plus prior library traces in this repo, not a live modal session. Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-13T16:50:38Z | 2026-11-13T16:51:01Z | 22:20:38 | 22:21:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-13T16:51:24Z | 2026-11-13T16:55:26Z | 22:21:24 | 22:25:26 | 00:04:01 (4.0 min) |
| `delivery` | 2026-11-13T16:55:26Z | 2026-11-13T16:56:05Z | 22:25:26 | 22:26:05 | 00:00:39 (0.7 min) |
| **Total run (preflight start to finish)** | 2026-11-13T16:50:38Z | 2026-11-13T16:56:05Z | 22:20:38 | 22:26:05 | **00:05:27 (5.5 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:24 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T165038Z-933d81af5632477da5ba1955c052d4bb.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/163
- Base `main` `7028709e0ce14c3b132dcbd44f2c37c39fc47206` / head `bughunter/20261113T165038Z-933d81af5632477da5ba1955c052d4bb-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint pending; CI Test pending
- Local tests **NOT RUN BY BUGHUNTER**
