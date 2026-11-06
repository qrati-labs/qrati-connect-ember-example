# Ember host Contact CTA text contrast

- **Run:** `20261106T124038Z-521d33e88d854550938fdbcbefea0f2d`
- **Repository:** `qrati-labs/qrati-connect-ember-example`
- **Base:** fetched `origin/main` at `ce9af565998ef672f2966f077afb0e1f696c7a09` (`ce9af56 fix(head): add Open Graph tags and subpath favicons (#17)`)
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T124038Z-521d33e88d854550938fdbcbefea0f2d-ember`
- **Branch:** `bughunter/20261106T124038Z-521d33e88d854550938fdbcbefea0f2d-ember`
- **Workflow:** host **Contact Qrati** `.btn-cta-primary` label vs filled background in light and dark themes (WCAG 1.4.3)
- **Disposition:** P3 confirmed; dedicated `--cta-bg: #c24100`; issue [#18](https://github.com/qrati-labs/qrati-connect-ember-example/issues/18)
- **Ownership:** `qrati-connect-ember-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent). `qrati-admin` checkout `REPO=main` worktree add failed: `fatal: cannot change to '/home/hermes/Projects/main': No such file or directory`. Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Contact CTA text fails WCAG 1.4.3** — **Evidence:** `app/components/qrati-demo.gts` renders `<a class="btn-cta-primary" href="https://qrati.com/contact-us">Contact Qrati →</a>`. `app/styles/app.css` used `background: var(--brand-accent); color: #fff !important` with no large-text size/weight. Light `--brand-accent: #e14f00` vs white **3.947:1**; dark `--brand-accent: #ff6b35` vs white **2.835:1**. `QratiDemo` sets `data-theme` from `qc-theme` or `prefers-color-scheme`, so dark is reachable on first paint. **Failure:** [WCAG 2.2 SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires **4.5:1** for normal text (16px / 400). Dark also misses the **3:1** large-text floor. Logotype exception does not apply. **Fix:** `--cta-bg: #c24100` (white **5.185:1**) on `:root` and both theme blocks; `.btn-cta-primary` uses `var(--cta-bg)`. `--brand-accent` unchanged. **Test:** `tests/unit/cta-primary-contrast-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: application template → `QratiDemo` constructor applies `data-theme`; CTA in the closing SEO section.
2. Inputs: default/OS theme; public example; no authz.
3. Style: compact `.btn-cta-primary` fill used `--brand-accent`; later hover rule does not change fill color.
4. Output: white CTA label vs `#c24100` in both themes.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Large-text exception:** CTA has no 18pt / 14pt-bold rule; 2.835:1 would still fail 3:1.
- **Logotype exception:** the control is a contact conversion link, not a logo/brand name.
- **Incidental/inactive:** the link is the primary CTA and is active.
- **Sibling cookie-consent off-toggle (Preact #80):** Ember `preferencesModal.sections: []` so vanilla-cookieconsent v3.1.0 renders no category toggles; that 1.4.11 miss is not reachable here.
- **Brand-accent link text:** out of scope; `--brand-accent` left unchanged.

## Scope and non-goals

Host Ember example **Contact Qrati** button text contrast only. Not cookie-consent, not embed widget, not `html lang`, not production fetch.

## Tests and verification

- Authored: `tests/unit/cta-primary-contrast-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used
- Primary docs: [Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); vanilla-cookieconsent v3.1.0 `dist/cookieconsent.css` inspected only to falsify toggle reachability

## Limitations

No browser computed-style or axe run. Ratios are from source hex tokens and the WCAG sRGB relative-luminance formula. Knob/toggle contrast not claimed. `?raw` import of `.gts`/`.css` is assumed available in this Embroider/Vite test build.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

TIMING_TABLE_PENDING
