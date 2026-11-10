# Ember host theme toggle, persist, and embed theme sync

- **Scope:** Host Light/Dark control: first-paint boot (`index.html`), `readHostTheme` / `persistHostTheme` / `toggleTheme`, `data-theme` + `html.dark`, and in-place `mountEmbed` theme updates on `<qrati-connect>` or the in-flight loader. Excludes cookie-consent GTM (#138), embed `innerHTML` remount (#60), gallery heading sibling (#26), org-id fallback (#51), first-paint unthemed flash (#45), storage throw (#40), toggle accessible name (#34), OS `prefers-color-scheme` live updates (20261107T064238Z), theme-toggle CSS position cascade (20261107T031838Z).
- **Base:** `origin/main` at `35e63ff496493937bece20755ff2d5db0d4e3059`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T174238Z-3c8f100d2b7e49f09cd4180c8f72ed2e-qrati-connect-ember-example`, `bughunter/20261110T174238Z-3c8f100d2b7e49f09cd4180c8f72ed2e-ember`.
- **Run:** `20261110T174238Z-3c8f100d2b7e49f09cd4180c8f72ed2e`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: blocking script in `index.html` reads `localStorage['qc-theme']` (guarded) or `prefers-color-scheme`, then sets `document.documentElement` `data-theme` and `classList.toggle('dark', theme === 'dark')`.
2. `app/templates/application.gts` renders `<QratiDemo />`. Constructor (`app/components/qrati-demo.gts`) calls `readHostTheme()` (same key / OS fallback / storage catch), reapplies `data-theme` and `html.dark`, then `initCookieConsent()` (out of scope).
3. User control: `.theme-toggle` `type="button"` `{{on "click" this.toggleTheme}}`. Visible name is `☀ Light` / `🌙 Dark` via `this.isDark`. `toggleTheme` flips `@tracked theme`, writes `data-theme` / `html.dark`, `persistHostTheme` (`localStorage.setItem` in try/catch).
4. Live gallery: `.widget-embed-host {{mountEmbed this.theme}}`. Functional `ember-modifier`: if child `qrati-connect` exists, `setAttribute('theme', theme)` and return; else if child `script` exists, `dataset.theme = theme` and return; else inject classic `async` `embed.js` once with `data-organization-id`, `data-router="hash"`, `data-theme`. No `innerHTML` wipe (#60).
5. Ember Guides (template lifecycle / modifiers): the functional modifier reruns when tracked positional args change; an optional destructor runs before the next invocation. This modifier returns no destructor, so the host node and loader/widget stay in place across theme flips.
6. Authz/validation: public demo. Persistence: `qc-theme` only after an explicit toggle (OS-detected first visit is not written). Side effects: host chrome + embed theme attribute. Errors: storage / `matchMedia` failures fall back to in-memory / `'light'`.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Theme toggle still remounts a second gallery on `document.body`:** contradicted by current `mountEmbed` (reuse widget / pending script; no `innerHTML = ''`). Covered by `tests/unit/embed-theme-remount-test.ts` and closed #60.
- **Unguarded `localStorage` throws and blanks the host:** both the head boot and `readHostTheme` / `persistHostTheme` catch `SecurityError`. Closed #40.
- **First paint is unthemed until Ember boots:** head script applies `data-theme` before CSS/body. Closed #45.
- **Modifier rerun without destructor re-injects a second loader:** second invocation sees the existing `script` or `qrati-connect` and returns after updating theme. Race after the loader removes its tag and before `<qrati-connect>` exists is not demonstrated from this source; #60’s body fallback required a detached in-flight classic script after wipe.
- **`html.dark` and `data-theme` can diverge:** constructor, head boot, and `toggleTheme` always set both from the same `theme` value.
- **Later CSS `position: absolute; z-index: 1` hides the control:** the toggle is a sibling of `.page-shell`, not clipped by `.page-shell { overflow: hidden }`. Prior position-cascade audit (20261107T031838Z) did not confirm unusability; this run does not re-open it.
- **Issue search** `theme toggle OR persistHostTheme OR qc-theme OR mountEmbed theme`: closed #60, #45, #40, #34. No open duplicate.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). Existing `tests/unit/embed-theme-remount-test.ts`, `tests/unit/theme-storage-guard-test.ts`, `tests/unit/index-html-theme-boot-test.ts`, `tests/unit/theme-toggle-label-in-name-test.ts` already cover sibling contracts. `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [Ember Guides — Template Lifecycle, DOM, and Modifiers](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
- `app/components/qrati-demo.gts` (`readHostTheme`, `persistHostTheme`, `toggleTheme`, `mountEmbed`)
- `index.html` blocking `qc-theme` boot
- Prior: #60, #45, #40, #34

## Limitations

CodeGraph unindexed. No browser session. Public `https://qrati.com/connect/ember-example` historically 404; deployment availability out of scope. Embed `theme` observation assumed from prior #60 / `qrati-connect-ts` `observedAttributes`, not re-fetched jsdelivr bytes.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T17:42:38Z | 2026-11-10T17:43:02Z | 23:12:38 | 23:13:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-10T17:43:28Z | 2026-11-10T17:47:59Z | 23:13:28 | 23:17:59 | 00:04:31 (4.5 min) |
| `delivery` | 2026-11-10T17:47:59Z | 2026-11-10T17:48:59Z | 23:17:59 | 23:18:59 | 00:01:00 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-10T17:42:38Z | 2026-11-10T17:48:59Z | 23:12:38 | 23:18:59 | **00:06:21 (6.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:26 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T174238Z-3c8f100d2b7e49f09cd4180c8f72ed2e.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/140
- Base `main` `35e63ff496493937bece20755ff2d5db0d4e3059` / head `bughunter/20261110T174238Z-3c8f100d2b7e49f09cd4180c8f72ed2e-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
