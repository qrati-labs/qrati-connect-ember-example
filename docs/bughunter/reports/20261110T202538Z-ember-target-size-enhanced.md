# Ember host WCAG 2.5.5 target size (enhanced)

- **Scope:** WCAG 2.2 SC 2.5.5 Target Size (Enhanced) for host-authored pointer targets in `QratiDemo`: `.theme-toggle`, `.action-pills a`, FAQ `<summary>`, footer nav links, `.footer-cookie-btn`. Excludes Contact CTA (already ≥ 44px), hero inline `Qrati` links (Inline exception), cookie-consent modal chrome, embed internals (`qrati-connect` / `embed.js`), 2.5.8 Target Size (Minimum) (20261107T053238Z, 20261110T184938Z).
- **Base:** `origin/main` at `5ba12746906608e6bb01f9c78e167a3eb3412b79`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T202538Z-d4485fc730d54781816829b4ae3d5a5a-ember`, `bughunter/20261110T202538Z-d4485fc730d54781816829b4ae3d5a5a-ember`.
- **Run:** `20261110T202538Z-d4485fc730d54781816829b4ae3d5a5a`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path is not this repository. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Host pointer targets are smaller than 44×44 CSS pixels** — **Evidence:** `app/styles/app.css` + `app/components/qrati-demo.gts`. At a 16px root and `:root { line-height: 1.5 }`: theme toggle **34.72px** tall; action pills **43.6px** tall (padding + line box + 1px border); FAQ `<summary>` **24px** tall; footer nav / Cookie Preferences **18.72px** tall (`padding: 0`, shortest label `npm`). **Failure:** WCAG 2.2 SC 2.5.5 — custom targets must be at least 44×44 CSS pixels; unlike 2.5.8 there is no spacing exception. Documented failure: target less than 44×44. **Fix:** C44 `min-height` / `min-width: 44px` (`box-sizing: border-box`); `display: inline-flex` on footer links/button so min-size applies. FAQ `<summary>` stays UA `list-item` so the disclosure marker remains. **Test:** `tests/unit/target-size-enhanced-test.ts` (`pnpm test`, **NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Pointer targets are host CSS in `app/styles/app.css`.
2. [SC 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) (AAA): 44×44 CSS pixels except Equivalent, Inline, User Agent Control, Essential. Sufficient technique [C44](https://www.w3.org/WAI/WCAG22/Techniques/css/C44).
3. Inline exception: hero `Qrati` anchors sit in the `h1` / `.hero-copy` sentences. Footer controls are a `<nav>`, not sentence text. Theme toggle, pills, and FAQ summaries are standalone widgets.
4. Contact CTA `.btn-cta-primary` padding `0.8rem` + 1rem line box → **49.6px** height; already meets 2.5.5; left unchanged.
5. 2.5.8 audits (footer 20261107T053238Z, remaining 20261110T184938Z) already measured these heights against the 24px AA floor and explicitly left 2.5.5 out of scope.

Authz: none (public demo). Persistence: none on this path. Side effects: theme persist, navigation, FAQ open/close, cookie preferences. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Click/spacing already passes 2.5.8 so 2.5.5 is style:** 2.5.5 has no spacing exception; Understanding requires 44×44 on the target itself.
- **AAA unclaimed is not a defect:** the WG documents a failure for targets under 44×44; same class as the 3.2.5 new-tab indication fix. Severity P3 because the SC is AAA.
- **Hero and footer `Qrati` links must grow:** hero links are Inline. Footer `qrati.com` is a nav item, not a sentence, and is included.
- **FAQ `display: inline-flex` is required:** `min-height` applies to `list-item`; forcing flex hides the disclosure marker. Summary keeps UA display.
- **Action pills 43.6px is close enough:** the criterion is at least 44, not approximately 44.
- **Issue search** `2.5.5 OR "target size" OR 44px`: no matching issue. Created #148.

## Impact / severity

P3 (low). Undersized host controls on a public demo; AA 2.5.8 still holds via size or spacing. No authz bypass.

## Root cause

Host used compact padding and `0.78rem`/`0.8rem` text without a 44px minimum hit box. Footer links remained `display: inline`, so `min-height` would not have applied without a box.

## Disposition

Confirmed P3. Issue [#148](https://github.com/qrati-labs/qrati-connect-ember-example/issues/148). Narrow CSS fix + source regression test. Repo is an unmapped `*-example` (no owner guessed).

## Tests

`tests/unit/target-size-enhanced-test.ts` — `.theme-toggle`, `.action-pills a`, `.faq-list summary`, `.footer nav a`, `.footer-cookie-btn` declare `min-height`/`min-width` ≥ 44px; footer controls use `inline-flex`. `pnpm test` **NOT RUN BY BUGHUNTER**. `git diff --check` clean.

## Citations

- [WCAG 2.2 Understanding SC 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [C44: Using CSS to ensure targets are at least 44 by 44 CSS pixels](https://www.w3.org/WAI/WCAG22/Techniques/css/C44)
- `app/styles/app.css`
- `app/components/qrati-demo.gts`
- Prior: 2.5.8 footer (20261107T053238Z); 2.5.8 remaining (20261110T184938Z)

## Limitations

CodeGraph unindexed. Sizes from authored CSS tokens at 16px root, not a computed-style / screenshot capture. No pointer session on `https://qrati.com/connect/ember-example`. No claim about cookie-consent or embed hit targets.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T20:25:38Z | 2026-11-10T20:26:00Z | 01:55:38 | 01:56:00 | 00:00:22 (0.4 min) |
| `audit` | 2026-11-10T20:26:31Z | 2026-11-10T20:31:42Z | 01:56:31 | 02:01:42 | 00:05:11 (5.2 min) |
| `delivery` | 2026-11-10T20:31:42Z | 2026-11-10T20:32:44Z | 02:01:42 | 02:02:44 | 00:01:02 (1.0 min) |
| **Total run (preflight start to finish)** | 2026-11-10T20:25:38Z | 2026-11-10T20:32:44Z | 01:55:38 | 02:02:44 | **00:07:06 (7.1 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:31 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T202538Z-d4485fc730d54781816829b4ae3d5a5a.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time. IST clock times are 2026-11-11.

## PR / checks

- Issue: https://github.com/qrati-labs/qrati-connect-ember-example/issues/148
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/149
- Head: `ff4b9fb411ad5aa04e4b8c2e74e22d8443fb2d02` (timing-table commit follows)
- Checks at first read-back: Lint/Test/Workers Builds pending. Local `pnpm test` **NOT RUN BY BUGHUNTER**.
