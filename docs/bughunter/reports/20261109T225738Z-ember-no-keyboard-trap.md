# Ember host WCAG 2.1.2 no keyboard trap

- **Scope:** WCAG 2.2 SC 2.1.2 No Keyboard Trap for host-authored UI in `QratiDemo`: theme toggle, hero/action-pill/Contact/footer links, FAQ `<details>`/`<summary>`, footer Cookie Preferences, sequential focus into/out of the live-gallery host. Excludes embed internals (`qrati-connect` / `embed.js` keyboard handling), vanilla-cookieconsent modal chrome implementation (library-owned; host config only), WCAG 2.1.1 Keyboard (20261109T223538Z), skip/bypass (20261107T044738Z), focus visible (20261107T050938Z), focus order (20261109T191838Z), focus not obscured (20261109T194038Z).
- **Base:** `origin/main` at `b2a6fbe840f49fbde5119c1d2f46983f66b78333`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T225738Z-9a1bd3dda34a4d8aa34c04326b0fc5f0-ember`, `bughunter/20261109T225738Z-9a1bd3dda34a4d8aa34c04326b0fc5f0-ember`.
- **Run:** `20261109T225738Z-9a1bd3dda34a4d8aa34c04326b0fc5f0`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host interaction is in `app/components/qrati-demo.gts`.
2. Host-authored event bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">`. Repo search of `app/`, `index.html`, `src/`, and host CSS for `preventDefault`, `keydown`/`keyup`/`keypress`, `tabindex`, and `.focus(`: **no matches**.
3. Remaining operable host UI is native sequential-focus content:
   - `<a href>` (hero Qrati links, GitHub/VS Code pills, Contact CTA, footer nav)
   - FAQ `<details>`/`<summary>`
   - live-gallery mount is a host `<div class="widget-embed-host">` that appends a classic `script` (`mountEmbed`); the host does not wrap it in `tabindex`, an `<iframe>`, or a keydown interceptor.
4. [WCAG 2.2 SC 2.1.2](https://www.w3.org/TR/WCAG22/#no-keyboard-trap): if focus can be moved to a component with a keyboard interface, it can be moved away with a keyboard interface; extra exit methods must be documented. [Understanding 2.1.2](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) allows modal focus cycles when the user can leave via standard controls or Esc. Sufficient technique [G21](https://www.w3.org/WAI/WCAG22/Techniques/general/G21) (Tab exits the subset after the last control). Failure [F10](https://www.w3.org/WAI/WCAG22/Techniques/failures/F10) is combining formats so the user cannot leave a plugin/embedded format — not present in host source.
5. Cookie-consent host config (`app/lib/cookieConsent.ts`): `CookieConsent.run` with `mode`/`autoShow`/`categories` and EN translations that include `acceptAllBtn`, `acceptNecessaryBtn`, `showPreferencesBtn`, `savePreferencesBtn`, and `closeIconLabel: 'Close'`. Host does not set `disablePageInteraction` (library default **false**: overlay/scroll-lock off until consent). Modal focus-trap behavior is library-owned; host copy still exposes dismiss/save actions so a library trap, if present, has a keyboard exit (Understanding 2.1.2 dialog example).
6. CSS: `.page-shell { overflow: hidden }` and `.widget-frame { overflow: hidden }` clip paint; they do not capture Tab. Theme-toggle `position: absolute` does not remove it from the tab sequence.

Authz/validation/persistence: none (public demo). Side effects: theme persist (`qc-theme`), cookie-preferences modal, navigation, embed mount. Errors: host does not swallow Tab; `showCookiePreferences` awaits init then `CookieConsent.showPreferences()`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`{{on "click"}}` plus a consent overlay traps Tab:** host does not register keyboard listeners. Library default `disablePageInteraction` is false, so the host page is not scroll-locked by this config. A CMP that traps without Accept/Reject/Close would be library chrome; host translations still provide those actions. Not a host F10.
- **Live gallery / `qrati-connect` is an applet trap (F10):** host injects `embed.js` into a normal `div`. No host `<iframe>`, `tabindex="-1"` loop, or `keydown` `preventDefault` on Tab. Embed internals are out of scope; not claimed.
- **FAQ `<details>` or theme toggle keeps focus:** native controls; Tab moves on. No `pointer-events: none` on `summary`.
- **`overflow: hidden` is a keyboard trap:** CSS overflow is not a keyboard interface. Off-screen focus after scroll is 2.4.11 (already report-only).
- **WCAG 2.1.1 already covered this:** 2.1.1 is “functionality is operable from the keyboard.” 2.1.2 is “focus can leave.” Prior keyboard audit noted the absence of a host trap; this run is the 2.1.2 workflow with G21/F10 against current `b2a6fbe`.
- **Issue search** `keyboard trap`, `2.1.2`, `keytrap`, `tabindex`: no matching issue. Open issues: none. Closed a11y issues (#18/#22/#24 contrast, #20 lang, #34 toggle name, #28 preferences reopen) are different paths. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)
- [WCAG 2.2 SC 2.1.2](https://www.w3.org/TR/WCAG22/#no-keyboard-trap)
- [G21: Ensuring that users are not trapped in content](https://www.w3.org/WAI/WCAG22/Techniques/general/G21)
- [F10: Failure of 2.1.2 due to combining formats that trap keyboard users](https://www.w3.org/WAI/WCAG22/Techniques/failures/F10)
- [CookieConsent `disablePageInteraction` (default false)](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts`
- `app/styles/app.css`

## Limitations

CodeGraph unindexed. No browser keyboard session; absence of a host trap is from source (no key handlers / tabindex / focus loop) plus WCAG G21/F10, not a captured Tab pass on `https://qrati.com/connect/ember-example`. Cookie-consent and embed keyboard chrome not claimed as verified library behavior.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-09T22:57:38Z | 2026-11-09T22:58:02Z | 04:27:38 | 04:28:02 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-09T22:58:24Z | 2026-11-09T23:01:46Z | 04:28:24 | 04:31:46 | 00:03:22 (3.4 min) |
| `delivery` | 2026-11-09T23:01:46Z | 2026-11-09T23:02:49Z | 04:31:46 | 04:32:49 | 00:01:03 (1.1 min) |
| **Total run (preflight start to finish)** | 2026-11-09T22:57:38Z | 2026-11-09T23:02:49Z | 04:27:38 | 04:32:49 | **00:05:11 (5.2 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:23 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T225738Z-9a1bd3dda34a4d8aa34c04326b0fc5f0.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/97
- Base `main` `b2a6fbe840f49fbde5119c1d2f46983f66b78333` / head `bughunter/20261109T225738Z-9a1bd3dda34a4d8aa34c04326b0fc5f0-ember` `2368eee605cd9d7cfac10a6963aed43721ecb034` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
