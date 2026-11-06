# Ember host theme-toggle label-in-name

- **Scope:** Host theme toggle accessible name vs visible Light/Dark label (`app/components/qrati-demo.gts`).
- **Base:** `origin/main` at `a2629f5684bd2503d910f78512635cc6d7cdbdc5`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T163638Z-d4145d0689e34def96c543e27f31421b-ember`, `bughunter/20261106T163638Z-d4145d0689e34def96c543e27f31421b-ember`.
- **Run:** `20261106T163638Z-d4145d0689e34def96c543e27f31421b`.

## Finding

**[P3] Theme toggle aria-label hides visible Light/Dark name** — **Evidence:** `QratiDemo` template button.theme-toggle sets `aria-label="Toggle theme"` while the visible label is `☀ Light` or `🌙 Dark` (`app/components/qrati-demo.gts`). Reachable on every page load; first tab stop is this control. **Failure:** AccName uses `aria-label` over descendant text, so the accessible name is “Toggle theme” and does not contain the visible words Light/Dark (WCAG 2.2 SC 2.5.3 Label in Name). Speech-input users who see **Light** or **Dark** cannot activate the control by speaking that label. **Fix:** drop the generic `aria-label` so the accessible name is the existing visible text. **Test:** `tests/unit/theme-toggle-label-in-name-test.ts` via `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

- Entry: host page → `application.gts` → `QratiDemo`.
- Theme init: `qc-theme` / `prefers-color-scheme`; constructor sets `data-theme` and `.dark`.
- Toggle: `toggleTheme` flips tracked theme, document attributes, `localStorage`, and remounts the embed via `mountEmbed`.
- Control: `<button type="button" class="theme-toggle">` with visible Light/Dark action text.
- Prior 2026-10-17 theme-toggle audit checked persistence and remount only; it did not evaluate AccName vs visible text.

## Falsification

- Not intentional extra naming: visible text already names the action; the aria-label only genericizes it.
- No other guard supplies Light/Dark in the accessible name (`aria-labelledby` absent).
- `action-pills` / footer `aria-label`s name regions, not this button.
- Contrast, embed remount, and cookie consent are out of scope and already separately tracked.

## Disposition

Confirmed source defect. Issue [#34](https://github.com/qrati-labs/qrati-connect-ember-example/issues/34). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/theme-toggle-label-in-name-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Patch hygiene: `git diff --check` — no whitespace errors

## Citations

- [WCAG 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)
- [G208 Including the text of the visible label as part of the accessible name](https://www.w3.org/WAI/WCAG21/Techniques/general/G208)

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser/speech-control session. Local unit tests not executed per BugHunter boundary.

## Timing

Timing table inserted after `finish` (measured ledger only).
