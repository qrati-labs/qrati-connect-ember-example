# Ember host WCAG 2.4.3 focus order

- **Scope:** WCAG 2.2 SC 2.4.3 Focus Order on the Ember example host: sequential Tab order of `QratiDemo` controls (theme-toggle, hero links, live gallery mount, FAQ summaries, Contact CTA, footer nav / Cookie Preferences). Excludes 2.4.1 skip/bypass (20261107T044738Z), 2.4.2 page titled (20261109T185738Z), 2.4.4 link purpose (20261109T183438Z), 2.4.7 link focus-visible (20261107T050938Z), cookie-consent first-layer chrome (20261107T072738Z), embed internals / hash routing.
- **Base:** `origin/main` at `804ecdc7a225014e09214fc1e08887777a74b9a6`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T191838Z-1a98de5d6ff74b7894ad147bb4af6bad-ember`, `bughunter/20261109T191838Z-1a98de5d6ff74b7894ad147bb4af6bad-ember`.
- **Run:** `20261109T191838Z-1a98de5d6ff74b7894ad147bb4af6bad`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />` then `{{outlet}}`. `app/router.ts` `Router.map` is empty (single application index).
2. Host focusable sequence in `app/components/qrati-demo.gts` follows source order (no `tabindex` anywhere in `app/`, `index.html`, or `src/worker.ts`):
   - `<button class="theme-toggle">` (first in the template; visible Light/Dark text)
   - hero `<header>`: two `https://qrati.com` anchors, then GitHub / VS Code `.action-pills` anchors
   - `<main>`: gallery `mountEmbed` host (third-party `qrati-connect` internals out of scope), then SEO copy (not focusable), `<details>/<summary>` FAQ controls, Contact CTA `.btn-cta-primary`
   - `<footer>`: four nav anchors, then `footer-cookie-btn`
3. CSS (`app/styles/app.css`): `.theme-toggle` is `position: absolute; top: 1rem; right: 1rem` (later rule overrides `fixed` / `z-index: 100` to `absolute` / `z-index: 1`). The button is a **sibling** of `.page-shell`, not a child, so it stays at the start of the host tab order and at the top-right of the page. No `order`, flex/grid reordering, or `tabindex` > 0 restyles the sequence.
4. Cookie consent (`app/lib/cookieConsent.ts`, vanilla-cookieconsent 3.1.0): `autoShow: required` (geo fail-closed). Host does not set `disablePageInteraction` (library default `false`) or `guiOptions`. Default first-layer is a non-modal box (`layout: box`, `position: bottom right` per configuration reference). That is a cookie banner, not a host-authored modal that must take the rest of the page inert. First-layer behavior was a prior audit.
5. SC 2.4.3 (A): if a page can be navigated sequentially and that sequence affects meaning or operation, focusable components receive focus in an order that preserves meaning and operability. [Understanding 2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html): HTML sequential order is the content stream when no scripting/`tabindex` changes it; focus order need not match visual layout if it remains logical. [F44](https://www.w3.org/WAI/WCAG22/Techniques/failures/F44) is the failure of using `tabindex` to create a non-logical tab order — not present.

Authz/validation/persistence: none (public demo). Side effects on this path: theme persist, `showCookiePreferences`, outbound links. Errors: none thrown by tab order.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme-toggle first (top-right) vs hero (center) fails 2.4.3:** Understanding 2.4.3 allows a focus order that is not identical to visual layout if meaning/operability are preserved. Site chrome then document content is a logical sequence; the control is first in the content stream.
- **Missing skip link / five hero tab stops fail 2.4.3:** 2.4.1 (already audited) addresses bypass of repeated blocks. 2.4.3 does not require skipping unique hero chrome.
- **Cookie banner without `disablePageInteraction` fails 2.4.3:** library default is a non-modal box. Understanding’s modal example (inert remainder) applies to modal dialogs, not this banner. Not claimed without a CookieConsent focus-trap counterexample in this repo.
- **Embed widget inserts extra tab stops and breaks host order:** embed internals are out of scope; host mount is a single script host in DOM order inside `<main>` after the hero.
- **F44 via implicit tabindex:** no `tabindex` attributes in host source.
- **Issue search** `focus order OR 2.4.3 OR tabindex OR keyboard order`: no matching issue (open or closed). Closed a11y issues are different SCs. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [WCAG 2.2 SC 2.4.3](https://www.w3.org/TR/WCAG22/#focus-order)
- [F44: Failure of 2.4.3 due to tabindex that does not preserve meaning](https://www.w3.org/WAI/WCAG22/Techniques/failures/F44)
- [CookieConsent configuration reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html) (`autoShow`, `disablePageInteraction` default false, `guiOptions.consentModal`)
- `app/components/qrati-demo.gts` (DOM order of controls)
- `app/styles/app.css` (`.theme-toggle` position cascade)
- `app/lib/cookieConsent.ts` (vanilla-cookieconsent 3.1.0 run options)
- `app/templates/application.gts`, `app/router.ts`

## Limitations

CodeGraph unindexed. No browser keyboard session; tab order is inferred from source (no `tabindex`, no CSS `order`) plus WCAG HTML content-stream rule. Live `https://qrati.com/connect/ember-example` was not used as evidence this run. CookieConsent focus-trap implementation is from published defaults, not executed `node_modules`.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261109T191838Z-1a98de5d6ff74b7894ad147bb4af6bad.json`.
