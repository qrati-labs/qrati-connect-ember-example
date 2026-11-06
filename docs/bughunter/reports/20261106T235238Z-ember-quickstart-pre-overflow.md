# Ember quickstart snippet overflow

- **Scope:** On-page developer-integration recipe in `QratiDemo` (`#quickstart-heading` → `<pre><code>` embed script) and host CSS that clips it. Excludes live `mountEmbed`, cookie consent, theme toggle, worker routing, and README markdown.
- **Base:** `origin/main` at `f496e35cf094c070ee824a8cf4c2db7f502a1c1e`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261106T235238Z-556a59b0f8d14f7a98276e1f7b7555d7-ember`, `bughunter/20261106T235238Z-556a59b0f8d14f7a98276e1f7b7555d7-ember`.
- **Run:** `20261106T235238Z-556a59b0f8d14f7a98276e1f7b7555d7`.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Quickstart embed snippet is clipped on narrow viewports** — **Evidence:** `app/components/qrati-demo.gts` `#quickstart-heading` section renders a `<pre><code>` classic `embed.js` sample whose longest line is the jsDelivr `src` URL. `app/styles/app.css` had no `pre`/`code` rules (UA `white-space: pre`). `.page-shell` sets `overflow: hidden` and the later `.page-shell { position: relative; }` rule does not override it. `.seo-section { text-align: center }` applies to the snippet. **Failure:** on phone-width viewports the `src` line overflows the page frame and is clipped, so the copy-paste recipe is unreadable. **Fix:** `.seo-section pre { max-width: 100%; overflow-x: auto; text-align: left; white-space: pre; }`. **Test:** `tests/unit/ember-quickstart-pre-overflow-test.ts` via `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`.
2. Developer-integration section: `<section class="seo-section" aria-labelledby="quickstart-heading">` with `<pre><code>` escaped `<script async src="https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js" …>`.
3. Ancestors: `.content-shell` → `.page-frame` → `.page-shell` (`isolation: isolate; overflow: hidden`).
4. No authz/validation/persistence. Side effect: none beyond rendering; overflow is clipped rather than creating a page-level scrollbar.

## Falsification

- Not a duplicate of [#36](https://github.com/qrati-labs/qrati-connect-ember-example/issues/36): that issue corrected snippet *content* (web component → embed script). Layout/overflow was unchanged.
- Desktop `page-frame` max-width 72rem fits ~80ch; the failure is narrow viewports, which the example CSS already special-cases (`@media (max-width: 640px)` for `.answer-section`).
- Changing `.page-shell { overflow }` would be a broader visual-containment change; containing overflow on `pre` is the narrower root-cause fix.
- README markdown snippet is out of scope (not this page).

## Disposition

Confirmed source defect. Issue [#57](https://github.com/qrati-labs/qrati-connect-ember-example/issues/57). Ownership map (`qrati-operations` `web/ownership.html`) has no `qrati-connect-ember-example` row; issue left unassigned (no guessed owner). Example repos are non-critical for this job’s merge policy.

## Tests

- Authored: `tests/unit/ember-quickstart-pre-overflow-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- Patch hygiene: `git diff --check` — no whitespace errors

## Citations

- CSS overflow clipping of descendants: [MDN `overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- UA `pre` white-space: [HTML rendering / `pre` element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element)

## Limitations

CodeGraph unindexed for this worktree; source reads used. No browser session; overflow inferred from CSS containing blocks and UA `pre` defaults.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30).

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T23:52:38Z | 2026-11-06T23:52:59Z | 05:22:38 | 05:22:59 | 00:00:21 (0.3 min) |
| `audit` | 2026-11-06T23:53:21Z | 2026-11-06T23:56:46Z | 05:23:21 | 05:26:46 | 00:03:25 (3.4 min) |
| `delivery` | 2026-11-06T23:56:46Z | 2026-11-06T23:57:23Z | 05:26:46 | 05:27:23 | 00:00:37 (0.6 min) |
| **Total run (preflight start to finish)** | 2026-11-06T23:52:38Z | 2026-11-06T23:57:23Z | 05:22:38 | 05:27:23 | **00:04:45 (4.8 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261106T235238Z-556a59b0f8d14f7a98276e1f7b7555d7.json`. Timing-table insertion itself occurs after this measurement snapshot.

## PR / checks

- Issue: [#57](https://github.com/qrati-labs/qrati-connect-ember-example/issues/57)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/58
- Base `main` `f496e35cf094c070ee824a8cf4c2db7f502a1c1e` / head `bughunter/20261106T235238Z-556a59b0f8d14f7a98276e1f7b7555d7-ember`
- `closingIssuesReferences`: #57
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: GitGuardian pending; CI Lint pending; CI Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
