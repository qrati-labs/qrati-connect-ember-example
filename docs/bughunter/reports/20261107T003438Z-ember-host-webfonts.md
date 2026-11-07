# Ember host Inter/Sora webfont loading

- **Scope:** Host typography loading for Inter (body/UI) and Sora (hero headings) via `app/styles/app.css` Google Fonts `@import`, including fallback stacks, `font-display`, cookie-consent gating, and critical-path CSS coupling. Excludes cookie-consent categories, Iconify, embed mount, and theme toggle.
- **Base:** `origin/main` at `40b49d56e17a5c989f94dca76497306eb54f35fd`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261107T003438Z-24a49c1302d64a22ad240683590ec4ae-ember`, `bughunter/20261107T003438Z-24a49c1302d64a22ad240683590ec4ae-ember`.
- **Run:** `20261107T003438Z-24a49c1302d64a22ad240683590ec4ae`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Host CSS is `app/styles/app.css` (Embroider/Vite app stylesheet).
2. Line 1: local `@import 'vanilla-cookieconsent/dist/cookieconsent.css'` (bundled with the app, not a third-party network fetch at runtime).
3. Line 2: remote `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700&display=swap')`.
4. `:root` sets `font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`. `.hero h1` sets `font-family: 'Sora', sans-serif`. `#cc-main` sets `--cc-font-family: Inter, system-ui, sans-serif`.
5. `index.html` does not `preconnect` to `fonts.googleapis.com` / `fonts.gstatic.com`. Iconify is loaded separately with `defer` (out of scope).
6. Cookie consent (`app/lib/cookieConsent.ts`) gates only the `analytics` category and GTM. The webfont `@import` is not a cookie category and is not delayed until consent.
7. Read-only fetch of that Google Fonts CSS (same query string as source, including `display=swap`) returns `@font-face` rules with `font-display: swap` for Inter 400–800 and Sora 600–700, with `src` on `fonts.gstatic.com`.

Authz/validation/persistence: none (public stylesheet). Side effects: browser requests to Google Fonts CSS and font files on first paint of host CSS. Errors: if the CSS `@import` fails, UA still applies the remainder of `app.css`; `font-family` falls back to `system-ui` / `sans-serif`.

## Falsification

- **Invisible text (FOIT) while fonts load:** the stylesheet URL includes `display=swap`; Google’s CSS answers with `font-display: swap` on every `@font-face` observed in this run.
- **Missing fallback if Google is blocked:** `:root` already lists `system-ui` and generic sans-serif; Sora headings fall back to `sans-serif`. Missing Inter/Sora is degraded typography, not a broken layout or unreadable page.
- **Ad-block hang leaving the host unstyled:** not evidenced. Common blockers fail the import quickly; remaining rules in `app.css` still apply. A hung TCP connection is hypothetical.
- **GDPR / consent invariant:** the host’s stated cookie contract is essential vs optional analytics (`cookieConsent.ts` copy and categories). Webfonts are not cookies and are not claimed as an analytics load. Legal third-party IP transfer is a policy risk, not a falsified product-code defect on this example.
- **Critical-path `@import` vs `<link>`:** known performance smell ([web.dev: Avoid CSS `@import`](https://web.dev/learn/performance/optimize-web-fonts)); not a reachable functional failure given swap + fallbacks.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: none (no confirmed defect).
- Command: none.
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**.
- Patch hygiene: `git diff --check` on docs-only diff.

## Citations

- [Google Fonts CSS API / `display=swap`](https://developers.google.com/fonts/docs/css2)
- [CSS `font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [web.dev: Optimize web fonts](https://web.dev/learn/performance/optimize-web-fonts) (avoid render-blocking `@import`)
- `app/styles/app.css` lines 1–12, 148–156, 323–324; `app/lib/cookieConsent.ts` categories

## Limitations

CodeGraph unindexed. No browser session of the Ember host. Google Fonts CSS was fetched with curl (may differ from a browser `woff2` UA). Public example URL historically 404 (deployment-availability, out of scope).

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-07T00:34:38Z | 2026-11-07T00:35:00Z | 06:04:38 | 06:05:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-07T00:35:26Z | 2026-11-07T00:41:51Z | 06:05:26 | 06:11:51 | 00:06:25 (6.4 min) |
| `delivery` | 2026-11-07T00:41:51Z | 2026-11-07T00:42:38Z | 06:11:51 | 06:12:38 | 00:00:47 (0.8 min) |
| **Total run (preflight start to finish)** | 2026-11-07T00:34:38Z | 2026-11-07T00:42:38Z | 06:04:38 | 06:12:38 | **00:08:00 (8.0 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:27 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261107T003438Z-24a49c1302d64a22ad240683590ec4ae.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/59
- Base `main` `40b49d56e17a5c989f94dca76497306eb54f35fd` / head `bughunter/20261107T003438Z-24a49c1302d64a22ad240683590ec4ae-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian SUCCESS; CI Lint queued; CI Test queued; Workers Builds in progress
- Local tests **NOT RUN BY BUGHUNTER**
