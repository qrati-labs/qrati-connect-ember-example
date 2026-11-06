# Ember host hero kicker contrast

- **UTC date:** 2026-11-06
- **Run ID:** `20261106T134338Z-a18a6a33aa8e4b4abb3821f1cad67c3b`
- **Repository / base SHA:** `qrati-labs/qrati-connect-ember-example` `origin/main` `64819b37d0092b297821388971ff762acf9c9802`
- **Workflow:** Host hero kicker (“Qrati Connect Demo”) and light-theme brand-accent text contrast
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T134338Z-a18a6a33aa8e4b4abb3821f1cad67c3b-qrati-connect-ember-example`
- **Branch:** `bughunter/20261106T134338Z-a18a6a33aa8e4b4abb3821f1cad67c3b-ember`

## Finding

**[P3] Host hero kicker and brand-link text fail WCAG 1.4.3** — **Evidence:** `app/components/qrati-demo.gts` renders `<p class="hero-kicker">Qrati Connect Demo</p>` (`font-size: 0.68rem`, weight 800; not large text) and 1rem `.hero-copy` links to qrati.com. `app/styles/app.css` `.hero-kicker` used hardcoded `color: #e14f00` on `background: rgba(255, 255, 255, 0.78)`. vs cream `#fff7f1` under that fill: **3.89:1**. Dark theme kept the light pill: **2.43:1**. Light `--brand-accent: #e14f00` vs white **3.95:1** (also `.seo-kicker`, pill/footer hover). **Failure:** [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum) requires **4.5:1** for normal text. **Fix:** light `--brand-accent` (and sibling hover tokens) `#c24100` (white **5.185:1**, cream **4.895:1**); `.hero-kicker` uses `color: var(--brand-accent)` and `background: var(--pill-bg)` so dark `#ff6b35` composites to **5.81:1**. **Test:** `tests/unit/hero-kicker-contrast-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: `QratiDemo` constructor sets `data-theme` from `qc-theme` / `prefers-color-scheme`.
2. Hero kicker and brand links render on first paint of the host page.
3. Light theme tokens and hardcoded kicker colors applied from `app/styles/app.css`.
4. No later style override restores contrast.

Cookie-consent off-toggle (`--cc-toggle-off-bg: #9ca3af`) was considered and **falsified**: `preferencesModal.sections: []` so vanilla-cookieconsent 3.1.0 never emits category toggles (`preferencesModal.js` iterates `sections` only).

## Impact / severity

P3 (low). Demo visitors using the default light theme, and anyone on dark theme, see under-contrast hero branding. No data loss or authz failure.

## Root cause

Light brand orange `#e14f00` is below 4.5:1 on light surfaces; the kicker ignored theme tokens so dark mode kept a light translucent pill.

## Disposition

Confirmed defect. Issue https://github.com/qrati-labs/qrati-connect-ember-example/issues/24. Source + regression test.

Ownership: `qrati-connect-ember-example` is not in `qrati-operations` `web/ownership.html` ASSIGNMENTS. No primary assigned (do not guess). Example repo is non-critical for merge routing.

## Tests

- Authored: `tests/unit/hero-kicker-contrast-test.ts`
- Updated pin: `tests/unit/cta-primary-contrast-test.ts` light `--brand-accent` `#e14f00` → `#c24100` so it does not encode the defect
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- `git diff --check`: clean (no output)
- lint / typecheck / ember test / CI: **NOT RUN BY BUGHUNTER**

## Citations

- [WCAG 2.2 Success Criterion 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- vanilla-cookieconsent v3.1.0 `src/core/modals/preferencesModal.js` (`sectionsData.forEach`) — used only to falsify toggle-contrast reachability

## Limitations

CodeGraph unindexed on this worktree; source reads used. Contrast computed from declared CSS (sRGB relative luminance), not a browser screenshot. Live page not mutated. Hover `--pill-text-hover` / `--footer-link-hover` updated as the same `#e14f00` class; not separately screenshot-verified.

## Timing

timing incomplete — table inserted after `bughunter-timing.py finish`

## PR / checks

To be recorded after remote read-back.
