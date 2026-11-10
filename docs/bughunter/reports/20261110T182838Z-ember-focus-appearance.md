# Ember host WCAG 2.4.13 focus appearance

- **Scope:** WCAG 2.2 SC 2.4.13 Focus Appearance (AAA) for host-authored keyboard focus indicators in `QratiDemo`: `.theme-toggle:focus-visible` and `.footer-cookie-btn:focus-visible`. Excludes 2.4.7 focus visible on links (20261107T050938Z), 1.4.11 non-text contrast of the same rings (20261109T181138Z), 2.4.11 focus not obscured (20261109T194038Z), cookie-consent modal chrome (library-owned), embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `1ffa7ed5833d83245a6a92acad12705541797a21`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T182838Z-fdd9540f5e924a9bb271eb1085c3250d-ember`, `bughunter/20261110T182838Z-fdd9540f5e924a9bb271eb1085c3250d-ember`.
- **Run:** `20261110T182838Z-fdd9540f5e924a9bb271eb1085c3250d`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders only `<QratiDemo />`. Host controls live in `app/components/qrati-demo.gts`. Author-drawn focus CSS is only in `app/styles/app.css`.
2. Host-authored `:focus-visible` rules:
   - `.theme-toggle:focus-visible` — `outline: 2px solid var(--brand-accent); outline-offset: 2px;`
   - `.footer-cookie-btn:focus-visible` — same outline / offset.
   Theme-toggle is a pill (`border-radius: 999px`). Cookie Preferences is unbordered text (`padding: 0`).
3. [SC 2.4.13](https://www.w3.org/TR/WCAG22/#focus-appearance) (AAA): when a keyboard focus indicator is visible, an area of it is at least a 2 CSS px thick perimeter of the unfocused component **and** those pixels have ≥ 3:1 contrast between focused and unfocused states. Exceptions: UA-determined indicator the author cannot adjust, or author does not modify the indicator **and** its background.
4. Size: a solid 2px `outline` is the documented sufficient perimeter. `outline-offset: 2px` is the Understanding “outset” case (Figure 4: outset / outline / border pass; inset 2px fails). Offset does not reduce area below the 2px perimeter.
5. Change-of-contrast (same pixels, focused vs unfocused). Offset outline is painted on page background, not on the control fill:
   - Light `--brand-accent: #c24100` vs `--page` `#fffdfb` **5.11:1**; vs `#ffffff` **5.19:1**; vs blended toggle fill `rgba(0,0,0,0.06)` over `#fffdfb` **4.48:1**.
   - Dark `--brand-accent: #ff6b35` vs `#0f0f14` **6.74:1**; vs `#111111` **6.66:1**; vs blended toggle fill `rgba(255,255,255,0.08)` over `#111` **5.47:1**.
   All ≥ 3:1. Adjacent contrast of these rings was already ≥ 3:1 under 1.4.11 (20261109T181138Z).
6. Other host controls: hero / action-pill / Contact / footer `<a>` and FAQ `<summary>` do not set `outline` / `outline-color` / `:focus`. Exception 2 applies (author does not modify the indicator or its background). 2.4.7 G149 already covers visibility of those UA rings.
7. Cookie-consent first-layer / preferences chrome is library CSS (`#cc-main`); host only restyles buttons/toggles via custom properties, not focus outlines. Embed internals out of scope.

Authz: none (public demo). Persistence: none on this path. Side effects: theme toggle persist (`qc-theme`) and cookie-preferences modal are activation, not focus. Errors: none thrown.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR. Open issues: none.

## Falsification

- **2px outline fails because the toggle is a pill / `border-radius: 999px`:** Understanding allows a line that solidly encloses the shape **or** the minimum bounding box. A 2px CSS `outline` is the sufficient technique for both.
- **`outline-offset: 2px` is inset and needs 3px:** contradicted by Understanding Figure 4 (outset passes). Offset paints outside the border box.
- **Must also restyle link / FAQ summary rings to 2.4.13:** Exception 2 — author did not modify those indicators or their background. Not a host failure.
- **Light `#c24100` vs toggle fill (4.48:1) is “barely” and should fail:** 3:1 is the threshold; 4.48 meets it. Offset pixels are vs page background (5.11:1), which is the actual unfocused color of those pixels.
- **AAA is out of product scope so this cannot be an audit:** 2.4.13 is a connected host workflow (author-drawn rings). Absence of a failure is report-only, not a reason to skip tracing.
- **Issue search** `focus appearance OR 2.4.13 OR outline`: no open issue. Closed hits were Iconify size (#38), cookie reopen (#28), embed heading (#26) — different paths.

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS (`qrati-connect-ts` is mapped High / Chiranjeet Sarkar; this example repo is not). No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 SC 2.4.13 Focus Appearance](https://www.w3.org/TR/WCAG22/#focus-appearance)
- [Understanding SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- `app/styles/app.css` (`.theme-toggle:focus-visible`, `.footer-cookie-btn:focus-visible`, `--brand-accent`)
- `app/components/qrati-demo.gts` (theme toggle, Cookie Preferences)
- Prior: 2.4.7 links (20261107T050938Z); 1.4.11 rings (20261109T181138Z)

## Limitations

CodeGraph unindexed. Contrast from authored CSS tokens (sRGB WCAG relative luminance), not a computed-style / screenshot capture. No keyboard session on `https://qrati.com/connect/ember-example`. No claim about UA default rings on links/`summary`, or about cookie-consent / embed focus chrome.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T18:28:38Z | 2026-11-10T18:29:02Z | 23:58:38 | 23:59:02 | 00:00:24 (0.4 min) |
| `audit` | 2026-11-10T18:29:10Z | 2026-11-10T18:32:26Z | 23:59:10 | 00:02:26 | 00:03:16 (3.3 min) |
| `delivery` | 2026-11-10T18:32:26Z | 2026-11-10T18:33:18Z | 00:02:26 | 00:03:18 | 00:00:52 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-10T18:28:38Z | 2026-11-10T18:33:18Z | 23:58:38 | 00:03:18 | **00:04:40 (4.7 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:08 (0.1 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T182838Z-fdd9540f5e924a9bb271eb1085c3250d.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/142
- Base `main` `1ffa7ed5833d83245a6a92acad12705541797a21` / head `bughunter/20261110T182838Z-fdd9540f5e924a9bb271eb1085c3250d-ember`
- `closingIssuesReferences`: none
- Mergeable; assignees none (repo unmapped; no guessed owner)
- Checks at first read-back: Lint pending; Test pending; Workers Builds pending
- Local tests **NOT RUN BY BUGHUNTER**
