# Ember host WCAG 1.4.1 use of color

- **Scope:** WCAG 2.2 SC 1.4.1 Use of Color for host-authored UI in `QratiDemo`: inline hero links, footer nav / cookie-preferences control, action pills, Contact CTA, answer-point checkmarks, FAQ disclosures, cookie-consent host tokens. Excludes embed internals (`qrati-connect` / `embed.js`), vanilla-cookieconsent dialog chrome beyond host CSS variables, 1.4.3 text contrast (20261109T214938Z), 1.4.11 non-text contrast (20261109T181138Z), closed issue [#49](https://github.com/qrati-labs/qrati-connect-ember-example/issues/49) except as regression of the current underline rules.
- **Base:** `origin/main` at `c849d129e14b6ff1badae9249baf166f86ee365d`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261110T012438Z-5424081781e2403884dc979ddb1f3c12-ember`, `bughunter/20261110T012438Z-5424081781e2403884dc979ddb1f3c12-ember`.
- **Run:** `20261110T012438Z-5424081781e2403884dc979ddb1f3c12`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. Admin chore PRs #121/#122 were not used. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host chrome and copy live in `app/components/qrati-demo.gts` and `app/styles/app.css`. Cookie-consent init is `app/lib/cookieConsent.ts`.
2. [WCAG 2.2 SC 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color) (Level A): color is not used as the **only** visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. [Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) notes that a hyperlink styled **no different** than neighboring static text does **not** fail (no color differentiation). [F73](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73) fails when color (hue) is the only cue that makes links identifiable; navigational clusters can be evident from layout; hover-only underlines still fail F73 when color already identifies the link.
3. Host color vs extra cues:
   - Inline hero links (`h1` “Qrati”, `.hero-copy` “Qrati”): `color: var(--brand-accent)` plus last-wins `text-decoration: underline` on `.hero h1 a, .hero-copy a` (after `.hero a { text-decoration: none }`). Matches G182 / closed #49. Action pills are bordered chips with icon + text, not inline color-only links.
   - Footer: `nav` of destination links plus Cookie Preferences `button`. `.footer a` / `.footer-cookie-btn` share `--footer-muted` with `.footer-note` / `.footer-brand p` and `text-decoration: none`. Hover recolors to `--footer-link-hover` only. F73’s inline-body case does not apply: these are a navigational cluster, not in-paragraph links identified by hue. Same-color-as-note is explicitly out of 1.4.1 per Understanding.
   - Contact CTA: filled `.btn-cta-primary` (background, padding, pill radius, white text) plus the visible label “Contact Qrati →”.
   - Answer points: each item is text prefixed with the `✓` character, not a hue-only “good vs bad” code.
   - FAQ: native `<details>`/`<summary>` disclosure, not color-coded state.
   - Theme toggle: labeled button (`☀ Light` / `🌙 Dark`) with border/background; state is the control name, not a color swatch.
   - Cookie-consent host tokens: Accept/Reject are distinct **button labels**; category toggles have a sliding knob (position) plus section titles. Host `--cc-toggle-on-bg` / `--cc-toggle-off-bg` are not the sole cue. Library chrome itself is out of scope.
4. No host form required/error fields, charts, or instructions that refer to color only (`cta-highlight` is unused). Repo search: no `required` field styling, no “in red” copy.

Authz/validation/persistence: public demo; theme persist (`qc-theme`); geo consent cache. No color-only validation.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Hero accent links fail F73:** they keep a resting underline; #49 already closed that gap. Current CSS last-wins underline on `.hero h1 a` / `.hero-copy a`.
- **Footer links fail because they are muted with no underline:** 1.4.1 requires an extra cue only when color identifies the control. Footer links are not hue-differentiated from adjacent muted copy; they sit in a dedicated `nav`. Hover-only accent is not a 1.4.1 fail when rest style is not color-identified (Understanding 1.4.1; F73 nav exception).
- **Cookie on/off toggles are color-only:** knob position and category text remain. Not a host 1.4.1 fail.
- **Answer `✓` is decorative color:** the glyph is in the text node, not a CSS color meaning.
- **Issue search** `1.4.1 OR "use of color" OR color-only OR F73`: hit is closed #49 (hero underline), not an open 1.4.1 gap. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [WCAG 2.2 SC 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color)
- [F73](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73)
- `app/components/qrati-demo.gts`
- `app/styles/app.css`
- `app/lib/cookieConsent.ts`

## Limitations

CodeGraph unindexed. No visual/AT session on `https://qrati.com/connect/ember-example`; claims are from host markup/CSS plus WCAG 1.4.1 / F73. Cookie-consent and embed widgets not claimed.

## Timing

Measured wall-clock from `bughunter-timing.py` (IST = UTC+05:30). Copied from the timer ledger after `finish`.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-10T01:24:38Z | 2026-11-10T01:25:01Z | 06:54:38 | 06:55:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-10T01:25:22Z | 2026-11-10T01:28:07Z | 06:55:22 | 06:58:07 | 00:02:46 (2.8 min) |
| `delivery` | 2026-11-10T01:28:07Z | 2026-11-10T01:29:03Z | 06:58:07 | 06:59:03 | 00:00:55 (0.9 min) |
| **Total run (preflight start to finish)** | 2026-11-10T01:24:38Z | 2026-11-10T01:29:03Z | 06:54:38 | 06:59:03 | **00:04:25 (4.4 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:20 (0.3 min) |

Timer record: `/home/hermes/.hermes/cache/scratch/bughunter-timing/20261110T012438Z-5424081781e2403884dc979ddb1f3c12.json`. Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

- Issue: none (report-only)
- PR: https://github.com/qrati-labs/qrati-connect-ember-example/pull/102
