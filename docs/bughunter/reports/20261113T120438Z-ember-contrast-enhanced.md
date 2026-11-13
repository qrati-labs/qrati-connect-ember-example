# Ember host WCAG 1.4.6 contrast (enhanced)

- **Scope:** WCAG 2.2 SC 1.4.6 Contrast (Enhanced) for host-authored text in `QratiDemo` and cookie-consent chrome tokens in `app/styles/app.css`. Same pairings as the 1.4.3 audit: `--page-text`, `--page-heading`, `--page-muted`, `--brand-accent`, `--footer-muted`, `--pill-text`, `--theme-toggle-color`, CTA/consent button labels, `.seo-kicker`, hero accent links. Excludes 1.4.3 AA (20261109T214938Z, closed #18/#22/#24), 1.4.11 non-text (20261109T181138Z), 1.4.1 use of color (20261110T012438Z), embed internals (`qrati-connect` / `embed.js`).
- **Base:** `origin/main` at `af922c2cac71882abbce6b6bdb0ed87ebfdc6813`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261113T120438Z-ef2a39b9550947b6a348391153c4b9d4-qrati-connect-ember-example`, `bughunter/20261113T120438Z-ef2a39b9550947b6a348391153c4b9d4-ember`.
- **Run:** `20261113T120438Z-ef2a39b9550947b6a348391153c4b9d4`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y / `src/index.css` in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

Several host tokens are below the AAA 7:1 floor (4.5:1 for large-scale text). That is not a violated product invariant: the host already meets 1.4.3 AA, and no in-repo contract claims AAA contrast.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host text color is CSS tokens in `app/styles/app.css` (`[data-theme='light'|'dark']`). Cookie-consent tokens under `#cc-main` / `[data-theme='dark'] #cc-main`.
2. SC 1.4.6 (AAA): contrast ≥ **7:1** for normal text; ≥ **4.5:1** for large-scale text (18pt / 14pt bold ≈ 24px / 18.5px). Incidental and logotype text are exempt. [Understanding 1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html). Footer/kicker/pill/CTA sizes are `0.68rem`–`1rem` without a 700+ weight at ≥ 18.5px — treated as **normal** text (7:1). Hero `h1` is `clamp(2.25rem, 3vw, 3.6rem)` / weight 700 — **large-scale** (4.5:1).
3. Ratios from sRGB relative luminance (`python3`; same method as 20261109T214938Z). Light worst-case page bg `#fff7f1` unless noted; dark bg `#111111` / `#1c0e05` with white-alpha tokens blended onto the opaque bg.

   Light:

   - `--page-text` `#213547` vs `#fff7f1`: **11.91:1** (pass)
   - `--page-heading` `#1a1a2e` vs `#fffdfb`: **16.81:1** (pass)
   - `--page-muted` `#4a5568` vs `#fff7f1`: **7.11:1** (pass)
   - `--brand-accent` `#c24100` vs `#fff7f1`: **4.90:1** (fail 7:1 as normal; **pass 4.5:1** as large `h1` links)
   - `--footer-muted` `#6b7280` vs `#fff7f1`: **4.56:1** (fail 7:1; still ≥ 4.5:1)
   - `--pill-text` / `--theme-toggle-color` `#374151`: **10.16:1–10.31:1** (pass)
   - `.btn-cta-primary` `#fff` on `--cta-bg` `#c24100`: **5.19:1** (fail 7:1)
   - `#cc-main` primary `#fff` on `#cc3d00`: **4.96:1** (fail 7:1); secondary `#1a1a2e` on `#fff0e9`: **15.35:1** (pass)

   Dark:

   - heading `#f0f0f5`: **16.59:1–16.62:1** (pass)
   - `--page-text` `rgba(255,255,255,0.87)`: **~14.3:1** (pass)
   - `--page-muted` `0.6`: **~7.21:1** (pass)
   - `--footer-muted` `0.5`: **~5.33:1** (fail 7:1)
   - `--brand-accent` `#ff6b35`: **~6.66:1** (fail 7:1)
   - CTA / consent primary: same **5.19:1** / **4.96:1** (fail 7:1)

4. Reachable text: footer nav / Cookie Preferences / `.footer-note` use `--footer-muted`; `.hero-copy a` and `.seo-kicker` use `--brand-accent` at ~1rem; Contact CTA and consent Accept use white on `#c24100` / `#cc3d00`. Hero `h1` accent links are large-scale and already ≥ 4.5:1.

Authz/validation/persistence: none (public demo). Side effects: none from static CSS tokens. Errors: none thrown by contrast.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Tokens below 7:1 are 1.4.6 failures, so file like 2.5.5 AAA:** the WG documents a 7:1 floor, but this host’s evidenced contrast contract is 1.4.3 AA (closed #18/#22/#24; 20261109T214938Z explicitly did not claim 1.4.6). Meeting AA then missing AAA is not a broken invariant. A 7:1 fix would recolor brand orange, CTA, consent primary, and footer muted — a palette change, not a narrow correction.
- **Hero accent links fail 1.4.6:** `h1` is large-scale; 4.90:1 meets the AAA large-text floor. `.hero-copy a` is normal text at 4.90:1 and would fail 7:1 if AAA were in contract.
- **`--footer-muted` 4.56:1 already failed 1.4.3:** contradicted by 20261109T214938Z (**4.56:1 ≥ 4.5:1**).
- **Issue search** `1.4.6 OR "contrast enhanced" OR footer-muted OR AAA contrast`: no matching issue (open set empty). Closed contrast hits are 1.4.3 component fixes (#18/#22/#24) and 1.4.1 (#49). No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [WCAG 2.2 SC 1.4.6](https://www.w3.org/TR/WCAG22/#contrast-enhanced)
- `app/styles/app.css`
- `app/components/qrati-demo.gts`
- Prior: 1.4.3 remaining text (20261109T214938Z); CTA/consent/kicker 1.4.3 (#18/#22/#24)

## Limitations

CodeGraph unindexed. Ratios from source tokens + sRGB relative luminance (`python3`), not a browser eyedropper or live `https://qrati.com/connect/ember-example` screenshot. Backdrop-filter on pills/toggle approximated as the declared wash. No claim that the public example URL is currently deployed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

TIMING_TABLE_PLACEHOLDER

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261113T120438Z-ef2a39b9550947b6a348391153c4b9d4.json`.

## PR / checks

- Issue: none (report-only)
- PR: pending delivery
- `closingIssuesReferences`: none
- Local tests **NOT RUN BY BUGHUNTER**
