# Ember host WCAG 1.4.3 contrast (minimum)

- **Scope:** WCAG 2.2 SC 1.4.3 Contrast (Minimum) for remaining host-authored text in `QratiDemo` and cookie-consent chrome colors in `app/styles/app.css`. Pairings: `--page-text`, `--page-heading`, `--page-muted`, `--brand-accent`, `--footer-muted`, `--pill-text`, `--theme-toggle-color`, CTA/consent button labels, `.seo-kicker`. Backgrounds: light gradient `#fffdfb`→`#fff7f1`, `.answer-section` `#ff48000d` wash, `--card-bg`, pill/toggle washes; dark `#111111`/`#1c0e05` and matching washes. Excludes already-fixed 1.4.3 issues [#18](https://github.com/qrati-labs/qrati-connect-ember-example/issues/18) CTA, [#22](https://github.com/qrati-labs/qrati-connect-ember-example/issues/22) consent primary, [#24](https://github.com/qrati-labs/qrati-connect-ember-example/issues/24) hero kicker; 1.4.11 non-text (20261109T181138Z); 1.4.12 text spacing (20261109T165738Z).
- **Base:** `origin/main` at `6392c023526dbfb32cdfd768e4e3c45402f8a5e9`.
- **Worktree/branch:** `/home/hermes/.hermes/cache/scratch/bh-20261109T214938Z-c75064189ec0451eae06b2f4d07f45b2-ember`, `bughunter/20261109T214938Z-c75064189ec0451eae06b2f4d07f45b2-ember`.
- **Run:** `20261109T214938Z-c75064189ec0451eae06b2f4d07f45b2`.

## Candidate selection

Preflight used once. Skipped dirty rows (`qrati-connect-lit-example`, `qrati-connect-svelte-example`, `qrati-admin`, `qrati-connect-nextjs-example`, others). Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`; did not inspect a second workflow there). `qrati-admin` source row is dirty. `REPO=main` path `/home/hermes/Projects/main` does not exist (`fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

No confirmed defect on this workflow.

## Trace

1. Entry: `app/templates/application.gts` renders `<QratiDemo />`. Host text is CSS-token colored in `app/styles/app.css` (`[data-theme='light'|'dark']`). Cookie-consent tokens under `#cc-main` / `[data-theme='dark'] #cc-main`.
2. SC 1.4.3 (AA): contrast ≥ 4.5:1 for normal text; ≥ 3:1 for large text (18pt / 14pt bold). Footer/kicker/pill sizes are `0.68rem`–`0.78rem` or default `1rem` — treated as **normal** text (4.5:1). Ratios from relative-luminance (sRGB) with rgba blended onto the stated opaque background.
3. Light (worst-case page bg `#fff7f1` unless noted):

   - `--page-text` `#213547`: **11.91:1**
   - `--page-heading` `#1a1a2e`: **16.10:1**
   - `--page-muted` `#4a5568`: **7.11:1** (answer wash `#ff48000d` → **6.67:1**; card wash **7.42:1**)
   - `--brand-accent` `#c24100` (kickers, hero links): **4.90:1** (answer wash **4.60:1**; pill wash **5.18:1**)
   - `--footer-muted` `#6b7280` (footer copy, nav, cookie button, `0.78rem`): **4.56:1** on `#fff7f1`, **4.83:1** on white
   - `--pill-text` / `--theme-toggle-color` `#374151`: **10.30:1** / **8.91:1** on their washes
   - `.btn-cta-primary` `#fff` on `--cta-bg` `#c24100`: **5.19:1**
   - `#cc-main` `--cc-secondary-color` `#4a5568` on `#ffffff`: **7.53:1**; secondary button `#1a1a2e` on `#fff0e9`: **15.35:1**; primary `#fff` on `#cc3d00`: **4.96:1**

4. Dark (bg `#111111` / `#1c0e05`; white-alpha tokens blended):

   - `--page-text` `rgba(255,255,255,0.87)`: **14.28:1–14.48:1**
   - `--page-heading` `#f0f0f5`: **16.59:1–16.62:1**
   - `--page-muted` `0.6`: **7.19:1–7.23:1** (answer wash **6.98:1**)
   - `--footer-muted` `0.5`: **5.28:1–5.34:1**
   - `--brand-accent` `#ff6b35`: **6.65:1–6.74:1**
   - pill/toggle `0.8`: **10.37:1–12.28:1**
   - `#cc-main` secondary `0.65` on `#161622`: **8.02:1**; secondary button `#f0f0f5` on `#2a2020`: **13.94:1**

5. All measured host pairings meet 4.5:1. Lowest is light `--footer-muted` at **4.56:1** on the warm footer background — above the AA floor, not a failure.

Authz/validation/persistence: none (public demo). Side effects: none from static CSS tokens. Errors: none thrown by contrast.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **`--footer-muted` `#6b7280` fails on warm gradient:** 4.56:1 on `#fff7f1` and 4.83:1 on white. 4.5:1 is the criterion, not a higher house style.
- **Answer-section orange wash drops muted/accent below 4.5:1:** muted 6.67:1, accent 4.60:1.
- **Dark `rgba(255,255,255,0.5)` footer text fails:** blended **5.28:1** on `#1c0e05`.
- **`.seo-kicker` is small and uses accent only:** default `1rem` / weight 800 still needs 4.5:1 (not large-text 3:1); light accent **4.90:1**.
- **Prior CTA/kicker/consent-primary failures still present:** closed issues #18/#22/#24; current tokens `#c24100` / `#cc3d00` meet 4.5:1 for white label text.
- **Issue search** `contrast 1.4.3 OR muted footer text WCAG`: hits are the closed specific-component issues above, not remaining body/footer tokens. No issue created (report-only).

## Disposition

Report-only. No issue. No source or test change.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for this job’s merge policy.

## Tests

None authored (no confirmed defect). `pnpm test` **NOT RUN BY BUGHUNTER**. Patch hygiene: `git diff --check` on docs.

## Citations

- [WCAG 2.2 Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- `app/styles/app.css`
- `app/components/qrati-demo.gts`
- `app/lib/cookieConsent.ts` (consent copy uses `#cc-main` tokens)

## Limitations

CodeGraph unindexed. Ratios from source tokens + sRGB relative luminance (python3), not a browser eyedropper or live `https://qrati.com/connect/ember-example` screenshot. Backdrop-filter on pills/toggle approximated as the declared wash over the page gradient. 1.4.6 Contrast (Enhanced) not claimed.

## Timing

TIMING_PLACEHOLDER
