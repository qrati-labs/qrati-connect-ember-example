# Ember host theme storage guard

- **Scope:** Host light/dark theme persistence in `QratiDemo` (`localStorage['qc-theme']` read on construct, write on toggle).
- **Base:** `origin/main` at `e4acb613b791d101d80c315cf5de5505122b9b43`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T174539Z-da39a3ba60da4f7fa6d1723b0dc674a6-qrati-connect-ember-example`, `bughunter/20261106T174539Z-da39a3ba60da4f7fa6d1723b0dc674a6-ember`.
- **Run:** `20261106T174539Z-da39a3ba60da4f7fa6d1723b0dc674a6`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). Skipped `qrati-admin` / `REPO=main` (open PRs #121/#122; snapshot of uncommitted work can overlap any admin workflow). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Unguarded localStorage theme read crashes the Ember host when storage is blocked** — **Evidence:** `app/components/qrati-demo.gts` initialized `@tracked theme` with `localStorage.getItem('qc-theme')` in a class field (runs before `constructor`). `app/templates/application.gts` mounts only `QratiDemo`. MDN [`Window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) documents `SecurityError` when persistence is blocked (including cookie blocking). **Failure:** the host never renders, so the live gallery embed never mounts. A truthy non-`light`/`dark` stored value also skipped `[data-theme='light'|'dark']` CSS. **Fix:** `readHostTheme` / `persistHostTheme` wrap storage in `try/catch`, accept only `light`|`dark`, fall back to `prefers-color-scheme` then `light`. **Test:** `tests/unit/theme-storage-guard-test.ts` via `pnpm exec ember test --filter="host theme persistence"` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `application.gts` → `<QratiDemo />` (no other outlet content).
2. Input: `qc-theme` in `localStorage`; else `prefers-color-scheme`.
3. Authz/validation: none; stored string was cast, not checked.
4. State: `@tracked theme` plus `document.documentElement` `data-theme` / `.dark`.
5. Side effect: `localStorage.setItem` in `toggleTheme`.
6. Errors: uncaught `SecurityError` during field init aborts construction.
7. Output: blank page vs themed host + embed.

Sibling `app/lib/cookieConsent.ts` already wraps `sessionStorage` in `try/catch`; theme persistence did not.

## Falsification

- Reachable: every page load constructs `QratiDemo`.
- Not intentional: demo should still show with a session-only theme.
- No other guard: class fields are not inside the consent `try`.
- MDN Using the Web Storage API: property existence is not sufficient feature detection.
- Invalid stored values (`"foo"`) are truthy after the old cast, so the `|| matchMedia` fallback never ran.

## Disposition

Confirmed P3. Issue [#40](https://github.com/qrati-labs/qrati-connect-ember-example/issues/40). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/theme-storage-guard-test.ts`
- Command: `pnpm exec ember test --filter="host theme persistence"` (**NOT RUN BY BUGHUNTER**)
- Patch hygiene: `git diff --check` — no whitespace errors

## Citations

- [Window.localStorage — Exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- `app/components/qrati-demo.gts`, `app/templates/application.gts`

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser session with cookies disabled. Local unit tests not executed per BugHunter boundary.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T17:45:39Z | 2026-11-06T17:46:02Z | 23:15:39 | 23:16:02 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T17:46:29Z | 2026-11-06T17:49:40Z | 23:16:29 | 23:19:40 | 00:03:11 (3.2 min) |
| **Total run (preflight start to finish)** | 2026-11-06T17:45:39Z | 2026-11-06T17:49:40Z | 23:15:39 | 23:19:40 | **00:04:00 (4.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:27 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T174539Z-da39a3ba60da4f7fa6d1723b0dc674a6.json`.
