# Ember host WCAG 2.1.4 character key shortcuts

- **Scope:** WCAG 2.2 SC 2.1.4 Character Key Shortcuts for host-authored UI in `QratiDemo`: theme toggle, footer Cookie Preferences, FAQ `<details>`/`<summary>`, hero/action-pill/Contact CTA/footer links, cookie-consent init, theme boot script, Cloudflare Worker HTML path. Includes vanilla-cookieconsent **3.1.0** key listeners as configured by this host (`app/lib/cookieConsent.ts`). Excludes embed internals (`qrati-connect` / `embed.js`), 2.1.1 keyboard (20261109T223538Z), 2.1.2 no keyboard trap (20261109T225738Z), 2.4.7 focus visible (20261107T050938Z).
- **Base:** `origin/main` at `d66cdacc9d33aaf2c752dadedd6ae8ff49dabeef`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T091539Z-2b327ba914bf4c8ebe1943bd54e827ac-ember`, `bughunter/20261110T091539Z-2b327ba914bf4c8ebe1943bd54e827ac-ember`.
- **Run:** `20261110T091539Z-2b327ba914bf4c8ebe1943bd54e827ac`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / light-theme off-toggle in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome lives in `app/components/qrati-demo.gts`. Constructor calls `initCookieConsent()` (`app/lib/cookieConsent.ts`). `index.html` inline theme boot only reads `qc-theme` / `prefers-color-scheme`. Worker (`src/worker.ts`) rewrites `/connect/ember-example` and optional `__GTM_ID__`; it does not register keyboard shortcuts.
2. Host-authored event bindings (only two): `{{on "click" this.toggleTheme}}` on `<button type="button" class="theme-toggle">`; `{{on "click" this.openCookiePreferences}}` on `<button type="button" class="footer-cookie-btn">`. Repo search of `app/`, `index.html`, and `src/` for `accesskey`, `keydown`/`keyup`/`keypress`, and `addEventListener('key…')`: **no matches**.
3. Remaining operable host UI is native `<a href>`, FAQ `<details>`/`<summary>`, and those two buttons. User-agent activation keys (Enter/Space on a focused control) are not character-key shortcuts; they are active only while the control has focus.
4. vanilla-cookieconsent **3.1.0** (jsDelivr UMD, same version as `package.json`): listeners are `click`, `change`, `mouseenter`, `focus`, `transitionend`, **Tab** wrap inside the open modal, and **Escape** (`keyCode === 27`) to hide preferences. No letter, number, punctuation, or symbol shortcut is registered. Host `CookieConsent.run({...})` does not add `accesskey` or custom hotkeys.
5. [WCAG 2.2 SC 2.1.4](https://www.w3.org/TR/WCAG22/#character-key-shortcuts) (Level A) applies **if** a shortcut uses only letter/punctuation/number/symbol characters. Then turn-off, remap, or active-only-on-focus is required. [Understanding 2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html): access keys that need a modifier, and shortcuts only while a component has focus, are out of scope. With no host character-key shortcut, the SC is satisfied (nothing to turn off or remap).

Authz/validation: public demo. Persistence: `qc-theme` localStorage on theme `click`; consent cookie / GTM inject after preferences `click`. Side effects: none on this SC. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Missing remapping UI fails 2.1.4:** SC applies only when a character-key shortcut exists. Host source has none.
- **Cookie-consent Tab wrap / Escape are character shortcuts:** Tab and Escape are non-printable keys. Understanding 2.1.4 excludes them.
- **Speech users can still trigger “Press X”:** that is UA/AT behavior, not an author-implemented shortcut.
- **Embed gallery implements letter shortcuts:** out of scope; not claimed.
- **Issue search** `shortcut OR accesskey OR 2.1.4 OR hotkey`: `gh issue list --state all` has no matching issue. Open issues empty. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-web`/`qrati-api`/`qrati-media`/`qrati-ai`/`qrati-connect-ts`/`qrati-sdk-ts`/`qrati-admin`/`qscore-web`/`qrati-tools`/`qrati-operations` only). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)
- [WCAG 2.2 SC 2.1.4](https://www.w3.org/TR/WCAG22/#character-key-shortcuts)
- vanilla-cookieconsent 3.1.0 UMD (`keydown` only for Tab trap and Escape)
- `app/components/qrati-demo.gts` (click-only host handlers)
- `app/lib/cookieConsent.ts` (`CookieConsent.run` config; no hotkeys)
- `index.html` / `src/worker.ts` (no keyboard listeners)
- Prior: 2.1.1 (20261109T223538Z); 2.1.2 (20261109T225738Z)

## Limitations

CodeGraph unindexed. No live session on `https://qrati.com/connect/ember-example`; claims are from host markup/JS, WCAG 2.1.4 Understanding, and the published 3.1.0 UMD. Embed widget internals not claimed. `node_modules` absent in the worktree.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

timing incomplete
