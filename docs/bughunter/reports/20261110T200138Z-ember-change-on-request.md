# Ember host WCAG 3.2.5 change on request

- **Scope:** WCAG 2.2 SC 3.2.5 Change on Request (AAA) for host-authored context changes in `QratiDemo`: `target="_blank"` links (hero Qrati, GitHub/VS Code pills, footer nav). Excludes Contact CTA (same-tab), theme toggle / FAQ / cookie-preferences (no new window), embed internals (`qrati-connect` / `embed.js`), cookie-consent modal chrome, 3.2.1 on focus (20261110T020738Z), 3.2.2 on input (20261110T022738Z), 2.4.4 link purpose (20261109T183438Z).
- **Base:** `origin/main` at `4bce9bd2f628a471152bb1f6435d444c282b5ce6`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T200138Z-5288217159c94c00bf6062901fb4436d-qrati-connect-ember-example`, `bughunter/20261110T200138Z-5288217159c94c00bf6062901fb4436d-ember`.
- **Run:** `20261110T200138Z-5288217159c94c00bf6062901fb4436d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Admin chore PRs #121/#122 are not this repository. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Host `target="_blank"` links do not warn that a new tab opens** — **Evidence:** eight `<a target="_blank">` controls in `app/components/qrati-demo.gts` (hero `h1` / `.hero-copy` Qrati, GitHub and VS Code pills, footer qrati.com / npm / GitHub / Pricing). Trigger: keyboard or pointer activation. **Failure:** WCAG 2.2 SC 3.2.5 — a new window/tab is a change of context and is not user-initiated unless the user is told in advance; [F22](https://www.w3.org/WAI/WCAG22/Techniques/failures/F22) example 2 / checks 5–6. `rel="noopener noreferrer"` and the `target` attribute are not associated text. **Fix:** `.sr-only` “ (opens in a new tab)” inside each of those links. Contact CTA stays same-tab. **Test:** `tests/unit/blank-target-new-tab-indication-test.ts` (`pnpm test`, **NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. `app/router.ts` `Router.map` is empty (single history index).
2. [SC 3.2.5](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html) (AAA): changes of context are initiated only by user request, or a mechanism exists to turn them off. Understanding: opening a new window “cannot be regarded as user-initiated if it happens without the user explicitly requesting it.” Situation C sufficient technique [H83](https://www.w3.org/WAI/WCAG22/Techniques/html/H83) requires `target` **and** link text that says a new window will open.
3. Host `<a target="_blank" rel="noopener noreferrer">` with no `title` and no new-tab phrase: two hero Qrati links, two action pills, four footer nav links. Contact CTA `class="btn-cta-primary"` → `https://qrati.com/contact-us` has no `target` (same-tab navigation on request).
4. Theme toggle, FAQ `<details>`, Cookie Preferences change content or open a dialog on **click**, not a new UA window. Cookie `autoShow` is a same-window dialog (not F52). Worker (`src/worker.ts`) does not inject links or `target`.
5. `.sr-only` already exists in `app/styles/app.css` (clip 1px). Associated text lives in the link, so the accessible name includes the warning (F22 allows hidden association).

Authz: none (public demo). Persistence: none on this path. Side effects: new tab via `target="_blank"`. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Clicking a link is a user request, so 3.2.5 does not apply:** contradicted by the Understanding note and F22 example 2 (click with no associated “new window” text).
- **`target` is machine-readable so AT already announces it:** H83 still requires indication in link text for people not using AT; F22 check 6 requires associated text (`title` or in-link). Host had neither.
- **Contact CTA / theme / FAQ already change context without warning:** Contact is same-tab; FAQ/theme are content changes, not new windows (3.2.1/3.2.2 already treated those as activation).
- **2.4.4 already covered these links:** 2.4.4 is destination purpose (“Qrati”, “npm”), not the extra change of context of a new tab. Separate SC.
- **AAA is unclaimed so not a defect:** F22 is a documented failure of 3.2.5, not a style preference. Severity is P3 because the SC is AAA and the demo remains usable.
- **Issue search** `target OR "new window" OR "new tab" OR 3.2.5 OR blank`: no matching issue. Created #146.

## Impact / severity

P3 (low). Eight public demo links open a new tab without warning; Back does not return to the example. No authz bypass.

## Root cause

Host used `target="_blank"` for outbound links without associated “opens in a new tab” text.

## Disposition

Confirmed P3. Issue [#146](https://github.com/qrati-labs/qrati-connect-ember-example/issues/146). Narrow markup fix + source regression test. Repo is an unmapped `*-example` (no owner guessed).

## Tests

`tests/unit/blank-target-new-tab-indication-test.ts` — eight `target="_blank"` anchors each contain `.sr-only` + “opens in a new tab”; Contact CTA has no `target`. `pnpm test` **NOT RUN BY BUGHUNTER**. `git diff --check` clean.

## Citations

- [WCAG 2.2 Understanding SC 3.2.5 Change on Request](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html)
- [F22](https://www.w3.org/WAI/WCAG22/Techniques/failures/F22)
- [H83](https://www.w3.org/WAI/WCAG22/Techniques/html/H83)
- `app/components/qrati-demo.gts`
- `app/styles/app.css` `.sr-only`

## Limitations

CodeGraph unindexed. No browser/AT session; F22 applied from markup. UA-specific `target` announcements were not captured.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T20:01:38Z | 2026-11-10T20:02:03Z | 01:31:38 | 01:32:03 | 00:00:25 (0.4 min) |
| `audit` | 2026-11-10T20:02:34Z | 2026-11-10T20:09:15Z | 01:32:34 | 01:39:15 | 00:06:41 (6.7 min) |
| **Total run (preflight start to finish)** | 2026-11-10T20:01:38Z | 2026-11-10T20:09:15Z | 01:31:38 | 01:39:15 | **00:07:37 (7.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:32 (0.5 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T200138Z-5288217159c94c00bf6062901fb4436d.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time. IST clock times are 2026-11-11.

## PR / checks

- Issue: https://github.com/qrati-labs/qrati-connect-ember-example/issues/146
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/147
- Base `main` `4bce9bd2f628a471152bb1f6435d444c282b5ce6` / head `bughunter/20261110T200138Z-5288217159c94c00bf6062901fb4436d-ember` `116e460c39958d14fa0d6670949db5d78951a98a` (pre-timing-amend)
- `closingIssuesReferences`: #146
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first PR read-back: Lint pending; Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
