# Ember host WCAG 2.4.11 focus not obscured

- **Scope:** WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum) for host-authored overlays vs host keyboard targets in `QratiDemo` (theme-toggle, hero/action-pill links, FAQ summaries, Contact CTA, footer nav / Cookie Preferences). Overlay under test: vanilla-cookieconsent first-layer box (`#cc-main .cm`) and host `.theme-toggle`. Excludes 2.4.3 focus order (20261109T191838Z), 2.4.7 focus-visible (20261107T050938Z), first-layer consent chrome (20261107T072738Z), footer 2.5.8 (20261107T053238Z), embed internals.
- **Base:** `origin/main` at `03344b5050d1c6b358ad4992b23a25133e072a1c`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T194038Z-ced57c20db954cebbcb2bd4c307663eb-ember`, `bughunter/20261109T194038Z-ced57c20db954cebbcb2bd4c307663eb-ember`.
- **Run:** `20261109T194038Z-ced57c20db954cebbcb2bd4c307663eb`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty.
2. Host focusable controls (`app/components/qrati-demo.gts`) in source order: `.theme-toggle` (sibling of `.page-shell`), hero `qrati.com` anchors, GitHub/VS Code `.action-pills`, FAQ `<summary>`s, Contact `.btn-cta-primary`, footer nav anchors, `footer-cookie-btn`. No host `tabindex`. No host sticky header/footer.
3. Author-created overlapping layers:
   - `.theme-toggle`: later Pilot rule `position: absolute; z-index: 1; top: 1rem; right: 1rem` (`app/styles/app.css`). Padded control, top-right of `.page-shell`. Hero copy and pills are centered (`text-align: center`; `.action-pills` `justify-content: center`).
   - Cookie first-layer: `CookieConsent.run` does not set `guiOptions` or `disablePageInteraction` (`app/lib/cookieConsent.ts`). vanilla-cookieconsent **3.1.0** defaults: consent modal `layout: box`, `position: bottom right`; `disablePageInteraction: false`. Compiled CSS: `#cc-main { position: fixed; --cc-z-index: 2147483647 }`; `.cm { position: fixed; max-width: 24rem }`; `.cm--bottom` / `.cm--right` with `--cc-modal-margin: 1rem`. At `max-width: 640px`, `.cm` becomes `max-width: none; width: auto` (still not `.cm--bar` full-viewport). Host `#cc-main` rules set color tokens only.
4. `autoShow: required` with geo fail-closed (`checkConsentRequired` returns `true` on non-OK / non-boolean / throw). Banner can appear without a user gesture. Note 2 of 2.4.11 (user-opened content) does not apply to this auto-shown box.
5. SC 2.4.11 (AA): when a component receives keyboard focus, it is not **entirely** hidden by author-created content. [Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): partial obscuring is allowed at AA; sticky cookie banners fail only if they entirely hide the focused component. Passing patterns include making the banner modal (`disablePageInteraction`) or `scroll-padding` so sticky content does not cover targets. Host sets neither.

Authz/validation/persistence: none (public demo). Side effects on this path: theme persist, `showCookiePreferences`, outbound links. Errors: none thrown by overlay geometry.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Bottom-right 24rem banner entirely hides the footer Cookie Preferences control:** possible on a scrolled-to-end desktop layout (`footer-meta` `align-items: flex-end` from 640px). Not measured. 2.4.11 requires the **component** to be entirely hidden, not merely overlapped. No viewport session; not claimed.
- **Mobile `width: auto` turns the box into a full-width bar:** the max-width 640px override is not `.cm--bar` (`left:0; right:0; width:100vw`). Content-sized `width: auto` with only `right` inset is not evidenced as a full-bleed cover.
- **Theme-toggle covers hero links:** rejected. Toggle is top-right chrome; hero/pills are centered; toggle is first in tab order so later targets are not under it.
- **Missing `disablePageInteraction` / `scroll-padding-bottom` is itself 2.4.11:** those are documented *ways of passing*, not required techniques. Absence is not a failure without an entirely hidden target.
- **2.4.12 Focus Not Obscured (Enhanced) AAA:** not claimed.
- **Issue search** `2.4.11 OR obscured OR overlay OR sticky`: no matching issue. Closed consent/footer issues (#28, #32, #42) are different defects. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [WCAG 2.2 SC 2.4.11](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum)
- [CookieConsent configuration reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html) (`guiOptions.consentModal`, `disablePageInteraction`)
- vanilla-cookieconsent v3.1.0 `dist/cookieconsent.css` (`#cc-main` fixed, `.cm` max-width 24rem, `.cm--bottom` / `.cm--right`, `--cc-z-index: 2147483647`)
- `app/lib/cookieConsent.ts` (`CookieConsent.run` without `guiOptions`)
- `app/styles/app.css` (`.theme-toggle` Pilot absolute / `z-index: 1`; `#cc-main` tokens only)
- `app/components/qrati-demo.gts`

## Limitations

CodeGraph unindexed. No browser keyboard session; overlay vs target intersection is inferred from host CSS plus published 3.1.0 consent CSS, not a captured layout. Live `https://qrati.com/connect/ember-example` was not used as evidence this run.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- Local tests **NOT RUN BY BUGHUNTER**
