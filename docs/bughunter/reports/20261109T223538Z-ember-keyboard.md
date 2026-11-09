# Ember host WCAG 2.1.1 keyboard

- **Scope:** WCAG 2.2 SC 2.1.1 Keyboard for host-authored controls in `QratiDemo`: theme toggle, hero/action-pill/Contact/footer links, FAQ `<details>`/`<summary>`, footer Cookie Preferences. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome (library-owned), skip/bypass (20261107T044738Z), focus visible (20261107T050938Z), focus order (20261109T191838Z), focus not obscured (20261109T194038Z).
- **Base:** `origin/main` at `a73cfb20a7beedc11d6288f9b0b9ed47786491c2`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T223538Z-a7e447cde73c46799d7bf42e4b048bf4-qrati-connect-ember-example`, `bughunter/20261109T223538Z-a7e447cde73c46799d7bf42e4b048bf4-ember`.
- **Run:** `20261109T223538Z-a7e447cde73c46799d7bf42e4b048bf4`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host interaction is in `app/components/qrati-demo.gts`.
2. Host-authored event bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">`. No `keydown`/`keyup`/`keypress`, `mousedown`/`pointerdown`, `tabindex`, or `accesskey` in host `app/` or `index.html`.
3. Remaining operable host UI is native:
   - `<a href>` (hero Qrati links, GitHub/VS Code pills, Contact CTA, footer nav)
   - FAQ `<details>`/`<summary>`
4. [HTML `button` in a form-associated context](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element) and [HTML `a` with `href`](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element) are keyboard-operable in user agents (Enter/Space on buttons; Enter on links). [HTML `summary`](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element) is a disclosure widget; Enter/Space toggles the ancestor `details`.
5. SC 2.1.1 (AA): all functionality available via a keyboard interface, except path-dependent input. [Understanding 2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) lists [G202](https://www.w3.org/WAI/WCAG22/Techniques/general/G202) (native controls) as sufficient. [F54](https://www.w3.org/WAI/WCAG22/Techniques/failures/F54) (function only on JS mouse events on non-focusable elements) and [F42](https://www.w3.org/WAI/WCAG22/Techniques/failures/F42) (scripted event on non-focusable) do not apply: both `click` handlers sit on `type="button"` controls.
6. No custom keyboard trap: host does not call `preventDefault` on Tab, does not use `tabindex > 0`, and does not `focus()`-loop. Cookie-consent overlay is library-owned (out of scope). `mountEmbed` only injects `embed.js` (out of scope).

Authz/validation/persistence: none (public demo). Side effects: theme persist (`qc-theme`), cookie-preferences modal, navigation. Errors: `toggleTheme` / `openCookiePreferences` do not swallow keyboard activation; `showCookiePreferences` awaits init then `CookieConsent.showPreferences()`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`{{on "click"}}` is mouse-only:** HTML `click` on a focused `button` also fires from keyboard activation. Not F54.
- **Theme toggle `position: absolute` (later cascade) takes it out of tab order:** `position` does not remove a `button` from sequential focus. Off-screen-after-scroll is 2.4.11 / 2.4.3, already audited report-only.
- **FAQ `<details>` is not keyboard-operable:** native `summary` is a button-like control; no host CSS sets `pointer-events: none` or removes it from the tree.
- **Contact CTA / pills lack `type` or role:** they are `href` links, not fake buttons.
- **Must audit cookie-consent dialog Tab wrap / embed gallery:** third-party chrome; not host source. Not claimed.
- **Issue search** `keyboard OR 2.1.1 OR keytrap OR tabindex`: no matching issue. Closed a11y issues (#18/#22/#24 contrast, #20 lang, #34 toggle name, #28 preferences reopen) are different paths. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 SC 2.1.1](https://www.w3.org/TR/WCAG22/#keyboard)
- [G202: Ensuring keyboard control for all functionality](https://www.w3.org/WAI/WCAG22/Techniques/general/G202)
- `app/components/qrati-demo.gts`
- `app/templates/application.gts`

## Limitations

CodeGraph unindexed. No browser keyboard session; operability is from host markup + HTML/WCAG native-control techniques, not a captured Tab pass on `https://qrati.com/connect/ember-example`. Cookie-consent and embed keyboard behavior not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

## PR / checks

Filled after remote read-back.
