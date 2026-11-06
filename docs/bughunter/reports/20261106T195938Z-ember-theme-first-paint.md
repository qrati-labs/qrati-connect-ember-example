# Ember host theme first paint

- **Scope:** Host light/dark theme on first paint (`index.html` document head vs `QratiDemo` constructor applying `data-theme` / `html.dark`). CSS tokens in `app/styles/app.css` under `[data-theme='light'|'dark']`.
- **Base:** `origin/main` at `c5cac7266c01cc718ebfb36f1cd2448f5afe1704`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T195938Z-afa39aee3879418f89d06ca18045edd2-ember`, `bughunter/20261106T195938Z-afa39aee3879418f89d06ca18045edd2-ember`.
- **Run:** `20261106T195938Z-afa39aee3879418f89d06ca18045edd2`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `REPO=main` worktree add failed (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Admin chore PRs #121/#122 were not used as a reason to skip a later admin row; next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Host theme is applied only after Ember boots so first paint is unthemed** — **Evidence:** `app/styles/app.css` binds page background/text/chrome exclusively to `[data-theme='light']` and `[data-theme='dark']`. `index.html` was `<html lang="en">` with no `data-theme` and no head script. `QratiDemo` sets `data-theme` and `html.dark` in its constructor, which runs after `vendor.js` + `Application.create` (`index.html` body). Sibling Connect hosts (Preact/React/Vue/Solid/Qwik/Svelte) apply `qc-theme` in a blocking `<head>` script. **Failure:** `prefers-color-scheme: dark` or `localStorage['qc-theme']='dark'` first-paints unthemed (unset `--page-text` / page background) until Ember constructs `QratiDemo`. **Fix:** guarded inline head script matching `readHostTheme` (`qc-theme` light|dark, else `prefers-color-scheme`, else `light`; set `data-theme` and toggle `dark`). **Test:** `tests/unit/index-html-theme-boot-test.ts` via `pnpm exec ember test --filter="host theme first paint"` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: browser loads `index.html`; CSS in `<head>` keys off `[data-theme=…]`.
2. Input: `localStorage['qc-theme']` or `prefers-color-scheme`.
3. Authz: none (public host page).
4. Validation: stored value must be `light`|`dark` (already true in `readHostTheme`; now also in the boot script).
5. State: `document.documentElement` `data-theme` and class `dark`.
6. Side effects: none beyond DOM theme attributes (constructor still syncs on boot/toggle).
7. Errors: `localStorage` / `matchMedia` throws are caught; fallback `light`.
8. Output: first paint uses themed tokens; later toggle still remounts the embed.

## Falsification

- Reachable: every document load, before Ember.
- Not intentional: sibling examples already boot-theme in `<head>`; constructor comments describe host-controlled theme, not a delayed flash.
- No other guard: no `color-scheme` media CSS, no static `data-theme` on `<html>`.
- Theme-toggle / storage-guard audits covered runtime persistence, not first paint.
- `cc--darkmode` not added: this host’s cookie-consent CSS uses `html.dark` / `[data-theme='dark']` only.

## Disposition

Confirmed P3. Issue [#45](https://github.com/qrati-labs/qrati-connect-ember-example/issues/45). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/index-html-theme-boot-test.ts`
- Command: `pnpm exec ember test --filter="host theme first paint"` (**NOT RUN BY BUGHUNTER**)
- Patch hygiene: `git diff --check` — no whitespace errors
- Tests/build/lint/type-check/install: **NOT RUN BY BUGHUNTER**

## Citations

- [MDN: `<script>` — classic scripts without `async`/`defer` block parsing](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)
- [MDN: `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: `Window.localStorage` exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- Sibling: `qrati-connect-preact-example/index.html` head `qc-theme` boot script
- `index.html`, `app/components/qrati-demo.gts`, `app/styles/app.css`

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser session of first paint. Local unit tests not executed per BugHunter boundary.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Table inserted after `finish`.

## PR / checks

To be recorded after remote read-back.
