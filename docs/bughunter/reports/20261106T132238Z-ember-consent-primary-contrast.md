# Ember cookie-consent primary button contrast

- **Run:** `20261106T132238Z-7a26e64c41e745e1a172fddc6995db99`
- **Repository:** `qrati-labs/qrati-connect-ember-example`
- **Base:** fetched `origin/main` at `98738ae3c669bb337d3b37a37f4b8c58fad42d40` (`98738ae fix(a11y): set html lang=en on the host document (#21)`)
- **Worktree:** `/home/hermes/.hermes/cache/scratch/bh-20261106T132238Z-7a26e64c41e745e1a172fddc6995db99-qrati-connect-ember-example`
- **Branch:** `bughunter/20261106T132238Z-7a26e64c41e745e1a172fddc6995db99-ember`
- **Workflow:** host-controlled vanilla-cookieconsent primary actions (`Accept all` / `Save preferences`) white-on-fill contrast in light and dark themes (WCAG 1.4.3)
- **Disposition:** P3 confirmed; `--cc-btn-primary-bg: #cc3d00` and dark hover `#d93d00`; issue [#22](https://github.com/qrati-labs/qrati-connect-ember-example/issues/22)
- **Ownership:** `qrati-connect-ember-example` is absent from `qrati-labs/qrati-operations` `web/ownership.html`; no assignee invented. `*-example` repos are non-critical for this job.

## Candidate selection

Preflight used once. Skipped dirty rows. Skipped `preact-consent-fresh-20261016` (open PR #80 overlaps cookie-consent a11y in `qrati-connect-preact-example`). `qrati-admin` checkout `REPO=main` path missing (`/home/hermes/Projects/main`). Next clean `FETCH=ok` row with `OPEN_PR_COUNT=0`: `qrati-connect-ember-example`. CodeGraph unindexed; focused source reads used.

## Finding

**[P3] Cookie-consent primary buttons fail WCAG 1.4.3** — **Evidence:** `app/lib/cookieConsent.ts` `initCookieConsent()` from `QratiDemo` constructor; geo fail-closed `required: true` sets `autoShow` and `acceptAllBtn: 'Accept all'`. `app/styles/app.css` `#cc-main` and `html.dark #cc-main, [data-theme='dark'] #cc-main` used `--cc-btn-primary-bg: #ff4800` / `--cc-btn-primary-color: #ffffff` (**3.40:1**); dark `--cc-btn-primary-hover-bg: #ff6b35` (**2.84:1**). vanilla-cookieconsent v3.1.0 `.cm__btn` / `.pm__btn` use those tokens at `font-size: .82em` of `#cc-main { font-size: 16px }` (**13.12px**, `font-weight: 600`). **Failure:** [WCAG 2.2 SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires **4.5:1** for normal text. 13.12px/600 is not large text (18pt/24px or 14pt/~18.7px bold). Dark hover also misses the **3:1** large-text floor. **Fix:** `--cc-btn-primary-bg: #cc3d00` (white **4.96:1**) in both themes; dark hover `#d93d00` (**4.55:1**), matching light hover. **Test:** `tests/unit/consent-primary-contrast-test.ts` — `pnpm test` (**NOT RUN BY BUGHUNTER**).

## Trace

1. Entry: application template → `QratiDemo` constructor → `initCookieConsent()`.
2. Inputs: geo `/api/cookie-consent-geo` or `https://qrati.com/api/cookie-consent-geo`; catch returns `true`. Host theme via `data-theme` / `html.dark`.
3. Authz: none; public example.
4. Style: host overrides library primary tokens (`#30363c` default unused). `.cm__btn` (consent modal) and `.pm__btn` (preferences) share `--cc-btn-primary-*`.
5. Output: white labels on `#cc3d00`; hover `#d93d00`. `--cc-toggle-on-bg` and secondary fills unchanged.

Open PRs at selection: none (`OPEN_PR_COUNT=0`). No overlapping PR.

## Falsification

- **Brand orange is intentional:** readable primary consent labels are still required. 3.40:1 / 2.84:1 on Accept all is not a style preference.
- **Large-text exception (3:1):** buttons are 13.12px / weight 600. SC 1.4.3 normal-text threshold applies. Dark hover 2.84:1 also fails 3:1.
- **Toggle 1.4.11 (Preact #80):** Ember `preferencesModal.sections: []` so v3.1.0 renders no category toggles; that miss is not reachable here.
- **Host Contact CTA (#18):** already uses `--cta-bg: #c24100`; out of scope.
- **Secondary buttons:** light `#1a1a2e` on `#fff0e9` (~15.3:1) already pass.

## Scope and non-goals

Host Ember example cookie-consent primary button text contrast only. Not toggle/switch non-text contrast, not `.btn-cta-primary`, not other example repos, no production fetch.

## Tests and verification

- Authored: `tests/unit/consent-primary-contrast-test.ts`
- Command: `pnpm test` (**NOT RUN BY BUGHUNTER**)
- Tests/build/lint/type-check/install/package managers: **NOT RUN BY BUGHUNTER**
- `git diff --check`: clean
- CodeGraph: unindexed; focused reads used
- Primary docs: [Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); vanilla-cookieconsent v3.1.0 `dist/cookieconsent.css` `.cm__btn` / `.pm__btn`

## Limitations

No browser computed-style or axe run. Ratios are from source hex tokens and the WCAG sRGB relative-luminance formula. Button metrics are from the pinned library CSS, not a live layout. `?raw` import of `.ts`/`.css` is assumed available in this Embroider/Vite test build.

## Timing

Copied from the timer ledger after `finish`. IST = UTC+05:30.

| Phase | Segment start (UTC) | Segment end (UTC) | Start (IST) | End (IST) | Elapsed |
|---|---|---|---|---|---|
| `preflight` | 2026-11-06T13:22:38Z | 2026-11-06T13:23:01Z | 18:52:38 | 18:53:01 | 00:00:23 (0.4 min) |
| `audit` | 2026-11-06T13:23:22Z | 2026-11-06T13:27:16Z | 18:53:22 | 18:57:16 | 00:03:53 (3.9 min) |
| `delivery` | 2026-11-06T13:27:16Z | 2026-11-06T13:27:16Z | 18:57:16 | 18:57:16 | 00:00:00 (0.0 min) |
| **Total run (preflight start to finish)** | 2026-11-06T13:22:38Z | 2026-11-06T13:27:16Z | 18:52:38 | 18:57:16 | **00:04:38 (4.6 min)** |
| Unclassified interval between marked phases | — | — | — | — | 00:00:22 (0.4 min) |

Timing-table insertion itself occurs after this measurement snapshot. Merge of this example PR is after `finish` and is not in the measured elapsed time.

## PR / checks

PR [#23](https://github.com/qrati-labs/qrati-connect-ember-example/pull/23): `Fixes #22`; `MERGEABLE`; base `main` `98738ae3c669bb337d3b37a37f4b8c58fad42d40`; head `6603c86c1eaab5cc1f84d073e44c7985ec2c8195`. Assignees none (unmapped example). At first readback: Lint/Test pending; GitGuardian pending; Workers Builds pending. Example repo: squash-merge with branch deletion after this timing update.
