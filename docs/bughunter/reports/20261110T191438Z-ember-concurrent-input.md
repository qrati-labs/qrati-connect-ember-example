# Ember host WCAG 2.5.6 concurrent input mechanisms

- **Scope:** WCAG 2.2 SC 2.5.6 Concurrent Input Mechanisms (AAA) for host-authored UI in `QratiDemo`: theme toggle, hero/action-pill/Contact/footer links, FAQ `<details>`/`<summary>`, footer Cookie Preferences. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent modal chrome (library-owned; host config only), 2.1.1 keyboard (20261109T223538Z), 2.5.1 pointer gestures (20261110T062738Z), 2.5.2 pointer cancellation (20261110T051738Z).
- **Base:** `origin/main` at `a5b8c3e456b69b9c7133f0dccaacb11c3dbaa39e`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T191438Z-b3b2ab6db0b94bada27f0914a3ae0592-qrati-connect-ember-example`, `bughunter/20261110T191438Z-b3b2ab6db0b94bada27f0914a3ae0592-ember-embed`.
- **Run:** `20261110T191438Z-b3b2ab6db0b94bada27f0914a3ae0592`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Host controls live in `app/components/qrati-demo.gts` and `app/styles/app.css`.
2. [SC 2.5.6](https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms) (AAA): web content does not restrict use of input modalities available on a platform except where the restriction is essential. Users must be able to switch among pointer, touch, and keyboard at any time. Sufficient technique: high-level, input-agnostic handlers (`click`, `focus`, `blur`).
3. Host activation: theme toggle and Cookie Preferences use `{{on "click" ...}}` (`toggleTheme`, `openCookiePreferences`). Action pills, hero/footer/Contact are native `<a>`. FAQ uses native `<details>`/`<summary>`. No `touchstart`/`pointerdown`-only handlers, no `ontouch*`, no `onpointer*` in host source.
4. CSS: no `touch-action: none` / `manipulation` lock, no `pointer-events: none` on those controls. `.theme-toggle` / `.footer-cookie-btn` keep `:hover` and `:focus-visible`. Hover transforms on cards/CTA do not disable other input.
5. Cookie consent init (`app/lib/cookieConsent.ts`) does not set input-mode or pointer restrictions. Worker (`src/worker.ts`) only rewrites the `/connect/ember-example` prefix and optional `__GTM_ID__`; it does not inject input-locking headers or scripts.

Authz: none (public demo). Persistence: theme `qc-theme` and consent cookie are independent of input device. Side effects: theme persist, `showPreferences`, navigation, FAQ open/close. Errors: none thrown on this path.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR. Open issues: none.

## Falsification

- **Click-only handlers fail 2.5.6:** contradicted. `click` is the recommended input-agnostic activation; OS/UA fire it for mouse, touch, pen, and keyboard on buttons/links/summary.
- **Hover-only theme or FAQ fails:** theme and FAQ also work via click/keyboard; hover styles are visual only.
- **Cookie-consent overlay trapping pointer while keyboard still works (or the reverse) is a host defect:** first-layer chrome is library-owned and out of scope; host does not set `disablePageInteraction` or pointer locks.
- **Embed gallery pointer lock applies:** embed internals excluded; host mount does not set `touch-action` or capture pointers.
- **Issue search** `concurrent OR 2.5.6 OR input mechanism OR touch-action OR pointer-events`: no matching issue.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 2.5.6 Concurrent Input Mechanisms](https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms)
- `app/components/qrati-demo.gts` `{{on "click"}}` / native `<a>` / `<details>`
- `app/styles/app.css` (no `touch-action` / `pointer-events` on host controls)
- Prior: 2.1.1 keyboard (20261109T223538Z); 2.5.1 pointer gestures (20261110T062738Z); 2.5.2 pointer cancellation (20261110T051738Z)

## Limitations

CodeGraph unindexed. No browser multi-device session. Library cookie-consent and embed shadow tree not re-tested as host defects.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T19:14:38Z | 2026-11-10T19:15:00Z | 00:44:38 | 00:45:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T19:15:28Z | 2026-11-10T19:21:04Z | 00:45:28 | 00:51:04 | 00:05:36 (5.6 min) |
| `delivery` | 2026-11-10T19:21:04Z | 2026-11-10T19:21:58Z | 00:51:04 | 00:51:58 | 00:00:55 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-10T19:14:38Z | 2026-11-10T19:21:58Z | 00:44:38 | 00:51:58 | **00:07:20 (7.3 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:28 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T191438Z-b3b2ab6db0b94bada27f0914a3ae0592.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

IST dates are 2026-11-11 (UTC+05:30).

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/144
- Base `main` `a5b8c3e456b69b9c7133f0dccaacb11c3dbaa39e` / head `bughunter/20261110T191438Z-b3b2ab6db0b94bada27f0914a3ae0592-ember-embed` `04cb35c83783f1d44dcf4935543a7581f5ee27dd` (pre-timing-amend)
- `closingIssuesReferences`: none
- Mergeable at first read-back: MERGEABLE; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: GitGuardian pass; CI Lint/Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
